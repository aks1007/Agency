const express = require('express')


const supplierGroupController = require('../controllers/supplierGroup')
const router = express.Router()


//--DISPLAYING ALL SUPPLIER GROUPS--
router.get('/', supplierGroupController.getAllSupplierGroups)

//--CREATING A NEW SUPPLIER GROUP--
router.post('/', supplierGroupController.postOneSupplierGroup)

//--DISPLAYING A SUPPLIER GROUP--
router.get('/basic/:supplierGroupName', supplierGroupController.getOneSupplierGroup)

//--UPDATING A SUPPLIER GROUP--
router.put('/basic/:supplierGroupName', supplierGroupController.putOneSupplierGroup)

//--DELETING A SUPPLIER GROUP--
router.delete('/basic/:supplierGroupName', supplierGroupController.deleteOneSupplierGroup)

//--ADRESS LIST REPORT(ALL)--
router.get('/address', supplierGroupController.getAllAddress)

module.exports = router