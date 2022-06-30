const express = require('express');
const cors = require('cors');
const app = express();
const port = 1000;

const mongoose = require('./src/database/connection')
const usersControllers = require('./src/controllers/usersControllers')

app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use('/auth', usersControllers)

app.listen(port, () => {
    console.log(`Servidor no ar: http://localhost:${port}`)
})