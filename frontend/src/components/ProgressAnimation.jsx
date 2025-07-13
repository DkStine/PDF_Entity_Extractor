import { useCallback, useEffect } from 'react';

export default function ProgressAnimation({ activeNode }) {
  // Create moving dots between nodes (USP)
  const createDataFlow = useCallback(() => {
    const dots = [];
    const nodePositions = {
      upload: 0, 
      preprocess: 25, 
      ocr: 50, 
      extract: 75, 
      validate: 100
    };
    
    // Create 5 animated dots
    for (let i = 0; i < 5; i++) {
      dots.push(
        <div 
          key={i}
          className="absolute w-3 h-3 bg-blue-500 rounded-full"
          style={{
            left: `${nodePositions[activeNode]}%`,
            transition: 'left 1.5s ease-in-out',
            animation: 'pulse 1.5s infinite',
            top: `${10 + i * 10}%`
          }}
        />
      );
    }
    return dots;
  }, [activeNode]);

  return <div className="absolute inset-0">{createDataFlow()}</div>;
}