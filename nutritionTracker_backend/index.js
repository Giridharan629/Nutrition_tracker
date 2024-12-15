const express = require("express")
const app = express()
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require('dotenv').config();

const cors = require("cors")

//verify token 

const verifyToken = require("./components/verifyToken")

// importing models

const userModel = require("./models/userModel")
const foodModel = require("./models/foodModel")
const trackingModel = require("./models/trackingModel")

app.use(express.json())

// Configure CORS middleware
app.use(cors({
    origin: process.env.FRONTEND_ORIGIN, // Allow this specific origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true // If using cookies or authentication
}));

// Handle preflight requests explicitly (optional, for clarity)
app.options('*', cors());




mongoose.connect(process.env.MONGO_DB).then((res)=>{
    console.log("db connection is successfull!")
}).catch((err)=>{
    console.log(err)
})

// const user = {
//     name : "giri",
//     password: "giri",
//     age:23,
//     email:"giri@gmail.com"
// }


app.post("/register",(req,res)=>{


    let user = req.body

    bcrypt.genSalt(10,(err,salt)=>{
        if(!err){
            bcrypt.hash(user.password,salt,async (err,hpass)=>{
                if(!err){
                    user.password = hpass;
                    try{
                        const userDetail = await userModel.create(user)
                        console.log(user)
                        res.status(201).send({message:"user created successfully"})
                    }catch(err){
                        console.log(err)
                        res.send({message:"some error"})
                    }
                }else{
                    res.send({message:"some problem in hpass"})
                }
            })
        }else{
            res.send({message:"some problem in senSalt"})
        }
    })

})


app.post("/login",async (req,res)=>{
    const user = req.body

    // userModel.find().then((d)=>{
    //     console.log(d)
    // }).catch()
    try{
        let userCred = await userModel.findOne({email:user.email})
        // console.log(userCred.id)
        if(userCred!==null){
            bcrypt.compare(user.password,userCred.password,(err,success)=>{
                if(success==true){
                    jwt.sign({email:userCred.email},"nutrition",(err,token)=>{
                        if(!err){
                            res.status(200).send({message:"login successfull",name:userCred.name,id:userCred.id,token:token})
                        }else{
                            res.send({message:"some probem in token creation"})
                        }
                    })
                }else{
                    res.status(403).send({message:"incorrect password"})
                }

            })
        }else{
            res.status(404).send({message:"user not found"})
        }
    }catch(err){
        console.log(err)
        res.send({message:"some problem in login"})
    }
})

// const foods = {
//     name: "griled chicken",
//     quantity: "150 grams",
//     calories: 280,
//     protein: 30,
//     carbohydrates: 0,
//     fats: 18,
//   };

app.get("/foods",verifyToken,async (req,res)=>{

    try{
        const foods = await foodModel.find()
        res.send(foods)
    }catch(err){
        console.log(d)
        res.send(d)
    }
})


app.get("/foods/:name",verifyToken,async (req,res)=>{

    let foodName = req.params.name

    try{
        const food = await foodModel.find({name:{$regex:foodName,$options:"i"}})
        res.send(food)
    }catch(err){
        res.status(500).send({message:"there is some error in fetching data"})
    }

})

app.post("/track",verifyToken,(req,res)=>{
    const info = req.body;
    try{
        let data = trackingModel.create(info)
        res.status(201).send({message:"tracking food added"})
    }catch(err){
        res.status(500).send({message:"there is some error in adding data"})
    }
})

app.get("/track/:userId/:date",verifyToken,async(req,res)=>{
    const userId = req.params.userId
    const date = new Date(req.params.date).toLocaleDateString()
    console.log(req.params,date)

    try{
        const data = await trackingModel.find({userId:userId,eatenDate:date}).populate('userId').populate('foodId')
        if(data.length >0){
            res.send(data)
        }else(
            res.send({message:"no matches found"})
        )
    }catch(err){
        res.status(500).send({message:"there is some error in fetching data"})
    }
})


app.listen(8000)