const express = require("express")
const router = express.Router()
const Product = require("../models/Products")
const Cart = require("../models/Cart")
const auth = require("../middleware/authoriztion")
const Payment = require("../models/Payment")
const stripe = require("stripe")("sk_test_51KJDSEHtmqI2AWakUDE0fYjvSatSBYWxR5xVL6poRZdeVaVewiQZok7CGN1g6DBozfA5E0wzLmExr2MDvuEb59qV00ujM19Oxb")
router.post('/',auth,async (req,res)=>{

  try {
    const {cart,total,token} =req.body;
    const {card} = token
    const shippingAddress = {
      address1:card.address_line1,
      address2:card.address_line2,
      city:card.address_city,
      country:card.address_country,
      state:card.address_state,
      zip:card.address_zip,
    }
    stripe.charges.create({
      amount : total,
      currency : "USD",
      receipt_email : token.email,
      source : req.body.token.id,
      description : `payment for the purchase ${cart.products.lenght} items from the shop`,
    },async (err,charge)=>{
      console.log("debuyfd");
      console.log(err);
      if(err){
        return res.send({status:400,err})
      }
      console.log(charge);
      console.log(charge.status);
      if(charge && charge.status === "succeeded"){
              console.log("debug");
              const authoriztion ={
                ...charge.payment_method_details,
                receipt:charge.receipt_url,
                token:token.id,
              }
                console.log("debug1");
                console.log(authoriztion);
              const context = {
                authoriztion,
                userId:req.user.id,
                cartId:cart._id,
                reference:charge.id,
                transaction:charge.balance_transaction,
                shippingAddress,
              }
              let payment = new Payment(context)

              await payment.save()
              await Cart.findOneAndUpdate({_id:cart._id},{$set:{fulfilled:true}},{new:true})
              const theCart = await Cart.findById({_id:cart._id})

              theCart.products.forEach(async (product)=>{
                let productDetails = await Product.findById({_id:product})
                const qty = Number(productDetails.quantity) - 1
                await Product.findOneAndUpdate({_id:product},{$set:{quantity:qty}},{new:true})
              })
      res.send({status:200})
    }
    })
  } catch (e) {
    res.sendStatus(500)
  }

})





module.exports =router
