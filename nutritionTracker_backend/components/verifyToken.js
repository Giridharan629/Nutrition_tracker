const jwt = require("jsonwebtoken")

function verifyToken(req,res,next){

    if(req.headers.authorization !== undefined){
        const token = req.headers.authorization.split(" ")[1]
        jwt.verify(token,"nutrition",(err,data)=>{
            if(!err){
                next()
            }else(
                // console.log(err)
                res.status(403).send({message:"invalid token"})
            )
        })

    }
    else{
        res.status(401).send({message:"no token found"})
    }
}

module.exports = verifyToken;