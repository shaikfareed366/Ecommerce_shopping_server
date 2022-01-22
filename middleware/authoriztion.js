const jwt = require("jsonwebtoken")

module.exports = function(req,res,next){
  const token = req.header("x-auth-token")
  if(!token){
    return res.status(401)
  }
  try{
    const decode = jwt.verify(token,'ecomerceSecret')
    req.user = decode.user;
    next()
  }catch(error){
    res.status(401)
  }
}
