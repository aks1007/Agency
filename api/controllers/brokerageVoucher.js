const transaction = require('../models/conn').transaction
const BrokerageVoucher = transaction.model('BrokerageVoucher')

//CREATING A NEW GR  INVOICE
exports.postOneBrokerageVoucher = (req, res, next) => {    
    var x = req.body.billNo
    const brokerageVoucher = new BrokerageVoucher({
        serialNo : req.body.serialNo,
        id : req.body.id,
        select : req.body.select,
        vouNo : req.body.vouNo,
        vouDate : req.body.vouDate,
        customer : req.body.customer,
        bills : req.body.bills,
        amount : req.body.amount,
        brokP : req.body.brokP,
        brok : req.body.brok
    })
    brokerageVoucher.save()
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


//DELETING ONE GR  INVOICE
exports.deleteOneBrokerageVoucher = (req, res, next) => {
    const num = req.params.id
    //Look for brokerageVoucher to be deleted
    BrokerageVoucher.find({ serialNo: num}).lean()
    .collation({ "locale": "en", "strength": 2 })
    .then((doc) =>{
        //If GR Bill exists, delete the brokerageVoucher from database
        if(doc)
        {
            BrokerageVoucher.deleteMany({ serialNo: num })
            .collation({ "locale": "en", "strength": 2 })            
            .then( doc => {
                    res.status(200).json({
                        code : 200,
                    })    
            })
            //Catch any errors encountered during deleting GR Bill from database
            .catch(error => {
                res.status(404).json({ 
                    code : 404,
                })
            })
        }
        //If GR Bill doesn't exist, inform user.
        else
        {
            res.status(409).json({
                code : 409,
            })
        }
    })
}


//GETTING AN ARRAY OF GR  INVOICE FOR A SPECIFIC VOUCHER
exports.getMultipleBrokerageVoucher = (req, res, next) =>
{
    const num = req.params.id
    BrokerageVoucher.find({serialNo : num}).lean()
    .select('serialNo id select vouNo vouDate customer bills amount brokP brok')
    .collation({ "locale": "en", "strength": 2 })
    .then( docs => {
        const response = {
            count: docs.length,
            BrokerageVoucher : docs.map( doc =>{
                return {
                    serialNo : doc.serialNo,
                    id : doc.id,
                    select : doc.select,
                    vouNo : doc.vouNo,
                    vouDate : doc.vouDate,
                    customer : doc.customer,
                    bills : doc.bills,
                    amount : doc.amount,
                    brokP : doc.brokP,
                    brok : doc.brok
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

//--GETTING MULTIPLE GOODS RETURN ON A SINGLE INVOICE
exports.getOneBrokerageVoucherFromVouNo = (req, res, next) => 
{
    var id = req.params.vouNo
    var customer = req.params.customer
    var supplier = req.params.supplier
    BrokerageVoucher.find({vouNo : id,customer: customer, supplier: supplier}).sort({vouNo : 1}).lean()
    .select('serialNo id select vouNo vouDate customer bills amount brokP brok')
    .collation({ "locale": "en", "strength": 2 })
    .then( docs => {
        const response = {
            count: docs.length,
            BrokerageVoucher : docs.map( doc =>{
                return {
                    serialNo : doc.serialNo,
                    id : doc.id,
                    select : doc.select,
                    vouNo : doc.vouNo,
                    vouDate : doc.vouDate,
                    customer : doc.customer,
                    bills : doc.bills,
                    amount : doc.amount,
                    brokP : doc.brokP,
                    brok : doc.brok
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