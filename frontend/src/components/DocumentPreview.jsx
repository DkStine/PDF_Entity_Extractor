import { useState, useEffect } from 'react';

const DocumentPreview = ({ file, entities = {} }) => {
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  return (
    <div className="relative">
      <img src={previewUrl} alt="Preview" className="border" />

      {/* Only render entity highlights if position data is available */}
      {entities?.names?.map((name, i) => (
        name?.position ? (
          <div
            key={i}
            className="absolute border-2 border-green-500 animate-pulse bg-white bg-opacity-70 text-xs p-1"
            style={{ top: name.position.y, left: name.position.x, position: 'absolute' }}
          >
            {name.text}
          </div>
        ) : null
      ))}
    </div>
  );
};

export default DocumentPreview;
