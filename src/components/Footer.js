import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';

const Footer = () => {
  const [userFooterCookieData, setUserFooterCookieData] = useState(null);
  const  [dayData, setDayData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingDayId, setEditingDayId]= useState(null);
  const [editSchedulesContent, setEditSchedulesContent] = useState({
    day:'',
    lunchTime:'',
    dinnerTime:''
  });
  
  // Effect hook to retrieve user data from cookie when component mounts
  useEffect (() => {
    const cookie = Cookies.get('userData');
    if (cookie) {
      setUserFooterCookieData(JSON.parse(Cookies.get('userData')))
    }
  }, []);

// Effect hook to fetch data from API when `editSchedulesContent` changes
  useEffect(() => {
    axios
    .get("https://api-rest-quai-antique.herokuapp.com/index.php")
    .then((res) => setDayData(res.data.schedules));
  }, [editSchedulesContent]);

  // Function to handle editing a day's schedule
  const handleEdit = (dayId) => {
    // Find the day object in `dayData` that matches `dayId`
    const dayToUpdate = dayData.find((day) => day.id === dayId);
    // Create a data object to send to the server with updated schedule information
    const data = {
      day: dayToUpdate.day,
      lunchTime: editSchedulesContent.lunchTime || dayToUpdate.lunchTime,
      dinnerTime: editSchedulesContent.dinnerTime || dayToUpdate.dinnerTime,
    }
    // Send the updated data to the server via POST request
    axios
      .post('https://api-rest-quai-antique.herokuapp.com/editSchedules.php', data)
      .then((res) => {
        if (res.data.success) {
          alert("Horaires modifiés avec succès.");
        } else {alert("Echec de la modification.")}
      })
      .catch(err => console.error(err));
      
    // Reset editing state and ID
    setIsEditing(false);
    setEditingDayId(null);
  };

  return (
    <footer>
      <div className="footer-content">
        <div className="left-part">
          <h2>Horaires d'ouverture</h2>
          <ul>
          {dayData && dayData.map((day) => (
            <li key={day.id}>
              <p>{day.day} :</p>
              {isEditing && editingDayId === day.id ? 
                <div>
                  <textarea placeholder={day.lunchTime} onChange={(e) => setEditSchedulesContent({...editSchedulesContent, lunchTime: e.target.value})}></textarea>
                  <textarea placeholder={day.dinnerTime} onChange={(e) => setEditSchedulesContent({...editSchedulesContent, dinnerTime: e.target.value})}></textarea>
                </div> 
                : <p>{day.lunchTime} | {day.dinnerTime}</p>
              }
              {userFooterCookieData && userFooterCookieData.isAdmin && (
                isEditing && editingDayId === day.id ? (
                  <i onClick={() => handleEdit(day.id)} className="fa-solid fa-pen-to-square"></i>
                ) : (
                  <i onClick={() => {setIsEditing(true); setEditingDayId(day.id);}} className="fa-regular fa-pen-to-square"></i>
              ))}
            </li>
          ))}
          </ul>
        </div>
        <div className="right-part">
          <div className="newsletter">
            <h3>NEWSLETTER :</h3>
            <input type="email" placeholder='Votre adresse email' />
          </div>
          <div className="follow-us">
            <h3>SUIVEZ NOUS :</h3>
            <ul>
        <a
          href="https://www.facebook.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <li>
            <i className="fab fa-facebook-f"></i>
          </li>
        </a>
        <a
          href="https://www.twitter.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <li>
            <i className="fab fa-twitter"></i>
          </li>
        </a>
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <li>
            <i className="fab fa-instagram"></i>
          </li>
        </a>
        <a
          href="https://www.pinterest.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <li>
            <i className="fab fa-pinterest"></i>
          </li>
        </a>
      </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;