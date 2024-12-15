import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { userContext } from '../context/UserContext'
import './home.css'

const home = () => {

  const loggedData = useContext(userContext)
  const [foodItem, setFoodItem] = useState([]);
  const [foodItems, setFoodItems] = useState([])
  const [food,setFood]=useState(null);
  const [oldFood, setOldFood] = useState(null)
  const [inputText,setInputText]= useState(undefined)
  const [trackFoodDetails,setTrackFoodDetails] = useState({})

  let [quantity,setQuantity] = useState(1)

  let navigate = useNavigate()

  //fot getting single food item

  function searchFood(event){

    if(event.target.value!==""){
      fetch(`http://localhost:8000/foods/${event.target.value}`,{
        method:"GET",
        headers:{
          "Authorization":`Bearer ${loggedData.loggedUser.token}`
        }
      }).then((Response)=>Response.json())
      .then((data)=>{
        console.log(data)
          setFoodItem(data)
          setFoodItems(data)
      }).catch((err)=>{
        console.log(err)
      })
    }
    else{
      setFoodItem([])
    }

  }

  //for getting all food items
  useEffect(()=>{
    fetch(`http://localhost:8000/foods`,{
      method:"GET",
      headers:{
        "Authorization":`Bearer ${loggedData.loggedUser.token}`
      }
    }).then((Response)=>Response.json())
    .then((data)=>{
      // console.log(data)
        setFoodItems(data)
    }).catch((err)=>{
      console.log(err)
    })

    
  },[])


  


  return (
    <>
      <div className='home'>
          <div className="header">
            <Link to="/list " className='track-btn'> track</Link>
            <input className='search-box' onChange={searchFood} type="text" placeholder="Search food here" value={inputText} />
            <button className='logout-btn' onClick={()=>{
              localStorage.removeItem("nutrify-tracker")
              navigate("/login")
              }}>Logout</button>
          </div>

            {
              foodItem.length!==0 ?(
                <div className="food-items">
                  {
                    foodItem.map((item)=>{
                      return (
                        <p className='item' onClick={()=>{
                          console.log(item)
                          setInputText(item.name)
                          setFood(item)
                          setOldFood(item)
                          console.log(foodItem)
                          setFoodItem([])
                        }} key={item._id}>{item.name}</p>
                      )
                    })
                  }
                </div>
              ):null
            }

          {food!==null?
          <>
              <div className="food">
                <div className="food-image">
                  <img src={food.image_url} alt="Image not available" />
                  
                </div>
                <div className="food-details">
                  <div className="foodHeading">
                    <h2 className="name">{food.name}</h2>
                    <div className="quantity"><span>Quantity :</span> {quantity} {food.quantity_type}</div>
                  </div>
                  <div className="details">
                    <div className="details-div">
                      <h3>Calories</h3>
                      <p>{food.calories}g</p>
                    </div>
                    <div className="details-div">
                      <h3>Carbohydrates</h3>
                      <p>{food.carbohydrates}g</p>
                    </div>
                    <div className="details-div">
                      <h3>Fats</h3>
                      <p>{food.fats}g</p>
                    </div>
                    <div className="details-div">
                      <h3>Protein</h3>
                      <p>{food.protein}g</p>
                    </div>
                  </div>

                    <div className="tracking-div">

                      <div className="changeQuantity">
                      <input
                        type="number"
                        placeholder="Enter quantity"
                        onChange={(e) => {
                          const inputQuantity = Number(e.target.value);
                          setQuantity(inputQuantity);

                          if (inputQuantity <= 0) {
                            setQuantity(1);
                            return;
                          }

                          let newFood;

                          if (oldFood.quantity_type !== "grams") {
                            newFood = {
                              calories: oldFood.calories * inputQuantity,
                              carbohydrates: oldFood.carbohydrates * inputQuantity,
                              fats: oldFood.fats * inputQuantity,
                              protein: oldFood.protein * inputQuantity,
                              image_url: oldFood.image_url,
                              name: oldFood.name,
                              quantity: inputQuantity,
                              quantity_type: oldFood.quantity_type,
                              _id: oldFood._id,
                            };
                          } else {
                            newFood = {
                              calories: oldFood.calories * inputQuantity,
                              carbohydrates: oldFood.carbohydrates * inputQuantity,
                              fats: oldFood.fats * inputQuantity,
                              protein: oldFood.protein * inputQuantity,
                              image_url: oldFood.image_url,
                              name: oldFood.name,
                              quantity: oldFood.quantity * inputQuantity,
                              quantity_type: oldFood.quantity_type,
                              _id: oldFood._id,
                            };
                          }

                          setFood(newFood);
                          console.log("Updated food:", newFood);
                        }}
                      />

                      </div>
                      <button className='trackFood-btn'onClick={()=>{

                        // console.log(food)

                        let setTrackFoodDetails= {
                          "userId": loggedData.loggedUser.id,
                          "foodId": food._id,
                          "details": {
                            "calories":food.calories,
                            "carbohydrates":food.carbohydrates,
                            "fat":food.fats,
                            "protien":food.protein
                          },
                          "quantity": quantity,
                          "quantity_type": food.quantity_type
                        }

                        // console.log(food._id)
                        console.log(setTrackFoodDetails)

                          fetch("http://localhost:8000/track",{
                            method:"POST",
                            body: JSON.stringify(setTrackFoodDetails),
                            headers:{
                              "Authorization": `Bearer ${loggedData.loggedUser.token}`,
                              "content-type": "application/json"
                            }
                          }).then((response)=>{
                            console.log(response)

                            if(response.status === 201){
                              alert("food tracked successfully")
                            }
                            return response.json()
                          })
                          .then((result)=>{
                            console.log(result)
                          })
                          .catch((err)=>{
                            console.log(err)
                          })

                      }}>Track Food</button>

                  </div>
                </div>

              
              </div>
              
              <button className='back' onClick={()=>{
                setFood(null)
                navigate("/home")
              }}>back</button>
          </>
          : 
          foodItems.map((item=>{
            
            return(
              <div key={item._id} className="food" onClick={()=> {
                setFood(item)
                setOldFood(item) 
                console.log(item)
                }}>
                <div className="food-image">
                  <img src={item.image_url} alt="Image not available" />
                  
                </div>
                <div className="food-details">

                  <div className="foodHeading">
                    <h2 className="name">{item.name}</h2>
                    <div className="quantity"><span>Quantity :</span> {item.quantity} {item.quantity_type}</div>
                  </div>
                  <div className="details">
                    <div className="details-div">
                      <h3>Calories</h3>
                      <p>{item.calories}g</p>
                    </div>
                    <div className="details-div">
                      <h3>Carbohydrates</h3>
                      <p>{item.carbohydrates}g</p>
                    </div>
                    <div className="details-div">
                      <h3>Fats</h3>
                      <p>{item.fats}g</p>
                    </div>
                    <div className="details-div">
                      <h3>Protein</h3>
                      <p>{item.protein}g</p>
                    </div>
                  </div>

                </div>
          
              </div>

            )
          }))
        }
          
      </div>
    </>
  )
}

export default home