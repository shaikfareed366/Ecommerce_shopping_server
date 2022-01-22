const express = require("express")
const router = express.Router()
const Product = require("../models/Products")
const Cart = require("../models/Cart")
const auth = require("../middleware/authoriztion")
router.get("/",auth,async (req,res)=>{
  try {
      const userId = req.user.id
      const carts = await Cart.find({userId})
      if(carts.lenght == 0){
        return res.send({products:[]})
      }
      let retrievedCart;
      carts.forEach((cart) => {
        if(!cart.fulfilled){
            retrievedCart = cart
        }
      });
      let products = []
      let result
      if(retrievedCart) {
        products = retrievedCart.products.map(async product => await Product.findById({_id:product}))
        products = await Promise.all(products)
        result = {...retrievedCart.toJSON(),products}
      }
      res.send(result)
  } catch (err) {
      res.send(500)
  }
})

router.put("/:id",auth,async (req,res)=>{
  
  try {
    const cartId = req.params.id;
    const product = req.body.product;
    const cart = await Cart.update(
      {_id:cartId},
      {$pullAll : {products:[product]}}
    )
    res.send({cart})
  } catch (e) {
    res.send(500)
  }
})


router.post("/",auth,async (req,res)=>{
  try {
    const userId =req.user.id;
    const {products} = req.body;

    let cart,unfulfiledCart;
    const carts = await Cart.find({userId})
    const hasValidCart = carts.reduce((acc,value)=>{
      if(!value.fulfilled){
        unfulfiledCart = value
      }
      return acc && value.fulfilled;
      //value.fulfilled is true and fyi -> acc is previous value and value is current value
    },true)
    //hasValidCart is having true means it has no unfulfiledCart items

    if(hasValidCart){
      console.log(products);
      cart = new Cart({userId,products})
      cart = await cart.save()
    }else {
      const stringProduct = [
        ...unfulfiledCart.products,
        ...products,
      ].map(product => product.toString())
      const newProducts = Array.from(new Set(stringProduct))
      cart = await Cart.findByIdAndUpdate({_id:unfulfiledCart._id},{products:newProducts})
    }
    let value = cart.products.map(async(id)=> await Product.findById(id))
    value = await Promise.all(value)
    res.send({...cart.json(),producs:value})
  } catch (e) {

  }
})





module.exports = router
