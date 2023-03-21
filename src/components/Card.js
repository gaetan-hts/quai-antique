import axios from 'axios';
import React, { useState } from 'react';

const Card = ({ picture, admin, id }) => {
  const [isEditing, setIsEditing] = useState(false);// Initialize state for the edit mode
  const [editContent, setEditContent] = useState('');// Initialize state for the edited content

  // Handle the edit action
  const handleEdit = () => {
    const data = {
      id: id,
      title: editContent ? editContent : picture.title
    }
    axios
    .post('https://api-rest-quai-antique.herokuapp.com/editPicture.php', data)
    .then((res) => {
      if (res.data.success) {
        alert("Titre de la photo modifié avec succès.");
      } else {alert("Echec de la modification")}
    })

    setIsEditing(false);
  }

  // Handle the remove action
  const handleRemove = () => {
    axios
      .post('https://api-rest-quai-antique.herokuapp.com/removePicture.php', {id: id})
      .then((res) => {
        if (res.data.success) {
          alert("Photo supprimée avec succès.");
        } else {alert("Echec de la suppréssion.")}
      })
  }

  return (
    <div className='card'>
      <img src={picture.url} alt={picture.title}/>
      {isEditing ? <textarea placeholder={picture.title} onChange={(e) => setEditContent(e.target.value)}></textarea> : <span className='card-title'>{picture.title}</span>}
      {admin === true && <span className='remove-icon' onClick={handleRemove}><i className="fa-solid fa-xmark"></i></span>}
      {admin === true && (isEditing ? (
        <i onClick={() => handleEdit()} className="fa-solid fa-pen-to-square"></i>
        ) : (
        <i onClick={() => setIsEditing(true)} className="fa-regular fa-pen-to-square"></i>
        )
      )}
    </div>
  );
};

export default Card;