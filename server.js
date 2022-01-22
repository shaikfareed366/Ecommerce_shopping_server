const express = require("express")
const cors = require("cors")
const app = express()
const morgan = require("morgan")
const connectDB = require("./config/db")
const port = process.env.PORT || 5000;

connectDB();
app.use(cors())
app.use(morgan("dev"))
app.use(express.json({extended:false}))
app.use("/api/users",require("./routes/userApi"))
app.use("/api/auth",require("./routes/AuthApi"))
app.use("/api/products",require("./routes/productsApi"))
app.use("/api/profile",require("./routes/profileApi"))
app.use("/api/cart",require("./routes/cartApi"))
app.use("/api/payment",require("./routes/paymentApi"))
app.get("/",(req,res)=>{
  res.send('welcome')
})
app.listen(port,()=>{
console.log(`it is listening port ${port}`);
})
