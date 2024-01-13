import { useCallback, useEffect, useState } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';

import "./style.css";

function SaDetailsNode({ id, isConnectable }) {

  const { deleteElements } = useReactFlow();

  const deleteNode = () => deleteElements({ nodes: [ {id} ] });

  return (
    <div className="text-updater-sa-node">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <div className="node-buttons" >
        <button type="button" onClick={deleteNode}>
          x
        </button>
      </div>
      <div>
        <p> SA Details </p>
      </div>
      <Handle type="source" position={Position.Bottom} id="c" isConnectable={isConnectable} />
    </div>
  );
}

export default SaDetailsNode;