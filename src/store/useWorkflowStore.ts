import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
} from '@xyflow/react';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';

export type NodeData = {
  label: string;
  config?: Record<string, any>;
};

export type AppNode = Node<NodeData>;

export interface WorkflowState {
  nodes: AppNode[];
  edges: Edge[];
  selectedNodeId: string | null;
  
  // Validation and Execution state
  simulationStatus: 'idle' | 'running' | 'success' | 'failed';
  simulationLogs: string[];
  nodeStatuses: Record<string, 'idle' | 'running' | 'success' | 'failed'>;
  nodeValidationErrors: Record<string, string[]>;
  
  onNodesChange: OnNodesChange<AppNode>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  
  addNode: (node: AppNode) => void;
  updateNodeData: (nodeId: string, data: Partial<NodeData>) => void;
  updateNodeConfig: (nodeId: string, config: any) => void;
  setSelectedNodeId: (nodeId: string | null) => void;
  deleteNode: (nodeId: string) => void;
  
  setSimulationStatus: (status: 'idle' | 'running' | 'success' | 'failed') => void;
  addSimulationLog: (log: string) => void;
  clearSimulationLogs: () => void;
  
  setNodeStatus: (nodeId: string, status: 'idle' | 'running' | 'success' | 'failed') => void;
  clearNodeStatuses: () => void;
  setNodeValidationErrors: (errors: Record<string, string[]>) => void;
}

export const useWorkflowStore = create<WorkflowState>()(
  persist(
    (set, get) => ({
      nodes: [],
      edges: [],
      selectedNodeId: null,
      
      simulationStatus: 'idle',
      simulationLogs: [],
      nodeStatuses: {},
      nodeValidationErrors: {},

      onNodesChange: (changes: NodeChange<AppNode>[]) => {
        set({
          nodes: applyNodeChanges(changes, get().nodes),
        });
      },
      onEdgesChange: (changes: EdgeChange[]) => {
        set({
          edges: applyEdgeChanges(changes, get().edges),
        });
      },
      onConnect: (connection: Connection) => {
        set({
          edges: addEdge(connection, get().edges),
        });
      },

      addNode: (node) => {
        set({ nodes: [...get().nodes, node] });
      },

      updateNodeData: (nodeId, data) => {
        set({
          nodes: get().nodes.map((node) => {
            if (node.id === nodeId) {
              return { ...node, data: { ...node.data, ...data } };
            }
            return node;
          }),
        });
      },

      updateNodeConfig: (nodeId, config) => {
         set({
          nodes: get().nodes.map((node) => {
            if (node.id === nodeId) {
              return { ...node, data: { ...node.data, config } };
            }
            return node;
          }),
          // Clear validation errors when user fixes config
          nodeValidationErrors: {
             ...get().nodeValidationErrors,
             [nodeId]: []
          }
        });
      },

      setSelectedNodeId: (nodeId) => {
        set({ selectedNodeId: nodeId });
      },

      deleteNode: (nodeId) => {
        set({
          nodes: get().nodes.filter((n) => n.id !== nodeId),
          edges: get().edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
          selectedNodeId: get().selectedNodeId === nodeId ? null : get().selectedNodeId,
        });
      },

      setSimulationStatus: (status) => {
        set({ simulationStatus: status });
      },

      addSimulationLog: (log) => {
        set({ simulationLogs: [...get().simulationLogs, log] });
      },

      clearSimulationLogs: () => {
        set({ simulationLogs: [] });
      },
      
      setNodeStatus: (nodeId, status) => {
        set({
          nodeStatuses: { ...get().nodeStatuses, [nodeId]: status }
        });
      },
      
      clearNodeStatuses: () => {
        set({ nodeStatuses: {} });
      },
      
      setNodeValidationErrors: (errors) => {
        set({ nodeValidationErrors: errors });
      }
    }),
    {
      name: 'flowforge-storage',
      // We only want to persist the graph structure, not the runtime execution state
      partialize: (state) => ({ 
        nodes: state.nodes, 
        edges: state.edges 
      }),
    }
  )
);
