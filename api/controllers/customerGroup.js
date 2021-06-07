const master = require('../models/conn').master
const CustomerGroup = master.model('CustomerGroup')

//DISPLAYING ALL CUSTOMER GROUPS
exports.getAllCustomerGroups = (req, res, next) => {
    CustomerGroup.find().lean()
    .select('customerGroup dealsIn phoneNo mobileNo emailId poc line1 line2 city state pinCode remarks')
    .collation({ "locale": "en", "strength": 2 })
    .then( docs => {
        const response = {
            count: docs.length,
            CustomerGroup : docs.map( doc =>{
                return {
                    customerGroup: doc.customerGroup,
                    dealsIn : doc.dealsIn,
                    phoneNo: doc.phoneNo,
                    mobileNo: doc.mobileNo,
                    emailId: doc.emailId,
                    poc: doc.poc,
                    line1: doc.line1,
                    line2: doc.line2,
                    city: doc.city,
                    state: doc.state,
                    pinCode: doc.pinCode,                    
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



//CREATING A NEW CUSTOMER GROUP
exports.postOneCustomerGroup = (req, res, next) => {
    const customerGroup = new CustomerGroup({
        customerGroup : req.body.customerGroup,
        dealsIn : req.body.dealsIn,
        phoneNo: req.body.phoneNo,
        mobileNo: req.body.mobileNo,        
        emailId: req.body.emailId,
        poc: req.body.poc,
        line1: req.body.line1,
        line2: req.body.line2,
        city: req.body.city,
        state: req.body.state,
        pinCode: req.body.pinCode,
        remarks: req.body.remarks,        
    })
    name = req.body.customerGroup
    //Look for customerGroup
    CustomerGroup.findOne({customerGroup : name})
    .collation({ "locale": "en", "strength": 2 })
    .then((doc)=>
    {
        //If CustomerGroup exists
        if(doc)
        {            
            res.status(409).json({
                code : 409,
                message : req.body.customerGroup + " already exists."
            })
        }
        //If CustomerGroup doesn't exist
        else
        {
            customerGroup.save()
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



//DISPLAYING ONE CUSTOMER GROUP
exports.getOneCustomerGroup = (req, res, next) => 
{
    var name = req.params.customerGroupName
    CustomerGroup.findOne({customerGroup : name}).lean()
    .collation({ "locale": "en", "strength": 2 })
    .then( doc =>
    {
        //Executed if documnet exists
        if(doc){
            res.status(200).json({
                code : 200,
                message: name + " Found!",
                customerGroup : doc.customerGroup,
                dealsIn : doc.dealsIn,
                phoneNo: doc.phoneNo,
                mobileNo: doc.mobileNo,
                emailId: doc.emailId,
                poc: doc.poc,
                line1: doc.line1,
                line2: doc.line2,
                city: doc.city,
                state: doc.state,
                pinCode: doc.pinCode,                
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



//UPDATING ONE CUSTOMER GROUP
exports.putOneCustomerGroup = (req, res, next) => 
{
    var name = req.params.customerGroupName
    var nCustomerGroup = req.body.customerGroup
    //Look for new CustomerGroup
    CustomerGroup.findOne({customerGroup : nCustomerGroup})
    .collation({ "locale": "en", "strength": 2 })            
    .then((doc)=>{

        //If new customerGroup already exists
        if(doc)
        {
            //If the New CustomerGroup is the same as the Old CustomerGroup
            if(name !== nCustomerGroup)
            {
                res.status(500).json({ 
                    code : 409,
                    message : req.body.customerGroup + " already exists." 
                })
            }
            //If the New CustomerGroup is the same as the Old CustomerGroup
            else
            {
                CustomerGroup.updateOne({ customerGroup : name }, { $set : req.body})
                .collation({ "locale": "en", "strength": 2 })
                .then(()=> {
                    res.status(200).json({
                        code : 200,
                        message : name + " has been updated successfully!",
                    })
                })
            }
        }
        //If new CustomerGroup doesn't exist
        else
        {
            CustomerGroup.updateOne({ customerGroup : name }, { $set : req.body})
            .collation({ "locale": "en", "strength": 2 })
            .then(()=> {
                res.status(200).json({
                    code : 200,
                    message : name + " has been updated successfully!",
                })
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



//DELETING ONE CUSTOMER GROUP
exports.deleteOneCustomerGroup = (req, res, next) => {
    const name = req.params.customerGroupName
    //Look for customerGroup to be deleted
    CustomerGroup.findOne({ customerGroup : name})
    .collation({ "locale": "en", "strength": 2 })
    .then((doc) =>{
        //If CustomerGroup exists, delete the customerGroup from database
        if(doc)
        {
            CustomerGroup.deleteOne({ customerGroup : name })
            .collation({ "locale": "en", "strength": 2 })            
            .then( doc => {
                    res.status(200).json({
                        code : 200,
                        message : name + " has been deleted successfully",
                    })    
            })
            //Catch any errors encountered during deleting CustomerGroup from database
            .catch(error => {
                res.status(404).json({ 
                    code : 404,
                    message : name + "Not Found" }
                )
            })
        }
        //If CustomerGroup doesn't exist, inform user.
        else
        {
            res.status(409).json({
                code : 409,
                message : name + " doesn't exist!"
            })
        }
    })
}