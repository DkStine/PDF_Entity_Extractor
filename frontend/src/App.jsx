import { useState } from 'react';
import FileUpload from './components/FileUpload';
import DocumentPreview from './components/DocumentPreview';
import Pipeline from './components/Pipeline';
import ResultsDisplay from './components/ResultsDisplay';
import { showToast, NotificationSystem } from './components/NotificationSystem';
import { processDocument } from './services/api';

function App() {
  // State from both versions
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentFile, setCurrentFile] = useState(null);
  const [viewMode, setViewMode] = useState("all"); // 'all' | 'entities' | 'tables'

  // Calculate pipeline status (visualization version)
  const pipelineStatus = 
    isLoading ? 'processing' : 
    error ? 'error' : 
    results ? 'complete' : 'idle';

  // Unified upload handler (merged logic)
  const handleFileUpload = async (file) => {
    setIsLoading(true);
    setError(null);
    setCurrentFile(file);
    showToast.processing('Processing document...');
    
    try {
      const data = await processDocument(file);
      showToast.dismiss();
      showToast.success('Document processed successfully!');
      setResults(data);
    } catch (err) {
      showToast.dismiss();
      showToast.error(err.message || 'Processing failed');
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // CSV Export (teammate's version - modified)
  const exportCSV = () => {
    if (!results) {
      showToast.error('No data to export');
      return;
    }

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Type,Value,Page\n';
    
    results.pages.forEach((page, pageIndex) => {
      // Export entities
      Object.entries(page.entities).forEach(([type, items]) => {
        items.forEach(value => {
          csvContent += `"${type}","${value}",${pageIndex + 1}\n`;
        });
      });
      
      // Export tables
      page.tables.forEach((table, tableIndex) => {
        table.forEach(row => {
          const rowData = Object.values(row).map(val => `"${val}"`).join(',');
          csvContent += `"Table ${tableIndex+1}",${rowData},${pageIndex + 1}\n`;
        });
      });
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'extracted_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <NotificationSystem />
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Document Data Extractor</h1>
          <p className="text-gray-600">Upload PDFs/images to extract structured data</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Upload Document</h2>
              <FileUpload onUpload={handleFileUpload} disabled={isLoading} />
              <p className="mt-3 text-sm text-gray-500">
                Supports PDF, JPG, PNG (max 10MB)
              </p>
              
              {/* View Mode Toggle (teammate's feature) */}
              {results && (
                <div className="mt-4">
                  <h3 className="font-medium mb-2">View Mode:</h3>
                  <div className="flex space-x-2">
                    {['all', 'entities', 'tables'].map(mode => (
                      <button
                        key={mode}
                        className={`px-3 py-1 text-sm rounded ${
                          viewMode === mode
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                        onClick={() => setViewMode(mode)}
                      >
                        {mode.charAt(0).toUpperCase() + mode.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {results && currentFile && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Document Preview</h2>
                <DocumentPreview file={currentFile} />
                
                <div className="mt-4">
                  <button 
                    onClick={exportCSV}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                  >
                    Export as CSV
                  </button>
                </div>
                
                <div className="mt-4">
                  <p><span className="font-medium">Pages Processed:</span> {results.page_count}</p>
                  {results.partial && (
                    <p className="text-yellow-600 mt-2">
                      Only first 3 pages processed
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Processing Pipeline</h2>
              <Pipeline status={pipelineStatus} />
            </div>

            {results && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Extracted Data</h2>
                <ResultsDisplay 
                  data={results} 
                  viewMode={viewMode} // Pass view mode to results
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;