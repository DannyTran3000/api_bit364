const { isArray } = require('lodash')

class LogHelper {
  consoleCPUDataFromInsert(data) {
    let processingTimes = []
    Object.entries(data).forEach(([key, value]) => {
      const totalTime = isArray(value.processingTime)
        ? value.processingTime
            .map((item) => item.processingTime)
            .reduce((p, n) => p + n, 0)
        : value.processingTime
      processingTimes.push({ Database: key, 'Time (ms)': totalTime })

      console.log('Database: ', key)
      const consoleData = [
        {
          Metric: 'User CPU Time',
          Start: value.cpu.StartCpuUsage.user + ' µs',
          End: value.cpu.endCpuUsage.user + ' µs',
        },
        {
          Metric: 'System CPU Time',
          Start: value.cpu.StartCpuUsage.system + ' µs',
          End: value.cpu.endCpuUsage.system + ' µs',
        },
        {
          Metric: 'Total CPU Time',
          Start:
            value.cpu.StartCpuUsage.user +
            value.cpu.StartCpuUsage.system +
            ' µs',
          End:
            value.cpu.endCpuUsage.user + value.cpu.endCpuUsage.system + ' µs',
        },
        {
          Metric: 'RSS Memory',
          Start: value.cpu.initialMemoryUsage.rss + ' bytes',
          End: value.cpu.finalMemoryUsage.rss + ' bytes',
        },
        {
          Metric: 'Heap Total',
          Start: value.cpu.initialMemoryUsage.heapTotal + ' bytes',
          End: value.cpu.finalMemoryUsage.heapTotal + ' bytes',
        },
        {
          Metric: 'Heap Used',
          Start: value.cpu.initialMemoryUsage.external + ' bytes',
          End: value.cpu.finalMemoryUsage.external + ' bytes',
        },
        {
          Metric: 'Heap Used',
          Start: value.cpu.initialMemoryUsage.external + ' bytes',
          End: value.cpu.finalMemoryUsage.external + ' bytes',
        },
      ]

      console.table(consoleData)
    })
    console.log('Processing Time:')
    console.table(processingTimes)
  }
}

const LOG_HELPER = new LogHelper()

module.exports = LOG_HELPER
