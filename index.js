const express = require('express')
const bodyParser = require('body-parser');
require('dotenv').config()
require('./db/mongoose')
const productRoutes = require('./routes/product.route')
const authRoutes = require('./routes/auth.route')

const PORT = process.env.PORT || 5000
const app = express()

app.use(bodyParser.json())
app.use(authRoutes)
app.use(productRoutes)



app.listen(PORT , ()=>{
    console.log(`Listening on port ${PORT} `)
})
