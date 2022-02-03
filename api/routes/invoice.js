const express = require('express')
const mongoose = require('mongoose')


const invoiceController = require('../controllers/invoice')
const router = express.Router()


//--DISPLAYING ALL INVOICES--
router.get('/', invoiceController.getAllInvoices)

//--CREATING A NEW INVOICE--
router.post('/', invoiceController.postOneInvoice)

//--DISPLAYING A INVOICE--
router.get('/basic/:serialNo', invoiceController.getOneInvoice)

//--UPDATING A INVOICE--
router.put('/basic/:serialNo', invoiceController.putOneInvoice)

//--DELETING A INVOICE--
router.delete('/basic/:serialNo', invoiceController.deleteOneInvoice)

//-----------------------------------------------------------------CUSTOM REQUESTS

//--GET LAST INVOICE's SERIAL NO--
router.get('/last', invoiceController.getLastInvoice)

//--DISPLAYING ALL INVOICES BETWEEN A DATE RANGE
router.get('/range/:from&:to',invoiceController.getRangeInvoices)

//--DISPLAYING ALL INVOICES FROM A SPECIFIC COMBINATION OF CUSTOMER AND SUPPLIER : 
router.get('/combo/:customer/:supplier', invoiceController.getAllInvoicesFromCombo)

//--DISPLAYING ONE INVOICE FROM INVOICE NO. WHICH IS NOT SETTLED
router.get('/bill/:customer/:supplier/:billNo', invoiceController.getOneInvoiceFromBill)

//--DISPLAYING ONE INVOICE FROM INVOICE NO. IRRESPECTIVE OF IT'S STATUS
router.get('/status/:customer/:supplier/:billNo', invoiceController.getAnyInvoiceFromBill)

//-----------------------------------------------------------------REPORTS

//--L.R. REPORT
router.post('/lr/:from&:to',invoiceController.lrReport)

//--DEALING REPORT
router.post('/dealr/:from&:to',invoiceController.dealingReport)

module.exports = router