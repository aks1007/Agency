const express = require('express')
const mongoose = require('mongoose')


const transporterController = require('../controllers/transporter')
const router = express.Router()


//--DISPLAYING ALL TRANSPORTERS--
router.get('/', transporterController.getAllTransporters)

//--CREATING A NEW TRANSPORTER--
router.post('/', transporterController.postOneTransporter)

//--DISPLAYING A TRANSPORTER--
router.get('/:transporterName', transporterController.getOneTransporter)

//--UPDATING A TRANSPORTER--
router.put('/:transporterName', transporterController.putOneTransporter)

//--DELETING A TRANSPORTER--
router.delete('/:transporterName', transporterController.deleteOneTransporter)


module.exports = router