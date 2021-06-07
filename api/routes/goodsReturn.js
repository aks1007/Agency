const express = require('express')
const mongoose = require('mongoose')


const goodsReturnController = require('../controllers/goodsReturn')
const router = express.Router()


//--DISPLAYING ALL GOODS RETURNS--
router.get('/', goodsReturnController.getAllGoodsReturns)

//--CREATING A NEW GOODS RETURN--
router.post('/', goodsReturnController.postOneGoodsReturn)

//--DISPLAYING A GOODS RETURN--
router.get('/basic/:serialNo', goodsReturnController.getOneGoodsReturn)

//--UPDATING A GOODS RETURN--
router.put('/basic/:serialNo', goodsReturnController.putOneGoodsReturn)

//--DELETING A GOODS RETURN--
router.delete('/basic/:serialNo', goodsReturnController.deleteOneGoodsReturn)

//--GET LAST GOODS RETURN's SERIAL NO--
router.get('/last', goodsReturnController.getLastGoodsReturn)

//--DISPLAYING ALL ORDERS BETWEEN A DATE RANGE
router.get('/range/:from&:to',goodsReturnController.getRangeGoodsReturns)


module.exports = router