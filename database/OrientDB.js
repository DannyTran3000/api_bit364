const OrientDBClient = require('orientjs').OrientDBClient

const connectToOrientDB = async () => {
  try {
    const client = await OrientDBClient.connect({
      host: 'localhost',
      port: 2424,
    })

    const session = await client.session({
      name: 'bit364_orientdb',
      username: 'root',
      password: 'root',
    })

    return session
  } catch (err) {
    console.error('Failed to connect to OrientDB:', err.message)
  }
}

module.exports = { connectToOrientDB }
