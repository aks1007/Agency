const mongoose = require('mongoose')

const marketSchema = mongoose.Schema({
    market : {
        type : String,
    }
})

module.exports = marketSchema