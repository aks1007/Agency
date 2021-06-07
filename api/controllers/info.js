const transaction = require('../models/conn').transaction
const Info = transaction.model('Info')

//CREATING INFO
exports.postOneInfo = (req, res, next) => {    
    const info = new Info({
        sNo : req.body.sNo,
        companyName : req.body.companyName,
        gstin : req.body.gstin,
        pan: req.body.pan,
        phoneNo : req.body.phoneNo,
        telephoneNo: req.body.telephoneNo,
        email : req.body.email,
        address : req.body.address
    })
    info.save()
    .then(()=> {
        res.status(201).json({
            code : 201,
            message: 'Company Info Recorded Successfully',
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



//DISPLAYING INFO
exports.getOneInfo = (req, res, next) => 
{
    num = req.params.id
    Info.findOne({sNo : num}).lean()
    .collation({ "locale": "en", "strength": 2 })
    .then( doc =>
    {    
        //Executed if documnet exists
        if(doc){
            res.status(200).json({
                code : 200,
                message:  num + " Found!",
                sNo : doc.sNo,
                companyName : doc.companyName,
                gstin : doc.gstin,
                pan : doc.pan,
                phoneNo : doc.phoneNo,
                telephoneNo: doc.telephoneNo,
                email : doc.email,
                address : doc.address
                })
        }
        else
        {
            res.status(404).json({
                code : 404,
                message : "Company Info not found!"
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



//UPDATING INFO
exports.putOneInfo = (req, res, next) => 
{
    num = req.params.id
    Info.updateOne({ sNo : num }, { $set : req.body})
    .collation({ "locale": "en", "strength": 2 })
    .then(()=> {
        res.status(200).json({
            code : 200,
            message : 'Company Info Recorded Successfully',
        })
    })
    .catch( error => {
        console.log(error)
        res.status(500).json({ 
            code : 500,
            error : error.message
        })
    })
}