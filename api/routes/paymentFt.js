const express = require('express')
const mongoose = require('mongoose')

const paymentFtController = require('../controllers/paymentFt')
const router = express.Router()

//--CREATING A NEW PAYMENT FT--
router.post('/', paymentFtController.postOnePaymentFt)

//--DELETING A PAYMENT FT--
router.delete('/basic/:id', paymentFtController.deleteOnePaymentFt)

//--GETTING A ARRAY OF PAYMENT FT FOR A SPECIFIC PAYMENT
router.get('/basic/:id', paymentFtController.getMultiplePaymentFt)

module.exports = router