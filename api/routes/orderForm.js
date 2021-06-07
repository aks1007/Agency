const express = require('express')
const mongoose = require('mongoose')


const orderFormController = require('../controllers/orderForm')
const router = express.Router()


//--DISPLAYING ALL ORDER FORMS--
router.get('/', orderFormController.getAllOrderForms)

//--CREATING A NEW ORDER FORM--
router.post('/', orderFormController.postOneOrderForm)

//--DISPLAYING A ORDER FORM--
router.get('/basic/:serialNo', orderFormController.getOneOrderForm)

//--UPDATING A ORDER FORM--
router.put('/basic/:serialNo', orderFormController.putOneOrderForm)

//--DELETING A ORDER FORM--
router.delete('/basic/:serialNo', orderFormController.deleteOneOrderForm)

//--GET LAST ORDER FORM's SERIAL NO--
router.get('/last', orderFormController.getLastOrderForm)

//--DISPLAYING ALL ORDERS BETWEEN A DATE RANGE
router.get('/range/:from&:to',orderFormController.getRangeOrderForms)


module.exports = router