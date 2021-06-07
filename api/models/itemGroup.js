const mongoose = require('mongoose')

const itemGroupSchema = mongoose.Schema({
    itemGroup : {
        type : String,
    }
})

module.exports = itemGroupSchema