<script lang="ts">
  import AboutMe from "$lib/components/AboutMe.svelte"
  import CollapsibleSection from "$lib/components/CollapsibleSection.svelte"
  import SEO from "$lib/components/SEO.svelte"
  import { onDestroy, onMount } from "svelte"

  let canvasEl: HTMLCanvasElement | null = null
  let mod: any = null
  let ready = $state(false)
  let pollIntervalId: number | null = null
  let destroyed = false
  let initToken = 0

  // Simple state you can bind to controls
  let loss = $state(0)
  let accuracy = $state(0)
  let epoch = $state(0)
  let learningRate = $state(0.1)
  let batchSize = $state(64)
  let autoTrain = $state(false)
  let datasetIndex = $state(0)
  let numPoints = $state(1000)
  let spread = $state(1)
  let autoMaxEpochs = $state(0)
  let autoTargetLoss = $state(0.1)
  let useTargetLossStop = $state(false)
  let optimizer = $state(0)
  let momentum = $state(0.9)
  let adamBeta1 = $state(0.9)
  let adamBeta2 = $state(0.999)
  let adamEps = $state(1e-8)
  let initMode = $state(0)
  let maxPoints = $state(1000)

  const datasetLabels = [
    "Two blobs",
    "Concentric circles",
    "Two moons",
    "XOR quads",
    "Spirals",
  ] as const

  const optimizerLabels = ["SGD", "SGD Momentum", "Adam"] as const

  const initModeLabels = ["Zero", "He Uniform", "He Normal"] as const

  async function initWasm() {
    const currentToken = ++initToken
    ready = false

    const createModule = (await import("./NeuralNetDemo.js")).default

    // If the component was destroyed while the module code was loading, abort
    if (destroyed || currentToken !== initToken) return

    const instance = await createModule({
      canvas: canvasEl,
      locateFile: (path: string) => `/${path}`,
    })

    // If a newer init started or the component was destroyed while instantiating, shut down and abort
    if (destroyed || currentToken !== initToken) {
      if (instance && typeof (instance as any)._nn_shutdown === "function") {
        try {
          ;(instance as any)._nn_shutdown()
        } catch {
          // ignore shutdown errors during teardown
        }
      }
      return
    }

    mod = instance

    // Initialize UI state from C++ side
    learningRate = mod._nn_get_learning_rate()
    batchSize = mod._nn_get_batch_size()
    autoTrain = !!mod._nn_get_auto_train()
    datasetIndex = mod._nn_get_dataset_index()
    numPoints = mod._nn_get_num_points()
    spread = mod._nn_get_spread()
    autoMaxEpochs = mod._nn_get_auto_max_epochs()
    autoTargetLoss = mod._nn_get_auto_target_loss()
    useTargetLossStop = !!mod._nn_get_use_target_loss_stop()
    optimizer = mod._nn_get_optimizer()
    momentum = mod._nn_get_momentum()
    adamBeta1 = mod._nn_get_adam_beta1()
    adamBeta2 = mod._nn_get_adam_beta2()
    adamEps = mod._nn_get_adam_eps()
    initMode = mod._nn_get_init_mode()
    maxPoints = mod._nn_get_max_points()

    ready = true
  }

  function pollState() {
    if (!mod) return
    loss = mod._nn_get_last_loss()
    accuracy = mod._nn_get_last_accuracy()
    epoch = mod._nn_get_step_count()
    datasetIndex = mod._nn_get_dataset_index()
    optimizer = mod._nn_get_optimizer()
    initMode = mod._nn_get_init_mode()
  }

  onMount(() => {
    destroyed = false
    initWasm()

    pollIntervalId = window.setInterval(pollState, 250)
  })

  onDestroy(() => {
    destroyed = true
    initToken += 1

    if (pollIntervalId !== null) {
      clearInterval(pollIntervalId)
      pollIntervalId = null
    }

    if (mod) {
      if (typeof (mod as any)._nn_shutdown === "function") {
        try {
          ;(mod as any)._nn_shutdown()
        } catch {
          // ignore shutdown errors during teardown
        }
      }
      mod = null
    }

    if (canvasEl) {
      const gl = canvasEl.getContext("webgl2") || canvasEl.getContext("webgl")
      gl?.getExtension("WEBGL_lose_context")?.loseContext()
      canvasEl = null
    }

    ready = false
  })

  // ----- control handlers -----

  function setDataset(index: number, numPoints: number, spread: number) {
    if (!mod) return
    mod._nn_set_dataset(index, numPoints, spread)
  }

  function onDatasetIndexChange(v: number) {
    datasetIndex = v | 0
    setDataset(datasetIndex, numPoints, spread)
  }

  function onNumPointsChange(v: number) {
    numPoints = v | 0
    setDataset(datasetIndex, numPoints, spread)
  }

  function onSpreadChange(v: number) {
    spread = v
    setDataset(datasetIndex, numPoints, spread)
  }

  function onLearningRateChange(v: number) {
    learningRate = v
    if (!mod) return
    mod._nn_set_learning_rate(v)
  }

  function onBatchSizeChange(v: number) {
    batchSize = v
    if (!mod) return
    mod._nn_set_batch_size(v | 0)
  }

  function onAutoTrainToggle(value: boolean) {
    autoTrain = value
    if (!mod) return
    mod._nn_set_auto_train(value ? 1 : 0)
  }

  function onAutoMaxEpochsChange(v: number) {
    autoMaxEpochs = v | 0
    if (!mod) return
    mod._nn_set_auto_max_epochs(autoMaxEpochs)
  }

  function onAutoTargetLossChange(v: number) {
    autoTargetLoss = v
    if (!mod) return
    mod._nn_set_auto_target_loss(v)
  }

  function onUseTargetLossStopToggle(value: boolean) {
    useTargetLossStop = value
    if (!mod) return

    if (value && autoTargetLoss <= 0) {
      autoTargetLoss = 0.1
      mod._nn_set_auto_target_loss(autoTargetLoss)
    }

    mod._nn_set_use_target_loss_stop(value ? 1 : 0)
  }

  function onOptimizerChange(v: number) {
    optimizer = v | 0
    if (!mod) return
    mod._nn_set_optimizer(optimizer)

    if (optimizer === 2) {
      if (learningRate > 0.05 || learningRate < 0.0001) {
        learningRate = 0.01
        mod._nn_set_learning_rate(learningRate)
      }
    }
  }

  function onMomentumChange(v: number) {
    momentum = v
    if (!mod) return
    mod._nn_set_momentum(v)
  }

  function onAdamBeta1Change(v: number) {
    adamBeta1 = v
    if (!mod) return
    mod._nn_set_adam_beta1(v)
  }

  function onAdamBeta2Change(v: number) {
    adamBeta2 = v
    if (!mod) return
    mod._nn_set_adam_beta2(v)
  }

  function onAdamEpsChange(v: number) {
    adamEps = v
    if (!mod) return
    mod._nn_set_adam_eps(v)
  }

  function onInitModeChange(v: number) {
    initMode = v | 0
    if (!mod) return
    mod._nn_set_init_mode(initMode)
  }

  function trainOneEpoch() {
    if (!mod) return
    mod._nn_step_train()
    pollState()
  }

  function setProbeFromClick(ev: MouseEvent) {
    if (!mod || !canvasEl) return
    const rect = canvasEl.getBoundingClientRect()
    const x = ((ev.clientX - rect.left) / rect.width) * 2 - 1
    const y = 1 - ((ev.clientY - rect.top) / rect.height) * 2
    mod._nn_set_probe_enabled(1)
    mod._nn_set_probe_position(x, y)
  }
</script>

<SEO
  title="Neural Network Demo - Chris J Mears"
  description="A simple toy neural network demo built with C++, OpenGL, and WebAssembly."
  type="website"
/>

<div class="px-4 pt-6 pb-2 max-w-6xl mx-auto text-sm text-slate-800 space-y-2">
  <h1 class="text-2xl font-semibold">Interactive Neural Network Demo</h1>
  <p>
    This is a small 2D classification demo powered by a neural network written
    in C++ and rendered with OpenGL, compiled to WebAssembly and embedded in
    this Svelte app.
  </p>
  <p>
    The plot shows how the model separates two classes of points. The summary
    bar tracks training progress (epoch, loss, accuracy, dataset, optimizer, and
    weight initialization). Use the panels on the right to step training, enable
    auto-training, change the dataset, and tweak optimization settings.
  </p>
</div>

<div class="flex items-center justify-center px-4 pb-6">
  <div class="flex w-full max-w-6xl flex-col gap-6 md:flex-row md:items-start">
    <div class="flex flex-1 flex-col items-center justify-center gap-4">
      <div class="relative w-full max-w-[800px] aspect-[4/3]">
        <canvas
          bind:this={canvasEl}
          width="800"
          height="600"
          onclick={setProbeFromClick}
          class="block h-full w-full rounded-lg border border-slate-700 bg-black"
        ></canvas>

        {#if !ready}
          <div
            class="absolute inset-0 flex items-center justify-center rounded-lg bg-black/40 text-sm text-white md:text-base"
          >
            Loading neural net...
          </div>
        {/if}
      </div>

      <div class="w-full max-w-[800px]">
        <div
          class="mx-auto mt-4 inline-flex w-full flex-wrap items-center justify-center gap-x-8 gap-y-2 rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-3 text-xs text-slate-100 sm:text-sm"
        >
          <div class="flex flex-col items-center">
            <span class="text-[0.65rem] uppercase tracking-wide text-slate-400"
              >Epoch</span
            >
            <span class="font-mono">{epoch}</span>
          </div>
          <div class="flex flex-col items-center">
            <span class="text-[0.65rem] uppercase tracking-wide text-slate-400"
              >Loss</span
            >
            <span class="font-mono">{loss.toFixed(4)}</span>
          </div>
          <div class="flex flex-col items-center">
            <span class="text-[0.65rem] uppercase tracking-wide text-slate-400"
              >Accuracy</span
            >
            <span class="font-mono">{accuracy.toFixed(3)}</span>
          </div>
          <div class="flex flex-col items-center">
            <span class="text-[0.65rem] uppercase tracking-wide text-slate-400"
              >Dataset</span
            >
            <span class="font-mono">{datasetLabels[datasetIndex] ?? "?"}</span>
          </div>
          <div class="flex flex-col items-center">
            <span class="text-[0.65rem] uppercase tracking-wide text-slate-400"
              >Optimizer</span
            >
            <span class="font-mono">{optimizerLabels[optimizer] ?? "?"}</span>
          </div>
          <div class="flex flex-col items-center">
            <span class="text-[0.65rem] uppercase tracking-wide text-slate-400"
              >Init</span
            >
            <span class="font-mono">{initModeLabels[initMode] ?? "?"}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="w-full md:w-80 space-y-4">
      <CollapsibleSection
        title="Training"
        initiallyOpen={true}
        headerBgClass="bg-sky-800 p-2 rounded"
        headerTextClass="text-white"
      >
        <div class="space-y-3 p-2">
          <div class="flex items-center justify-between gap-3">
            <button
              onclick={trainOneEpoch}
              disabled={!ready}
              class="inline-flex items-center justify-center rounded-md border border-slate-300 bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-900 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Train one epoch
            </button>

            <div class="flex flex-col items-end gap-1 text-right">
              <label class="text-sm">
                <span class="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    bind:checked={autoTrain}
                    onchange={(e) => onAutoTrainToggle(e.currentTarget.checked)}
                    disabled={!ready}
                    class="h-4 w-4 rounded border-slate-300 text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                  <span>Auto-train</span>
                </span>
                <p class="text-xs text-slate-600">Train epochs automatically</p>
              </label>
            </div>
          </div>

          <div class="space-y-2">
            <label class="flex flex-col gap-1">
              <span>Learning rate</span>
              <input
                type="range"
                min="0.0001"
                max="0.2"
                step="0.0001"
                bind:value={learningRate}
                oninput={(e) => onLearningRateChange(+e.currentTarget.value)}
                disabled={!ready}
                class="w-full accent-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
              />
              <span class="font-mono text-xs text-slate-600"
                >{learningRate.toFixed(5)}</span
              >
            </label>

            <label class="flex flex-col gap-1">
              <span>Batch size</span>
              <input
                type="range"
                min="1"
                max="512"
                step="1"
                bind:value={batchSize}
                oninput={(e) => onBatchSizeChange(+e.currentTarget.value)}
                disabled={!ready}
                class="w-full accent-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
              />
              <span class="font-mono text-xs text-slate-600">{batchSize}</span>
            </label>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Dataset"
        initiallyOpen={true}
        headerBgClass="bg-sky-800 p-2 rounded"
        headerTextClass="text-white"
      >
        <div class="space-y-2 p-2">
          <label class="flex flex-col gap-1">
            <span>Dataset</span>
            <select
              bind:value={datasetIndex}
              onchange={(e) => onDatasetIndexChange(+e.currentTarget.value)}
              disabled={!ready}
              class="w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value={0}>Two blobs</option>
              <option value={1}>Concentric circles</option>
              <option value={2}>Two moons</option>
              <option value={3}>XOR quads</option>
              <option value={4}>Spirals</option>
            </select>
          </label>

          <label class="flex flex-col gap-1">
            <span>Num points</span>
            <input
              type="range"
              min="10"
              max={maxPoints}
              step="10"
              bind:value={numPoints}
              oninput={(e) => onNumPointsChange(+e.currentTarget.value)}
              disabled={!ready}
              class="w-full accent-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
            />
            <span class="font-mono text-xs text-slate-600">{numPoints}</span>
          </label>

          <label class="flex flex-col gap-1">
            <span>Spread</span>
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              bind:value={spread}
              oninput={(e) => onSpreadChange(+e.currentTarget.value)}
              disabled={!ready}
              class="w-full accent-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
            />
            <span class="font-mono text-xs text-slate-600"
              >{spread.toFixed(2)}</span
            >
          </label>

          <label class="flex flex-col gap-1">
            <span>Initialization</span>
            <select
              bind:value={initMode}
              onchange={(e) => onInitModeChange(+e.currentTarget.value)}
              disabled={!ready}
              class="w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value={0}>Zero</option>
              <option value={1}>HeUniform</option>
              <option value={2}>HeNormal</option>
            </select>
          </label>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Auto stop"
        initiallyOpen={false}
        headerBgClass="bg-sky-800 p-2 rounded"
        headerTextClass="text-white"
      >
        <div class="space-y-3 p-2">
          <label class="flex flex-col gap-1">
            <span>Max epochs (auto)</span>
            <input
              type="number"
              min="0"
              step="1"
              bind:value={autoMaxEpochs}
              oninput={(e) => onAutoMaxEpochsChange(+e.currentTarget.value)}
              disabled={!ready}
              class="w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
            />
            <input
              type="range"
              min="0"
              max="1000"
              step="1"
              bind:value={autoMaxEpochs}
              oninput={(e) => onAutoMaxEpochsChange(+e.currentTarget.value)}
              disabled={!ready}
              class="w-full accent-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </label>

          <label class="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              bind:checked={useTargetLossStop}
              onchange={(e) =>
                onUseTargetLossStopToggle(e.currentTarget.checked)}
              disabled={!ready}
              class="h-4 w-4 rounded border-slate-300 text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
            />
            <span>Use target loss stop</span>
          </label>

          {#if useTargetLossStop}
            <label class="flex flex-col gap-1">
              <span>Target loss (auto)</span>
              <input
                type="number"
                min="0"
                step="0.0001"
                bind:value={autoTargetLoss}
                oninput={(e) => onAutoTargetLossChange(+e.currentTarget.value)}
                disabled={!ready}
                class="w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
              />
              <input
                type="range"
                min="0"
                max="1"
                step="0.0001"
                bind:value={autoTargetLoss}
                oninput={(e) => onAutoTargetLossChange(+e.currentTarget.value)}
                disabled={!ready}
                class="w-full accent-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </label>
          {/if}
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Optimizer"
        initiallyOpen={false}
        headerBgClass="bg-sky-800 p-2 rounded"
        headerTextClass="text-white"
      >
        <div class="space-y-2 p-2">
          <label class="flex flex-col gap-1">
            <span>Optimizer</span>
            <select
              bind:value={optimizer}
              onchange={(e) => onOptimizerChange(+e.currentTarget.value)}
              disabled={!ready}
              class="w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value={0}>SGD</option>
              <option value={1}>SGD Momentum</option>
              <option value={2}>Adam</option>
            </select>
          </label>

          {#if optimizer === 1 || optimizer === 2}
            <label class="flex flex-col gap-1">
              <span>Momentum</span>
              <input
                type="range"
                min="0"
                max="0.99"
                step="0.01"
                bind:value={momentum}
                oninput={(e) => onMomentumChange(+e.currentTarget.value)}
                disabled={!ready}
                class="w-full accent-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
              />
              <span class="font-mono text-xs text-slate-600"
                >{momentum.toFixed(2)}</span
              >
            </label>
          {/if}

          {#if optimizer === 2}
            <label class="flex flex-col gap-1">
              <span>Adam β₁</span>
              <input
                type="range"
                min="0"
                max="0.9999"
                step="0.0001"
                bind:value={adamBeta1}
                oninput={(e) => onAdamBeta1Change(+e.currentTarget.value)}
                disabled={!ready}
                class="w-full accent-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
              />
              <span class="font-mono text-xs text-slate-600"
                >{adamBeta1.toFixed(4)}</span
              >
            </label>

            <label class="flex flex-col gap-1">
              <span>Adam β₂</span>
              <input
                type="range"
                min="0"
                max="0.9999"
                step="0.0001"
                bind:value={adamBeta2}
                oninput={(e) => onAdamBeta2Change(+e.currentTarget.value)}
                disabled={!ready}
                class="w-full accent-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
              />
              <span class="font-mono text-xs text-slate-600"
                >{adamBeta2.toFixed(4)}</span
              >
            </label>

            <label class="flex flex-col gap-1">
              <span>Adam ε</span>
              <input
                type="range"
                min="0.0000000001"
                max="0.01"
                step="0.0000000001"
                bind:value={adamEps}
                oninput={(e) => onAdamEpsChange(+e.currentTarget.value)}
                disabled={!ready}
                class="w-full accent-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
              />
              <span class="font-mono text-xs text-slate-600"
                >{adamEps.toExponential(2)}</span
              >
            </label>
          {/if}
        </div>
      </CollapsibleSection>
    </div>
  </div>
</div>

<AboutMe />
