const express = require('express')
const mongoose = require('mongoose')


const itemGroupController = require('../controllers/itemGroup')
const router = express.Router()


//--DISPLAYING ALL ITEMGROUPS--
router.get('/', itemGroupController.getAllItemGroups)

//--CREATING A NEW ITEMGROUP--
router.post('/', itemGroupController.postOneItemGroup)

//--DISPLAYING A ITEMGROUP--
router.get('/:itemGroupName', itemGroupController.getOneItemGroup)

//--UPDATING A ITEMGROUP--
router.put('/:itemGroupName', itemGroupController.putOneItemGroup)

//--DELETING A ITEMGROUP--
router.delete('/:itemGroupName', itemGroupController.deleteOneItemGroup)


module.exports = router