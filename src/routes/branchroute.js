const express = require('express')
const {createbranch,getbranch,getbranchbyid,updatebranch} = require('../controllers/branch controller')

const branchrouter = express.Router()

branchrouter.post('/',createbranch);
branchrouter.get('/',getbranch);
branchrouter.get('/:id',getbranchbyid);
branchrouter.put('/update/:id',updatebranch);




module.exports = branchrouter;



