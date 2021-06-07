const express = require('express')
const mongoose = require('mongoose')


const noticeController = require('../controllers/notice')
const router = express.Router()


//--DISPLAYING ALL NOTES--
router.get('/', noticeController.getAllNotices)

//--CREATING A NEW NOTICE--
router.post('/', noticeController.postOneNotice)

//--DISPLAYING A NOTICE--
router.get('/basic/:serialNo', noticeController.getOneNotice)

//--UPDATING A NOTICE--
router.put('/basic/:serialNo', noticeController.putOneNotice)

//--DELETING A NOTICE--
router.delete('/basic/:serialNo', noticeController.deleteOneNotice)

//--GET LAST NOTICE's SERIAL NO--
router.get('/last', noticeController.getLastNotice)

//--DISPLAYING ALL SALES BETWEEN A DATE RANGE
router.get('/range/:from&:to',noticeController.getRangeNotices)


module.exports = router