import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { userContext } from "../context/UserContext";
import "./list.css";

const List = () => {
  const loggedData = useContext(userContext);
  const [trackedData, setTrackedData] = useState([]);

  let [date, setDate] = useState(new Date())

  useEffect(() => {
    // console.log("token is ", loggedData.loggedUser.token);
    fetch(`http://localhost:8000/track/${loggedData.loggedUser.id}/${date.getMonth()+1}-${date.getDate()}-${date.getFullYear()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${loggedData.loggedUser.token}`,
      },
    })
      .then((Response) => Response.json())
      .then((data) => {
        // console.log("before change ", data);

        // Transform the data to calculate the required fields and IST time
        const transformedData = data.map((item) => {
          const istTime = new Date(
            new Date(item.createdAt).toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata",
            })
          );

          // Adjust the quantity for "grams"
          const adjustedQuantity =
            item.foodId.quantity_type === "grams"
              ? item.foodId.quantity * item.quantity
              : item.quantity;

          return {
            ...item,
            foodId: {
              ...item.foodId,
              calories: item.foodId.calories * item.quantity,
              carbohydrates: item.foodId.carbohydrates * item.quantity,
              fats: item.foodId.fats * item.quantity,
              protein: item.foodId.protein * item.quantity,
              quantity: adjustedQuantity, // Use adjusted quantity
            },
            istTime, // Add IST time to the transformed item
          };
        });

        setTrackedData(transformedData);
      })
      .catch((err) => {
        setTrackedData([])
        // console.log(err);
      });


  }, [date]);


  return (
    <div className="list">

      <input type="date" onChange={(event)=>{
        setDate(new Date(event.target.value))
        console.log("current date", new Date())
        console.log(date)
      }} />

      {trackedData.length > 0 ? (
        trackedData.map((item) => {
          return (
            <div key={item.details._id} className="food">
              <div className="food-image">
                <img src={item.foodId.image_url} alt="Image not available" />
              </div>
              <div className="food-details">
                <div className="foodHeading">
                  <h2 className="name">{item.foodId.name}</h2>
                  <div className="quantity">
                    <span>Quantity :</span> {item.foodId.quantity}{" "}
                    {item.foodId.quantity_type}
                  </div>
                </div>
                <div className="details">
                  <div className="details-div">
                    <h3>Calories</h3>
                    <p>{item.details.calories}</p>
                  </div>
                  <div className="details-div">
                    <h3>Carbohydrates</h3>
                    <p>{item.details.carbohydrates}</p>
                  </div>
                  <div className="details-div">
                    <h3>Fats</h3>
                    <p>{item.details.fat}</p>
                  </div>
                  <div className="details-div">
                    <h3>Protein</h3>
                    <p>{item.details.protien}</p>
                  </div>
                  <div className="details-div">
                    <h3>Time :</h3>
                    <p>{item.istTime.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="noFood">
          <h1>No foods you are eaten this date</h1>
        </div>
      )}
      
      <Link className="back"  to={"/home"}>back</Link>

    </div>
  );
};

export default List;
