const nano = require('nano')('http://admin:admin@127.0.0.1:5984')


const couchDB = nano.db.use('bit364_couchdb')

module.exports = { couchDB }
