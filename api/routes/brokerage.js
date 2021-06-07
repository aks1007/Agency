const express = require('express')
const mongoose = require('mongoose')


const brokerageController = require('../controllers/brokerage')
const router = express.Router()


//--DISPLAYING ALL BROKERAGES--
router.get('/', brokerageController.getAllBrokerages)

//--CREATING A NEW BROKERAGE--
router.post('/', brokerageController.postOneBrokerage)

//--DISPLAYING A BROKERAGE--
router.get('/basic/:serialNo', brokerageController.getOneBrokerage)

//--UPDATING A BROKERAGE--
router.put('/basic/:serialNo', brokerageController.putOneBrokerage)

//--DELETING A BROKERAGE--
router.delete('/basic/:serialNo', brokerageController.deleteOneBrokerage)

//--GET LAST BROKERAGE's SERIAL NO--
router.get('/last', brokerageController.getLastBrokerage)

//--DISPLAYING ALL ORDERS BETWEEN A DATE RANGE
router.get('/range/:from&:to',brokerageController.getRangeBrokerages)

module.exports = router