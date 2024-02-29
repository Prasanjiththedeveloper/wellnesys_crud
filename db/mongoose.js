const mongoose = require('mongoose')
const url = process.env.MONGO_DB_URL
mongoose.connect(url)
.then(()=>{
    console.log('Connected to db')
})
.catch(()=>{
    console.log('Connection Failed')
})

module.exports = mongoose