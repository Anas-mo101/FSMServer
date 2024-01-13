import { useState, useMemo, useCallback, useEffect } from 'react';
import { Handle, Position, NodeProps, useUpdateNodeInternals, useReactFlow  } from 'reactflow';

import McqModal from "../McqModal";

import "./style.css";

function McqNode({ id, data, type }) {

  useEffect(() => {
    if(data.active){
      setActive(true)
    }

    if(data.handles){
      setHandleCount(data.handles);
    }

    if(data.handleValues){
      setHandleValues(data.handleValues);
    } else {
      data.handleValues = handleValues;
    }
  }, []);

  const [quickModalOpen, setQuickModalOpen] = useState(false);

  const [handleCount, setHandleCount] = useState(2);
  const [handleValues, setHandleValues] = useState(["", ""]);
  const updateNodeInternals = useUpdateNodeInternals();
  const [active, setActive] = useState(false);

  const deleteNode = () => deleteElements({ nodes: [ {id} ] });

  const { deleteElements } = useReactFlow();

  const handles = useMemo(
    () =>
      Array.from({ length: handleCount }, (x, i) => {
        const handleId = `handle-${i}`;
        return <div className="choice-handle">
          <label style={{ left: 48 * i }} htmlFor={handleId}>{i}</label>
          <Handle key={handleId} type="source" position={Position.Bottom} isConnectable={true} id={handleId} style={{ left: 48 * i }} />
        </div>;
      }),
    [handleCount]
  );

  const onClick = () => {
    setHandleCount((c) => {
      if(c < 7){
        updateNodeInternals(id);
        data.handles = c + 1;
        data.handleValues.push("");
        setHandleValues(data.handleValues);
        return c + 1;
      }
      return c;
    });
  };

  const onRemoveClick = () => {
    setHandleCount((c) => {
      if(c > 2){
        updateNodeInternals(id);
        data.handles = c - 1;
        data.handleValues.pop();
        setHandleValues(data.handleValues);
        return c - 1;
      }
      return c;
    });
  };

  return (
    <div className={"text-updater-node " + (active && "active")}>

      <McqModal
        open={quickModalOpen}
        onClose={() => {
          setQuickModalOpen(false)
          data.handleValues = handleValues;
        }}
        setHandleValues={setHandleValues}
        handleValues={handleValues}
      ></McqModal>

      <Handle type="target" position={Position.Top} isConnectable={true} />
      <div className="node-buttons" >
        <button type="button" onClick={onClick}> + </button>
        <button type="button" onClick={onRemoveClick}> - </button>
        <button type="button" onClick={deleteNode}> x </button>
        <button type="button" onClick={() => setQuickModalOpen(true)}> mc </button>
      </div>
      <h2 style={{textAlign: "center"}}> Module: {type} </h2>
      {handles}
    </div>
  );
}

export default McqNode;