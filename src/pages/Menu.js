import React, { useState, useEffect } from 'react';
import axios from "axios";
import Footer from '../components/Footer';
import icPlate from "../assets/img/ic-plate.png";
import Navigation from '../components/Navigation';

// Available categories for the dishes (radio menu)
const radios = ["entrée", "plat", "dessert", "vin", "menu"];

const Menu = () => {
  const [dishesData, setDishesData] = useState([]); // Data retrieved from backend, store every dishes to map on it
  const [selectedRadio, setSelectedRadio] = useState(radios[0]); // State for the selected category radio button
  

// Fetch dishes data from API on component mount
  useEffect (() => {
    axios
      .get('https://api-rest-quai-antique.herokuapp.com/index.php')
      .then ((res)=> setDishesData(res.data.dishes))
      .catch(error => {console.log(error)})
  },[])


  return (
    <div className='menu-page'>
      <Navigation />
      <h2>La carte</h2>
      <img src={icPlate} alt="icon-plate"/>
      <ul className='dishes-menu'>
      {radios.map((category) => (
          <li key={category}>
            <input
              type="radio"
              id={category}
              name="categoryRadio"
              checked={category === selectedRadio}
              onChange={(e) => setSelectedRadio(e.target.id)}
            />
            <label className={category === selectedRadio ? "selected" : ""} htmlFor={category}>{category}</label>
          </li>
        ))}
      </ul>
    <div className="dishes-container">
    {dishesData && dishesData
      .filter((dish) => dish.category.includes(selectedRadio))
      .map((dish) => (
            <div className="article" key={dish.name}>
              <h3>{dish.name}</h3>
              <p>{dish.description}</p>
              <p>{dish.price} €</p>
            </div>
          ))}
    </div>
    <div className="bg-img"></div>
      <Footer />
    </div>
  );
};

export default Menu;