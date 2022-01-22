const express = require("express")
const router = express.Router()
const {check,validationResult}=require("express-validator")
const auth = require("../middleware/authoriztion")
const Product = require("../models/Products")
router.get("/",async (req,res)=>{
  try {
    const products = await Product.find()
    res.json(products)
  } catch (e) {
    res.status(404)
  }
})

router.get("/:id",async (req,res)=>{
  try {
    const products = await Product.findById(req.params.id)
    if(!products){
      return res.status(404).json({msg:"product was not found"})
    }
    res.json(products)
  } catch (e) {
    res.status(500).send("server error")
  }
})

router.post("/",
[
auth,
 [
  check("name","name is required").not().isEmpty(),
  check("description","description is required").not().isEmpty(),
  check("category","category is required").not().isEmpty(),
  check("price","price is required").not().isEmpty(),
  check("quantity","quantity is required").not().isEmpty(),
 ]
],async (req,res)=>{
  const err = validationResult(req)
  if(!err.isEmpty()){
    return res.status(404).json({errors:err.array()})
  }
  try {
    const {name,description,category,price,brand,quantity} = req.body
    const newProduct = new Product({
      userId:req.user.id,
      name,
      description,
      category,
      price,
      brand,
      quantity
    })
  const product = await newProduct.save()
  return res.status({product})
  } catch (e) {
      res.status(404)
  }

})

router.get("/instructors/:id",auth,async (req,res) => {
  try {
    const products = await Product.find({userId:req.params.id})
    res.json(products)
  } catch (e) {
      res.status(500).send("server error")
  }
})



module.exports = router
