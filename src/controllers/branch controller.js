const pool = require('../config/db')

const createbranch = async(req,res) =>{
    try{
        const {branch_name,ifsc_code,address,contact_number,created_at,updated_at} = req.body

        if(!ifsc_code || !branch_name){
            res.status(400).json({message:'ifsc code and branch name is required'})
        }
        const [result] = await pool.query(
            `insert into branch
            (branch_name,ifsc_code,address,contact_number,created_at,updated_at)
            values(?,?,?,?,NOW(),NOW())`,
            [
                branch_name,
                ifsc_code,
                address,
                contact_number
            ]
        )
       res.status(201).json({
    message:'Bank details added successfully',
    branchid: result.insertId
});

    }catch(err){
        console.log(err);
        res.status(500).send("Internal Server error");
    }
}
const getbranch = async(req,res) =>{
    try{
        const [rows] = await pool.query('select * from branch')

        res.status(201).json({message:'fetched branch details successfully',
            branch:rows
        })
    }catch(err){
        console.log(err)
        res.status(500).send('internal server error')
    }
}

const getbranchbyid = async(req,res) =>{
    try{
        const {branch_id} = req.params
        
        const [rows] = await pool.query('select * from branch',[branch_id])

        res.status(201).json({message:'fetched branch details by id',
            branch:rows[0]
        })

    }catch(err){
        console.log(err)
        res.status(500).send('internal server error')
    }
}

module.exports = {createbranch,
    getbranch,
    getbranchbyid
}


