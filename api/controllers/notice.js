const transaction = require('../models/conn').transaction
const Notice = transaction.model('Notice')

//DISPLAYING ALL NOTES
exports.getAllNotices = (req, res, next) => {
    Notice.find().sort({serialNo : 1}).lean()
    .select('serialNo date  subject to notice')
    .collation({ "locale": "en", "strength": 2 })
    .then( docs => {
        const response = {
            count: docs.length,
            Notice : docs.map( doc =>{
                return {
                    serialNo: doc.serialNo,
                    date: doc.date,
                    subject: doc.subject,
                    to : doc.to,                    
                    notice: doc.notice
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



//CREATING A NEW NOTICE
exports.postOneNotice = (req, res, next) => {
    const notice = new Notice({
        serialNo : req.body.serialNo,
        date: req.body.date,
        subject: req.body.subject,
        to : req.body.to,
        notice : req.body.notice,
    })
    id = req.body.serialNo
    //Look for notice
    Notice.findOne({serialNo : id})
    .collation({ "locale": "en", "strength": 2 })
    .then((doc)=>
    {
        //If Notice exists
        if(doc)
        {            
            res.status(409).json({
                code : 409,
                message : "Notice No. " + id + " already exists."
            })
        }
        //If Notice doesn't exist
        else
        {
            notice.save()
            .then(()=> {
                res.status(201).json({
                    code : 201,
                    message: "Notice No. " + id + ' recorded successfully',
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



//DISPLAYING ONE NOTICE
exports.getOneNotice = (req, res, next) => 
{
    var id = req.params.serialNo
    Notice.findOne({serialNo:id}).lean()
    .collation({ "locale": "en", "strength": 2 })
    .then( doc =>
    {
        //Executed if documnet exists
        if(doc){
            res.status(200).json({
                code : 200,
                message: "Notice No. " + id + " Found!",
                serialNo : doc.serialNo,
                date: doc.date,
                subject : doc.subject,
                to : doc.to,
                notice : doc.notice
                })
        } 
        //Executed if document doesn't exist  
        else
        {
            return res.status(404).json({
                code : 404,
                message: "Notice No. " + id + " Not Found!"
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



//UPDATING ONE NOTICE
exports.putOneNotice = (req, res, next) => 
{
    id = req.params.serialNo
    Notice.updateOne({ serialNo: id }, { $set : req.body})
    .collation({ "locale": "en", "strength": 2 })
    .then(()=> {
        res.status(200).json({
            code : 200,
            message : "Notice No. " + id + " has been updated successfully!",
        })
    })
    .catch( error => {
        console.log(error)
        res.status(409).json({ 
            code : 409,
            message: "Notice No. " + id + " already exists."})
    })
}



//DELETING ONE NOTICE
exports.deleteOneNotice = (req, res, next) =>
{
    const id = req.params.serialNo
    Notice.deleteOne({ serialNo: id})
    .collation({ "locale": "en", "strength": 2 })            
    .then( doc =>{
        res.status(200).json({
            code : 200,
            message : "Notice No. " + id + " has been deleted successfully",
        })    
    })
    //Catch any errors encountered during deleting Notice from database
    .catch(error => 
    {
        res.status(404).json({ 
            code : 404,
            message : "Notice No. " + id + "Not Found" }
        )
    })
}   

exports.getLastNotice = (req, res, next) => {
    Notice.find().sort({serialNo : -1}).limit(1).lean()
    .select('serialNo')
    .collation({ "locale": "en", "strength": 2 })
    .then( docs => {
        const response = {
            count: docs.length,
            Notice : docs.map( doc =>{
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

exports.getRangeNotices = (req, res) => {
    var from = req.params.from
    var to = req.params.to
    Notice.find({date : { $gte : new Date(from), $lt : new Date(to)}}).sort({billNo : 1}).lean()
    .select('serialNo date  subject to notice')
    .collation({ "locale": "en", "strength": 2 })
    .then( docs => {
        const response = {
            count: docs.length,
            Notice : docs.map( doc =>{
                return {
                    serialNo: doc.serialNo,
                    date: doc.date,
                    subject: doc.subject,
                    to : doc.to,                    
                    notice: doc.notice
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
