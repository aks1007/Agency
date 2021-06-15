const express = require('express')
const mongoose = require('mongoose')


const postController = require('../controllers/post')
const router = express.Router()


//--DISPLAYING ALL POSTS--
router.get('/', postController.getAllPosts)

//--CREATING A NEW POST--
router.post('/', postController.postOnePost)

//--DISPLAYING A POST--
router.get('/basic/:postName', postController.getOnePost)

//--UPDATING A POST--
router.put('/basic/:postName', postController.putOnePost)

//--DELETING A POST--
router.delete('/basic/:postName', postController.deleteOnePost)

//--ADRESS LIST REPORT(ALL)--
router.get('/address', postController.getAllAddress)


module.exports = router