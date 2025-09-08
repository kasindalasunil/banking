const express = require('express')
const {createuser,getusers,getuserbyid} = require('../controllers/usercontroller')

const userrouter = express.Router()

userrouter.post('/',createuser)
userrouter.get('/get',getusers)
userrouter.get('/get/:id',getuserbyid)


module.exports = userrouter;

