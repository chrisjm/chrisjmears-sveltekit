<script lang="ts">
  import { onMount } from "svelte"
  import * as d3 from "d3"
  import type { Selection } from "d3"

  interface FileEntity {
    id: number
    createdAt: number
    completionTime?: number
    [key: string]: number | undefined
  }

  interface StationConfig {
    name: string
    workers: number
    costPerHour: number
    processTimeMin: number
    processTimeMode: number
    processTimeMax: number
  }

  interface SimulationConfig {
    totalFiles: number
    stations: StationConfig[]
    simulationSpeed: number
    fileArrivalInterval: number
  }

  interface StationState {
    id: number
    config: StationConfig
    queue: FileEntity[]
    activeWorkers: ({ file: FileEntity; completionTime: number } | null)[]
  }

  interface SimulationState {
    isRunning: boolean
    simulationTime: number
    filesCreated: number
    timeToNextFile: number
  }

  function generateNormalRandom(mean: number, stdDev: number): number {
    let u1 = Math.random()
    let u2 = Math.random()
    let z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2)
    return Math.max(1, z0 * stdDev + mean)
  }

  function generateTriangularRandom(
    min: number,
    mode: number,
    max: number
  ): number {
    const u = Math.random()
    const f = (mode - min) / (max - min)
    if (u < f) {
      return min + Math.sqrt(u * (max - min) * (mode - min))
    } else {
      return max - Math.sqrt((1 - u) * (max - min) * (max - mode))
    }
  }

  function createFileEntity(id: number, time: number): FileEntity {
    return { id, createdAt: time }
  }

  let simulationConfig = $state<SimulationConfig>({
    totalFiles: 100,
    simulationSpeed: 500,
    fileArrivalInterval: 0.2,
    stations: [
      {
        name: "Intake",
        workers: 2,
        costPerHour: 50,
        processTimeMin: 5,
        processTimeMode: 5,
        processTimeMax: 10,
      },
      {
        name: "Digitization",
        workers: 3,
        costPerHour: 25,
        processTimeMin: 8,
        processTimeMode: 10,
        processTimeMax: 15,
      },
      {
        name: "QA",
        workers: 2,
        costPerHour: 50,
        processTimeMin: 5,
        processTimeMode: 15,
        processTimeMax: 30,
      },
    ],
  })

  let simulationState = $state<SimulationState>({
    isRunning: false,
    simulationTime: 0,
    filesCreated: 0,
    timeToNextFile: 0,
  })

  let stationStates = $state<StationState[]>(
    simulationConfig.stations.map((config, index) => ({
      id: index,
      config: config,
      queue: [],
      activeWorkers: Array(config.workers).fill(null),
    }))
  )

  const samplingInterval = 0.1
  const pixelsPerMinute = 80
  const simulationHours = $derived(simulationState.simulationTime / 60)

  let batchRunning = $state(false)
  let completedFiles = $state<FileEntity[]>([])
  let timeSeries = $state<{ t: number; queues: number[] }[]>([])
  let lastSampledTime = $state(0)
  let fitToWidth = $state(true)

  const totalCost = $derived(
    simulationConfig.stations.reduce(
      (total, station) => total + station.workers * station.costPerHour,
      0
    ) * simulationHours
  )

  const totalQueued = $derived(
    stationStates.reduce((sum, station) => sum + station.queue.length, 0)
  )

  const configSignature = $derived(
    JSON.stringify({
      totalFiles: simulationConfig.totalFiles,
      simulationSpeed: simulationConfig.simulationSpeed,
      fileArrivalInterval: simulationConfig.fileArrivalInterval,
      stations: simulationConfig.stations.map((s) => ({
        name: s.name,
        workers: s.workers,
        costPerHour: s.costPerHour,
        processTimeMin: s.processTimeMin,
        processTimeMode: s.processTimeMode,
        processTimeMax: s.processTimeMax,
      })),
    })
  )
  let lastConfigSignature = $state<string | null>(null)

  let svgElement: SVGSVGElement
  let svg: Selection<SVGSVGElement, unknown, null, undefined>

  onMount(() => {
    svg = d3.select(svgElement)
    updateChart()
  })

  $effect(() => {
    if (svg) {
      updateChart()
    }
  })

  function updateChart() {
    const margin = { top: 16, right: 24, bottom: 24, left: 40 }
    const container = svgElement.parentElement as HTMLElement | null
    const containerWidth = container?.clientWidth ?? 800
    const svgHeight = svgElement.clientHeight || 256
    const innerHeight = svgHeight - margin.top - margin.bottom
    const t0 = timeSeries.length ? timeSeries[0].t : 0
    const t1raw = timeSeries.length ? timeSeries[timeSeries.length - 1].t : 1
    const t1 = t1raw > t0 ? t1raw : t0 + 1
    const baseWidth = containerWidth - margin.left - margin.right
    const timeWidth = fitToWidth
      ? baseWidth
      : Math.max(baseWidth, (t1 - t0) * pixelsPerMinute)

    svg.attr("width", timeWidth + margin.left + margin.right)

    const maxY = d3.max(timeSeries, (d) => d3.max(d.queues, (q) => q) ?? 0) ?? 0
    const yMax = Math.max(5, maxY + 1)

    const xScale = d3.scaleLinear().domain([t0, t1]).range([0, timeWidth])
    const yScale = d3.scaleLinear().domain([0, yMax]).range([innerHeight, 0])

    svg.selectAll("*").remove()

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(
        d3
          .axisBottom(xScale)
          .ticks(10)
          .tickFormat((d) => `${d}m` as any)
      )
    g.append("g").call(d3.axisLeft(yScale))

    const stationNames = simulationConfig.stations.map((s) => s.name)
    const color = d3
      .scaleOrdinal<string, string>(d3.schemeCategory10)
      .domain(stationNames)

    const lineGen = (idx: number) =>
      d3
        .line<{ t: number; queues: number[] }>()
        .x((d) => xScale(d.t))
        .y((d) => yScale(d.queues[idx]))
        .curve(d3.curveMonotoneX)

    stationNames.forEach((name, i) => {
      g.append("path")
        .datum(timeSeries)
        .attr("fill", "none")
        .attr("stroke", color(name))
        .attr("stroke-width", 2)
        .attr("d", lineGen(i))
    })

    const legend = g
      .append("g")
      .attr("transform", `translate(${timeWidth - 120},0)`)
    stationNames.forEach((name, i) => {
      const row = legend
        .append("g")
        .attr("transform", `translate(0, ${i * 16})`)
      row
        .append("rect")
        .attr("width", 12)
        .attr("height", 12)
        .attr("fill", color(name))
      row
        .append("text")
        .attr("x", 16)
        .attr("y", 10)
        .attr("fill", "#334155")
        .attr("font-size", 12)
        .text(name)
    })

    if (
      container &&
      (simulationState.isRunning || batchRunning) &&
      !fitToWidth
    ) {
      container.scrollLeft = container.scrollWidth
    }
  }

  $effect(() => {
    fitToWidth
    if (svg) updateChart()
  })

  function sampleQueues() {
    const t = simulationState.simulationTime
    if (timeSeries.length === 0 || t - lastSampledTime >= samplingInterval) {
      const queues = stationStates.map((s) => s.queue.length)
      timeSeries.push({ t, queues })
      lastSampledTime = t
      if (svg) updateChart()
    }
  }

  function normalizeStationTimes(station: StationConfig) {
    if (station.processTimeMin > station.processTimeMode) {
      station.processTimeMode = station.processTimeMin
    }
    if (station.processTimeMode > station.processTimeMax) {
      station.processTimeMax = station.processTimeMode
    }
    if (station.processTimeMin > station.processTimeMax) {
      station.processTimeMin = station.processTimeMax
    }
  }

  function percentOfMax(value: number, max: number) {
    const m = max > 0 ? max : 1
    return Math.round((value / m) * 100)
  }

  function advanceSimulation(deltaTime: number) {
    const timeStep = (deltaTime * simulationConfig.simulationSpeed) / 60
    simulationState.simulationTime += timeStep

    simulationState.timeToNextFile -= timeStep
    if (
      simulationState.timeToNextFile <= 0 &&
      simulationState.filesCreated < simulationConfig.totalFiles
    ) {
      const newFile = createFileEntity(
        simulationState.filesCreated,
        simulationState.simulationTime
      )
      stationStates[0].queue.push(newFile)
      simulationState.filesCreated++
      simulationState.timeToNextFile = simulationConfig.fileArrivalInterval
    }
    for (const station of stationStates) {
      for (let i = 0; i < station.activeWorkers.length; i++) {
        const worker = station.activeWorkers[i]
        if (worker && simulationState.simulationTime >= worker.completionTime) {
          const finishedFile = worker.file
          const nextStationIndex = station.id + 1
          if (nextStationIndex < stationStates.length) {
            stationStates[nextStationIndex].queue.push(finishedFile)
          } else {
            completedFiles.push(finishedFile)
          }
          station.activeWorkers[i] = null
        }
      }
      for (let i = 0; i < station.activeWorkers.length; i++) {
        if (station.activeWorkers[i] === null && station.queue.length > 0) {
          const fileToProcess = station.queue.shift()!
          const processTime = generateTriangularRandom(
            station.config.processTimeMin,
            station.config.processTimeMode,
            station.config.processTimeMax
          )
          station.activeWorkers[i] = {
            file: fileToProcess,
            completionTime: simulationState.simulationTime + processTime,
          }
        }
      }
    }
    if (completedFiles.length === simulationConfig.totalFiles) {
      simulationState.isRunning = false
    }
    sampleQueues()
  }

  $effect(() => {
    if (!simulationState.isRunning) return

    let frameId: number
    let lastTime = performance.now()

    const frame = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000
      lastTime = currentTime

      advanceSimulation(deltaTime)

      if (simulationState.isRunning) {
        frameId = requestAnimationFrame(frame)
      }
    }
    frameId = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(frameId)
    }
  })

  function start() {
    simulationState.isRunning = true
    // Ensure an immediate visual update
    sampleQueues()
    if (svg) updateChart()
  }

  function pause() {
    simulationState.isRunning = false
  }

  function reset() {
    simulationState.isRunning = false
    simulationState.simulationTime = 0
    simulationState.filesCreated = 0
    simulationState.timeToNextFile = 0
    completedFiles = []
    timeSeries = []
    lastSampledTime = 0
    stationStates = simulationConfig.stations.map((config, index) => ({
      id: index,
      config: config,
      queue: [],
      activeWorkers: Array(config.workers).fill(null),
    }))
    sampleQueues()
    if (svg) updateChart()
  }

  async function batchRun() {
    if (batchRunning) return
    simulationState.isRunning = false
    reset()
    fitToWidth = false
    batchRunning = true

    try {
      let iterations = 0
      const yieldEvery = 200

      const done = () => completedFiles.length === simulationConfig.totalFiles

      while (!done()) {
        let deltas: number[] = []
        if (simulationState.filesCreated < simulationConfig.totalFiles) {
          deltas.push(Math.max(0, simulationState.timeToNextFile))
        }
        for (const station of stationStates) {
          for (const worker of station.activeWorkers) {
            if (worker) {
              const remaining =
                worker.completionTime - simulationState.simulationTime
              deltas.push(Math.max(0, remaining))
            }
          }
        }

        let deltaMinutes = deltas.length > 0 ? Math.min(...deltas) : 0
        if (!isFinite(deltaMinutes)) deltaMinutes = 0

        const deltaSeconds =
          (deltaMinutes * 60) / simulationConfig.simulationSpeed

        advanceSimulation(deltaSeconds)

        iterations++
        if (iterations % yieldEvery === 0) {
          await new Promise((r) => setTimeout(r, 0))
        }
      }
    } finally {
      batchRunning = false
      fitToWidth = true
      if (svg) updateChart()
    }
  }

  $effect(() => {
    if (batchRunning) return
    if (lastConfigSignature === null) {
      lastConfigSignature = configSignature
      return
    }

    if (configSignature !== lastConfigSignature) {
      const hasProgress =
        simulationState.simulationTime > 0 ||
        simulationState.filesCreated > 0 ||
        completedFiles.length > 0

      if (hasProgress) {
        reset()
      }
      lastConfigSignature = configSignature
    }
  })
</script>

<div
  class="font-sans border rounded-lg p-6 bg-gray-50 max-w-5xl mx-auto shadow-lg"
>
  <header
    class="flex flex-wrap justify-between items-center border-b pb-4 mb-4"
  >
    <h1 class="text-2xl font-bold text-gray-800">File Processing Simulator</h1>
    <div class="controls mt-2 sm:mt-0">
      <button
        onclick={start}
        disabled={simulationState.isRunning || batchRunning}
        class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >Start</button
      >
      <button
        onclick={pause}
        disabled={!simulationState.isRunning || batchRunning}
        class="ml-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >Pause</button
      >
      <button
        onclick={reset}
        disabled={batchRunning}
        class="ml-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >Reset</button
      >
      <button
        onclick={batchRun}
        disabled={batchRunning}
        class="ml-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed"
        >Batch Run</button
      >
      {#if batchRunning}
        <span class="ml-3 inline-flex items-center text-sm text-gray-600">
          <svg
            class="animate-spin -ml-1 mr-2 h-4 w-4 text-purple-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          Running...
        </span>
      {/if}
    </div>
  </header>

  <main>
    <div class="dashboard">
      <div
        class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center bg-gray-100 p-3 rounded-md mb-6"
      >
        <div>
          <div class="text-xs text-gray-500 uppercase">Time</div>
          <div class="text-xl font-semibold text-gray-800">
            {simulationState.simulationTime.toFixed(1)}m ({simulationHours.toFixed(
              2
            )}h)
          </div>
        </div>
        <div>
          <div class="text-xs text-gray-500 uppercase">Completed</div>
          <div class="text-xl font-semibold text-gray-800">
            {completedFiles.length} / {simulationConfig.totalFiles}
          </div>
        </div>
        <div>
          <div class="text-xs text-gray-500 uppercase">Queued</div>
          <div class="text-xl font-semibold text-gray-800">{totalQueued}</div>
        </div>
        <div>
          <div class="text-xs text-gray-500 uppercase">Total Cost</div>
          <div class="text-xl font-semibold text-gray-800">
            ${totalCost.toFixed(2)}
          </div>
        </div>
      </div>
    </div>

    <details class="bg-white border rounded-lg p-4 mb-6 shadow-sm">
      <summary class="font-semibold text-lg cursor-pointer"
        >Configuration</summary
      >
      <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="border rounded-md p-4">
          <h4 class="font-medium mb-3">Global Settings</h4>
          <label class="block text-sm text-gray-600">
            Total Documents
            <input
              type="number"
              bind:value={simulationConfig.totalFiles}
              class="mt-1 w-full p-1 border rounded"
              min="10"
              max="5000"
            />
          </label>
        </div>
        <div class="border rounded-md p-4">
          <h4 class="font-medium mb-3">Simulation Speed</h4>
          <label class="block text-sm text-gray-600">
            Speed Multiplier ({simulationConfig.simulationSpeed}x)
            <input
              type="range"
              bind:value={simulationConfig.simulationSpeed}
              class="mt-1 w-full"
              min="1"
              max="2000"
              step="1"
            />
          </label>
        </div>
      </div>

      <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        {#each simulationConfig.stations as station (station.name)}
          <div class="border rounded-md p-4 space-y-3">
            <h4 class="font-medium">{station.name}</h4>
            <label class="block text-sm text-gray-600">
              Workers ({station.workers})
              <input
                type="range"
                bind:value={station.workers}
                class="mt-1 w-full"
                min="1"
                max="15"
              />
            </label>
            <label class="block text-sm text-gray-600">
              Cost per Hour (${station.costPerHour})
              <input
                type="range"
                bind:value={station.costPerHour}
                class="mt-1 w-full"
                min="10"
                max="100"
              />
            </label>
            <label class="block text-sm text-gray-600">
              Min Time ({station.processTimeMin.toFixed(1)}m, {percentOfMax(
                station.processTimeMin,
                station.processTimeMax
              )}%)
              <input
                type="range"
                bind:value={station.processTimeMin}
                class="mt-1 w-full"
                min="0.1"
                max={station.processTimeMax}
                step="0.1"
                oninput={() => normalizeStationTimes(station)}
              />
            </label>
            <label class="block text-sm text-gray-600">
              Mode Time ({station.processTimeMode.toFixed(1)}m, {percentOfMax(
                station.processTimeMode,
                station.processTimeMax
              )}%)
              <input
                type="range"
                bind:value={station.processTimeMode}
                class="mt-1 w-full"
                min={station.processTimeMin}
                max={station.processTimeMax}
                step="0.1"
                oninput={() => normalizeStationTimes(station)}
              />
            </label>
            <label class="block text-sm text-gray-600">
              Max Time ({station.processTimeMax.toFixed(1)}m, 100%)
              <input
                type="range"
                bind:value={station.processTimeMax}
                class="mt-1 w-full"
                min={station.processTimeMode}
                max="60"
                step="0.1"
                oninput={() => normalizeStationTimes(station)}
              />
            </label>
          </div>
        {/each}
      </div>
    </details>

    <div class="stations grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {#each stationStates as station (station.id)}
        <div class="border rounded-lg p-4 bg-white shadow-sm flex flex-col">
          <h3 class="font-semibold text-lg text-gray-800 mb-3">
            {station.config.name}
          </h3>
          <div class="flex-grow space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">In Queue:</span>
              <span class="font-mono bg-gray-100 px-2 py-0.5 rounded"
                >{station.queue.length}</span
              >
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Active Workers:</span>
              <span class="font-mono bg-gray-100 px-2 py-0.5 rounded"
                >{station.activeWorkers.filter((w) => w !== null).length} / {station
                  .config.workers}</span
              >
            </div>
          </div>
        </div>
      {/each}
    </div>

    <div class="visualization mt-6">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-lg font-semibold text-gray-800">Queue Lengths</h3>
        <div class="flex items-center gap-2 text-xs text-gray-600">
          <span>View</span>
          <button
            onclick={() => {
              fitToWidth = true
              if (svg) updateChart()
            }}
            class={`px-2 py-1 rounded border ${fitToWidth ? "bg-gray-800 text-white border-gray-800" : "bg-white hover:bg-gray-50"}`}
            aria-pressed={fitToWidth}>Fit</button
          >
          <button
            onclick={() => {
              fitToWidth = false
              if (svg) updateChart()
            }}
            class={`px-2 py-1 rounded border ${!fitToWidth ? "bg-gray-800 text-white border-gray-800" : "bg-white hover:bg-gray-50"}`}
            aria-pressed={!fitToWidth}>Follow</button
          >
        </div>
      </div>
      <div
        class="w-full overflow-x-auto bg-white p-2 border rounded-lg shadow-sm"
      >
        <svg bind:this={svgElement} class="h-64"></svg>
      </div>
    </div>
  </main>
</div>
