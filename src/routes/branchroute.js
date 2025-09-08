const express = require('express')
const {createbranch,getbranch,getbranchbyid} = require('../controllers/branch controller')

const branchrouter = express.Router()

branchrouter.post('/',createbranch);
branchrouter.get('/',getbranch);
branchrouter.get('/:id',getbranchbyid);



module.exports = branchrouter;



