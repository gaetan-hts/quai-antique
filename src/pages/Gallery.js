import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import Navigation from '../components/Navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import Card from '../components/Card';
import { NavLink } from 'react-router-dom';

const Gallery = () => {
  const [userCookieData, setUserCookieData] = useState(null); // User cookie data
  const [pictureTitle, setPictureTitle] = useState(''); // Picture title for admin panel (add new picture to the gallery)
  const [pictureUrl, setPictureUrl] = useState(''); // Picture url for admin panel (add new picture to the gallery)
  const [pictures, setPictures] = useState([]); // Data retrieved from backend, store every picture to map on it

// Use effect hook to get user cookie data
  useEffect (() => {
    const cookie = Cookies.get('userData');
    if (cookie) {
      setUserCookieData(JSON.parse(Cookies.get('userData')))
    }
  }, [])

// Use effect hook to get picture data from API Rest (backend)
  useEffect (() => {
    axios
      .get('https://api-rest-quai-antique.herokuapp.com/index.php')
      .then((res) => setPictures(res.data.pictures))
      .catch(error => {console.error(error)});
  },[])

// Function to handle form submit for adding a new picture
const handleSubmit = (e) => {
  e.preventDefault();
  const data = {
    title: pictureTitle,
    url: pictureUrl
  }

  // Check that both fields are filled
  if (!data.title || !data.url) {
    alert("Veuillez remplir tous les champs du formulaire.");
    return;
  }
  // Check that the URL is valid
  const urlPattern = /^https?:\/\/\S+$/i;
  if (!urlPattern.test(data.url)) {
    alert("L'URL doit commencer par 'http://' ou 'https://' et ne doit contenir aucun espace.");
    return;
  }

  axios
    .post('https://api-rest-quai-antique.herokuapp.com/addPicture.php', data)
    .then((res) => {
      console.log(res)
      if (res.data.success) {
        alert("Photo ajoutée avec succès.");
      } else {alert("Echec de l'ajout.")}
    })
    .catch(error => {console.error(error)});
}


  return (
    <div className='gallery-page'>
      <Navigation />
      <div className="gallery-container">
          {pictures && pictures.map((picture) =>(
            <Card key={picture.id} picture={picture} admin={userCookieData ? userCookieData.isAdmin : ""} id={picture.id}/>
          ))}
      </div>

      <NavLink
          to="/reserver" >
          <button className='booking-table'>RESERVER UNE TABLE <i className="fa-sharp fa-solid fa-arrow-pointer"></i></button>
      </NavLink>

      {userCookieData && userCookieData.isAdmin ?
      <div className="admin-form-container">
        <h3>Ajouter une photo à la galerie</h3>
        <form>
          <input type="text" placeholder='Titre de la photo' onChange={(e) => setPictureTitle(e.target.value)} required/>
          <input type="text" placeholder='Url de la photo' onChange={(e) => setPictureUrl(e.target.value)} required/>
          <button onClick={handleSubmit}>Ajouter</button>
        </form>
      </div>
      
      : <div></div>}
      <Footer />
    </div>
  );
};

export default Gallery;