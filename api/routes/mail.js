const express = require('express')
const mongoose = require('mongoose')


const mailController = require('../controllers/mail')
const router = express.Router()


//--DISPLAYING ALL MAILS--
router.get('/', mailController.getAllMails)

//--CREATING A NEW MAIL--
router.post('/', mailController.postOneMail)

//--DISPLAYING A MAIL--
router.get('/basic/:serialNo', mailController.getOneMail)

//--UPDATING A MAIL--
router.put('/basic/:serialNo', mailController.putOneMail)

//--DELETING A MAIL--
router.delete('/basic/:serialNo', mailController.deleteOneMail)

//--GET LAST MAIL's SERIAL NO--
router.get('/last', mailController.getLastMail)

//--DISPLAYING ALL SALES BETWEEN A DATE RANGE
router.get('/range/:from&:to',mailController.getRangeMails)


module.exports = router