import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DocumentForm = ({ onDocumentSave }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [notification, setNotification] = useState(null);

  const handleSave = async () => {
    setNotification(null);

    if (!name && !type) {
      setNotificationAndTimeout('error', 'Les champs "Nom" et "Type" doivent être renseignés.');
      return;
    } else if (!name) {
      setNotificationAndTimeout('error', 'Le champ "Nom" doit être renseigné.');
      return;
    } else if (!type) {
      setNotificationAndTimeout('error', 'Le champ "Type" doit être renseigné.');
      return;
    }

    const uppercaseType = type.toUpperCase();

    try {
      const response = await axios.post('http://localhost:3000/documents', {
        name,
        type: uppercaseType,
        description,
      });

      setNotificationAndTimeout('success', 'Document ajouté avec succès.');
      onDocumentSave(response.data);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du document', error);
      setNotificationAndTimeout('error', `Erreur lors de l'ajout du document. Veuillez réessayer. Détails: ${error.message}`);
    } finally {
      setName('');
      setType('');
      setDescription('');
    }
  };

  const setNotificationAndTimeout = (type, message) => {
    setNotification({
      type: type,
      message: message,
    });

    setTimeout(() => {
      setNotification(null);
    }, 5000); // Hide the notification after 5 seconds
  };

  useEffect(() => {
    const handleClickOutside = () => {
      if (notification && notification.type === 'success') {
        setNotification(null);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [notification]);

  return (
    <div>
      <h2>Ajouter un document</h2>
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      <div>
        <label>Nom du document:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label>Type du document:</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Sélectionnez le type</option>
          <option value="PDF">PDF</option>
          <option value="TXT">TXT</option>
          <option value="XDOC">XDOC</option>
        </select>
      </div>
      <div>
        <label>Description du document:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <button onClick={handleSave} className="save-button">
        <i className="fas fa-check" style={{ color: 'white' }}></i> Enregistrer
      </button>
    </div>
  );
};

export default DocumentForm;
