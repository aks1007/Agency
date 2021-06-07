const express = require('express')
const mongoose = require('mongoose')


const postController = require('../controllers/post')
const router = express.Router()


//--DISPLAYING ALL POSTS--
router.get('/', postController.getAllPosts)

//--CREATING A NEW POST--
router.post('/', postController.postOnePost)

//--DISPLAYING A POST--
router.get('/:postName', postController.getOnePost)

//--UPDATING A POST--
router.put('/:postName', postController.putOnePost)

//--DELETING A POST--
router.delete('/:postName', postController.deleteOnePost)


module.exports = router