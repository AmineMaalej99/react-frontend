import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Notification from './Notification';

const DocumentList = ({ documents, setDocuments }) => {
  const [editingDocumentId, setEditingDocumentId] = useState(null);
  const [editedDocuments, setEditedDocuments] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3000/alldocuments')
      .then(response => {
        if (response.data) {
          setDocuments(response.data);
        } else {
          console.error('Invalid API response structure:', response.data);
        }
      })
      .catch(error => console.error('Erreur de chargement des documents', error));
  }, [setDocuments]);

  const handleEdit = (documentId) => {
    setEditingDocumentId(documentId);
    setEditedDocuments(prevState => ({
      ...prevState,
      [documentId]: {
        name: documents.find(doc => doc.id === documentId)?.name || '',
        type: documents.find(doc => doc.id === documentId)?.type || '',
        description: documents.find(doc => doc.id === documentId)?.description || '',
      },
    }));
    setHasChanges(false);
  };

  const handleSave = async (documentId) => {
    try {
      const editedDocument = editedDocuments[documentId];
      const originalDocument = documents.find(doc => doc.id === documentId);

      // Check if there are any changes
      if (JSON.stringify(editedDocument) !== JSON.stringify(originalDocument)) {
        const response = await axios.put(`http://localhost:3000/documents/${documentId}`, editedDocument);

        console.log('Document modifié avec succès', response.data);

        setDocuments((prevDocuments) =>
          prevDocuments.map((doc) =>
            doc.id === documentId ? { ...doc, ...editedDocument } : doc
          )
        );

        setSuccessMessage(' Document modifié avec succès.');
      }

      setEditingDocumentId(null);
      setHasChanges(false);
    } catch (error) {
      console.error('Erreur lors de la modification du document', error);
      // Clear success message if modification fails
      setSuccessMessage(null);
    }
  };

  const handleDelete = async (documentId) => {
    try {
      const response = await axios.delete(`http://localhost:3000/documents/${documentId}`);

      console.log('Document supprimé avec succès', response.data);
      setDocuments((prevDocuments) => prevDocuments.filter((doc) => doc.id !== documentId));
      setDeleteMessage(' Document supprimé avec succès.');
    } catch (error) {
      console.error('Erreur lors de la suppression du document', error);
    }
  };

  const handleInputChange = (documentId, field, value) => {
    setEditedDocuments((prevState) => ({
      ...prevState,
      [documentId]: {
        ...prevState[documentId],
        [field]: value,
      },
    }));
    setHasChanges(true);
  };

  return (
    <div>
      {successMessage && (
        <Notification type="success" message={successMessage} onClose={() => setSuccessMessage(null)} />
      )}
      {deleteMessage && (
        <Notification type="success" message={deleteMessage} onClose={() => setDeleteMessage(null)} />
      )}
      <h2>Liste des documents</h2>
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Type</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((document) => (
            <tr key={document.id}>
              <td>
                {editingDocumentId === document.id ? (
                  <input
                    type="text"
                    value={editedDocuments[document.id]?.name}
                    onChange={(e) => handleInputChange(document.id, 'name', e.target.value)}
                  />
                ) : (
                  document.name
                )}
              </td>
              <td>
                {editingDocumentId === document.id ? (
                  <select
                    value={editedDocuments[document.id]?.type}
                    onChange={(e) => handleInputChange(document.id, 'type', e.target.value)}
                  >
                    <option value="PDF">PDF</option>
                    <option value="TXT">TXT</option>
                    <option value="XDOC">XDOC</option>
                  </select>
                ) : (
                  document.type
                )}
              </td>
              <td>
                {editingDocumentId === document.id ? (
                  <input
                    type="text"
                    value={editedDocuments[document.id]?.description}
                    onChange={(e) => handleInputChange(document.id, 'description', e.target.value)}
                  />
                ) : (
                  document.description
                )}
              </td>
              <td>
                {editingDocumentId === document.id ? (
                  <>
                    <button onClick={() => handleSave(document.id)} className="save-button" disabled={!hasChanges}>
                      <i className="fas fa-check" style={{ color: 'blue' }}></i>
                    </button>
                    <button onClick={() => setEditingDocumentId(null)} className="action-button">
                      <i className="fas fa-times" style={{ color: 'white' }}></i> Annuler
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(document.id)} className="action-button">
                      <i className="fas fa-pencil-alt" style={{ color: 'yellow' }}></i> Modifier
                    </button>
                    <button onClick={() => handleDelete(document.id)} className="action-button">
                      <i className="fas fa-trash-alt" style={{ color: 'red' }}></i> Supprimer
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentList;
