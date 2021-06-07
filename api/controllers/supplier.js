const master = require('../models/conn').master
const Supplier = master.model('Supplier')

//DISPLAYING ALL SUPPLIERS
exports.getAllSuppliers = (req, res, next) => {
    Supplier.find().lean()
    .select('supplier supplierGroup dealsIn phoneNo mobileNo emailId line1 line2 city state pinCode post pan gstNo poc ddl rdpp rdpm cp discount blip blackList remarks')
    .collation({ "locale": "en", "strength": 2 })
    .then( docs => {
        const response = {
            count: docs.length,
            Supplier : docs.map( doc =>{
                return {
                    supplier: doc.supplier,
                    supplierGroup: doc.supplierGroup,
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
                    ddl: doc.ddl,
                    rdpp: doc.rdpp,
                    rdpm: doc.rdpm,
                    cp: doc.cp,
                    discount: doc.discount,
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



//CREATING A NEW SUPPLIER 
exports.postOneSupplier = (req, res, next) => {
    const supplier = new Supplier({
        supplier : req.body.supplier,
        supplierGroup: req.body.supplierGroup,
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
        ddl: req.body.ddl,
        rdpp: req.body.rdpp,
        rdpm: req.body.rdpm,
        cp: req.body.cp,
        discount: req.body.discount,
        blip: req.body.blip,
        blackList: req.body.blackList,
        remarks: req.body.remarks,        
    })
    name = req.body.supplier
    //Look for supplier
    Supplier.findOne({supplier : name})
    .collation({ "locale": "en", "strength": 2 })
    .then((doc)=>
    {
        //If Supplier exists
        if(doc)
        {            
            res.status(409).json({
                code : 409,
                message : req.body.supplier + " already exists."
            })
        }
        //If Supplier doesn't exist
        else
        {
            supplier.save()
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



//DISPLAYING ONE SUPPLIER 
exports.getOneSupplier = (req, res, next) => 
{
    var name = req.params.supplierName
    Supplier.findOne({supplier : name}).lean()
    .collation({ "locale": "en", "strength": 2 })
    .then( doc =>
    {
        //Executed if documnet exists
        if(doc){
            res.status(200).json({
                code : 200,
                message: name + " Found!",
                supplier : doc.supplier,
                supplierGroup : doc.supplierGroup,
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
                ddl: doc.ddl,
                rdpp: doc.rdpp,
                rdpm: doc.rdpm,
                cp : doc.cp,
                discount: doc.discount,
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



//UPDATING ONE SUPPLIER 
exports.putOneSupplier = (req, res, next) => 
{
    name = req.params.supplierName
    nSupplier = req.body.supplier
    //Look for new Supplier
    Supplier.findOne({supplier : nSupplier})
    .collation({ "locale": "en", "strength": 2 })            
    .then((doc)=>{

        //If new supplier already exists
        if( name.value !== nSupplier.value)
        {
            if(doc)
            {
                res.status(409).json({ 
                    code : 409,
                    message : req.body.supplier + " already exists."
                })
            }
        }
        //If new supplier doesn't exist
        else
        {
            Supplier.updateOne({ supplier : name }, { $set : req.body})
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
                    message: req.body.supplier + " already exists."})
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



//DELETING ONE SUPPLIER 
exports.deleteOneSupplier = (req, res, next) => {
    const name = req.params.supplierName
    //Look for supplier to be deleted
    Supplier.findOne({ supplier : name})
    .collation({ "locale": "en", "strength": 2 })
    .then((doc) =>{
        //If Supplier exists, delete the supplier from database
        if(doc)
        {
            Supplier.deleteOne({ supplier : name })
            .collation({ "locale": "en", "strength": 2 })            
            .then( doc => {
                    res.status(200).json({
                        code : 200,
                        message : name + " has been deleted successfully",
                    })    
            })
            //Catch any errors encountered during deleting Supplier from database
            .catch(error => {
                res.status(404).json({ 
                    code : 404,
                    message : name + "Not Found" }
                )
            })
        }
        //If Supplier doesn't exist, inform user.
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
    Supplier.find().lean()
    .select('supplier supplierGroup phoneNo mobileNo emailId line1 line2 city state pinCode')
    .collation({ "locale": "en", "strength": 2 })
    .then( docs => {
        const response = {
            count: docs.length,
            Supplier : docs.map( doc =>{
                return {
                    type : "SUPPLIER",
                    supplier: doc.supplier,
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