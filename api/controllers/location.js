const master = require('../models/conn').master
const Location = master.model('Location')

//DISPLAYING ALL LOCATIONS
exports.getAllCities = (req, res, next) => {
    Location.find().sort({city: 1}).lean()
    .select('city state stdCode')
    .collation({ "locale": "en", "strength": 2 })
    .then( docs => {
        const response = {
            count: docs.length,
            Location : docs.map( doc =>{
                return {
                    city: doc.city,
                    state : doc.state,
                    stdCode : doc.stdCode
                }
            })
        }
        res.status(200).json(response)
    })
    .catch(err => {
        res.status(500).json({ 
            code : 500,
            error : err })
    })    
}



//CREATING A NEW LOCATION
exports.postOneLocation = (req, res, next) => {
    const city = new Location({
        city : req.body.city,
        state : req.body.state,
        stdCode : req.body.stdCode
    })
    name = req.body.city
    //Look for city
    Location.findOne({city : name})
    .collation({ "locale": "en", "strength": 2 })
    .then((doc)=>
    {
        //If Location exists
        if(doc)
        {            
            res.status(409).json({
                code : 409,
                message : req.body.city + " already exists."
            })
        }
        //If Location doesn't exist
        else
        {
            city.save()
            .then(()=> {
                res.status(201).json({
                    code : 201,
                    message: name + ' recorded successfully',
                })
            })
            .catch( error => {
                //If error is encountered while sending data to Database
                 res.status(500).json({ 
                    code : 500, 
                    error: error.message })
            }) 
        }
    })
    .catch(error =>
    {
        //If any other error encountered
        res.status(500).json({ 
            code : 500,
            message : error.message
        })
    })
}



//DISPLAYING ONE LOCATION
exports.getOneLocation = (req, res, next) => 
{
    var name = req.params.cityName
    Location.findOne({city : name}).lean()
    .collation({ "locale": "en", "strength": 2 })
    .then( doc =>
    {
        //Executed if documnet exists
        if(doc){
            res.status(200).json({
                code : 200,
                message: name + " Found!",
                city : doc.city,
                state : doc.state,
                stdCode : doc.stdCode,
                })
        } 
        //Executed if document doesn't exist  
        else
        {
            return res.status(404).json({
                code : 404,
                message: name + " Not Found"
            })
        }
    })
    .catch(error =>
    {
        //If any other error encountered
        res.status(500).json({ 
            code : 500,
            message : error.message
        })
    })              
}              



//UPDATING ONE LOCATION
exports.putOneLocation = (req, res, next) => 
{
    var name = req.params.cityName
    var nCity = req.body.city
    //Look for new Location
    Location.findOne({city : nCity}).lean()
    .collation({ "locale": "en", "strength": 2 })            
    .then((doc)=>{
        //If new City already exists
        if(doc)
        {
            //If the New City is the same as the Old City
            if(name !== nCity)
            {
                res.status(500).json({ 
                    code : 409,
                    message : req.body.city + " already exists." 
                })
            }
            //If the New City is the same as the Old City
            else
            {
                Location.updateOne({ city : name }, { $set : req.body})
                .collation({ "locale": "en", "strength": 2 })
                .then(()=> {
                    res.status(200).json({
                        code : 200,
                        message : name + " has been updated successfully!",
                    })
                })
            }
        }
        //If new City doesn't exist
        else
        {
            Location.updateOne({ city : name }, { $set : req.body})
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
        res.status(500).json({ 
            code : 500,
            error : error.message })
    })
}



//DELETING ONE LOCATION
exports.deleteOneLocation = (req, res, next) => {
    const name = req.params.cityName
    //Look for city to be deleted
    Location.findOne({ city : name})
    .collation({ "locale": "en", "strength": 2 })
    .then((doc) =>{
        //If Location exists, delete the city from database
        if(doc)
        {
            Location.deleteOne({ city : name })
            .collation({ "locale": "en", "strength": 2 })            
            .then( doc => {
                    res.status(200).json({
                        code : 200,
                        message : name + " has been deleted successfully",
                    })    
            })
            //Catch any errors encountered during deleting Location from database
            .catch(error => {
                res.status(404).json({ 
                    code : 404,
                    message : name + "Not Found" }
                )
            })
        }
        //If Location doesn't exist, inform user.
        else
        {
            res.status(409).json({
                code : 409,
                message : name + " doesn't exist!"
            })
        }
    })
}