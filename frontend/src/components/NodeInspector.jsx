export default function NodeInspector({ nodeId, processingData }) {
  // Map node IDs to human-readable titles
  const nodeTitles = {
    upload: 'File Upload',
    preprocess: 'Image Optimization',
    ocr: 'Text Recognition',
    extract: 'Data Extraction',
    validate: 'Validation'
  };

  // Render different data per node
  const renderNodeData = () => {
    switch(nodeId) {
      case 'ocr':
        return (
          <div className="text-xs max-h-40 overflow-auto">
            <h4 className="font-bold mb-1">OCR Raw Output:</h4>
            <pre className="bg-gray-800 text-gray-100 p-2 rounded">
              {processingData?.ocrText?.substring(0, 200) || 'No data available...'}
            </pre>
          </div>
        );
      case 'extract':
        return (
          <div className="text-sm">
            <h4 className="font-bold mb-1">Detected Entities:</h4>
            <p>Names: {processingData?.entities?.names?.join(', ') || 'None'}</p>
            <p>Dates: {processingData?.entities?.dates?.join(', ') || 'None'}</p>
          </div>
        );
      default:
        return <p>No inspection data available</p>;
    }
  };

  return (
    <div className="p-4 bg-white border rounded-lg shadow-lg">
      <h3 className="font-bold text-lg mb-2">{nodeTitles[nodeId] || 'Node Inspector'}</h3>
      {renderNodeData()}
    </div>
  );
}