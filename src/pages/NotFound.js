import React from 'react';
import { NavLink } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className='not-found-page'>
      <div className='not-found-container'>
        <h2>Erreur 404</h2>
        <NavLink
            to="/" >
            <button className='back-home'>Retourner à la page d'accueil <i className="fa-sharp fa-solid fa-arrow-pointer"></i></button>
        </NavLink>
        </div>
    </div>
  );
};

export default NotFound;