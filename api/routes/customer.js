const express = require('express')
const mongoose = require('mongoose')

const customerController = require('../controllers/customer')
const router = express.Router()


//--DISPLAYING ALL CUSTOMER GROUPS--
router.get('/', customerController.getAllCustomers)

//--CREATING A NEW CUSTOMER GROUP--
router.post('/', customerController.postOneCustomer)

//--DISPLAYING A CUSTOMER GROUP--
router.get('/basic/:customerName', customerController.getOneCustomer)

//--UPDATING A CUSTOMER GROUP--
router.put('/basic/:customerName', customerController.putOneCustomer)

//--DELETING A CUSTOMER GROUP--
router.delete('/basic/:customerName', customerController.deleteOneCustomer)

//--ADRESS LIST REPORT(ALL)--
router.get('/address',customerController.getAllAddress)

module.exports = router