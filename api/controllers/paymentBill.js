const transaction = require('../models/conn').transaction
const PaymentBill = transaction.model('PaymentBill')

//CREATING A NEW PAYMENT  INVOICE
exports.postOnePaymentBill = (req, res, next) => {    
    var x = req.body.billNo
    const paymentBill = new PaymentBill({
        serialNo : req.body.serialNo,
        id : req.body.id,
        billNo : req.body.billNo,
        na : req.body.na,
        ba : req.body.ba,
        dd : req.body.dd,
        grA : req.body.grA,
        rd : req.body.rd,
        cl : req.body.cl,
        discP : req.body.discP,
        disc : req.body.disc,
        pc : req.body.pc,
        ol : req.body.ol,
        intP : req.body.intP,
        int : req.body.int,
        oa : req.body.oa,
        paid : req.body.paid,
        status : req.body.status
    })
    paymentBill.save()
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


//DELETING ONE PAYMENT  INVOICE
exports.deleteOnePaymentBill = (req, res, next) => {
    const num = req.params.id
    //Look for paymentBill to be deleted
    PaymentBill.find({ serialNo: num}).lean()
    .collation({ "locale": "en", "strength": 2 })
    .then((doc) =>{
        //If PAYMENT Bill exists, delete the paymentBill from database
        if(doc)
        {
            PaymentBill.deleteMany({ serialNo: num })
            .collation({ "locale": "en", "strength": 2 })            
            .then( doc => {
                    res.status(200).json({
                        code : 200,
                    })    
            })
            //Catch any errors encountered during deleting PAYMENT Bill from database
            .catch(error => {
                res.status(404).json({ 
                    code : 404,
                })
            })
        }
        //If PAYMENT Bill doesn't exist, inform user.
        else
        {
            res.status(409).json({
                code : 409,
            })
        }
    })
}


//GETTING AN ARRAY OF PAYMENT  INVOICE FOR A SPECIFIC VOUCHER
exports.getMultiplePaymentBill = (req, res, next) =>
{
    const num = req.params.id
    PaymentBill.find({serialNo : num}).lean()
    .select('serialNo id billNo na ba dd grA rd cl discP disc pc ol intP int oa paid status')
    .collation({ "locale": "en", "strength": 2 })
    .then( docs => {
        const response = {
            count: docs.length,
            PaymentBill : docs.map( doc =>{
                return {
                    serialNo : doc.serialNo,
                    id : doc.id,
                    billNo : doc.billNo,
                    na : doc.na,
                    ba : doc.ba,
                    dd : doc.dd,
                    grA : doc.grA,
                    rd : doc.rd,
                    cl : doc.cl,
                    discP : doc.discP,
                    disc : doc.disc,
                    pc : doc.pc,
                    ol : doc.ol,
                    intP : doc.intP,
                    int : doc.int,
                    oa : doc.oa,
                    paid : doc.paid,
                    status : doc.status
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