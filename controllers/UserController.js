const { faker } = require('@faker-js/faker')

const { DATABASE } = require('../database/_index')
const USER_MODEL = require('../models/UserModel')

class UserController {
  async insert(req, res) {
    const amount = parseInt(req.query?.amount || 1)

    const collection = privateGenerateUserData(amount)

    // const couchDBAnalyzeData = await privateInsert(DATABASE.couchDB, collection)
    // const mongoDBAnalyzeData = await privateInsert(DATABASE.mongoDB, collection)
    const orientDBAnalyzeData = await privateInsert(DATABASE.orientDB, collection)
    // console.log('CouchDB Data:', couchDBAnalyzeData)
    // console.log('MongoDB Data:', mongoDBAnalyzeData)
    console.log('OrientDB Data:', orientDBAnalyzeData)
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
  let endCpuUsage = process.cpuUsage(StartCpuUsage)
  let finalMemoryUsage = process.memoryUsage()
  const processingTimeData = []
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
}

const USER_CONTROLLER = new UserController()

module.exports = USER_CONTROLLER
