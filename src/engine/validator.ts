import type { AppNode } from '../store/useWorkflowStore';
import type { Edge } from '@xyflow/react';
import { NodeRegistry } from '../registry';

export function validateGraph(nodes: AppNode[], edges: Edge[]) {
  const errors: Record<string, string[]> = {};
  
  // 1. Check if start & end nodes exist
  const hasStart = nodes.some(n => n.type === 'start');
  const hasEnd = nodes.some(n => n.type === 'end');
  
  // 2. Validate individual node schemas & connections
  nodes.forEach(node => {
    errors[node.id] = [];
    
    // Schema validation
    const nodeDef = NodeRegistry[node.type || 'task'];
    if (nodeDef && nodeDef.schema) {
      const result = nodeDef.schema.safeParse(node.data.config || {});
      if (!result.success) {
         errors[node.id].push("Configuration is incomplete or invalid.");
      }
    }

    // Connection validation
    if (node.type !== 'start') {
      const hasInput = edges.some(e => e.target === node.id);
      if (!hasInput) {
        errors[node.id].push("Missing required incoming connection.");
      }
    }
    
    if (node.type !== 'end') {
      const hasOutput = edges.some(e => e.source === node.id);
      if (!hasOutput) {
        errors[node.id].push("Missing required outgoing connection.");
      }
    }
  });

  return {
    isValid: Object.values(errors).every(errs => errs.length === 0) && hasStart && hasEnd,
    nodeErrors: errors,
    globalErrors: [
      !hasStart && "Workflow is missing a Start Trigger.",
      !hasEnd && "Workflow is missing an End Process."
    ].filter(Boolean) as string[]
  };
}
