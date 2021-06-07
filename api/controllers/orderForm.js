const transaction = require('../models/conn').transaction
const OrderForm = transaction.model('OrderForm')

//DISPLAYING ALL ORDER FORMS
exports.getAllOrderForms = (req, res, next) => {
    OrderForm.find().sort({serialNo : 1}).lean()
    .select('serialNo date customer supplier orderNo transporter case destination remarks')
    .collation({ "locale": "en", "strength": 2 })
    .then( docs => {
        const response = {
            count: docs.length,
            OrderForm : docs.map( doc =>{
                return {
                    serialNo: doc.serialNo,
                    date: doc.date,
                    customer: doc.customer,
                    supplier: doc.supplier,                    
                    orderNo: doc.orderNo,
                    transporter : doc.transporter,
                    case : doc.case,
                    destination : doc.destination,
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



//CREATING A NEW ORDER FORM
exports.postOneOrderForm = (req, res, next) => {
    const orderForm = new OrderForm({
        serialNo : req.body.serialNo,
        date: req.body.date,
        customer: req.body.customer,
        supplier : req.body.supplier,
        orderNo : req.body.orderNo,
        transporter: req.body.transporter,
        case : req.body.case,
        destination : req.body.destination,
        remarks : req.body.remarks

    })
    id = req.body.serialNo
    //Look for orderForm
    OrderForm.findOne({serialNo : id})
    .collation({ "locale": "en", "strength": 2 })
    .then((doc)=>
    {
        //If OrderForm exists
        if(doc)
        {            
            res.status(409).json({
                code : 409,
                message : "Order Form No. " + id + " already exists."
            })
        }
        //If OrderForm doesn't exist
        else
        {
            orderForm.save()
            .then(()=> {
                res.status(201).json({
                    code : 201,
                    message: "Order Form No. " + id + ' recorded successfully',
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



//DISPLAYING ONE ORDER FORM
exports.getOneOrderForm = (req, res, next) => 
{
    var id = req.params.serialNo
    OrderForm.findOne({serialNo:id}).lean()
    .collation({ "locale": "en", "strength": 2 })
    .then( doc =>
    {
        //Executed if documnet exists
        if(doc){
            res.status(200).json({
                code : 200,
                message: "Order Form No. " + id + " Found!",
                serialNo: doc.serialNo,
                date: doc.date,
                customer: doc.customer,
                supplier: doc.supplier,                    
                orderNo: doc.orderNo,
                transporter : doc.transporter,
                case : doc.case,
                destination : doc.destination,
                remarks : doc.remarks 
                })
        } 
        //Executed if document doesn't exist  
        else
        {
            return res.status(404).json({
                code : 404,
                message: "Order Form No. " + id + " Not Found!"
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



//UPDATING ONE ORDER FORM
exports.putOneOrderForm = (req, res, next) => 
{
    id = req.params.serialNo
    OrderForm.updateOne({ serialNo: id }, { $set : req.body})
    .collation({ "locale": "en", "strength": 2 })
    .then(()=> {
        res.status(200).json({
            code : 200,
            message : "Order Form No. " + id + " has been updated successfully!",
        })
    })
    .catch( error => {
        console.log(error)
        res.status(409).json({ 
            code : 409,
            message: "Order Form No. " + id + " already exists."})
    })
}



//DELETING ONE ORDER FORM
exports.deleteOneOrderForm = (req, res, next) =>
{
    const id = req.params.serialNo
    OrderForm.deleteOne({ serialNo: id})
    .collation({ "locale": "en", "strength": 2 })            
    .then( doc =>{
        res.status(200).json({
            code : 200,
            message : "Order Form No. " + id + " has been deleted successfully",
        })    
    })
    //Catch any errors encountered during deleting OrderForm from database
    .catch(error => 
    {
        res.status(404).json({ 
            code : 404,
            message : "Order Form No. " + id + "Not Found" }
        )
    })
}   

exports.getLastOrderForm = (req, res, next) => {
    OrderForm.find().sort({serialNo : -1}).limit(1).lean()
    .select('serialNo')
    .collation({ "locale": "en", "strength": 2 })
    .then( docs => {
        const response = {
            count: docs.length,
            OrderForm : docs.map( doc =>{
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

exports.getRangeOrderForms = (req, res) => {
    var from = req.params.from
    var to = req.params.to
    OrderForm.find({date : { $gte : new Date(from), $lt : new Date(to)}}).sort({billNo : 1}).lean()
    .select('serialNo date customer supplier orderNo transporter case destination remarks')
    .collation({ "locale": "en", "strength": 2 })
    .then( docs => {
        const response = {
            count: docs.length,
            OrderForm : docs.map( doc =>{
                return {
                    serialNo: doc.serialNo,
                    date: doc.date,
                    customer: doc.customer,
                    supplier: doc.supplier,                    
                    orderNo: doc.orderNo,
                    transporter : doc.transporter,
                    case : doc.case,
                    destination : doc.destination,
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
