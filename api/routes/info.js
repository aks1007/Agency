const express = require('express')
const mongoose = require('mongoose')

const infoController = require('../controllers/info')
const router = express.Router()

//--CREATING A NEW INFO--
router.post('/', infoController.postOneInfo)

//--DISPLAYING AN INFO--
router.get('/:id', infoController.getOneInfo)

//--UPDATING AN INFO--
router.put('/:id', infoController.putOneInfo)


module.exports = router