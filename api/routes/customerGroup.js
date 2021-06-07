const express = require('express')
const mongoose = require('mongoose')


const customerGroupController = require('../controllers/customerGroup')
const router = express.Router()


//--DISPLAYING ALL CUSTOMER GROUPS--
router.get('/', customerGroupController.getAllCustomerGroups)

//--CREATING A NEW CUSTOMER GROUP--
router.post('/', customerGroupController.postOneCustomerGroup)

//--DISPLAYING A CUSTOMER GROUP--
router.get('/:customerGroupName', customerGroupController.getOneCustomerGroup)

//--UPDATING A CUSTOMER GROUP--
router.put('/:customerGroupName', customerGroupController.putOneCustomerGroup)

//--DELETING A CUSTOMER GROUP--
router.delete('/:customerGroupName', customerGroupController.deleteOneCustomerGroup)


module.exports = router