const express = require('express')
const mongoose = require('mongoose')


const locationController = require('../controllers/location')
const router = express.Router()


//--DISPLAYING ALL LOCATIONS--
router.get('/', locationController.getAllCities)

//--CREATING A NEW LOCATION--
router.post('/', locationController.postOneLocation)

//--DISPLAYING A LOCATION--
router.get('/:cityName', locationController.getOneLocation)

//--UPDATING A LOCATION--
router.put('/:cityName', locationController.putOneLocation)

//--DELETING A LOCATION--
router.delete('/:cityName', locationController.deleteOneLocation)


module.exports = router