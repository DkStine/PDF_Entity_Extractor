import ReactFlow, { Controls } from 'reactflow';
import 'reactflow/dist/style.css';

export default function Pipeline({ status }) {
  // Status: 'idle', 'processing', 'complete', 'error'
  const nodeStatus = {
    upload: status === 'idle' ? 'pending' : status === 'error' ? 'error' : 'complete',
    processing: ['processing', 'complete', 'error'].includes(status) 
      ? (status === 'processing' ? 'active' : status) 
      : 'pending',
    output: status === 'complete' ? 'complete' : 'pending'
  };

  const statusColors = {
    pending: 'bg-gray-200 border-gray-400',
    active: 'bg-yellow-300 border-yellow-500 animate-pulse',
    complete: 'bg-green-300 border-green-500',
    error: 'bg-red-300 border-red-500'
  };

  const nodes = [
    {
      id: 'upload',
      position: { x: 0, y: 0 },
      data: { 
        label: (
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${statusColors[nodeStatus.upload].replace('bg-', 'bg-').replace('border-', '')}`}></div>
            <span>PDF/Image Upload</span>
          </div>
        )
      },
      className: `px-4 py-2 rounded-lg border-2 ${statusColors[nodeStatus.upload]}`
    },
    {
      id: 'process',
      position: { x: 200, y: 0 },
      data: { 
        label: (
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${statusColors[nodeStatus.processing].replace('bg-', 'bg-').replace('border-', '')}`}></div>
            <span>OlmOCR Processing</span>
          </div>
        )
      },
      className: `px-4 py-2 rounded-lg border-2 ${statusColors[nodeStatus.processing]}`
    },
    {
      id: 'output',
      position: { x: 400, y: 0 },
      data: { 
        label: (
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${statusColors[nodeStatus.output].replace('bg-', 'bg-').replace('border-', '')}`}></div>
            <span>Structured Output</span>
          </div>
        )
      },
      className: `px-4 py-2 rounded-lg border-2 ${statusColors[nodeStatus.output]}`
    }
  ];

  const edges = [
    { id: 'e1-2', source: 'upload', target: 'process', animated: status === 'processing' },
    { id: 'e2-3', source: 'process', target: 'output', animated: status === 'processing' }
  ];

  return (
    <div className="h-64 my-6 border rounded-lg">
      <ReactFlow 
        nodes={nodes} 
        edges={edges} 
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        zoomOnScroll={false}
      >
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
