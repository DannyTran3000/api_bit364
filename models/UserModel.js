const { DATABASE } = require('../database/_index')
const { CouchDB } = require('../database/CouchDB')
const { MongoDB } = require('../database/MongoDB')
const { connectToOrientDB } = require('../database/OrientDB')
const { store } = require('../database/RavenDB')
const _ = require('lodash')

class UserModel {
  async create(type, data) {
    try {
      const start = process.hrtime()

      let newUser = null
      switch (type) {
        case DATABASE.couchDB:
          newUser = await CouchDB.insert({
            ...data,
            metadata: { collection: 'users' },
          })
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

          await OrientDB.close()
          break

        case DATABASE.ravenDB:
          const session = store.openSession()
          try {
            newUser = {
              ...data,
              '@metadata': { '@collection': 'users' },
            }
            await session.store(newUser)
            await session.saveChanges()
          } catch(e) {
            console.error(e)
          } finally {
            await session.dispose()
          }

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

        case DATABASE.ravenDB:
          return {
            id: newUser?.id,
            processingTime: totalMilliseconds,
          }

        default:
          break
      }
    } catch (err) {
      console.error('Error:', err?.message || JSON.stringify(err))
    }
  }

  async readAll(type, limit) {
    try {
      const start = process.hrtime()
      const StartCpuUsage = process.cpuUsage()
      const initialMemoryUsage = process.memoryUsage()
      let endCpuUsage, finalMemoryUsage

      let users
      switch (type) {
        case DATABASE.couchDB:
          users = await CouchDB.find({
            selector: { metadata: { collection: 'users' } },
            limit,
          })
          break

        case DATABASE.mongoDB:
          users = await MongoDB.collection('users')
            .find()
            .limit(limit)
            .toArray()
          break

        case DATABASE.orientDB:
          const OrientDB = await connectToOrientDB()
          users = await OrientDB.command(
            'SELECT * FROM users LIMIT :limit',
            { params: { limit } }
          ).all()
          break

        case DATABASE.ravenDB:
          const session = store.openSession()
          users = await session.query({ collection: 'users' }).take(limit).all()
          break

        default:
          break
      }

      const end = process.hrtime(start)
      const totalMilliseconds = Math.floor(end[1] / 1e6)
      endCpuUsage = process.cpuUsage(StartCpuUsage)
      finalMemoryUsage = process.memoryUsage()

      return {
        length: users.length,
        data: users,
        cpu: {
          StartCpuUsage,
          initialMemoryUsage,
          endCpuUsage,
          finalMemoryUsage,
        },
        processingTime: totalMilliseconds,
      }
    } catch (err) {
      console.error('Error:', err?.message || JSON.stringify(err))
    }
  }
}

const USER_MODEL = new UserModel()

module.exports = USER_MODEL
