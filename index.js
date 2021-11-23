const connectToMongo = require('./db');
connectToMongo();

const express = require('express')
const app = express()
const port = 3000

app.use(express.json())

// Available Routes
app.use('/api/auth', require('./routes/auth'))
//app.use('/api/leads', require('./routes/leads'))

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})