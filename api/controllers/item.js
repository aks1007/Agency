const master = require('../models/conn').master
const Item = master.model('Item')

//DISPLAYING ALL ITEMS
exports.getAllItems = (req, res, next) => {
    Item.find().lean()
    .select('item hsnCode itemGroup itemCut rpm rpp')
    .collation({ "locale": "en", "strength": 2 })
    .then( docs => {
        const response = {
            count: docs.length,
            Item : docs.map( doc =>{
                return {
                    item: doc.item,
                    hsnCode: doc.hsnCode,
                    itemGroup : doc.itemGroup,
                    itemCut : doc.itemCut,
                    rpm : doc.rpm,
                    rpp : doc.rpp,
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



//CREATING A NEW ITEM
exports.postOneItem = (req, res, next) => {
    const item = new Item({
        item : req.body.item,
        hsnCode : req.body.hsnCode,
        itemGroup : req.body.itemGroup,
        itemCut : req.body.itemCut,
        rpm : req.body.rpm,
        rpp : req.body.rpp,
    })
    name = req.body.item
    //Look for item
    Item.findOne({item : name})
    .collation({ "locale": "en", "strength": 2 })
    .then((doc)=>
    {
        //If Item exists
        if(doc)
        {            
            res.status(409).json({
                code : 409,
                message : req.body.item + " already exists."
            })
        }
        //If Item doesn't exist
        else
        {
            item.save()
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



//DISPLAYING ONE ITEM
exports.getOneItem = (req, res, next) => 
{
    var name = req.params.itemName
    Item.findOne({item : name}).lean()
    .collation({ "locale": "en", "strength": 2 })
    .then( doc =>
    {
        //Executed if documnet exists
        if(doc){
            res.status(200).json({
                code : 200,
                message: name + " Found!",
                item : doc.item,
                hsnCode : doc.hsnCode,
                itemGroup : doc.itemGroup,
                itemCut : doc.itemCut,
                rpm : doc.rpm,
                rpp : doc.rpp,
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



//UPDATING ONE ITEM
exports.putOneItem = (req, res, next) => 
{
    var name = req.params.itemName
    var nItem = req.body.item
    //Look for new Item
    Item.findOne({item : nItem})
    .collation({ "locale": "en", "strength": 2 })            
    .then((doc)=>{

        //If new item already exists
        if(doc)
        {
            //If the New Item is the same as the Old Item
            if(name !== nItem)
            {
                res.status(500).json({ 
                    code : 409,
                    message : req.body.item + " already exists." 
                })
            }
            //If the New Item is the same as the Old Item
            else
            {
                Item.updateOne({ item : name }, { $set : req.body})
                .collation({ "locale": "en", "strength": 2 })
                .then(()=> {
                    res.status(200).json({
                        code : 200,
                        message : name + " has been updated successfully!",
                    })
                })
            }
        }
        //If new Item doesn't exist
        else
        {
            Item.updateOne({ item : name }, { $set : req.body})
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



//DELETING ONE ITEM
exports.deleteOneItem = (req, res, next) => {
    const name = req.params.itemName
    //Look for item to be deleted
    Item.findOne({ item : name})
    .collation({ "locale": "en", "strength": 2 })
    .then((doc) =>{
        //If Item exists, delete the item from database
        if(doc)
        {
            Item.deleteOne({ item : name })
            .collation({ "locale": "en", "strength": 2 })            
            .then( doc => {
                    res.status(200).json({
                        code : 200,
                        message : name + " has been deleted successfully",
                    })    
            })
            //Catch any errors encountered during deleting Item from database
            .catch(error => {
                res.status(404).json({ 
                    code : 404,
                    message : name + "Not Found" }
                )
            })
        }
        //If Item doesn't exist, inform user.
        else
        {
            res.status(409).json({
                code : 409,
                message : name + " doesn't exist!"
            })
        }
    })
}