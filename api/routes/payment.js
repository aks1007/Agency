const express = require('express')
const mongoose = require('mongoose')


const paymentController = require('../controllers/payment')
const router = express.Router()


//--DISPLAYING ALL GOODS RETURNS--
router.get('/', paymentController.getAllPayments)

//--CREATING A NEW GOODS RETURN--
router.post('/', paymentController.postOnePayment)

//--DISPLAYING A GOODS RETURN--
router.get('/basic/:serialNo', paymentController.getOnePayment)

//--UPDATING A GOODS RETURN--
router.put('/basic/:serialNo', paymentController.putOnePayment)

//--DELETING A GOODS RETURN--
router.delete('/basic/:serialNo', paymentController.deleteOnePayment)

//--GET LAST GOODS RETURN's SERIAL NO--
router.get('/last', paymentController.getLastPayment)

//--DISPLAYING ALL ORDERS BETWEEN A DATE RANGE
router.get('/range/:from&:to',paymentController.getRangePayments)

//--DISPLAYING ALL ORDERS BETWEEN A DATE RANGE FOR A SPECIFIC SUPPLIER
router.get('/range/:supplier/:from&:to',paymentController.getRangeSupplierPayments)


module.exports = router