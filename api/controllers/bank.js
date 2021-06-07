const master = require('../models/conn').master
const Bank = master.model('Bank')

//DISPLAYING ALL BANKS
exports.getAllBanks = (req, res, next) => {
    Bank.find().lean()
    .select('bank')
    .collation({ "locale": "en", "strength": 2 })
    .then( docs => {
        const response = {
            count: docs.length,
            Bank : docs.map( doc =>{
                return {
                    bank : doc.bank,
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



//CREATING A NEW BANK
exports.postOneBank = (req, res, next) => {
    const bank = new Bank({
        bank : req.body.bank,
    })
    name = req.body.bank
    //Look for bank
    Bank.findOne({bank : name}).lean()
    .collation({ "locale": "en", "strength": 2 })
    .then((doc)=>
    {
        //If Bank exists
        if(doc)
        {            
            res.status(409).json({
                code : 409,
                message : req.body.bank + " already exists."
            })
        }
        //If Bank doesn't exist
        else
        {
            bank.save()
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



//DISPLAYING ONE BANK
exports.getOneBank = (req, res, next) => 
{
    var name = req.params.bankName
    Bank.findOne({bank : name})
    .collation({ "locale": "en", "strength": 2 })
    .then( doc =>
    {
        //Executed if document exists
        if(doc){
            res.status(200).json({
                code : 200,
                message: name + " Found!",
                bank : doc.bank
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



//UPDATING ONE BANK
exports.putOneBank = (req, res, next) => 
{
    var name = req.params.bankName
    var nBank = req.body.bank
    //Look for new Bank
    Bank.findOne({bank : nBank})
    .collation({ "locale": "en", "strength": 2 })            
    .then((doc)=>{
        //If new Bank already exists
        if(doc)
        {
            //If the New Bank is the same as the Old Bank
            if(name !== nBank)
            {
                res.status(500).json({ 
                    code : 409,
                    message : req.body.bank + " already exists." 
                })
            }
            //If the New Bank is the same as the Old Bank
            else
            {
                Bank.updateOne({ bank : name }, { $set : req.body})
                .collation({ "locale": "en", "strength": 2 })
                .then(()=> {
                    res.status(200).json({
                        code : 200,
                        message : name + " has been updated successfully!",
                    })
                })
            }
        }
        //If new Bank doesn't exist
        else
        {
            Bank.updateOne({ bank : name }, { $set : req.body})
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



//DELETING ONE BANK
exports.deleteOneBank = (req, res, next) => {
    const name = req.params.bankName
    //Look for Bank to be deleted
    Bank.findOne({ bank : name})
    .collation({ "locale": "en", "strength": 2 })
    .then((doc) =>{
        //If Bank exists, delete the bank from database
        if(doc)
        {
            Bank.deleteOne({ bank : name })
            .collation({ "locale": "en", "strength": 2 })            
            .then( doc => {
                    res.status(200).json({
                        code : 200,
                        message : name + " has been deleted successfully",
                    })    
            })
            //Catch any errors encountered during deleting Bank from database
            .catch(error => {
                res.status(404).json({ 
                    code : 400,
                    message : name + "Not Found" }
                )
            })
        }
        //If Bank doesn't exist, inform user.
        else
        {
            res.status(409).json({
                code : 409,
                message : name + " doesn't exist!"
            })
        }
    })
}