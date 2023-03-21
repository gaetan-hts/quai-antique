import React from 'react';
import Footer from '../components/Footer';
import Navigation from '../components/Navigation';
import icPlate from "../assets/img/ic-plate.png";
import avatarOne from "../assets/img//chef-avatar3.jpg"
import avatarTwo from "../assets/img//avatar-sommelier.jpg"
import { NavLink } from 'react-router-dom';

const Home = () => {


  return (
    <div className='home-page'>
      <Navigation />
      <div className='header-text'>
        <h2>Welcome to</h2>
        <h1>QUAI ANTIQUE</h1>
        <img src={icPlate} alt="plate-icon" />
        <h6>Des ingrédients frais pour des plats exceptionnels</h6>
        <NavLink
          to="/reserver">
          <button>RESERVER</button>
        </NavLink>
    </div>
    <section className='section1'>
      <div className="intro-text">
        <h2>Découvrez</h2>
        <h3>NOTRE RESTAURANT</h3>
        <img src={icPlate} alt="plate-icon" />
        <p>
        Situé dans le centre historique de Chambery, le Quai Antique est un restaurant gastronomique qui offre une expérience culinaire haut de gamme. Avec des plats créatifs et des ingrédients frais, notre chef vous propose un voyage culinaire à travers les saveurs de la région. Nous vous invitons à venir découvrir notre cuisine inventive dans un cadre élégant et convivial.
        </p>
        <img src={avatarOne} alt="chef resto" />
        <h4>Arnaud Michant</h4>
        <h5>CHEF CUISINIER</h5>
      </div>
      <div className="intro-pic"></div>
    </section>
    <section className='section2'>
      <div className="intro-pic"></div>
      <div className="intro-text">
        <h2>Déguster</h2>
        <h3>NOS VINS</h3>
        <img src={icPlate} alt="plate-icon" />
        <p>
        En tant que sommelier du restaurant, je suis fier de vous proposer une sélection de vins français de qualité supérieure. Je prendrai le temps de comprendre vos préférences et de vous guider dans le choix de la parfaite bouteille pour accompagner votre repas. Laissez-moi vous faire découvrir les arômes subtils et les saveurs uniques des vins de notre région, ainsi que les grands crus prestigieux de notre carte.
        </p>
        <img src={avatarTwo} alt="chef resto" />
        <h4>Arthur Bellanger</h4>
        <h5>SOMMELIER</h5>
      </div>
    </section>
      <Footer />
    </div>
  );
};

export default Home;