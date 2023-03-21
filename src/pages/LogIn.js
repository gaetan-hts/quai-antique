import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import axios from 'axios';
import Cookies from 'js-cookie';


const LogIn = () => {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
    people: "",
    allergies: ""
  }); // Form data for log-in or sign-in using object destructuring and set initial state for all form fields
  
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/; // regex for email 
  const passwordRegex =/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{}:;"\\|,.<>/?])[A-Za-z\d!@#$%^&*()_+\-=[\]{}:;"\\|,.<>/?]{7,}$/; // regex for password (7 carac, 1 uppercase, 1 number, 1 carac spe)

// Function to handle the sign-in form submission, checks each field and alerts the corresponding message if a field is not valid, then creates a new user
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    let isValid = true;
    if (!emailRegex.test(formData.email)) {
        alert("Merci de renseigner une adresse email valide.");
        isValid = false;
    }
    if (!passwordRegex.test(formData.password)) {
      alert("Merci de renseigner un mot de passe contenant au moins : 7 caractères dont au moins : 1 majuscule, 1 chiffre et 1 caractères spécial.");
        isValid = false;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("Merci de renseigner deux mots de passe identiques.");
        isValid = false;
    }
    if (isValid) {
      const data = {
        name: formData.name,
        surname: formData.surname,
        email: formData.email,
        password: formData.password,
        people: formData.people,
        allergies: formData.allergies
      };

        await axios
          .post("https://api-rest-quai-antique.herokuapp.com/signUp.php", data)
          .then((res) => {
            if (res.data.usedEmail) {
              alert("Cette adresse email est déjà utilisée.")} 
            else {
              if (!Cookies.get('userData')) {
                Cookies.set('userData', JSON.stringify(res.data), { expires: null });
              } else {
                Cookies.remove('userData');
                Cookies.set('userData', JSON.stringify(res.data), { expires: null });
              }

              window.location.href = 'https://gaetan-hts.github.io/quai_antique/profil' // history.push('/profil') ?
            }
          })
          .catch(error => {
            console.log(error);
        })
    }
  };

  // Function to handle the log-in form submission, checks if email and password match then log the user thenr edirect to user page
  const handleLogInSubmit = async (e) => {
  e.preventDefault();
  const data = {
    email: formData.email,
    password: formData.password
  }
  await axios.post('https://api-rest-quai-antique.herokuapp.com/login.php', data)
  .then((res) => {
    if (res.data.failLogin) {
      alert("Email ou mot de passe incorecte.") 
    } else {
      if (!Cookies.get('userData')) {
        Cookies.set('userData', JSON.stringify(res.data), { expires: null });
      } else {
        Cookies.remove('userData');
        Cookies.set('userData', JSON.stringify(res.data), { expires: null });
      }
      
     window.location.href = 'https://gaetan-hts.github.io/quai_antique/profil' // history.push('/profil') ?
    }})
  .catch(error => {
    console.log(error);
  });
  };


  return (
    <div className='login-page'>
      <Navigation />
      <div className="forms-container">
        <div className="log-in">
          <form onSubmit={handleLogInSubmit}>
          <h2>Connexion</h2>
            <input type="email" className="email" name="email" placeholder='Email' onChange={(e) => setFormData({ ...formData, email: e.target.value })} required/>
            <input type="password" name="password" placeholder='Mot de passe' onChange={(e) => setFormData({ ...formData, password: e.target.value })} required/>
            <button type='submit' name='login'>Se connecter</button>
          </form>
        </div>
        <div className="sign-in">
          <form onSubmit={handleSignInSubmit}>
          <h2>Inscription</h2>
            <input type="text" name="name" placeholder='Prenom' onChange={(e) => setFormData({ ...formData, name: e.target.value })} required/>
            <input type="text" name="surname" placeholder='Nom' onChange={(e) => setFormData({ ...formData, surname: e.target.value })} required/>
            <input type="email" name="email" placeholder='Email' onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            <input type="password" name="password" placeholder='Mot de passe' onChange={(e) => setFormData({ ...formData, password: e.target.value })} required/>
            <input type="password" name="confirmPassword" placeholder='Confirmez le mot de passe' onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} required/>
            <input type="number" name="people" placeholder='Nombre de couverts habituel' onChange={(e) => setFormData({ ...formData, people: e.target.value })} min="1" max="10" required/>
            <textarea name="allergies" id="allergies" placeholder='Renseignez vos allergies' onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}></textarea>
            <button type='submit' name='signin'>S'inscrire</button>
          </form>
        </div>
      </div>
        <div className="bg-img"></div>
      <Footer />
    </div>
  );
};

export default LogIn;