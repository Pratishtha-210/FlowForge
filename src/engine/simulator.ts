import { useWorkflowStore } from '../store/useWorkflowStore';
import { validateGraph } from './validator';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function runSimulation() {
  const store = useWorkflowStore.getState();
  const { nodes, edges, addSimulationLog, setSimulationStatus, setNodeStatus, clearNodeStatuses } = store;
  
  setSimulationStatus('running');
  clearNodeStatuses();
  store.clearSimulationLogs();
  
  addSimulationLog('Initializing workflow validation...');
  await delay(600);
  
  const validation = validateGraph(nodes, edges);
  
  if (!validation.isValid) {
    store.setNodeValidationErrors(validation.nodeErrors);
    validation.globalErrors.forEach(err => addSimulationLog(`❌ ${err}`));
    addSimulationLog('❌ Validation failed. Please fix highlighted nodes.');
    setSimulationStatus('failed');
    return;
  }
  
  addSimulationLog('✅ Workflow structure is valid.');
  store.setNodeValidationErrors({});
  addSimulationLog('Initiating execution environment...');
  await delay(800);

  let currentNode = nodes.find(n => n.type === 'start');
  let stepCount = 0;
  
  while (currentNode && stepCount < 50) {
    stepCount++;
    const nodeId = currentNode.id;
    const label = currentNode.data.label;
    
    addSimulationLog(`> Executing [${label}]...`);
    setNodeStatus(nodeId, 'running');
    
    // Simulate real-world API delay
    await delay(1200);
    
    setNodeStatus(nodeId, 'success');
    
    if (currentNode.type === 'end') {
      addSimulationLog(`🎉 Reached end of workflow gracefully.`);
      break;
    }
    
    const edge = edges.find(e => e.source === nodeId);
    if (!edge) {
      addSimulationLog(`❌ Execution aborted: No path forward from [${label}]`);
      setSimulationStatus('failed');
      setNodeStatus(nodeId, 'failed');
      return;
    }
    
    currentNode = nodes.find(n => n.id === edge.target);
  }
  
  if (stepCount >= 50) {
    addSimulationLog(`❌ Execution aborted: Infinite loop or excessive depth detected.`);
    setSimulationStatus('failed');
    return;
  }

  setSimulationStatus('success');
  addSimulationLog('✅ All steps completed successfully.');
}
