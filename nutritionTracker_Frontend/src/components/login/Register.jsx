import { React, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";

const Register = () => {

    const navigate = useNavigate();  

    const [userDetails,setUserDetails] = useState({
      name:"",
      password:"",
      age:"",
      email:""
    })

    function storeDetails(event){
            setUserDetails((prev)=>{
                return {...prev,[event.target.name]:event.target.value}
            })

    }

    const [message,setMessage]=useState({
      type:"invisible",
      data:""
    })

    function viewDetails(event){
        event.preventDefault();

        console.log(userDetails)

        fetch("http://localhost:8000/register",{
        method:"post",
        body:JSON.stringify(userDetails),
        headers:{
          "content-type":"application/json"
        }
        }).then((res)=>{
          console.log(res)

          if(res.status == 200){
            setMessage({type:"error",data:"Enter all details correctly"})

            console.log("this is inside")
          }else if (res.status == 201){
            setMessage({type:"success",data:"user created successfully"})
            // alert("user create successfully")
          }

          return res.json();
        }).then((data)=>{

          console.log(data)
          

          setUserDetails({
            name:"",
            password:"",
            age:"",
            email:""
          })
          if(data.message == "user created successfully"){
            setTimeout(() => {
              navigate("/login");
            }, 2000);
          }


        }).catch((err)=>{
          console.log(err)
        })
    }
    
    

  return (
    <div className="container">
      <form action="" className="form">
        <h1>Register</h1>

        <div className="input-container">
          <input type="text" onChange={storeDetails} placeholder="UserName" value={userDetails.name} name="name" required />
          <input type="password" onChange={storeDetails} placeholder="Password" value={userDetails.password} name="password" required />
          <input type="text" onChange={storeDetails} placeholder="Age" value={userDetails.age} name="age" required />
          <input type="email" onChange={storeDetails} placeholder="Email" value={userDetails.email} name="email" required />
          <button type="submit" onClick={viewDetails}>Register</button>
        </div>
        <p id={message.type}>{message.data}</p>

        <p>
          Already have an account ? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
