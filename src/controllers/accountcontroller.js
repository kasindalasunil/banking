const pool = require('../config/db')

const createaccount = async(req,res)=>{
    try{
        const {account_number,user_id,branch_id,account_type,account_balance,account_status,created_at,updated_at} = req.body

        if(!account_number || !account_type || !account_status){
            res.status(400).json({message:'with out the account number,account type and status account cannot be created'})
        }

        const [result] = await pool.query(
            `insert into account
            (account_number,user_id,branch_id,account_type,account_balance,account_status,created_at,updated_at)
            values(?,?,?,?,?,?,NOW(),NOW())`,
            [
                account_number,
                user_id,
                branch_id,
                account_type ||'savings' ,
                account_balance,
                account_status || 'active'
            ]
        )
        res.status(201).json({
            message:'account is created successfully',
            account_id:result.insertId
        })
    }catch(err){
        console.log(err)
        res.status(500).send('Internal server error')
    }
}
const getaccounts = async(req,res) =>{
    try{
        const [rows] = await pool.query('select * from account')

        res.status(201).json({message:'fetched account details successfully',
            account:rows
        })


    }catch(err){
        console.log(err)
        res.status(500).send('internal server error')
    }

}

const getaccountbyid = async (req,res) =>{
    try{
        const {account_id} = req.params;
        const [rows] = await pool.query('select * from account',[account_id])

        res.status(201).json({messsage:'fetched the account details by id',
            account:rows[0]
        })
    }catch(err){
        console.log(err)
        res.status(500).send('internal server error')
    }
}

module.exports ={
    createaccount,
    getaccounts,
    getaccountbyid
}
