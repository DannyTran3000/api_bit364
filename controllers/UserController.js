const USER_COUCH_DB_MODEL = require('../models/user/couchDB')
const { faker } = require('@faker-js/faker')

const insert = (req, res) => {
  const amount = parseInt(req.query?.amount || 1)
  for (let i = 0; i < amount; i++) {
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

    USER_COUCH_DB_MODEL.create(data)
  }
}

module.exports = { insert }
