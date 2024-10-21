const { faker } = require('@faker-js/faker')

const { DATABASE } = require('../database/_index')
const USER_MODEL = require('../models/UserModel')
const {LOG_HELPER, consoleBreakLine} = require('../helpers/LogHelper')

class UserController {
  async insert(req, res) {
    const amount = parseInt(req.query?.amount || 1)

    const collection = privateGenerateUserData(amount)

    const couchDBAnalyzeData = await privateInsert(DATABASE.couchDB, collection)
    const mongoDBAnalyzeData = await privateInsert(DATABASE.mongoDB, collection)
    const orientDBAnalyzeData = await privateInsert(
      DATABASE.orientDB,
      collection
    )
    const ravenDBAnalyzeData = await privateInsert(DATABASE.ravenDB, collection)

    const analyzeData = {
      couchDB: couchDBAnalyzeData,
      mongoDB: mongoDBAnalyzeData,
      orientDB: orientDBAnalyzeData,
      ravenDB: ravenDBAnalyzeData,
    }

    console.log('')
    console.log(`${amount} records have been inserted into the databases`)
    console.log('')
    LOG_HELPER.consoleCPUDataFromInsert(analyzeData)

    res.json({ status: 201, data: analyzeData })
  }

  async select(req, res) {
    const amount = parseInt(req.query?.amount || 1)
    const couchDBUsers = await USER_MODEL.readAll(DATABASE.couchDB, amount)
    const mongoDBUsers = await USER_MODEL.readAll(DATABASE.mongoDB, amount)
    const orientDBUsers = await USER_MODEL.readAll(DATABASE.orientDB, amount)
    const ravenDBUsers = await USER_MODEL.readAll(DATABASE.ravenDB, amount)

    const analyzeData = {
      couchDB: couchDBUsers,
      mongoDB: mongoDBUsers,
      orientDB: orientDBUsers,
      ravenDB: ravenDBUsers,
    }


    consoleBreakLine(3)
    console.log(`${amount} records have been found from each database`)
    LOG_HELPER.consoleCPUDataFromInsert(analyzeData)

    res.json({ status: 200, data: analyzeData })
  }
}

const privateGenerateUserData = (loop) => {
  let list = []
  for (let i = 0; i < loop; i++) {
    const data = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      dob: faker.date.between({ from: '1970-01-01', to: '2004-01-01' }),
      address: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zip: faker.location.zipCode(),
      },
    }
    list.push(data)
  }

  return list
}

const privateInsert = async (type, input) => {
  const StartCpuUsage = process.cpuUsage()
  const initialMemoryUsage = process.memoryUsage()
  let endCpuUsage, finalMemoryUsage
  const processingTimeData = []
  // if (type != DATABASE.ravenDB) {
  for (let i = 0; i < input.length; i++) {
    if (!input[i]) continue

    const res = await USER_MODEL.create(type, input[i])
    processingTimeData.push(res)

    if (i != input.length - 1) continue
    endCpuUsage = process.cpuUsage(StartCpuUsage)
    finalMemoryUsage = process.memoryUsage()
  }

  return {
    cpu: { StartCpuUsage, initialMemoryUsage, endCpuUsage, finalMemoryUsage },
    processingTime: processingTimeData,
  }
  // }
}

const USER_CONTROLLER = new UserController()

module.exports = USER_CONTROLLER
