const express = require('express')


const supplierGroupController = require('../controllers/supplierGroup')
const router = express.Router()


//--DISPLAYING ALL SUPPLIER GROUPS--
router.get('/', supplierGroupController.getAllSupplierGroups)

//--CREATING A NEW SUPPLIER GROUP--
router.post('/', supplierGroupController.postOneSupplierGroup)

//--DISPLAYING A SUPPLIER GROUP--
router.get('/:supplierGroupName', supplierGroupController.getOneSupplierGroup)

//--UPDATING A SUPPLIER GROUP--
router.put('/:supplierGroupName', supplierGroupController.putOneSupplierGroup)

//--DELETING A SUPPLIER GROUP--
router.delete('/:supplierGroupName', supplierGroupController.deleteOneSupplierGroup)


module.exports = router