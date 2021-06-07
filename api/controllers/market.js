const master = require('../models/conn').master
const Market = master.model('Market')

//DISPLAYING ALL MARKETS
exports.getAllMarkets = (req, res, next) => {
    Market.find().lean()
    .select('market')
    .collation({ "locale": "en", "strength": 2 })
    .then( docs => {
        const response = {
            count: docs.length,
            Market : docs.map( doc =>{
                return {
                    market : doc.market,
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



//CREATING A NEW MARKET
exports.postOneMarket = (req, res, next) => {
    const market = new Market({
        market : req.body.market,
    })
    name = req.body.market
    //Look for Market
    Market.findOne({market : name})
    .collation({ "locale": "en", "strength": 2 })
    .then((doc)=>
    {
        //If Market exists
        if(doc)
        {            
            res.status(409).json({
                code : 409,
                message : req.body.market + " already exists."
            })
        }
        //If Market doesn't exist
        else
        {
            market.save()
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



//DISPLAYING ONE MARKET
exports.getOneMarket = (req, res, next) => 
{
    var name = req.params.marketName
    Market.findOne({market : name}).lean()
    .collation({ "locale": "en", "strength": 2 })
    .then( doc =>
    {
        //Executed if document exists
        if(doc){
            res.status(200).json({
                code : 200,
                message: name + " Found!",
                market : doc.market
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

//UPDATING ONE MARKET
exports.putOneMarket = (req, res, next) => 
{
    var name = req.params.marketName
    var nMarket = req.body.market    
    //Look for new Market
    Market.findOne({market : nMarket})
    .collation({ "locale": "en", "strength": 2 })            
    .then((doc)=>{
        //If new Market already exists
        if(doc)
        {
            //If the New Market is not the same as the Old Market
            if(name !== nMarket)
            {
                res.status(409).json({ 
                    code : 409,
                    message : req.body.market + " already exists."
                })  
            }
            //If the New Market is the same as the Old Market
            else
            {
                Market.updateOne({ market : name}, { $set : req.body})
                .collation({ "locale": "en", "strength": 2 })
                .then(()=> {
                    res.status(200).json({
                        code : 200,
                        message : name + " has been updated successfully!",
                    })
                })
            }
  
        }
        //If new Market doesn't exist
        else
        {
            Market.updateOne({ market : name}, { $set : req.body})
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



//DELETING ONE MARKET
exports.deleteOneMarket = (req, res, next) => {
    const name = req.params.marketName
    //Look for Market to be deleted
    Market.findOne({ market : name})
    .collation({ "locale": "en", "strength": 2 })
    .then((doc) =>{
        //If Market exists, delete the market from database
        if(doc)
        {
            Market.deleteOne({ market : name })
            .collation({ "locale": "en", "strength": 2 })            
            .then( doc => {
                    res.status(200).json({
                        code : 200,
                        message : name + " has been deleted successfully",
                    })    
            })
            //Catch any errors encountered during deleting Market from database
            .catch(error => {
                res.status(404).json({ 
                    code : 400,
                    message : name + "Not Found" }
                )
            })
        }
        //If Market doesn't exist, inform user.
        else
        {
            res.status(409).json({
                code : 409,
                message : name + " doesn't exist!"
            })
        }
    })
}