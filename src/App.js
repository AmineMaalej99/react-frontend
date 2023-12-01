import React, { useState } from 'react';
import DocumentList from './components/DocumentList';
import DocumentForm from './components/DocumentForm';

function App() {
  const [documents, setDocuments] = useState([]);

  const handleDocumentSave = (newDocument) => {
    setDocuments((prevDocuments) => [...prevDocuments, newDocument]);
  };

  return (
    <div>
      <DocumentList documents={documents} setDocuments={setDocuments} />
      <DocumentForm onDocumentSave={handleDocumentSave} />
    </div>
  );
}

export default App;
