const express = require('express')
const mongoose = require('mongoose')


const transporterController = require('../controllers/transporter')
const router = express.Router()


//--DISPLAYING ALL TRANSPORTERS--
router.get('/', transporterController.getAllTransporters)

//--CREATING A NEW TRANSPORTER--
router.post('/', transporterController.postOneTransporter)

//--DISPLAYING A TRANSPORTER--
router.get('/basic/:transporterName', transporterController.getOneTransporter)

//--UPDATING A TRANSPORTER--
router.put('/basic/:transporterName', transporterController.putOneTransporter)

//--DELETING A TRANSPORTER--
router.delete('/basic/:transporterName', transporterController.deleteOneTransporter)

//--ADRESS LIST REPORT(ALL)--
router.get('/address', transporterController.getAllAddress)


module.exports = router