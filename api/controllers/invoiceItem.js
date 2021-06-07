const transaction = require('../models/conn').transaction
const InvoiceItem = transaction.model('InvoiceItem')

//CREATING A NEW INVOICE ITEM
exports.postOneInvoiceItem = (req, res, next) => {    
    var x = req.body.billNo
    const invoiceItem = new InvoiceItem({
        serialNo : req.body.serialNo,
        id : req.body.id,
        item : req.body.item,
        hsnCode : req.body.hsnCode,
        pcs : req.body.pcs,
        cut : req.body.cut,
        mts : req.body.mts,
        rate : req.body.rate,
        unit : req.body.unit,
        amount : req.body.amount
    })
    invoiceItem.save()
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


//DELETING ONE INVOICE ITEM
exports.deleteOneInvoiceItem = (req, res, next) => {
    const num = req.params.id
    //Look for invoiceItem to be deleted
    InvoiceItem.find({ serialNo: num}).lean()
    .collation({ "locale": "en", "strength": 2 })
    .then((doc) =>{
        //If Invoice Item exists, delete the invoiceItem from database
        if(doc)
        {
            InvoiceItem.deleteMany({ serialNo: num })
            .collation({ "locale": "en", "strength": 2 })            
            .then( doc => {
                    res.status(200).json({
                        code : 200,
                    })    
            })
            //Catch any errors encountered during deleting Invoice Item from database
            .catch(error => {
                res.status(404).json({ 
                    code : 404,
                })
            })
        }
        //If Invoice Item doesn't exist, inform user.
        else
        {
            res.status(409).json({
                code : 409,
            })
        }
    })
}


//GETTING AN ARRAY OF INVOICE ITEM FOR A SPECIFIC VOUCHER
exports.getMultipleInvoiceItem = (req, res, next) =>
{
    const num = req.params.id
    InvoiceItem.find({serialNo : num}).lean()
    .select('serialNo id item hsnCode pcs cut mts rate unit amount')
    .collation({ "locale": "en", "strength": 2 })
    .then( docs => {
        const response = {
            count: docs.length,
            InvoiceItem : docs.map( doc =>{
                return {
                    serialNo : doc.serialNo,
                    id : doc.id,
                    item : doc.item,
                    hsnCode : doc.hsnCode,
                    pcs : doc.pcs,
                    cut : doc.cut,
                    mts : doc.mts,
                    rate : doc.rate,
                    unit : doc.unit,
                    amount : doc.amount,
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