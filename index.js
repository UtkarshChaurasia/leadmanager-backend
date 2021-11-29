const connectToMongo = require('./db');
connectToMongo();

const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const hostname = '0.0.0.0';

app.use(express.json())

// Available Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/leads', require('./routes/leads'))

app.listen(port, hostname, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})