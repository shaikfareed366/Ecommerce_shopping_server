const express = require("express")
const router = express.Router()
const auth = require("../middleware/authoriztion")
const {check,validationResult} = require('express-validator')
const Profile = require('../models/Profile')
const Product = require('../models/Products')
const User = require('../models/User')

router.get("/:id",async (req,res)=>{
  try {
    const profile =await Profile.findOne({userId:req.params.id})
    if(!profile){
      return res.status(400).json({msg:"there is no such profile"})
    }
    res.json(profile)
  } catch (err) {
    res.status(500).send("servern error")
  }
})

router.post('/',[
  auth,
  [
    check('address','address is required').not().isEmpty(),
    check('bio','bio is required').not().isEmpty()
  ],
],
async (req,res)=>{
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()})
  }
    const {website,address,bio,facebook,instagram,twitter,youtube,linkedin} = req.body
    const profileData = {}
    profileData.socialMedia = {}
    profileData.userId = req.user.id
    if(website) profileData.website = website
    if(address) profileData.address = address
    if(bio) profileData.bio = bio
    if(facebook) profileData.socialMedia.facebook = facebook
    if(instagram) profileData.socialMedia.instagram = instagram
    if(twitter) profileData.socialMedia.twitter = twitter
    if(youtube) profileData.socialMedia.youtube = youtube
    if(linkedin) profileData.socialMedia.linkedin = linkedin

    try {
      let profile = await Profile.findOne({userId:req.user.id})
      if(profile){
        profile = await Profile.findOneAndUpdate({userId:req.user.id},{$set:profileData},{new:true})
        return res.json(profile)
      }
     profile = new Profile(profileData)
      await profile.save()
      res.json(profile)
    } catch (e) {
      res.status(500).send("server error")
    }
})

router.delete("/",auth,async (req,res)=>{
  try {
    //await Product.findByIdAndRemove(product._id) ->it will also do same
    const products = await Product.find({userId:req.user.id})
    products.forEach(async (product) =>{
      await Product.findOneAndRemove({_id:product._id})
    })
    await Profile.findOneAndRemove({userId:req.user.id})
    await User.findOneAndRemove({_id:req.user.id})
    res.json({msg:"user details completely deleted"})
  } catch (e) {
      res.status(500).send("servern error")
  }
})




module.exports = router
