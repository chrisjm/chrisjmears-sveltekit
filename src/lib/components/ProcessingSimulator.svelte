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
    max: number,
    mode: number
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
    fileArrivalInterval: 60,
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
        processTimeMin: 10,
        processTimeMode: 10,
        processTimeMax: 15,
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

  let completedFiles = $state<FileEntity[]>([])

  const totalCost = $derived(
    simulationConfig.stations.reduce(
      (total, station) => total + station.workers * station.costPerHour,
      0
    ) *
      (simulationState.simulationTime / 60)
  )

  const totalQueued = $derived(
    stationStates.reduce((sum, station) => sum + station.queue.length, 0)
  )

  // Track configuration changes to reset simulation only when config changes
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
    const margin = { top: 20, right: 20, bottom: 30, left: 40 }
    const width = svgElement.clientWidth - margin.left - margin.right
    const height = svgElement.clientHeight - margin.top - margin.bottom

    const chartData = stationStates.map((s) => ({
      name: s.config.name,
      queueLength: s.queue.length,
    }))

    svg.selectAll("*").remove()

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)
    const xScale = d3
      .scaleBand()
      .domain(chartData.map((d) => d.name))
      .range([0, width])
      .padding(0.4)

    const maxQueue = d3.max(chartData, (d) => d.queueLength) || 10
    const yScale = d3.scaleLinear().domain([0, maxQueue]).range([height, 0])

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
    g.append("g").call(d3.axisLeft(yScale))
    g.selectAll(".bar")
      .data(chartData)
      .join("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d.name)!)
      .attr("width", xScale.bandwidth())
      .attr("y", (d) => yScale(d.queueLength))
      .attr("height", (d) => height - yScale(d.queueLength))
      .attr("fill", "steelblue")
  }

  function advanceSimulation(deltaTime: number) {
    const timeStep = deltaTime * simulationConfig.simulationSpeed
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
          // const processTime = generateNormalRandom(
          //   station.config.processTimeMean,
          //   station.config.processTimeStdDev
          // )
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
    // Update visualization each simulation step
    if (svg) {
      updateChart()
    }
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
    stationStates = simulationConfig.stations.map((config, index) => ({
      id: index,
      config: config,
      queue: [],
      activeWorkers: Array(config.workers).fill(null),
    }))
    // Refresh visualization after reset
    if (svg) {
      updateChart()
    }
  }

  $effect(() => {
    // Initialize signature on first run
    if (lastConfigSignature === null) {
      lastConfigSignature = configSignature
      return
    }

    // When config changes, reset if the simulation has progressed
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
        disabled={simulationState.isRunning}
        class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >Start</button
      >
      <button
        onclick={pause}
        disabled={!simulationState.isRunning}
        class="ml-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >Pause</button
      >
      <button
        onclick={reset}
        class="ml-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50"
        >Reset</button
      >
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
            {simulationState.simulationTime.toFixed(1)}m
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
              Min Time ({station.processTimeMin.toFixed(1)}m)
              <input
                type="range"
                bind:value={station.processTimeMin}
                class="mt-1 w-full"
                min="0.1"
                max="10"
                step="0.1"
              />
            </label>
            <label class="block text-sm text-gray-600">
              Mode Time ({station.processTimeMode.toFixed(1)}m)
              <input
                type="range"
                bind:value={station.processTimeMode}
                class="mt-1 w-full"
                min="0.1"
                max="10"
                step="0.1"
              />
            </label>
            <label class="block text-sm text-gray-600">
              Max Time ({station.processTimeMax.toFixed(1)}m)
              <input
                type="range"
                bind:value={station.processTimeMax}
                class="mt-1 w-full"
                min="0.1"
                max="10"
                step="0.1"
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
      <h3 class="text-lg font-semibold text-gray-800 mb-2">Queue Lengths</h3>
      <div class="w-full bg-white p-2 border rounded-lg shadow-sm">
        <svg bind:this={svgElement} class="w-full h-64"></svg>
      </div>
    </div>
  </main>
</div>
