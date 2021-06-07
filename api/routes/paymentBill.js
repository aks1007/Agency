const express = require('express')
const mongoose = require('mongoose')

const paymentBillController = require('../controllers/paymentBill')
const router = express.Router()

//--CREATING A NEW GOODS RETURN INVOICE--
router.post('/', paymentBillController.postOnePaymentBill)

//--DELETING A GOODS RETURN INVOICE--
router.delete('/basic/:id', paymentBillController.deleteOnePaymentBill)

//--GETTING A ARRAY OF GOODS RETURN INVOICES FOR A SPECIFIC GOODS RETURN ENTRY 
router.get('/basic/:id', paymentBillController.getMultiplePaymentBill)

module.exports = router