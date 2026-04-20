import React, { useCallback, useRef } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useReactFlow,
  ReactFlowProvider,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useWorkflowStore } from '../store/useWorkflowStore';
import { v4 as uuidv4 } from 'uuid';
import { CustomNode } from '../nodes/CustomNode';

const nodeTypes = {
  start: CustomNode,
  task: CustomNode,
  approval: CustomNode,
  automated: CustomNode,
  end: CustomNode,
};

function Flow() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    setSelectedNodeId
  } = useWorkflowStore();
  
  const reactFlowWrapper = useRef(null);
  const { screenToFlowPosition } = useReactFlow();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      const label = event.dataTransfer.getData('application/reactflow-label');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: uuidv4(),
        type,
        position,
        data: { label: `${label}`, config: {} },
      };

      addNode(newNode);
    },
    [screenToFlowPosition, addNode]
  );
  
  const onSelectionChange = useCallback(({ nodes }: { nodes: any[] }) => {
    if (nodes.length === 1) {
      setSelectedNodeId(nodes[0].id);
    } else {
      setSelectedNodeId(null);
    }
  }, [setSelectedNodeId]);

  return (
    <div className="flex-1 h-full w-full relative" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onSelectionChange={onSelectionChange}
        nodeTypes={nodeTypes}
        fitView
        className="bg-slate-50 dark:bg-slate-950"
      >
        <Controls className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-md fill-slate-700 dark:fill-slate-300" />
        <MiniMap 
          className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-md rounded-xl overflow-hidden"
          maskColor="rgba(0,0,0,0.1)"
          nodeColor={(node) => {
            switch (node.type) {
              case 'start': return '#10b981';
              case 'task': return '#6366f1';
              case 'approval': return '#f59e0b';
              case 'automated': return '#3b82f6';
              case 'end': return '#f43f5e';
              default: return '#cbd5e1';
            }
          }}
        />
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#94a3b8" />
      </ReactFlow>
    </div>
  );
}

export function Canvas() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
