const express = require('express')
const mongoose = require('mongoose')

const brokerageVoucherController = require('../controllers/brokerageVoucher')
const router = express.Router()

//--CREATING A NEW BROKERAGE VOUCHER--
router.post('/', brokerageVoucherController.postOneBrokerageVoucher)

//--DELETING A BROKERAGE VOUCHER--
router.delete('/basic/:id', brokerageVoucherController.deleteOneBrokerageVoucher)

//--GETTING A ARRAY OF BROKERAGE VOUCHERS FOR A SPECIFIC BROKERAGE ENTRY 
router.get('/basic/:id', brokerageVoucherController.getMultipleBrokerageVoucher)

//--GETTING MULTIPLE GOODS RETURN ON A SINGLE INVOICE
router.get('/bill/:customer/:supplier/:vouNo', brokerageVoucherController.getOneBrokerageVoucherFromVouNo)

module.exports = router