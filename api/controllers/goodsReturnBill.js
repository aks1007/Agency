const transaction = require('../models/conn').transaction
const GoodsReturnBill = transaction.model('GoodsReturnBill')

//CREATING A NEW GR  INVOICE
exports.postOneGoodsReturnBill = (req, res, next) => {    
    var x = req.body.billNo
    const goodsReturnBill = new GoodsReturnBill({
        serialNo : req.body.serialNo,
        id : req.body.id,
        billNo : req.body.billNo,
        na : req.body.na,
        ba : req.body.ba,
        ta : req.body.ta,
        gstP : req.body.gstP,
        gstA : req.body.gstA,
        grA : req.body.grA,
        lrNo : req.body.lrNo,
        lrDate : req.body.lrDate,
        transporter : req.body.transporter,
        status : req.body.status,
        customer : req.body.customer,
        supplier : req.body.supplier
    })
    goodsReturnBill.save()
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
exports.deleteOneGoodsReturnBill = (req, res, next) => {
    const num = req.params.id
    //Look for goodsReturnBill to be deleted
    GoodsReturnBill.find({ serialNo: num}).lean()
    .collation({ "locale": "en", "strength": 2 })
    .then((doc) =>{
        //If GR Bill exists, delete the goodsReturnBill from database
        if(doc)
        {
            GoodsReturnBill.deleteMany({ serialNo: num })
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
exports.getMultipleGoodsReturnBill = (req, res, next) =>
{
    const num = req.params.id
    GoodsReturnBill.find({serialNo : num}).lean()
    .select('serialNo id billNo na ba ta gstP gstA grA lrNo lrDate transporter status customer supplier')
    .collation({ "locale": "en", "strength": 2 })
    .then( docs => {
        const response = {
            count: docs.length,
            GoodsReturnBill : docs.map( doc =>{
                return {
                    serialNo : doc.serialNo,
                    id : doc.id,
                    billNo : doc.billNo,
                    na : doc.na,
                    ba : doc.ba,
                    ta : doc.ta,
                    gstP : doc.gstP,
                    gstA : doc.gstA,
                    grA : doc.grA,
                    lrNo : doc.lrNo,
                    lrDate : doc.lrDate,
                    transporter : doc.transporter,
                    status : doc.status,
                    customer : doc.customer,
                    supplier : doc.supplier
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
exports.getOneGRInvoiceFromBill = (req, res, next) => 
{
    var id = req.params.billNo
    var customer = req.params.customer
    var supplier = req.params.supplier
    GoodsReturnBill.find({billNo : id,customer: customer, supplier: supplier, status: 'PENDING'}).sort({billNo : 1}).lean()
    .select('serialNo id billNo na ba ta gstP gstA grA lrNo lrDate transporter status customer supplier')
    .collation({ "locale": "en", "strength": 2 })
    .then( docs => {
        const response = {
            count: docs.length,
            GoodsReturnBill : docs.map( doc =>{
                return {
                    serialNo : doc.serialNo,
                    id : doc.id,
                    billNo : doc.billNo,
                    na : doc.na,
                    ba : doc.ba,
                    ta : doc.ta,
                    gstP : doc.gstP,
                    gstA : doc.gstA,
                    grA : doc.grA,
                    lrNo : doc.lrNo,
                    lrDate : doc.lrDate,
                    transporter : doc.transporter,
                    status : doc.status,
                    customer : doc.customer,
                    supplier : doc.supplier
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