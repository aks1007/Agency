const transaction = require('../models/conn').transaction
const Brokerage = transaction.model('Brokerage')

//DISPLAYING ALL BROKERAGES
exports.getAllBrokerages = (req, res, next) => {
    Brokerage.find().sort({serialNo : 1}).lean()
    .select('serialNo entryNo date supplier mop txnNo txnDate bank brokReceived tds totalBrok gstP brokP from to selectAll remarks')
    .collation({ "locale": "en", "strength": 2 })
    .then( docs => {
        const response = {
            count: docs.length,
            Brokerage : docs.map( doc =>{
                return {
                    serialNo: doc.serialNo,
                    entryNo : doc.entryNo,                    
                    date: doc.date,
                    supplier: doc.supplier,                    
                    mop : doc.mop,
                    txnNo : doc.txnNo,
                    txnDate : doc.txnDate,
                    bank : doc.bank,
                    brokReceived : doc.brokReceived,
                    tds : doc.tds,
                    totalBrok : doc.totalBrok,
                    gstP : doc.gstP,
                    brokP : doc.brokP,
                    from : doc.from,
                    to : doc.to,
                    selectAll : doc.selectAll,
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



//CREATING A NEW BROKERAGE
exports.postOneBrokerage = (req, res, next) => {
    const brokerage = new Brokerage({
        serialNo: req.body.serialNo,
        entryNo : req.body.entryNo,                    
        date: req.body.date,
        supplier: req.body.supplier,                    
        mop : req.body.mop,
        txnNo : req.body.txnNo,
        txnDate : req.body.txnDate,
        bank : req.body.bank,
        brokReceived : req.body.brokReceived,
        tds : req.body.tds,
        totalBrok : req.body.totalBrok,
        gstP : req.body.gstP,
        brokP : req.body.brokP,
        from : req.body.from,
        to : req.body.to,
        selectAll : req.body.selectAll,
        remarks : req.body.remarks 
    })
    id = req.body.serialNo
    //Look for brokerage
    Brokerage.findOne({serialNo : id})
    .collation({ "locale": "en", "strength": 2 })
    .then((doc)=>
    {
        //If Brokerage exists
        if(doc)
        {            
            res.status(409).json({
                code : 409,
                message : "Brokerage at Serial No. " + id + " already exists."
            })
        }
        //If Brokerage doesn't exist
        else
        {
            brokerage.save()
            .then(()=> {
                res.status(201).json({
                    code : 201,
                    message: "Brokerage at Serial No. " + id + ' recorded successfully',
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



//DISPLAYING ONE BROKERAGE
exports.getOneBrokerage = (req, res, next) => 
{
    var id = req.params.serialNo
    Brokerage.findOne({serialNo:id}).lean()
    .collation({ "locale": "en", "strength": 2 })
    .then( doc =>
    {
        //Executed if documnet exists
        if(doc){
            res.status(200).json({
                code : 200,
                message: "Brokerage at Serial No. " + id + " Found!",
                serialNo: doc.serialNo,
                entryNo : doc.entryNo,                    
                date: doc.date,
                supplier: doc.supplier,                    
                mop : doc.mop,
                txnNo : doc.txnNo,
                txnDate : doc.txnDate,
                bank : doc.bank,
                brokReceived : doc.brokReceived,
                tds : doc.tds,
                totalBrok : doc.totalBrok,
                gstP : doc.gstP,
                brokP : doc.brokP,
                from : doc.from,
                to : doc.to,
                selectAll : doc.selectAll,
                remarks : doc.remarks
                })
        } 
        //Executed if document doesn't exist  
        else
        {
            return res.status(404).json({
                code : 404,
                message: "Brokerage at Serial No. " + id + " Not Found!"
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



//UPDATING ONE BROKERAGE
exports.putOneBrokerage = (req, res, next) => 
{
    id = req.params.serialNo
    Brokerage.updateOne({ serialNo: id }, { $set : req.body})
    .collation({ "locale": "en", "strength": 2 })
    .then(()=> {
        res.status(200).json({
            code : 200,
            message : "Brokerage at Serial No. " + id + " has been updated successfully!",
        })
    })
    .catch( error => {
        console.log(error)
        res.status(409).json({ 
            code : 409,
            message: "Brokerage at Serial No. " + id + " already exists."})
    })
}



//DELETING ONE BROKERAGE
exports.deleteOneBrokerage = (req, res, next) =>
{
    const id = req.params.serialNo
    Brokerage.deleteOne({ serialNo: id})
    .collation({ "locale": "en", "strength": 2 })            
    .then( doc =>{
        res.status(200).json({
            code : 200,
            message : "Brokerage at Serial No. " + id + " has been deleted successfully",
        })    
    })
    //Catch any errors encountered during deleting Brokerage from database
    .catch(error => 
    {
        res.status(404).json({ 
            code : 404,
            message : "Brokerage at Serial No. " + id + "Not Found" }
        )
    })
}   

exports.getLastBrokerage = (req, res, next) => {
    Brokerage.find().sort({serialNo : -1}).limit(1).lean()
    .select('serialNo')
    .collation({ "locale": "en", "strength": 2 })
    .then( docs => {
        const response = {
            count: docs.length,
            Brokerage : docs.map( doc =>{
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

exports.getRangeBrokerages = (req, res) => {
    var from = req.params.from
    var to = req.params.to
    Brokerage.find({date : { $gte : new Date(from), $lt : new Date(to)}}).sort({serialNo : 1}).lean()
    .select('serialNo entryNo date supplier mop txnNo txnDate bank brokReceived tds totalBrok gstP brokP from to selectAll remarks')
    .collation({ "locale": "en", "strength": 2 })
    .then( docs => {
        const response = {
            count: docs.length,
            Brokerage : docs.map( doc =>{
                return {
                    serialNo: doc.serialNo,
                    entryNo : doc.entryNo,                    
                    date: doc.date,
                    supplier: doc.supplier,                    
                    mop : doc.mop,
                    txnNo : doc.txnNo,
                    txnDate : doc.txnDate,
                    bank : doc.bank,
                    brokReceived : doc.brokReceived,
                    tds : doc.tds,
                    totalBrok : doc.totalBrok,
                    gstP : doc.gstP,
                    brokP : doc.brokP,
                    from : doc.from,
                    to : doc.to,
                    selectAll : doc.selectAll,
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
