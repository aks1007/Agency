const express = require('express')
const mongoose = require('mongoose')


const marketController = require('../controllers/market')
const router = express.Router()


//--DISPLAYING ALL MARKETS--
router.get('/', marketController.getAllMarkets)

//--CREATING A NEW MARKET--
router.post('/', marketController.postOneMarket)

//--DISPLAYING A MARKET--
router.get('/:marketName', marketController.getOneMarket)

//--UPDATING A MARKET--
router.put('/:marketName', marketController.putOneMarket)

//--DELETING A MARKET--
router.delete('/:marketName', marketController.deleteOneMarket)


module.exports = router