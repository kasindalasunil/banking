// const pool = require('../config/db')

// const createaccount = async(req,res)=>{
//     try{
//         const {account_number,user_id,branch_id,account_type,account_balance,account_status,created_at,updated_at} = req.body

//         if(!account_number || !account_type || !account_status){
//             res.status(400).json({message:'with out the account number,account type and status account cannot be created'})
//         }

//         const [result] = await pool.query(
//             `insert into account
//             (account_number,user_id,branch_id,account_type,account_balance,account_status,created_at,updated_at)
//             values(?,?,?,?,?,?,NOW(),NOW())`,
//             [
//                 account_number,
//                 user_id,
//                 branch_id,
//                 account_type ||'savings' ,
//                 account_balance,
//                 account_status || 'active'
//             ]
//         )
//         res.status(201).json({
//             message:'account is created successfully',
//             account_id:result.insertId
//         })
//     }catch(err){
//         console.log(err)
//         res.status(500).send('Internal server error')
//     }
// }
// const getaccounts = async(req,res) =>{
//     try{
//         const [rows] = await pool.query('select * from account')

//         res.status(201).json({message:'fetched account details successfully',
//             account:rows
//         })

//     }catch(err){
//         console.log(err)
//         res.status(500).send('internal server error')
//     }

// }

// const getaccountbyid = async (req,res) =>{
//     try{
//         const {account_id} = req.params;
//         const [rows] = await pool.query('select * from account',[account_id])

//         res.status(201).json({messsage:'fetched the account details by id',
//             account:rows[0]
//         })
//     }catch(err){
//         console.log(err)
//         res.status(500).send('internal server error')
//     }
// }

// module.exports ={
//     createaccount,
//     getaccounts,
//     getaccountbyid
// }

const bcrypt = require("bcrypt");
const pool = require("../config/db");

const validatefields = (data) => {
  const requiredFields = [
    //list of required fields
    "first_name",
    "last_name",
    "dob",
    "gender",
    "address",
    "mobile_number",
    "email",
    "username",
    "password",
  ];
  //check for missing fields
  for (const field of requiredFields) {
    if (!data[field]) {
      return { isvalid: false, missingField: field };
    }
  }

  return { isvalid: true };
};

const createaccount = async (req, res) => {
  //main fucntion to create account
  try {
    const payload = req.body;

    // 1. Validation
    const validationResult = validatefields(payload);
    if (!validationResult.isvalid) {
      return res.status(400).json({ message: "validation error" });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(payload.dob)) {
      return res
        .status(400)
        .json({ message: "date of birth must be in YYYY-MM-DD format" });
    }
    if (!/^[6-9]\d{9}$/.test(payload.mobile_number)) {
      return res
        .status(400)
        .json({ message: "mobile number must be 10 digit" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      return res.status(400).json({ message: "email must be in valid format" });
    }
    //validating if username already exists or not
    const [result] = await pool.query("select * from login where username= ?", [
      payload.username,
    ]);

    if (result.length>0) {
      return res
        .status(400)
        .json({ message: "username already exists"});
    }

    // 2. Create user + login and helper function returns userId
    const userId = await createUser({
      //user details
      first_name: payload.first_name,
      last_name: payload.last_name,
      dob: payload.dob,
      gender: payload.gender,
      mobile_number: payload.mobile_number,
      email: payload.email,
      address: payload.address,
      //login details
      username: payload.username,
      password: payload.password,
    });

    // 3. Create account (link with userId)
    let branchId = 1; // hardcoded branch for now

    const [branchResult] = await pool.query(
      `select branch_id from branch
      where ifsc_code = ?`,
      [payload.ifsc_code]
    )
    console.log(branchResult);

    branchId = branchResult[0].branch_id;


    const accountNumber = generateAccountnumber()

    await createAccount({
      //account details
      account_number:accountNumber,
      user_id: userId, //use the newly created userId
      branch_id: branchId,
      account_balance: payload.account_balance
    });
    return res.status(201).json({ message: "Account created successfully" });
  } catch (err) {
    console.error("Error creating account:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Create User + Login
const createUser = async (data) => {
  const createuserRes = await pool.query(
    `INSERT INTO user
      (first_name,last_name,dob,gender,mobile_number,email,address,created_at,updated_at)
     VALUES (?,?,?,?,?,?,?,NOW(),NOW())`,
    [
      data.first_name,
      data.last_name,
      data.dob,
      data.gender,
      data.mobile_number,
      data.email,
      data.address,
    ]
  );

  const insertId = createuserRes[0].insertId;

  // Hash password
  const saltRounds = 10;
  const Password = await bcrypt.hash(data.password, saltRounds);

  // Insert into login table
  await pool.query(
    `INSERT INTO login
      (username,user_id,password,created_at,updated_at)
     VALUES (?,?,?,NOW(),NOW())`,
    [data.username, insertId, Password]
  );

  return insertId; // return new userId
};

// Create Account
const createAccount = async (data) => {
  await pool.query(
    `INSERT INTO account
      (account_number, user_id, branch_id, account_balance, created_at, updated_at)
     VALUES (?,?,?,?,NOW(),NOW())`,
    [data.account_number,data.user_id, data.branch_id, data.account_balance]
  );
};

const generateAccountnumber = () => {
  return Date.now().toString() + Math.floor(Math.random() * 1000);
};


module.exports = {
  createaccount,
};
