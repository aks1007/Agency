const express = require('express')
const mongoose = require('mongoose')


const mailChequeController = require('../controllers/mailCheque')
const router = express.Router()


//--CREATING A NEW MAIL CHEQUE--
router.post('/', mailChequeController.postOneMailCheque)

//--DELETING A MAIL CHEQUE--
router.delete('/basic/:id', mailChequeController.deleteOneMailCheque)

//--GETTING A ARRAY OF MAIL CHEQUE FOR A SPECIFIC MAIL
router.get('/basic/:id', mailChequeController.getMultipleMailCheque)

module.exports = router