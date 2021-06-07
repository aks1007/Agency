const master = require('../models/conn').master
const Transporter = master.model('Transporter')

//DISPLAYING ALL TRANSPORTERS
exports.getAllTransporters = (req, res, next) => {
    Transporter.find().lean()
    .select('transporter emailId phoneNo remarks line1 line2 city state pinCode')
    .collation({ "locale": "en", "strength": 2 })
    .then( docs => {
        const response = {
            count: docs.length,
            Transporter : docs.map( doc =>{
                return {
                    transporter: doc.transporter,
                    emailId: doc.emailId,
                    phoneNo: doc.phoneNo,
                    remarks: doc.remarks,
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



//CREATING A NEW TRANSPORTER
exports.postOneTransporter = (req, res, next) => {
    const transporter = new Transporter({
        transporter : req.body.transporter,
        emailId: req.body.emailId,
        phoneNo: req.body.phoneNo,
        remarks: req.body.remarks,
        line1: req.body.line1,
        line2: req.body.line2,
        city: req.body.city,
        state: req.body.state,
        pinCode: req.body.pinCode,
    })
    name = req.body.transporter
    //Look for transporter
    Transporter.findOne({transporter : name})
    .collation({ "locale": "en", "strength": 2 })
    .then((doc)=>
    {
        //If Transporter exists
        if(doc)
        {            
            res.status(409).json({
                code : 409,
                message : req.body.transporter + " already exists."
            })
        }
        //If Transporter doesn't exist
        else
        {
            transporter.save()
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



//DISPLAYING ONE TRANSPORTER
exports.getOneTransporter = (req, res, next) => 
{
    var name = req.params.transporterName
    Transporter.findOne({transporter : name}).lean()
    .collation({ "locale": "en", "strength": 2 })
    .then( doc =>
    {
        //Executed if documnet exists
        if(doc){
            res.status(200).json({
                code : 200,
                message: name + " Found!",
                transporter : doc.transporter,
                emailId: doc.emailId,
                phoneNo: doc.phoneNo,
                remarks: doc.remarks,
                line1: doc.line1,
                line2: doc.line2,
                city: doc.city,
                state: doc.state,
                pinCode: doc.pinCode,
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



//UPDATING ONE TRANSPORTER
exports.putOneTransporter = (req, res, next) => 
{
    var name = req.params.transporterName
    var nTransporter = req.body.transporter
    //Look for new Transporter
    Transporter.findOne({transporter : nTransporter})
    .collation({ "locale": "en", "strength": 2 })            
    .then((doc)=>{
        //If new Transporter already exists
        if(doc)
        {
            //If the New Transporter is the same as the Old Transporter
            if(name !== nTransporter)
            {
                res.status(500).json({ 
                    code : 409,
                    message : req.body.transporter + " already exists." 
                })
            }
            //If the New Transporter is the same as the Old Transporter
            else
            {
                Transporter.updateOne({ transporter : name }, { $set : req.body})
                .collation({ "locale": "en", "strength": 2 })
                .then(()=> {
                    res.status(200).json({
                        code : 200,
                        message : name + " has been updated successfully!",
                    })
                })
            }
        }
        //If new Transporter doesn't exist
        else
        {
            Transporter.updateOne({ transporter : name }, { $set : req.body})
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



//DELETING ONE TRANSPORTER
exports.deleteOneTransporter = (req, res, next) => {
    const name = req.params.transporterName
    //Look for transporter to be deleted
    Transporter.findOne({ transporter : name})
    .collation({ "locale": "en", "strength": 2 })
    .then((doc) =>{
        //If Transporter exists, delete the transporter from database
        if(doc)
        {
            Transporter.deleteOne({ transporter : name })
            .collation({ "locale": "en", "strength": 2 })            
            .then( doc => {
                    res.status(200).json({
                        code : 200,
                        message : name + " has been deleted successfully",
                    })    
            })
            //Catch any errors encountered during deleting Transporter from database
            .catch(error => {
                res.status(404).json({ 
                    code : 404,
                    message : name + "Not Found" }
                )
            })
        }
        //If Transporter doesn't exist, inform user.
        else
        {
            res.status(409).json({
                code : 409,
                message : name + " doesn't exist!"
            })
        }
    })
}