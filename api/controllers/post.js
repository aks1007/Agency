const master = require('../models/conn').master
const Post = master.model('Post')

//DISPLAYING ALL POSTS
exports.getAllPosts = (req, res, next) => {
    Post.find().lean()
    .select('post emailId phoneNo remarks line1 line2 city state pinCode')
    .collation({ "locale": "en", "strength": 2 })
    .then( docs => {
        const response = {
            count: docs.length,
            Post : docs.map( doc =>{
                return {
                    post: doc.post,
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



//CREATING A NEW POST
exports.postOnePost = (req, res, next) => {
    const post = new Post({
        post : req.body.post,
        emailId: req.body.emailId,
        phoneNo: req.body.phoneNo,
        remarks: req.body.remarks,
        line1: req.body.line1,
        line2: req.body.line2,
        city: req.body.city,
        state: req.body.state,
        pinCode: req.body.pinCode,
    })
    name = req.body.post
    //Look for post
    Post.findOne({post : name})
    .collation({ "locale": "en", "strength": 2 })
    .then((doc)=>
    {
        //If Post exists
        if(doc)
        {            
            res.status(409).json({
                code : 409,
                message : req.body.post + " already exists."
            })
        }
        //If Post doesn't exist
        else
        {
            post.save()
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



//DISPLAYING ONE POST
exports.getOnePost = (req, res, next) => 
{
    var name = req.params.postName
    Post.findOne({post : name}).lean()
    .collation({ "locale": "en", "strength": 2 })
    .then( doc =>
    {
        //Executed if documnet exists
        if(doc){
            res.status(200).json({
                code : 200,
                message: name + " Found!",
                post : doc.post,
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



//UPDATING ONE POST
exports.putOnePost = (req, res, next) => 
{
    var name = req.params.postName
    var nPost = req.body.post
    //Look for new Post
    Post.findOne({post : nPost})
    .collation({ "locale": "en", "strength": 2 })            
    .then((doc)=>{

        //If new post already exists
        if( doc )
        {
            //If the New Post is the same as the Old Post
            if(name !== nPost)
            {
                res.status(500).json({ 
                    code : 409,
                    message : req.body.post + " already exists." 
                })
            }
            //If the New Post is the same as the Old Post
            else
            {
                Post.updateOne({ post : name }, { $set : req.body})
                .collation({ "locale": "en", "strength": 2 })
                .then(()=> {
                    res.status(200).json({
                        code : 200,
                        message : name + " has been updated successfully!",
                    })
                })
            }
        }
        //If new Post doesn't exist
        else
        {
            Post.updateOne({ post : name }, { $set : req.body})
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



//DELETING ONE POST
exports.deleteOnePost = (req, res, next) => {
    const name = req.params.postName
    //Look for post to be deleted
    Post.findOne({ post : name})
    .collation({ "locale": "en", "strength": 2 })
    .then((doc) =>{
        //If Post exists, delete the post from database
        if(doc)
        {
            Post.deleteOne({ post : name })
            .collation({ "locale": "en", "strength": 2 })            
            .then( doc => {
                    res.status(200).json({
                        code : 200,
                        message : name + " has been deleted successfully",
                    })    
            })
            //Catch any errors encountered during deleting Post from database
            .catch(error => {
                res.status(404).json({ 
                    code : 404,
                    message : name + "Not Found" }
                )
            })
        }
        //If Post doesn't exist, inform user.
        else
        {
            res.status(409).json({
                code : 409,
                message : name + " doesn't exist!"
            })
        }
    })
}