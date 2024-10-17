const express = require('express')
const UserRoute = require('./routes/UserRoute')

const app = express()
const port = 3000

app.use(express.json())

app.use('/api/users', UserRoute)

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
