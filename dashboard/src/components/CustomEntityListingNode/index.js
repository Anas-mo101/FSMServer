import { useCallback, useEffect, useState,useMemo } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import api from "../../services/api";
import toastError from "../../errors/toastError";

import {
  makeStyles, Select , MenuItem
} from "@material-ui/core";

import "./style.css";


function CustomEntityListingNode({ id, data, isConnectable }) {
  const onChange = useCallback((evt) => {
    data.entityTypetype = evt.target.value;
    setEntityTypetype(data.entityTypetype)
  }, []);

  const [loading, setLoading] = useState(false);
  const [entityTypetype, setEntityTypetype] = useState("");
  const [customTypes, setCustomTypes] = useState([]);

  const { deleteElements } = useReactFlow();

  const deleteNode = () => deleteElements({ nodes: [ {id} ] });

  useEffect(() => {
    if(data.entityTypetype){
      setEntityTypetype(data.entityTypetype);
    }
	}, []);

  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/entities/`);
        setCustomTypes(res.data.customEntitiesTypes);
      } catch (err) {
        toastError(err);
      }
      setLoading(false);
    };

    fetchContacts();
	}, []);

  return (
    <div className="container-main-node">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <div className="node-buttons" >
        <button type="button" onClick={deleteNode}>
          x
        </button>
      </div>
      <div>
        <label htmlFor="text">Custom Entity Listing: </label>
        <Select
          label="Custom Entity List Type:"
          autoFocus
          helperText={"Entity Type"}
          variant="outlined"
          fullWidth
          className='nodrag slc'
          value={entityTypetype}
          onChange={onChange}
        >
          { 
            !loading && customTypes.map((val) => { 
              const selc = (entityTypetype === val);
              return (<MenuItem selected={selc} key={val} value={val}> {val} </MenuItem>)
            })
          }
        </Select>
      </div>
      <Handle type="source" position={Position.Bottom} id="b" isConnectable={isConnectable} />
    </div>
  );
}

export default CustomEntityListingNode;