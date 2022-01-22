const express = require("express")
const router = express.Router()
const {check, validationResult} = require("express-validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const User = require("../models/User")
const auth = require("../middleware/authoriztion")

router.get("/",auth, async (req,res)=>{
  try{
  const user = await User.findById(req.user.id).select("-password");
  res.json(user)
    }
    catch(e){
      console.log(e);
    }
})
router.post("/",
          [
          check("email","please enter valid email").isEmail(),
          check("password","please enter valid password").not().isEmpty(),
          ],
          async (req,res)=>{
            const errors = validationResult(req)
            if(!errors.isEmpty()){
              return res.status(400).json({errors:errors.array()})
            }
            const {email,password} = req.body
              let user = await User.findOne({email})

            if(!user){
              console.log(user);
              return res.status(400).json({errors:[{"message":"user not exist"}]});
            }
            const match = await bcrypt.compare(password,user.password)
            if(!match){
              return res.status(400);
            }
              const payload = {
                user: {
                  id:user.id,
                }
              }
              jwt.sign(payload,'ecomerceSecret',{expiresIn : 3600*24},(err,token)=>{
                if(err){
                  console.log("its error");
                }
                res.json({token})
              })

                    }
)

module.exports = router
