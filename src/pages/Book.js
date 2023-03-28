import React, { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import icPlate from "../assets/img/ic-plate.png";
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'
import { fr } from "date-fns/locale";
import axios from 'axios';
import Cookies from 'js-cookie';
import Tooltip from '../components/Tooltip';

const Book = ({ content, children }) => {
  const [userCookieData, setUserCookieData] = useState(null); // User cookie data
  const [excludedDates, setExcludedDates] = useState([1, 3]); // Array of dates to exclude from calendar
  const [newMaxPeople, setNewMaxPeople] = useState(''); // New maximum number of diners
  const [fullDays, setFullDays] = useState([]); // Dates that are fully booked
  const [dbData, setDbData] = useState([]); // Data retrieved from backend
  const [userData, setUserData] = useState([]); // User data from database (if logged in)
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    people: "",
    allergies: "",
    selectedDate: new Date(new Date().setHours(12,0,0,0))
  }) // Form data for booking, using object destructuring and set initial state for all form fields
  
// Fetch data from backend on component mount
  useEffect(() => {
    axios
    .get("https://api-rest-quai-antique.herokuapp.com/index.php")
    .then(res => {
      const dateToExclude = [];
      res.data.calendar.forEach(date => {
        if (date.lunchPeople > date.maxPeople && date.dinnerPeople > date.maxPeople) {
          dateToExclude.push(new Date(date.date));
        }
      });
      const closedDays = [];
      res.data.schedules.forEach(schedule => {
        if (schedule.lunchTime === "fermé") {
          closedDays.push(schedule.id);
        }
      });
      setDbData(res.data);
      setFullDays(dateToExclude);
      setExcludedDates(closedDays); 
    })
    .catch(err => console.error(err));
  }, []);
  
// Retrieve user data from cookies and database
  useEffect(() => {
    const cookie = Cookies.get("userData");
    if (cookie) {
      setUserCookieData(JSON.parse(Cookies.get("userData")));
      if (userCookieData && userCookieData.email && dbData && dbData.users) {
        const user = dbData.users.filter((user) => user.email === userCookieData.email);
        if (user.length > 0) {
          setUserData(user[0]);
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dbData]);

// Handle submit booking form function
const handleSubmit = (e) => {
  e.preventDefault();
  const dateObject = new Date(formData.selectedDate);
  const data = {
    name: formData.name,
    surname: formData.surname,
    email: formData.email,
    people: userCookieData ? userData.people : formData.people,
    allergies: userCookieData ? userData.allergies : formData.allergies,
    date: dateObject.toLocaleDateString(),
    time: dateObject.toLocaleTimeString().slice(0, 5)
  };

  const validTimeRanges = [
    {start: '12:00', end: '14:00'},
    {start: '19:00', end: '21:00'}
  ];

  let isValidTime = false;
  for (const range of validTimeRanges) {
    if (data.time >= range.start && data.time <= range.end) {
      isValidTime = true;
      break;
    }
  }

  if (!data.name || !data.surname || !data.email || !data.people || !data.allergies || !data.date || !data.time) {
    alert("Veuillez renseigner tous les champs pour finaliser la réservation.");
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      alert("Veuillez entrer une adresse email valide.");
    } else if (!isValidTime) {
      alert("Veuillez sélectionner une heure de réservation valide. Les heures de réservation disponibles sont entre 12:00 et 14:00 et entre 19:00 et 21:00.");
    } else {
      axios.post('https://api-rest-quai-antique.herokuapp.com/checkBooking.php', data)
        .then((res) => console.log(res))
        .catch(err => console.error(err));

      axios.post('https://api-rest-quai-antique.herokuapp.com/bookingList.php', data)
        .then((r) => {
          if (r.data.booked === true) {
            alert("Merci, votre réservation a bien été prise en compte.")
            setFormData({
              name: "",
              surname: "",
              email: "",
              people: "",
              allergies: "",
              selectedDate: ""
            })
          } else {
            alert("Un problème est survenu, votre réservation n'a pas été prise en compte.")
          }
        })
        .catch(err => console.error(err));
    }
  }
};

// Handle submit of the admin panel form (change the max people)
  const handleMaxPeopleSubmit = (e) => {
    e.preventDefault();
    axios.post('https://api-rest-quai-antique.herokuapp.com/updateMaxPeople.php', { maxPeople: newMaxPeople })
      .then(res => { if (res.data.success) {
        alert(`Modification du nombre maximum de couverts reussi (${newMaxPeople})`)
      } else {
        alert("Echec de la modification.")
        console.log(res)
      }
    })
      .catch(error => {console.error(error)});
  }
  
  return (
    <div className='booking-page'>
    <Navigation />
    {userCookieData && userCookieData.isAdmin && 
    <div className='admin-panel'>
      <form>
        <label htmlFor="max-people">Nombre maximum de couverts : </label>
        <div className='tooltip-container'>
        <input type="number" placeholder='Nouveau nombre max de couverts' value={newMaxPeople} onChange={e => setNewMaxPeople(e.target.value)} />
          <Tooltip content="Le nombre maximal de couverts correspond au seuil à partir duquel toute nouvelle réservation est empêchée et la date dans l'input date/time est désactivée. Par exemple, si une réservation de 8 personnes est effectuée alors qu'il y a déjà 45 personnes sur les 50 couverts max, la réservation sera tout de même prise en compte.">
            <span><i className="fa fa-info-circle"></i></span>
          </Tooltip>
        </div>
        <button onClick={handleMaxPeopleSubmit}>Modifier</button>
      </form>
    </div>
    }
    <div className="form-content">
      <div className="hours">
        <div className="hours-content">
          <h3>Horaires</h3>
          <h4>ouverture</h4>
          <img src={icPlate} alt="icon-plate"/>
          <div> {dbData && dbData.schedules && dbData.schedules.map((day) => (
            day.lunchTime !== 'fermé' ? <p key={day.id}>{day.day}</p> : null
                ))}
          </div>
          <p>{dbData.schedules && dbData.schedules[6].lunchTime} (MIDI)</p>
          <p>{dbData.schedules && dbData.schedules[6].dinnerTime} (SOIR)</p>
          <h5>Adresse</h5>
          <p>18 avenue de la république</p>
          <p>73000 - Chambéry</p>
          <h5>06 59 45 72 48</h5>
        </div>
      </div>
      <div className="form-infos">
        <div className="form-infos-container">
          <h2>Reservation</h2>
          <h3>EN LIGNE</h3>
          <img src={icPlate} alt="icon-plate"/>
          <form className="form-inputs">
            <input type="text" placeholder="Prenom" onChange={(e) => setFormData({...formData, name: e.target.value})} value={formData.name} required/>
            <input type="text" placeholder="Nom" onChange={(e) => setFormData({...formData, surname: e.target.value})} value={formData.surname} required/>
            <input type="email" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} value={formData.email} required pattern=".+@globex\.com"/>
            {userCookieData ? <input type="number" value={userData.people} min="1" max="10" required/> : <input type="number" placeholder="Nombre de couverts" onChange={(e) => setFormData({...formData, people: e.target.value})} value={formData.people} min="1" max="10" required/>}
           {userCookieData ? <input type="text"  value={userData.allergies} required/> : <input type="text" placeholder="Alergies" onChange={(e) => setFormData({...formData, allergies: e.target.value})} value={formData.allergies} required/>} 
            <ReactDatePicker
              locale={fr} 
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              selected={formData.selectedDate}
              onChange={(date) => setFormData({...formData, selectedDate: date})}
              dateFormat='dd/MM/yyyy - HH:mm'
              placeholderText='Date de réservation'
              minDate={new Date()}
              includeTimes={[1675854000000, 1675854900000, 1675855800000, 1675856700000, 1675857600000, 1675858500000, 1675859400000, 1675860300000, 1675861200000, 1675879200000,1675879200000, 1675880100000, 1675881000000, 1675881900000, 1675882800000, 1675883700000, 1675884600000, 1675885500000, 1675886400000]}
              filterDate={date => !excludedDates.includes(date.getDay())}
              excludeDates={fullDays}
              required
              />
          </form>
          <button className='submit-btn' onClick={handleSubmit}>RESERVER UNE TABLE</button>
        </div>
          <Tooltip content="Pour toute réservation supérieure à 10 couverts, merci de nous contacter par téléphone.">
            <span><i className="fa fa-info-circle"></i></span>
          </Tooltip>
      </div>
    </div>
    <div className='bg-img'></div>
    <Footer />
  </div>
  );
};

export default Book;


    