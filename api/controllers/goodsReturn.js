const transaction = require('../models/conn').transaction
const GoodsReturn = transaction.model('GoodsReturn')

//DISPLAYING ALL GOODS RETURNS
exports.getAllGoodsReturns = (req, res, next) => {
    GoodsReturn.find().sort({serialNo : 1}).lean()
    .select('serialNo date customer supplier cNo dNo agrNo tta tax tgra remarks')
    .collation({ "locale": "en", "strength": 2 })
    .then( docs => {
        const response = {
            count: docs.length,
            GoodsReturn : docs.map( doc =>{
                return {
                    serialNo: doc.serialNo,
                    date: doc.date,
                    customer: doc.customer,
                    supplier: doc.supplier,                    
                    cNo: doc.cNo,
                    dNo: doc.dNo,
                    agrNo: doc.agrNo,
                    tta: doc.tta,
                    tax : doc.tax,
                    tgra: doc.tgra,
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



//CREATING A NEW GOODS RETURN
exports.postOneGoodsReturn = (req, res, next) => {
    const goodsReturn = new GoodsReturn({
        serialNo: req.body.serialNo,
        date: req.body.date,
        customer: req.body.customer,
        supplier: req.body.supplier,                    
        cNo: req.body.cNo,
        dNo: req.body.dNo,
        agrNo: req.body.agrNo,
        tta: req.body.tta,
        tax : req.body.tax,
        tgra: req.body.tgra,
        remarks : req.body.remarks
    })
    id = req.body.serialNo
    //Look for goodsReturn
    GoodsReturn.findOne({serialNo : id})
    .collation({ "locale": "en", "strength": 2 })
    .then((doc)=>
    {
        //If GoodsReturn exists
        if(doc)
        {            
            res.status(409).json({
                code : 409,
                message : "GR No. " + id + " already exists."
            })
        }
        //If GoodsReturn doesn't exist
        else
        {
            goodsReturn.save()
            .then(()=> {
                res.status(201).json({
                    code : 201,
                    message: "GR No. " + id + ' recorded successfully',
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



//DISPLAYING ONE GOODS RETURN
exports.getOneGoodsReturn = (req, res, next) => 
{
    var id = req.params.serialNo
    GoodsReturn.findOne({serialNo:id}).lean()
    .collation({ "locale": "en", "strength": 2 })
    .then( doc =>
    {
        //Executed if documnet exists
        if(doc){
            res.status(200).json({
                code : 200,
                message: "GR No. " + id + " Found!",
                serialNo: doc.serialNo,
                date: doc.date,
                customer: doc.customer,
                supplier: doc.supplier,                    
                cNo: doc.cNo,
                dNo: doc.dNo,
                agrNo: doc.agrNo,
                tta: doc.tta,
                tax : doc.tax,
                tgra: doc.tgra,
                remarks : doc.remarks 
                })
        } 
        //Executed if document doesn't exist  
        else
        {
            return res.status(404).json({
                code : 404,
                message: "GR No. " + id + " Not Found!"
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



//UPDATING ONE GOODS RETURN
exports.putOneGoodsReturn = (req, res, next) => 
{
    id = req.params.serialNo
    GoodsReturn.updateOne({ serialNo: id }, { $set : req.body})
    .collation({ "locale": "en", "strength": 2 })
    .then(()=> {
        res.status(200).json({
            code : 200,
            message : "GR No. " + id + " has been updated successfully!",
        })
    })
    .catch( error => {
        console.log(error)
        res.status(409).json({ 
            code : 409,
            message: "GR No. " + id + " already exists."})
    })
}



//DELETING ONE GOODS RETURN
exports.deleteOneGoodsReturn = (req, res, next) =>
{
    const id = req.params.serialNo
    GoodsReturn.deleteOne({ serialNo: id})
    .collation({ "locale": "en", "strength": 2 })            
    .then( doc =>{
        res.status(200).json({
            code : 200,
            message : "GR No. " + id + " has been deleted successfully",
        })    
    })
    //Catch any errors encountered during deleting GoodsReturn from database
    .catch(error => 
    {
        res.status(404).json({ 
            code : 404,
            message : "GR No. " + id + "Not Found" }
        )
    })
}   

exports.getLastGoodsReturn = (req, res, next) => {
    GoodsReturn.find().sort({serialNo : -1}).limit(1).lean()
    .select('serialNo')
    .collation({ "locale": "en", "strength": 2 })
    .then( docs => {
        const response = {
            count: docs.length,
            GoodsReturn : docs.map( doc =>{
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

exports.getRangeGoodsReturns = (req, res) => {
    var from = req.params.from
    var to = req.params.to
    GoodsReturn.find({date : { $gte : new Date(from), $lt : new Date(to)}}).sort({serialNo : 1}).lean()
    .select('serialNo date customer supplier cNo dNo agrNo tta tax tgra remarks')
    .collation({ "locale": "en", "strength": 2 })
    .then( docs => {
        const response = {
            count: docs.length,
            GoodsReturn : docs.map( doc =>{
                return {
                    serialNo: doc.serialNo,
                    date: doc.date,
                    customer: doc.customer,
                    supplier: doc.supplier,                    
                    cNo: doc.cNo,
                    dNo: doc.dNo,
                    agrNo: doc.agrNo,
                    tta: doc.tta,
                    tax : doc.tax,
                    tgra: doc.tgra,
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
