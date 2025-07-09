// src/components/FileUpload.jsx
import React from 'react';
import { useDropzone } from 'react-dropzone';

export default function FileUpload({ onUpload }) {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpg', '.jpeg', '.png']
    },
    maxSize: 10 * 1024 * 1024,
    onDrop: files => files[0] && onUpload(files[0])
  });

  return (
    <div {...getRootProps()} 
         className="border-2 border-dashed p-8 text-center cursor-pointer">
      <input {...getInputProps()} />
      <p>📁 Drag & drop PDF/image (max 10MB)</p>
    </div>
  );
}