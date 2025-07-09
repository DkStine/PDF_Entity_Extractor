import { useState } from 'react';
import FileUpload from '../components/FileUpload';
import axios from 'axios';

function App() {
  const [results, setResults] = useState(null);

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    // Connect to Member 1's API
    const response = await axios.post(
      'http://localhost:8000/process', 
      formData
    );
    setResults(response.data);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Data Extractor</h1>
      <FileUpload onUpload={handleUpload} />
      {results && (
        <pre className="mt-6 bg-gray-100 p-4 rounded">
          {JSON.stringify(results, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default App;
