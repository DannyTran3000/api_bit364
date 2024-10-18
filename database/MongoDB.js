const { MongoClient } = require('mongodb')

const client = new MongoClient('mongodb://localhost:27017')
const MongoDB = client.db('bit364_mongodb')

module.exports = { MongoDB }
