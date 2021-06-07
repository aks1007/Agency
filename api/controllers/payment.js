const transaction = require('../models/conn').transaction
const Payment = transaction.model('Payment')

//DISPLAYING ALL PAYMENTS
exports.getAllPayments = (req, res, next) => {
    Payment.find().sort({serialNo : 1}).lean()
    .select('serialNo entryNo doe dop customer supplier gr mop ta aa ba brokP brok remarks')
    .collation({ "locale": "en", "strength": 2 })
    .then( docs => {
        const response = {
            count: docs.length,
            Payment : docs.map( doc =>{
                return {
                    serialNo: doc.serialNo,
                    entryNo: doc.entryNo,
                    doe : doc.doe,
                    dop: doc.dop,
                    customer: doc.customer,
                    supplier: doc.supplier,                    
                    gr: doc.gr,
                    mop: doc.mop,
                    ta : doc.ta,
                    aa : doc.aa,
                    ba : doc.ba,
                    brokP: doc.brokP,
                    brok : doc.brok,
                    remarks : doc.remarks 
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

//CREATING A NEW PAYMENT
exports.postOnePayment = (req, res, next) => {
    const payment = new Payment({
        serialNo: req.body.serialNo,
        entryNo: req.body.entryNo,
        doe : req.body.doe,
        dop: req.body.dop,
        customer: req.body.customer,
        supplier: req.body.supplier,                    
        gr: req.body.gr,
        mop: req.body.mop,
        ta : req.body.ta,
        aa : req.body.aa,
        ba : req.body.ba,
        brokP: req.body.brokP,
        brok : req.body.brok,
        remarks : req.body.remarks 
    })
    id = req.body.serialNo
    //Look for payment
    Payment.findOne({serialNo : id})
    .collation({ "locale": "en", "strength": 2 })
    .then((doc)=>
    {
        //If Payment exists
        if(doc)
        {            
            res.status(409).json({
                code : 409,
                message : "Voucher No. " + id + " already exists."
            })
        }
        //If Payment doesn't exist
        else
        {
            payment.save()
            .then(()=> {
                res.status(201).json({
                    code : 201,
                    message: "Voucher No. " + id + ' recorded successfully',
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
    })
    .catch(error =>
    {
        //If any other error encountered
        console.log(error)
        res.status(500).json({ 
            code : 500,
            message : error.message
        })
        console.log(res)
    })
}



//DISPLAYING ONE PAYMENT
exports.getOnePayment = (req, res, next) => 
{
    var id = req.params.serialNo
    Payment.findOne({serialNo:id}).lean()
    .collation({ "locale": "en", "strength": 2 })
    .then( doc =>
    {
        //Executed if documnet exists
        if(doc){
            res.status(200).json({
                code : 200,
                message: "Voucher No. " + id + " Found!",
                serialNo: doc.serialNo,
                entryNo: doc.entryNo,
                doe : doc.doe,
                dop: doc.dop,
                customer: doc.customer,
                supplier: doc.supplier,                    
                gr: doc.gr,
                mop: doc.mop,
                ta : doc.ta,
                aa : doc.aa,
                ba : doc.ba,
                brokP: doc.brokP,
                brok : doc.brok,
                remarks : doc.remarks
                })
        } 
        //Executed if document doesn't exist  
        else
        {
            return res.status(404).json({
                code : 404,
                message: "Voucher No. " + id + " Not Found!"
            })
        }
    })
    .catch(error =>
    {
        //If any other error encountered
        console.log(error)
        res.status(500).json({ 
            code : 500,
            message : error.message
        })
        console.log(res)
    })              
}              



//UPDATING ONE PAYMENT
exports.putOnePayment = (req, res, next) => 
{
    id = req.params.serialNo
    Payment.updateOne({ serialNo: id }, { $set : req.body})
    .collation({ "locale": "en", "strength": 2 })
    .then(()=> {
        res.status(200).json({
            code : 200,
            message : "Voucher No. " + id + " has been updated successfully!",
        })
    })
    .catch( error => {
        console.log(error)
        res.status(409).json({ 
            code : 409,
            message: "Voucher No. " + id + " already exists."})
    })
}



//DELETING ONE PAYMENT
exports.deleteOnePayment = (req, res, next) =>
{
    const id = req.params.serialNo
    Payment.deleteOne({ serialNo: id})
    .collation({ "locale": "en", "strength": 2 })            
    .then( doc =>{
        res.status(200).json({
            code : 200,
            message : "Voucher No. " + id + " has been deleted successfully",
        })    
    })
    //Catch any errors encountered during deleting Payment from database
    .catch(error => 
    {
        res.status(404).json({ 
            code : 404,
            message : "Voucher No. " + id + "Not Found" }
        )
    })
}   

exports.getLastPayment = (req, res, next) => {
    Payment.find().sort({serialNo : -1}).limit(1).lean()
    .select('serialNo')
    .collation({ "locale": "en", "strength": 2 })
    .then( docs => {
        const response = {
            count: docs.length,
            Payment : docs.map( doc =>{
                return {
                    serialNo : doc.serialNo,
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

exports.getRangePayments = (req, res) => {
    var from = req.params.from
    var to = req.params.to
    Payment.find({dop : { $gte : new Date(from), $lt : new Date(to)}}).sort({serialNo : 1}).lean()
    .select('serialNo entryNo doe dop customer supplier gr mop ta aa ba brokP brok remarks')
    .collation({ "locale": "en", "strength": 2 })
    .then( docs => {
        const response = {
            count: docs.length,
            Payment : docs.map( doc =>{
                return {
                    serialNo: doc.serialNo,
                    entryNo: doc.entryNo,
                    doe : doc.doe,
                    dop: doc.dop,
                    customer: doc.customer,
                    supplier: doc.supplier,                    
                    gr: doc.gr,
                    mop: doc.mop,
                    ta : doc.ta,
                    aa : doc.aa,
                    ba : doc.ba,
                    brokP: doc.brokP,
                    brok : doc.brok,
                    remarks : doc.remarks
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


exports.getRangeSupplierPayments = (req, res) => {
    var supplier = req.params.supplier
    var from = req.params.from
    var to = req.params.to
    Payment.find({supplier : supplier,brokReceived : false,dop : { $gte : new Date(from), $lt : new Date(to)}}).sort({serialNo : 1}).lean()
    .select('serialNo entryNo doe dop customer supplier gr mop ta aa ba brokP brok remarks')
    .collation({ "locale": "en", "strength": 2 })
    .then( docs => {
        const response = {
            count: docs.length,
            Payment : docs.map( doc =>{
                return {
                    serialNo: doc.serialNo,
                    entryNo: doc.entryNo,
                    doe : doc.doe,
                    dop: doc.dop,
                    customer: doc.customer,
                    supplier: doc.supplier,                    
                    gr: doc.gr,
                    mop: doc.mop,
                    ta : doc.ta,
                    aa : doc.aa,
                    ba : doc.ba,
                    brokP: doc.brokP,
                    brok : doc.brok,
                    remarks : doc.remarks
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
