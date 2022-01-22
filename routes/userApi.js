const express = require("express")
const router = express.Router()
const {check, validationResult} = require("express-validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const User = require("../models/User")
router.get("/",(req,res)=> res.send("User router"))
router.post("/",
          [
          check("name","Name is required").not().isEmpty(),
          check("email","pleause enter valid mail").isEmail(),
          check("password","please pasword should have atleat 5 char").isLength({min:5}),
          ],
          async (req,res)=>{
            const errors = validationResult(req)
            if(!errors.isEmpty()){
              return res.status(400).json({errors:errors.array()})
            }
            const {name,email,password,role} = req.body
              let user = await  User.findOne({email})
            if(user){
              console.log(user);
              return res.status(400).json({errors:[{"message":"user alreday exist"}]});
            }
            user = new User({name,email,password,role,})
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(password,salt)
            user.save()
              const payload = {
                user: {
                  id:user.id,
                }
              }
              jwt.sign(payload,'ecomerceSecret',{expiresIn : 3600*24},(err,token)=>{
                if(err){
                  console.log("not created");
                }
                res.json({token})
              })
}

)

module.exports = router
