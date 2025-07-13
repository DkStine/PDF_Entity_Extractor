import { useState } from 'react';
import FileUpload from '../../frontend/src/components/FileUpload';
import DocumentPreview from '../../frontend/src/components/DocumentPreview';
import EntityTable from '../../frontend/src/components/EntityTable';
import TableRenderer from '../../frontend/src/components/TableRenderer';
import axios from 'axios';

function App() {
  const [results, setResults] = useState(null);
  const [viewMode, setViewMode] = useState("all"); // 'entities' | 'tables' | 'structure'
  const [currentFile, setCurrentFile] = useState(null); // Added to fix currentFile

  const handleUpload = async (file) => {
    try {
      setCurrentFile(file); // Store the file
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post('http://localhost:8000/process', formData);
      setResults(response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
      setResults(null);
    }
  };

  const exportCSV = (data) => {
    if (!data || (!data.entities && !data.tables)) {
      console.log('No data to export');
      return;
    }
    // Basic CSV export for entities or tables
    let csvContent = 'data:text/csv;charset=utf-8,';
    if (data.entities && viewMode !== 'tables') {
      csvContent += 'ID,Name,Type,Value\n';
      data.entities.forEach((entity) => {
        const row = [
          entity.id || '',
          entity.name || '',
          entity.type || '',
          entity.value || '',
        ].map((val) => `"${val}"`).join(',');
        csvContent += row + '\n';
      });
    } else if (data.tables && viewMode === 'tables') {
      data.tables.forEach((table, index) => {
        csvContent += `Table ${index + 1}\n`;
        const headers = table[0] && typeof table[0] === 'object' && !Array.isArray(table[0])
          ? Object.keys(table[0])
          : table[0] || ['Column 1', 'Column 2'];
        csvContent += headers.map((h) => `"${h}"`).join(',') + '\n';
        table.forEach((row) => {
          const rowData = Array.isArray(row)
            ? row
            : headers.map((h) => row[h] || '');
          csvContent += rowData.map((val) => `"${val}"`).join(',') + '\n';
        });
        csvContent += '\n';
      });
    }
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'extracted_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      {viewMode !== "tables" && results && results.entities && (
        <div className="grid grid-cols-2 gap-4">
          <DocumentPreview file={currentFile} entities={results.entities} />
          <EntityTable entities={results.entities} />
        </div>
      )}
      {viewMode === "tables" && results && results.tables && <TableRenderer tables={results.tables} />}
      <button onClick={() => exportCSV(results)} className="mt-4 bg-blue-500 text-white p-2 rounded">
        Export as CSV
      </button>
    </div>
  );
}

export default App;