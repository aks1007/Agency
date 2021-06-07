const express = require('express')
const mongoose = require('mongoose')

const invoiceItemController = require('../controllers/invoiceItem')
const router = express.Router()

//--CREATING A NEW ORDER ITEM--
router.post('/', invoiceItemController.postOneInvoiceItem)

//--DELETING A ORDER ITEM--
router.delete('/basic/:id', invoiceItemController.deleteOneInvoiceItem)

//--GETTING A ARRAY OF ORDER ITEM FOR A SPECIFIC ORDER FORM
router.get('/basic/:id', invoiceItemController.getMultipleInvoiceItem)

module.exports = router