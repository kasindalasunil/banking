const express = require('express')
const {createuser,getusers,getuserbyid,updateuser} = require('../controllers/usercontroller')

const userrouter = express.Router()

userrouter.post('/',createuser)
userrouter.get('/get',getusers)
userrouter.get('/get/:id',getuserbyid)
userrouter.put('/update/:id',updateuser)


module.exports = userrouter;

