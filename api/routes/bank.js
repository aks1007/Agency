const express = require('express')
const mongoose = require('mongoose')


const bankController = require('../controllers/bank')
const router = express.Router()


//--DISPLAYING ALL BANKS--
router.get('/', bankController.getAllBanks)

//--CREATING A NEW BANK--
router.post('/', bankController.postOneBank)

//--DISPLAYING A BANK--
router.get('/:bankName', bankController.getOneBank)

//--UPDATING A BANK--
router.put('/:bankName', bankController.putOneBank)

//--DELETING A BANK--
router.delete('/:bankName', bankController.deleteOneBank)


module.exports = router
