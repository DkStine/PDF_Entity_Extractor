// src/components/Pipeline.jsx
import ReactFlow, { Controls } from 'reactflow';
import 'reactflow/dist/style.css';

const nodeStyle = "px-4 py-2 bg-blue-100 rounded border border-blue-300";

const nodes = [
  { 
    id: 'upload', 
    position: { x: 0, y: 0 }, 
    data: { label: <div className={nodeStyle}>📥 PDF/Image Upload</div> } 
  },
  { 
    id: 'process', 
    position: { x: 250, y: 0 }, 
    data: { label: <div className={nodeStyle}>⚙ OlmOCR Processing</div> } 
  },
  { 
    id: 'output', 
    position: { x: 500, y: 0 }, 
    data: { label: <div className={nodeStyle}>📊 Structured Output</div> } 
  }
];

const edges = [
  { id: 'e1', source: 'upload', target: 'process' },
  { id: 'e2', source: 'process', target: 'output' }
];

export default function Pipeline() {
  return (
    <div className="h-64 my-6 border rounded-lg">
      <ReactFlow 
        nodes={nodes} 
        edges={edges} 
        fitView
      >
        <Controls />
      </ReactFlow>
    </div>
  );
}