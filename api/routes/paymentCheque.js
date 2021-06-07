const express = require('express')
const mongoose = require('mongoose')

const paymentChequeController = require('../controllers/paymentCheque')
const router = express.Router()

//--CREATING A NEW MAIL CHEQUE--
router.post('/', paymentChequeController.postOnePaymentCheque)

//--DELETING A MAIL CHEQUE--
router.delete('/basic/:id', paymentChequeController.deleteOnePaymentCheque)

//--GETTING A ARRAY OF MAIL CHEQUE FOR A SPECIFIC MAIL
router.get('/basic/:id', paymentChequeController.getMultiplePaymentCheque)

module.exports = router