const express = require('express')
const mongoose = require('mongoose')


const orderItemController = require('../controllers/orderItem')
const router = express.Router()



//--CREATING A NEW ORDER ITEM--
router.post('/', orderItemController.postOneOrderItem)

//--DELETING A ORDER ITEM--
router.delete('/basic/:id', orderItemController.deleteOneOrderItem)

//--GETTING A ARRAY OF ORDER ITEM FOR A SPECIFIC ORDER FORM
router.get('/basic/:id', orderItemController.getMultipleOrderItem)

module.exports = router