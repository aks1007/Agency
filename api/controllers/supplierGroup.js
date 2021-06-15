const master = require('../models/conn').master
const SupplierGroup = master.model('SupplierGroup')

//DISPLAYING ALL SUPPLIER GROUPS
exports.getAllSupplierGroups = (req, res, next) => {
    SupplierGroup.find().lean()
    .select('supplierGroup dealsIn phoneNo mobileNo emailId poc line1 line2 city state pinCode cp remarks')
    .collation({ "locale": "en", "strength": 2 })
    .then( docs => {
        const response = {
            count: docs.length,
            SupplierGroup : docs.map( doc =>{
                return {
                    supplierGroup: doc.supplierGroup,
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
                    cp : doc.cp,                
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



//CREATING A NEW SUPPLIER GROUP
exports.postOneSupplierGroup = (req, res, next) => {
    const supplierGroup = new SupplierGroup({
        supplierGroup : req.body.supplierGroup,
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
        cp: req.body.cp,
        remarks: req.body.remarks,        
    })
    name = req.body.supplierGroup
    //Look for supplierGroup
    SupplierGroup.findOne({supplierGroup : name})
    .collation({ "locale": "en", "strength": 2 })
    .then((doc)=>
    {
        //If SupplierGroup exists
        if(doc)
        {            
            res.status(409).json({
                code : 409,
                message : req.body.supplierGroup + " already exists."
            })
        }
        //If SupplierGroup doesn't exist
        else
        {
            supplierGroup.save()
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



//DISPLAYING ONE SUPPLIER GROUP
exports.getOneSupplierGroup = (req, res, next) => 
{
    var name = req.params.supplierGroupName
    SupplierGroup.findOne({supplierGroup : name}).lean()
    .collation({ "locale": "en", "strength": 2 })
    .then( doc =>
    {
        //Executed if documnet exists
        if(doc){
            res.status(200).json({
                code : 200,
                message: name + " Found!",
                supplierGroup : doc.supplierGroup,
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
                cp : doc.cp,           
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



//UPDATING ONE SUPPLIER GROUP
exports.putOneSupplierGroup = (req, res, next) => 
{
    var name = req.params.supplierGroupName
    var nSupplierGroup = req.body.supplierGroup
    //Look for new SupplierGroup
    SupplierGroup.findOne({supplierGroup : nSupplierGroup})
    .collation({ "locale": "en", "strength": 2 })            
    .then((doc)=>{

        //If new supplierGroup already exists
        if(doc)
        {
            //If the New SupplierGroup is the same as the Old SupplierGroup
            if(name !== nSupplierGroup)
            {
                res.status(500).json({ 
                    code : 409,
                    message : req.body.supplierGroup + " already exists." 
                })
            }
            //If the New SupplierGroup is the same as the Old SupplierGroup
            else
            {
                SupplierGroup.updateOne({ supplierGroup : name }, { $set : req.body})
                .collation({ "locale": "en", "strength": 2 })
                .then(()=> {
                    res.status(200).json({
                        code : 200,
                        message : name + " has been updated successfully!",
                    })
                })
            }
        }
        //If new SupplierGroup doesn't exist
        else
        {
            SupplierGroup.updateOne({ supplierGroup : name }, { $set : req.body})
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



//DELETING ONE SUPPLIER GROUP
exports.deleteOneSupplierGroup = (req, res, next) => {
    const name = req.params.supplierGroupName
    //Look for supplierGroup to be deleted
    SupplierGroup.findOne({ supplierGroup : name})
    .collation({ "locale": "en", "strength": 2 })
    .then((doc) =>{
        //If SupplierGroup exists, delete the supplierGroup from database
        if(doc)
        {
            SupplierGroup.deleteOne({ supplierGroup : name })
            .collation({ "locale": "en", "strength": 2 })            
            .then( doc => {
                    res.status(200).json({
                        code : 200,
                        message : name + " has been deleted successfully",
                    })    
            })
            //Catch any errors encountered during deleting SupplierGroup from database
            .catch(error => {
                res.status(404).json({ 
                    code : 404,
                    message : name + "Not Found" }
                )
            })
        }
        //If SupplierGroup doesn't exist, inform user.
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
    SupplierGroup.find().lean()
    .select('supplierGroup phoneNo mobileNo emailId line1 line2 city state pinCode')
    .collation({ "locale": "en", "strength": 2 })
    .then( docs => {
        const response = {
            count: docs.length,
            SupplierGroup : docs.map( doc =>{
                return {
                    type : "SUPPLIER GROUP",
                    supplierGroup: doc.supplierGroup,
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