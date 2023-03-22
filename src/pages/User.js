/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import Navigation from '../components/Navigation';

const User = () => {
  const [userCookieData, setUserCookieData] = useState(null); // User cookie data
  const [userData, setUserData] = useState([]); // Data retrieved from backend, store user data
  const [reload, setReload] = useState(false); // State variable to trigger reloading of user data from backend
  const [isEditingAllergies, setIsEditingAllergies] = useState(false); // State variable to indicate if user is editing allergies data
  const [isEditingPeople, setIsEditingPeople] = useState(false); // State variable to indicate if user is editing number of people data
  const [editAllergiesContent, setEditAllergiesContent] = useState('');// Content of allergies text area when user is editing allergies data
  const [editPeopleContent, setEditPeopleContent] = useState(''); // Content of people number input when user is editing number of people data

  // Use effect hook to get user data from API Rest (backend)
  useEffect (() => {
    const cookie = Cookies.get('userData');
    if (cookie) {
      setUserCookieData(JSON.parse(Cookies.get('userData')))
      // Fetch user data from backend using email stored in cookie
      axios
        .get('https://api-rest-quai-antique.herokuapp.com/index.php')
        .then((res) => {
          setUserData(res.data.users.find(u => u.email === userCookieData.email));
        })
        .catch((e) => {
          console.log(e);
          setReload(true)
        })
    } else {
      // If no user data cookie found, redirect to login page
      window.location.href = 'https://gaetan-hts.github.io/quai-antique/*'}
  },[reload])

  // Function to handle logout button click
  const handleClick = () => {
    Cookies.remove("userData");
    window.location.href = 'https://gaetan-hts.github.io/quai-antique/se-connecter'
  };

  // Function to handle editing of allergies data
  const handleEditAllergies = () => {
    const data = {
      email: userData.email,
      allergies: editAllergiesContent ? editAllergiesContent : userData.allergies,
    }

    // Update allergies data in backend using PUT request
    axios
      .put('https://api-rest-quai-antique.herokuapp.com/editAllergies.php', data)
      .catch(error => {console.log(error)})

    setIsEditingAllergies(false);
  };

  // Function to handle editing of number of people data
  const handleEditPeople = () => {
    const data = {
      email: userData.email,
      people: editPeopleContent ? editPeopleContent : userData.people,
    }

    // Update number of people data in backend using PUT request
    axios
      .put('https://api-rest-quai-antique.herokuapp.com/editPeople.php', data)
      .catch(error => {console.log(error)})
      
    setIsEditingPeople(false);
  };


  return (
    <div className='user-page'>
      <Navigation />
      <div className="user-container">
        <h2>Informations personnelles</h2>
        <ul>
          <li>Prénom : <p>{userData && userData.name}</p></li>
          <li>Nom : <p>{userData && userData.surname}</p></li>
          <li>Email : <p>{userData && userData.email}</p></li>
          <li>Nombre de couverts : 
          {isEditingPeople ? <input type="number" min="1" max="10" placeholder={userData.people} onChange={(e) => setEditPeopleContent(e.target.value)}/> : <p>{editPeopleContent ? editPeopleContent : userData.people}</p>}
          {isEditingPeople ? <i onClick={() => handleEditPeople()}  className="fa-solid fa-pen-to-square"></i> :
            <i onClick={() => setIsEditingPeople(true)} className="fa-regular fa-pen-to-square"></i>}
          </li>
          <li>Allergies : 
            {isEditingAllergies ? <textarea placeholder={userData.allergies} onChange={(e) => setEditAllergiesContent(e.target.value)}></textarea> : <p>{editAllergiesContent ? editAllergiesContent : userData.allergies}</p>}
            {isEditingAllergies ? <i onClick={() => handleEditAllergies()}  className="fa-solid fa-pen-to-square"></i> :
            <i onClick={() => setIsEditingAllergies(true)} className="fa-regular fa-pen-to-square"></i>}
          </li>
        </ul>
        <button onClick={handleClick}>Déconnexion</button>
      </div>
      <div className="bg-img-user"></div>
      <Footer />
    </div>
  );
};

export default User;