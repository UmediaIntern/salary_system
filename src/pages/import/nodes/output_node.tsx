import { useState, useEffect } from 'react';
import {
  Handle,
  Position,
  useNodeConnections,
  useNodesData,
} from '@xyflow/react';

export function OutputNode() {
  const connections = useNodeConnections({ handleType: 'target' });
  const nodesData = useNodesData(connections?.[0]?.source ?? "");

  return (
    <div
      className="rounded-sm border border-l-4 border-amber-400 bg-primary-foreground p-2"
    >
      <Handle type="target" position={Position.Left} />
      <div>
        <p style={{ fontWeight: 'bold', fontSize: '1.2em' }}>Ouput</p>
      </div>
    </div>
  );
}

