const express = require('express')
const mongoose = require('mongoose')


const itemController = require('../controllers/item')
const router = express.Router()


//--DISPLAYING ALL ITEMS--
router.get('/', itemController.getAllItems)

//--CREATING A NEW ITEM--
router.post('/', itemController.postOneItem)

//--DISPLAYING A ITEM--
router.get('/:itemName', itemController.getOneItem)

//--UPDATING A ITEM--
router.put('/:itemName', itemController.putOneItem)

//--DELETING A ITEM--
router.delete('/:itemName', itemController.deleteOneItem)


module.exports = router