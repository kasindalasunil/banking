const express = require('express')

const {createaccount,getaccounts,getaccountbyid} = require('../controllers/accountcontroller');

const accountrouter = express.Router()

accountrouter.post('/',createaccount)
accountrouter.get('/',getaccounts)
accountrouter.get('/:id',getaccountbyid)

module.exports = accountrouter;

