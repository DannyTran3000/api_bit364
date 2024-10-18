const { DATABASE } = require('../database/_index')
const { CouchDB } = require('../database/CouchDB')
const { MongoDB } = require('../database/MongoDB')
const { OrientDB, connectToOrientDB } = require('../database/OrientDB')

class UserModel {
  async create(type, data) {
    try {
      const start = process.hrtime()

      let newUser = null
      switch (type) {
        case DATABASE.couchDB:
          newUser = await CouchDB.insert({ ...data, $collection: 'users' })
          break

        case DATABASE.mongoDB:
          newUser = await MongoDB.collection('users').insertOne(data)
          break

        case DATABASE.orientDB:
          const OrientDB = await connectToOrientDB()

          const fields = Object.keys(data)
            .map((key) => `${key} = :${key}`)
            .join(', ')
          newUser = await OrientDB.command(`INSERT INTO users SET ${fields}`, {
            params: data,
          }).one()
          console.log(newUser)
          break

        default:
          break
      }

      const end = process.hrtime(start)
      const totalMilliseconds = Math.floor(end[1] / 1e6)

      if (!newUser) return { id: null, processingTime: 0 }

      switch (type) {
        case DATABASE.couchDB:
          return { id: newUser?.id, processingTime: totalMilliseconds }

        case DATABASE.mongoDB:
          return {
            id: newUser?.insertedId.toString(),
            processingTime: totalMilliseconds,
          }

        case DATABASE.orientDB:
          return {
            id: newUser['@rid'].toString(),
            processingTime: totalMilliseconds,
          }

        default:
          break
      }
    } catch (err) {
      console.error('Error:', err?.message || JSON.stringify(err))
    }
  }
}

const USER_MODEL = new UserModel()

module.exports = USER_MODEL
