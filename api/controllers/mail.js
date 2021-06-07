const transaction = require('../models/conn').transaction
const Mail = transaction.model('Mail')

//DISPLAYING ALL MAILS
exports.getAllMails = (req, res, next) => {
    Mail.find().sort({serialNo : 1}).lean()
    .select('serialNo date sender receiver io content post tid remarks')
    .collation({ "locale": "en", "strength": 2 })
    .then( docs => {
        const response = {
            count: docs.length,
            Mail : docs.map( doc =>{
                return {
                    serialNo: doc.serialNo,
                    date: doc.date,
                    sender: doc.sender,
                    receiver : doc.receiver,                    
                    io: doc.io,
                    content : doc.content,
                    post : doc.post,
                    tid: doc.tid,
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



//CREATING A NEW MAIL
exports.postOneMail = (req, res, next) => {
    const mail = new Mail({
        serialNo : req.body.serialNo,
        date: req.body.date,
        sender: req.body.sender,
        receiver : req.body.receiver,
        io : req.body.io,
        content : req.body.content,
        post : req.body.post,
        tid: req.body.tid,
        remarks : req.body.remarks

    })
    id = req.body.serialNo
    //Look for mail
    Mail.findOne({serialNo : id})
    .collation({ "locale": "en", "strength": 2 })
    .then((doc)=>
    {
        //If Mail exists
        if(doc)
        {            
            res.status(409).json({
                code : 409,
                message : "Mail No. " + id + " already exists."
            })
        }
        //If Mail doesn't exist
        else
        {
            mail.save()
            .then(()=> {
                res.status(201).json({
                    code : 201,
                    message: "Mail No. " + id + ' recorded successfully',
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



//DISPLAYING ONE MAIL
exports.getOneMail = (req, res, next) => 
{
    var id = req.params.serialNo
    Mail.findOne({serialNo:id}).lean()
    .collation({ "locale": "en", "strength": 2 })
    .then( doc =>
    {
        //Executed if documnet exists
        if(doc){
            res.status(200).json({
                code : 200,
                message: "Mail No. " + id + " Found!",
                serialNo: doc.serialNo,
                date: doc.date,
                sender: doc.sender,
                receiver : doc.receiver,                    
                io: doc.io,
                content : doc.content,
                post : doc.post,
                tid: doc.tid,
                remarks : doc.remarks 
                })
        } 
        //Executed if document doesn't exist  
        else
        {
            return res.status(404).json({
                code : 404,
                message: "Mail No. " + id + " Not Found!"
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



//UPDATING ONE MAIL
exports.putOneMail = (req, res, next) => 
{
    id = req.params.serialNo
    Mail.updateOne({ serialNo: id }, { $set : req.body})
    .collation({ "locale": "en", "strength": 2 })
    .then(()=> {
        res.status(200).json({
            code : 200,
            message : "Mail No. " + id + " has been updated successfully!",
        })
    })
    .catch( error => {
        console.log(error)
        res.status(409).json({ 
            code : 409,
            message: "Mail No. " + id + " already exists."})
    })
}



//DELETING ONE MAIL
exports.deleteOneMail = (req, res, next) =>
{
    const id = req.params.serialNo
    Mail.deleteOne({ serialNo: id})
    .collation({ "locale": "en", "strength": 2 })            
    .then( doc =>{
        res.status(200).json({
            code : 200,
            message : "Mail No. " + id + " has been deleted successfully",
        })    
    })
    //Catch any errors encountered during deleting Mail from database
    .catch(error => 
    {
        res.status(404).json({ 
            code : 404,
            message : "Mail No. " + id + "Not Found" }
        )
    })
}   

exports.getLastMail = (req, res, next) => {
    Mail.find().sort({serialNo : -1}).limit(1).lean()
    .select('serialNo')
    .collation({ "locale": "en", "strength": 2 })
    .then( docs => {
        const response = {
            count: docs.length,
            Mail : docs.map( doc =>{
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

exports.getRangeMails = (req, res) => {
    var from = req.params.from
    var to = req.params.to
    Mail.find({date : { $gte : new Date(from), $lt : new Date(to)}}).sort({billNo : 1}).lean()
    .select('serialNo date sender receiver io content post tid remarks')
    .collation({ "locale": "en", "strength": 2 })
    .then( docs => {
        const response = {
            count: docs.length,
            Mail : docs.map( doc =>{
                return {
                    serialNo: doc.serialNo,
                    date: doc.date,
                    sender: doc.sender,
                    receiver : doc.receiver,                    
                    io: doc.io,
                    content : doc.content,
                    post : doc.post,
                    tid: doc.tid,
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
