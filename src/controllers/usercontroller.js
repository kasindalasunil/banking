const pool = require('../config/db')
const createuser = async(req,res) => {
    try {
        const { first_name, last_name, dob, gender, mobile_number, email,address, kyc_status, is_verified,created_at,updated_at} = req.body;
        if (!first_name || !last_name || !mobile_number || !email) {
            res.status(400).json({ message: "Missing required fields" });
        }
        const [result] = await pool.query(
            `insert into user
            (first_name,last_name,dob,gender,mobile_number,email,address,kyc_status,is_verified,created_at,updated_at)
            values(?,?,?,?,?,?,?,?,?,NOW(),NOW())`,
            [
                first_name,
                last_name,
                dob || null,
                gender,
                mobile_number,
                email,
                address || null,
                kyc_status ||'pending',
                is_verified ||false-9            ]
        );

        res.status(201).json({
            message:'user created successfully', id:result.insertId})
}catch(err){
    console.log(err);
    res.status(500).send("Internal Server error");
  }
}
const getusers = async(req,res) =>{
    try{
    const [rows] = await pool.query('select * from user')

    res.status(201).json({message:'user details fetched successfully',
        user:rows    
    })
}catch(err){
    console.log(err)
    res.status(500).send('internal server error')
}

}
const getuserbyid = async(req,res)=>{
    try{
        const {user_id} = req.params
        console.log('user id',user_id)
        const [rows] = await pool.query('select * from `user`',[user_id])

        res.status(201).json({message:'got the userdetails by id',
            user:rows[0]
        })

    }catch(err){
        console.log(err)
        res.status(500).send('internal server error')
    }
}

const updateuser = async(req,res)=>{
    try{
        const {user_id} = req.params;
        const {first_name,last_name,email} = req.body;

        const [rows] = await pool.query(
            `update user set first_name=? , last_name =? , email = ? where user_id =?`,
            [
                first_name,
                last_name,
                email,
                user_id
            ]
        )

        res.status(201).json({
            message:'updated user data successfuly',
            user:rows[1]

        })

    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')
    }
}

module.exports = {
    createuser,
    getusers,
    getuserbyid,
    updateuser
}

