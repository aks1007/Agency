const transaction = require('../models/conn').transaction
const OrderItem = transaction.model('OrderItem')

//CREATING A NEW ORDER ITEM
exports.postOneOrderItem = (req, res, next) => {    
    var x = req.body.billNo
    const orderItem = new OrderItem({
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
    orderItem.save()
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


//DELETING ONE ORDER ITEM
exports.deleteOneOrderItem = (req, res, next) => {
    const num = req.params.id
    //Look for orderItem to be deleted
    OrderItem.find({ serialNo: num}).lean()
    .collation({ "locale": "en", "strength": 2 })
    .then((doc) =>{
        //If Order Item exists, delete the orderItem from database
        if(doc)
        {
            OrderItem.deleteMany({ serialNo: num })
            .collation({ "locale": "en", "strength": 2 })            
            .then( doc => {
                    res.status(200).json({
                        code : 200,
                    })    
            })
            //Catch any errors encountered during deleting Order Item from database
            .catch(error => {
                res.status(404).json({ 
                    code : 404,
                })
            })
        }
        //If Order Item doesn't exist, inform user.
        else
        {
            res.status(409).json({
                code : 409,
            })
        }
    })
}


//GETTING AN ARRAY OF ORDER ITEM FOR A SPECIFIC VOUCHER
exports.getMultipleOrderItem = (req, res, next) =>
{
    const num = req.params.id
    OrderItem.find({serialNo : num}).lean()
    .select('serialNo id item hsnCode pcs cut mts rate unit amount')
    .collation({ "locale": "en", "strength": 2 })
    .then( docs => {
        const response = {
            count: docs.length,
            OrderItem : docs.map( doc =>{
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