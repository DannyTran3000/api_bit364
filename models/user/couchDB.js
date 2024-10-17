const { couchDB } = require('../../database/CouchDB')

class UserCouchDBModel {
  async create(data) {
    try {
      const start = process.hrtime();
      const newUser = await couchDB.insert(data)

      console.log('New user:', newUser)
      const end = process.hrtime(start);

      console.log('===================', start, end)
    } catch (err) {
      console.error('Error:', err?.message || JSON.stringify(err))
    }
  }
}

const USER_COUCH_DB_MODEL = new UserCouchDBModel()

module.exports = USER_COUCH_DB_MODEL
