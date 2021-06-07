const master = require('../models/conn').master
const ItemGroup = master.model('ItemGroup')

//DISPLAYING ALL ITEM GROUPS
exports.getAllItemGroups = (req, res, next) => {
    ItemGroup.find().lean()
    .select('itemGroup')
    .collation({ "locale": "en", "strength": 2 })
    .then( docs => {
        const response = {
            count: docs.length,
            ItemGroup : docs.map( doc =>{
                return {
                    itemGroup : doc.itemGroup,
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



//CREATING A NEW ITEM GROUP
exports.postOneItemGroup = (req, res, next) => {
    const itemGroup = new ItemGroup({
        itemGroup : req.body.itemGroup,
    })
    name = req.body.itemGroup
    //Look for ItemGroup
    ItemGroup.findOne({itemGroup : name})
    .collation({ "locale": "en", "strength": 2 })
    .then((doc)=>
    {
        //If ItemGroup exists
        if(doc)
        {            
            res.status(409).json({
                code : 409,
                message : req.body.itemGroup + " already exists."
            })
        }
        //If ItemGroup doesn't exist
        else
        {
            itemGroup.save()
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



//DISPLAYING ONE ITEM GROUP
exports.getOneItemGroup = (req, res, next) => 
{
    var name = req.params.itemGroupName
    ItemGroup.findOne({itemGroup : name}).lean()
    .collation({ "locale": "en", "strength": 2 })
    .then( doc =>
    {
        //Executed if document exists
        if(doc){
            res.status(200).json({
                code : 200,
                message: name + " Found!",
                itemGroup : doc.itemGroup
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



//UPDATING ONE ITEM GROUP
exports.putOneItemGroup = (req, res, next) => 
{
    var name = req.params.itemGroupName
    var nItemGroup = req.body.itemGroup
    //Look for new ItemGroup
    ItemGroup.findOne({itemGroup : nItemGroup})
    .collation({ "locale": "en", "strength": 2 })            
    .then((doc)=>{
        //If new ItemGroup already exists
        if(doc)
        {
            //If New Item Group is NOT the same as Old Item Group
            if( name !== nItemGroup)            
            {
                res.status(409).json({ 
                    code : 409,
                    message : req.body.itemGroup + " already exists."
                })
            }
            //If New Item Group is the same as Old Item Group
            else
            {
                ItemGroup.updateOne({ itemGroup : name }, { $set : req.body})
                .collation({ "locale": "en", "strength": 2 })
                .then(()=> {
                    res.status(200).json({
                        code : 200,
                        message : name + " has been updated successfully!",
                    })
                })  
            }
        }
        //If new ItemGroup doesn't exist
        else
        {
            ItemGroup.updateOne({ itemGroup : name }, { $set : req.body})
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



//DELETING ONE ITEM GROUP
exports.deleteOneItemGroup = (req, res, next) => {
    const name = req.params.itemGroupName
    //Look for ItemGroup to be deleted
    ItemGroup.findOne({ itemGroup : name})
    .collation({ "locale": "en", "strength": 2 })
    .then((doc) =>{
        //If ItemGroup exists, delete the itemGroup from database
        if(doc)
        {
            ItemGroup.deleteOne({ itemGroup : name })
            .collation({ "locale": "en", "strength": 2 })            
            .then( doc => {
                    res.status(200).json({
                        code : 200,
                        message : name + " has been deleted successfully",
                    })    
            })
            //Catch any errors encountered during deleting ItemGroup from database
            .catch(error => {
                res.status(404).json({ 
                    code : 400,
                    message : name + "Not Found" }
                )
            })
        }
        //If ItemGroup doesn't exist, inform user.
        else
        {
            res.status(409).json({
                code : 409,
                message : name + " doesn't exist!"
            })
        }
    })
}