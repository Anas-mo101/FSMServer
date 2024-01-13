import { useCallback, useEffect, useState } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';

import "./style.css";

function RespondNode({ id, data, isConnectable }) {
  const onChange = useCallback((evt) => {
    data.question = evt.target.value;
  }, []);

  useEffect(() => {
    if(data.question){
      setQuestion(data.question);
    }
  }, []);

  const [question, setQuestion] = useState("");

  const { deleteElements } = useReactFlow();

  const deleteNode = () => deleteElements({ nodes: [ {id} ] });

  return (
    <div className="text-updater-node">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <div className="node-buttons" >
        <button type="button" onClick={deleteNode}>
          x
        </button>
      </div>
      <div>
        <label htmlFor="text">Respond:</label>
        <input id="text" name="text" defaultValue={question} onChange={onChange} className="nodrag" />
      </div>
    </div>
  );
}

export default RespondNode;