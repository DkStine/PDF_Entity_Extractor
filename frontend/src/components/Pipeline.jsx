import ReactFlow, { Controls, Background } from 'reactflow';
import 'reactflow/dist/style.css';

export default function Pipeline({ status }) {
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
            <div className={`w-3 h-3 rounded-full mr-2 ${statusColors[nodeStatus.upload]}`}></div>
            <span>PDF/Image Upload</span>
          </div>
        )
      },
      type: 'default',
      style: { padding: 10, borderRadius: 8, border: '2px solid #ccc', background: '#fff' }
    },
    {
      id: 'process',
      position: { x: 200, y: 0 },
      data: {
        label: (
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${statusColors[nodeStatus.processing]}`}></div>
            <span>OlmOCR Processing</span>
          </div>
        )
      },
      type: 'default',
      style: { padding: 10, borderRadius: 8, border: '2px solid #ccc', background: '#fff' }
    },
    {
      id: 'output',
      position: { x: 400, y: 0 },
      data: {
        label: (
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${statusColors[nodeStatus.output]}`}></div>
            <span>Structured Output</span>
          </div>
        )
      },
      type: 'default',
      style: { padding: 10, borderRadius: 8, border: '2px solid #ccc', background: '#fff' }
    }
  ];

  const edges = [
    { id: 'e1-2', source: 'upload', target: 'process', animated: status === 'processing' },
    { id: 'e2-3', source: 'process', target: 'output', animated: status === 'processing' }
  ];

  return (
    <div style={{ height: '260px', width: '100%' }} className="relative">
      <ReactFlow 
        nodes={nodes} 
        edges={edges} 
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        zoomOnScroll={false}
      >
        <Background color="#f0f0f0" gap={12} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
