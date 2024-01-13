import React, { useState, useEffect, useRef } from "react";
import openSocket from "../../services/socket-io";
import * as Yup from "yup";
import * as _ from 'lodash';
import { TrayWidget } from '../TrayWidget';
import McqNode from '../McqNode';

import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
  SmoothStepEdge
} from 'reactflow';

import 'reactflow/dist/style.css';

import {
  makeStyles,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from "@material-ui/core";
import { green } from "@material-ui/core/colors";
import { i18n } from "../../translate/i18n";

import api from "../../services/api";
import toastError from "../../errors/toastError";

const useStyles = makeStyles((theme) => ({
  textField: {
    marginRight: theme.spacing(1),
    width: "100%",
  },
  btnWrapper: {
    position: "relative",
  },
  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
  textuserFlowContainer: {
    width: "100%",
  },
  nodeEditorConatiner: {
    height: "600px"
  },
  body: {
    flexGrow: '1',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100%'
  },
  header: {
    display: 'flex',
    background: ' rgb(30, 30, 30)',
    flexGrow: '0',
    flexShrink: '0',
    color: 'white',
    fontFamily: 'Helvetica, Arial, sans-serif',
    padding: '10px',
    alignItems: 'center'
  },
  content: {
    display: 'flex',
    flexGrow: '1'
  },
  layer: {
    position: 'relative',
    flexGrow: '1'
  }
}));

const userFlowSchema = Yup.object().shape({
  title: Yup.string()
    .min(2, "Too Short!")
    .max(15, "Too Long!")
    .required("Required"),
  flow: Yup.string(),
});

let id = 0;
const getId = () => `dndnode_${Date.now()}_${id++}`;

const nodeTypes = {
  home: McqNode,
  profile: McqNode,
  news: McqNode,
  singleNews: McqNode,
};

const edgeTypes = {
  smoothStep: SmoothStepEdge,
};

const defaultEdgeOptions = {
  animated: false,
  type: 'smoothStep',
};

const UserFlowModal = ({
  open,
  onClose,
  userFlowId,
  userId,
  initialValues,
}) => {
  const classes = useStyles();

  const initialState = {
    title: "",
    flow: "",
  };

  const [isLoading, setIsLoading] = useState(false);
  const initialNodes = [];
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);


  useEffect(() => {
    const fetchuserFlow = async () => {
      setIsLoading(true);

      if (!userFlowId) {
        setIsLoading(false);
        return;
      };

      try {
        const { data } = await api.get(`/flow?userflowId=${userFlowId}`);
        
        const flow = restoreFlow(data.flow.flow);

        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);

        if(data.lastNode){
          setNodes((nodes) => {
            nodes.forEach((node) => {
              if(data.lastNode === node.id){
                node.data.active = true;
              }else{
                node.data.active = false;
              }
            });
            return nodes;
          })
        }
      } catch (err) {
        toastError(err);
      }

      setIsLoading(false);
    };

    fetchuserFlow();
  }, [userFlowId, open, initialValues]);

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    const socket = openSocket();
    socket.on("currentNode", (data) => {
      console.log(data);
      console.log(userId);
      if (data.action === "update" && data.userId === userId) {
        setIsLoading(true);
        setNodes((nodes) => {
          nodes.forEach((node) => {
            if(data.currentNodeId === node.id){
              node.data.active = true;
            }else{
              node.data.active = false;
            }
          });
          return nodes;
        })
        setIsLoading(false);
      }
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  // ============ NODE EDITOR ===============

  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const getFlowStringfied = () => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      delete flow.viewport;
      const flowString = JSON.stringify(flow);
      return flowString;
    }
    return "";
  };

  const restoreFlow = (flowString) => {
    try {
      const flow = JSON.parse(flowString);
      if (flow) {
        return {
          nodes: flow.nodes || [],
          edges: flow.edges || [],
        };
      }
    } catch (e) {
      return {};
    }
    return {};
  };

  // ======================================

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xl" fullWidth scroll="paper">
      <DialogTitle id="form-dialog-title">
        View
      </DialogTitle>
      {isLoading ? <CircularProgress size={24} className={classes.buttonProgress} /> : (

        <div className={classes.nodeEditorConatiner}>
          <div className={classes.body}>
            <div className={classes.header}>
              <div className="title"> Workflow Editior </div>
            </div>
            <div className={classes.content}>
              <TrayWidget>

              </TrayWidget>
              <ReactFlowProvider>
                <div className={classes.layer} ref={reactFlowWrapper}>
                  <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onInit={setReactFlowInstance}
                    fitView
                    nodeTypes={nodeTypes}
                    defaultEdgeOptions={defaultEdgeOptions}
                    edgeTypes={edgeTypes}
                  >
                    <Controls />
                    <Background />
                  </ReactFlow>
                </div>
              </ReactFlowProvider>
            </div>
          </div>
        </div>
      )}
    </Dialog>
  );
};

export default UserFlowModal;
