const express = require('express')
const mongoose = require('mongoose')


const supplierController = require('../controllers/supplier')
const router = express.Router()


//--DISPLAYING ALL SUPPLIER GROUPS--
router.get('/', supplierController.getAllSuppliers)

//--CREATING A NEW SUPPLIER GROUP--
router.post('/', supplierController.postOneSupplier)

//--DISPLAYING A SUPPLIER GROUP--
router.get('/basic/:supplierName', supplierController.getOneSupplier)

//--UPDATING A SUPPLIER GROUP--
router.put('/basic/:supplierName', supplierController.putOneSupplier)

//--DELETING A SUPPLIER GROUP--
router.delete('/basic/:supplierName', supplierController.deleteOneSupplier)

//--ADRESS LIST REPORT(ALL)--
router.get('/address', supplierController.getAllAddress)


module.exports = router