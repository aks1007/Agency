const master = require('../models/conn').master
const Customer = master.model('Customer')

//DISPLAYING ALL CUSTOMERS
exports.getAllCustomers = (req, res, next) => {
    Customer.find().lean()
    .select('customer customerGroup dealsIn phoneNo mobileNo emailId line1 line2 city state pinCode post pan gstNo poc creditLimit creditDays blip blackList remarks')
    .collation({ "locale": "en", "strength": 2 })
    .then( docs => {
        const response = {
            count: docs.length,
            Customer : docs.map( doc =>{
                return {
                    customer: doc.customer,
                    customerGroup: doc.customerGroup,
                    dealsIn : doc.dealsIn,
                    phoneNo: doc.phoneNo,
                    mobileNo: doc.mobileNo,
                    emailId: doc.emailId,
                    line1: doc.line1,
                    line2: doc.line2,
                    city: doc.city,
                    state: doc.state,
                    pinCode: doc.pinCode,
                    post: doc.post,
                    pan: doc.pan,
                    gstNo: doc.gstNo,
                    poc: doc.poc,
                    creditLimit: doc.creditLimit,
                    creditDays: doc.creditDays,
                    blip: doc.blip,
                    blackList: doc.blackList,                    
                    remarks: doc.remarks,
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



//CREATING A NEW CUSTOMER 
exports.postOneCustomer = (req, res, next) => {
    const customer = new Customer({
        customer : req.body.customer,
        customerGroup: req.body.customerGroup,
        dealsIn : req.body.dealsIn,
        phoneNo: req.body.phoneNo,
        mobileNo: req.body.mobileNo,        
        emailId: req.body.emailId,
        line1: req.body.line1,
        line2: req.body.line2,
        city: req.body.city,
        state: req.body.state,
        pinCode: req.body.pinCode,
        post: req.body.post,
        pan: req.body.pan,
        gstNo: req.body.gstNo,
        poc: req.body.poc,
        creditLimit: req.body.creditLimit,
        creditDays: req.body.creditDays,
        blip: req.body.blip,
        blackList: req.body.blackList,
        remarks: req.body.remarks,        
    })
    name = req.body.customer
    //Look for customer
    Customer.findOne({customer : name})
    .collation({ "locale": "en", "strength": 2 })
    .then((doc)=>
    {
        //If Customer exists
        if(doc)
        {            
            res.status(409).json({
                code : 409,
                message : req.body.customer + " already exists."
            })
        }
        //If Customer doesn't exist
        else
        {
            customer.save()
            .then(()=> {
                res.status(201).json({
                    code : 201,
                    message: name + ' recorded successfully',
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



//DISPLAYING ONE CUSTOMER 
exports.getOneCustomer = (req, res, next) => 
{
    var name = req.params.customerName
    Customer.findOne({customer : name}).lean()
    .collation({ "locale": "en", "strength": 2 })
    .then( doc =>
    {
        //Executed if documnet exists
        if(doc){
            res.status(200).json({
                code : 200,
                message: name + " Found!",
                customer : doc.customer,
                customerGroup : doc.customerGroup,
                dealsIn : doc.dealsIn,
                phoneNo: doc.phoneNo,
                mobileNo: doc.mobileNo,
                emailId: doc.emailId,
                line1: doc.line1,
                line2: doc.line2,
                city: doc.city,
                state: doc.state,
                pinCode: doc.pinCode,  
                post : doc.post,
                pan: doc.pan,
                gstNo: doc.gstNo,
                poc: doc.poc,
                creditLimit: doc.creditLimit,
                creditDays: doc.creditDays,
                blip: doc.blip,
                blackList: doc.blackList,              
                remarks: doc.remarks,
                })
        } 
        //Executed if document doesn't exist  
        else
        {
            console.log(name + " Not Found")
            return res.status(404).json({
                code : 404,
                message: name + " Not Found"
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



//UPDATING ONE CUSTOMER 
exports.putOneCustomer = (req, res, next) => 
{
    name = req.params.customerName
    nCustomer = req.body.customer
    //Look for new Customer
    Customer.findOne({customer : nCustomer})
    .collation({ "locale": "en", "strength": 2 })            
    .then((doc)=>{

        //If new customer already exists
        if( name.value !== nCustomer.value)
        {
            if(doc)
            {
                res.status(409).json({ 
                    code : 409,
                    message : req.body.customer + " already exists."
                })
            }
        }
        //If new customer doesn't exist
        else
        {
            Customer.updateOne({ customer : name }, { $set : req.body})
            .collation({ "locale": "en", "strength": 2 })
            .then(()=> {
                res.status(200).json({
                    code : 200,
                    message : name + " has been updated successfully!",
                })
            })
            .catch( error => {
                console.log(error)
                res.status(409).json({ 
                    code : 409,
                    message: req.body.customer + " already exists."})
            })
        }

    })
    //If error is encountered while updating data inside database
    .catch(error => {
        console.log(error)
        res.status(500).json({ 
            code : 500,
            error : error.message })
    })
}



//DELETING ONE CUSTOMER 
exports.deleteOneCustomer = (req, res, next) => {
    const name = req.params.customerName
    //Look for customer to be deleted
    Customer.findOne({ customer : name})
    .collation({ "locale": "en", "strength": 2 })
    .then((doc) =>{
        //If Customer exists, delete the customer from database
        if(doc)
        {
            Customer.deleteOne({ customer : name })
            .collation({ "locale": "en", "strength": 2 })            
            .then( doc => {
                    res.status(200).json({
                        code : 200,
                        message : name + " has been deleted successfully",
                    })    
            })
            //Catch any errors encountered during deleting Customer from database
            .catch(error => {
                res.status(404).json({ 
                    code : 404,
                    message : name + "Not Found" }
                )
            })
        }
        //If Customer doesn't exist, inform user.
        else
        {
            res.status(409).json({
                code : 409,
                message : name + " doesn't exist!"
            })
        }
    })
}

//ADDRESS LIST REPORT(ALL)
exports.getAllAddress = (req, res, next) => {
    Customer.find().lean()
    .select('customer customerGroup phoneNo mobileNo emailId line1 line2 city state pinCode')
    .collation({ "locale": "en", "strength": 2 })
    .then( docs => {
        const response = {
            count: docs.length,
            Customer : docs.map( doc =>{
                return {                    
                    type : "CUSTOMER",
                    customer: doc.customer,
                    customerGroup: doc.customerGroup,
                    phoneNo: doc.phoneNo,
                    mobileNo: doc.mobileNo,
                    emailId: doc.emailId,
                    line1: doc.line1,
                    line2: doc.line2,
                    city: doc.city,
                    state: doc.state,
                    pinCode: doc.pinCode,
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