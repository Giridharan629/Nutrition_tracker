import React, { useState,useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { userContext } from '../context/UserContext';

const Login = () => {

    const Loggeduser = useContext(userContext)
        
    const navigate = useNavigate();

    const [userDetails,setUserDetails] = useState({
        email:"",
        password:""
    })

    const [message,setMessage]= useState({
        type:"invisible",
        msg:""
    })


    useEffect(()=>{
        console.log(Loggeduser)
    },[])


    function storeDetails(event){
            setUserDetails((prev)=>{
                return {...prev,[event.target.name]:event.target.value}
            })

    }

    function submitDetails(event){
        event.preventDefault();

        console.log(userDetails)

        fetch("http://localhost:8000/login",{
            method:"POST",
            body:JSON.stringify(userDetails),
            headers:{
                "content-type":"application/json"
            }
        }).then((res)=>{
            
            console.log(res)
            if(res.status == 404){
                setMessage({type:"error",msg:"Email doesn't exist"})
            }else if(res.status == 403){
                setMessage({type:"error",msg:"password is incorrect"})
            }

            setTimeout(() => {
                setMessage({type:"success",msg:""})
            }, 5000);

            return res.json()
        })
        .then((data)=>{
            console.log("logged data is : ",data)
            if(data.token!==undefined){
                localStorage.setItem("nutrify-tracker",JSON.stringify(data))
                Loggeduser.setLoggedUser(data)
                navigate("/home")
            }

        }).catch((err)=>console.log(err))
    }


  return (
    <div className='container'>
        <form action="" className='form'>

            <h1>Login</h1>

            <div className="input-container">
                    <input type="email" onChange={storeDetails} value={userDetails.email} placeholder='Email' name='email' required />
                    <input type="password" onChange={storeDetails} value={userDetails.password} placeholder='Password' name='password' required />
                <button type="submit" onClick={submitDetails}>Login</button>
            </div>

            <p id={message.type}>{message.msg}</p>
        
            <p>Don't have an account ? <Link to="/register">Register</Link></p>

        </form>
    </div>
  )
}

export default Login