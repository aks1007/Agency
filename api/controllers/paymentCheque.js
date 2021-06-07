const transaction = require('../models/conn').transaction
const PaymentCheque = transaction.model('PaymentCheque')

//CREATING A NEW PAYMENT CHEQUE
exports.postOnePaymentCheque = (req, res, next) => {    
    var x = req.body.billNo
    const paymentCheque = new PaymentCheque({
        serialNo : req.body.serialNo,
        cId : req.body.cId,
        cNo : req.body.cNo,
        cDate : req.body.cDate,
        bank : req.body.bank,
        cAmount : req.body.cAmount,
    })
    paymentCheque.save()
    .then(()=> {
        res.status(201).json({
        })
    })
    .catch( error => {
        //If error is encountered while sending data to Database
        console.log(error) 
        res.status(500).json({ 
        code : 500, 
        error: error.message })
    }) 
}


//DELETING ONE PAYMENT CHEQUE
exports.deleteOnePaymentCheque = (req, res, next) => {
    const num = req.params.id
    //Look for paymentCheque to be deleted
    PaymentCheque.find({ serialNo: num}).lean()
    .collation({ "locale": "en", "strength": 2 })
    .then((doc) =>{
        //If PaymentCheque exists, delete the paymentCheque from database
        if(doc)
        {
            PaymentCheque.deleteMany({ serialNo: num })
            .collation({ "locale": "en", "strength": 2 })            
            .then( doc => {
                    res.status(200).json({
                        code : 200,
                    })    
            })
            //Catch any errors encountered during deleting PaymentCheque from database
            .catch(error => {
                res.status(404).json({ 
                    code : 404,
                })
            })
        }
        //If PaymentCheque doesn't exist, inform user.
        else
        {
            res.status(409).json({
                code : 409,
            })
        }
    })
}


//GETTING AN ARRAY OF PAYMENT CHEQUE FOR A SPECIFIC VOUCHER
exports.getMultiplePaymentCheque = (req, res, next) =>
{
    const num = req.params.id
    PaymentCheque.find({serialNo : num}).lean()
    .select('serialNo cId cNo cDate bank cAmount')
    .collation({ "locale": "en", "strength": 2 })
    .then( docs => {
        const response = {
            count: docs.length,
            PaymentCheque : docs.map( doc =>{
                return {
                    serialNo : doc.serialNo,
                    cId : doc.cId,
                    cNo: doc.cNo,
                    cDate : doc.cDate,
                    bank : doc.bank,
                    cAmount : doc.cAmount
                }
            })
        }
        res.status(200).json(response)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ 
            code : 500,
            error : err })
    })    
}