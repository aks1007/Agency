const express = require('express')
const mongoose = require('mongoose')

const goodsReturnBillController = require('../controllers/goodsReturnBill')
const router = express.Router()

//--CREATING A NEW GOODS RETURN INVOICE--
router.post('/', goodsReturnBillController.postOneGoodsReturnBill)

//--DELETING A GOODS RETURN INVOICE--
router.delete('/basic/:id', goodsReturnBillController.deleteOneGoodsReturnBill)

//--GETTING A ARRAY OF GOODS RETURN INVOICES FOR A SPECIFIC GOODS RETURN ENTRY 
router.get('/basic/:id', goodsReturnBillController.getMultipleGoodsReturnBill)

//--GETTING MULTIPLE GOODS RETURN ON A SINGLE INVOICE
router.get('/bill/:customer/:supplier/:billNo', goodsReturnBillController.getOneGRInvoiceFromBill)

module.exports = router