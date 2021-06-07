const transaction = require('../models/conn').transaction
const PaymentFt = transaction.model('PaymentFt')

//CREATING A NEW PAYMENT CHEQUE
exports.postOnePaymentFt = (req, res, next) => {    
    var x = req.body.billNo
    const paymentFt = new PaymentFt({
        serialNo : req.body.serialNo,
        ftId : req.body.ftId,
        utrNo : req.body.utrNo,
        ftDate : req.body.ftDate,
        bank : req.body.bank,
        ftAmount : req.body.ftAmount,
    })
    paymentFt.save()
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
exports.deleteOnePaymentFt = (req, res, next) => {
    const num = req.params.id
    //Look for paymentFt to be deleted
    PaymentFt.find({ serialNo: num}).lean()
    .collation({ "locale": "en", "strength": 2 })
    .then((doc) =>{
        //If PaymentFt exists, delete the paymentFt from database
        if(doc)
        {
            PaymentFt.deleteMany({ serialNo: num })
            .collation({ "locale": "en", "strength": 2 })            
            .then( doc => {
                    res.status(200).json({
                        code : 200,
                    })    
            })
            //Catch any errors encountered during deleting PaymentFt from database
            .catch(error => {
                res.status(404).json({ 
                    code : 404,
                })
            })
        }
        //If PaymentFt doesn't exist, inform user.
        else
        {
            res.status(409).json({
                code : 409,
            })
        }
    })
}


//GETTING AN ARRAY OF PAYMENT CHEQUE FOR A SPECIFIC VOUCHER
exports.getMultiplePaymentFt = (req, res, next) =>
{
    const num = req.params.id
    PaymentFt.find({serialNo : num}).lean()
    .select('serialNo ftId utrNo ftDate bank ftAmount')
    .collation({ "locale": "en", "strength": 2 })
    .then( docs => {
        const response = {
            count: docs.length,
            PaymentFt : docs.map( doc =>{
                return {
                    serialNo : doc.serialNo,
                    ftId : doc.ftId,
                    utrNo: doc.utrNo,
                    ftDate : doc.ftDate,
                    bank : doc.bank,
                    ftAmount : doc.ftAmount
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