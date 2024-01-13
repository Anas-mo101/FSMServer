import React, { useState, useRef, useCallback, useEffect } from 'react';
import * as _ from 'lodash';
import { TrayWidget } from '../TrayWidget';
import { TrayItemWidget } from '../TrayItemWidget';

import ButtonEdge from '../ButtonEdge';
import McqNode from '../McqNode';

import { toast } from "react-toastify";

import ReactFlow, {
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    ReactFlowProvider,
    SmoothStepEdge,
    MarkerType
} from 'reactflow';

import 'reactflow/dist/style.css';

import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
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

let id = 0;
const getId = () => `dndnode_${Date.now()}_${id++}`;

const nodeTypes = {
    home: McqNode,
    profile: McqNode,
    news: McqNode,
    singleNews: McqNode,
};

const edgeTypes = {
    smoothStep: ButtonEdge,
};

const defaultEdgeOptions = {
    animated: false,
    type: 'smoothStep',
};

export const NodeEditior = props => {
    const initialNodes = [];
    const nodeLimit = 100;
    const classes = useStyles();
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const generateRandomHexColors = (num) => {
        const colors = [];

        for (let i = 0; i < num; i++) {
            // Generate a random hex color string
            const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
            colors.push(randomColor);
        }

        return colors;
    }

    const getRandomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16);

    useEffect(() => {
        const fetchValue = async () => {
            if (props.flow.nodes) {
                const flow = props.flow;
                setNodes(flow.nodes || []);

                const colors = generateRandomHexColors(flow?.edges?.length ?? 0);

                setEdges(flow.edges.map((e,i) => {
                    return {
                        ...e,
                        type: "smoothStep",
                        markerEnd: {
                            type: MarkerType.ArrowClosed,
                            width: 20,
                            height: 20,
                            color: colors[i],
                        },
                        style: {
                            strokeWidth: 2,
                            stroke: colors[i],
                        },
                    }
                }) || []);
            } else {
                setNodes([
                    {
                        id: getId(),
                        type: 'input',
                        data: { label: 'Opening' },
                        position: { x: 0, y: 50 },
                    }
                ]);
            }
        };
        fetchValue();
    }, []);

    const onConnect = useCallback((params) => setEdges((eds) => {
    
    const color = getRandomColor();

    return addEdge({
        ...params,
        type: "smoothStep",
        markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color: color,
        },
        style: {
            strokeWidth: 2,
            stroke: color,
        },
    }, eds)
    
    
    }), []);

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback((event) => {
        event.preventDefault();

        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
        const type = event.dataTransfer.getData('application/reactflow');

        // check if the dropped element is valid
        if (typeof type === 'undefined' || !type) {
            return;
        }

        let labelName = ``;
        switch (type) {
            case "input":
                labelName = `Opening`;
                break;
            case "output":
                labelName = `Close`;
                break;
            default:
                labelName = `${type} nodes`;
                break;
        }

        const newNode = {
            id: getId(),
            type,
            position: props.refInc.project({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            }),
            data: { label: labelName },
        };

        setNodes((nds) => {
            if (nds.length >= nodeLimit) {
                toast.error(`Can not execeed more than ${nodeLimit} nodes`);
                return nds;
            }

            return nds.concat(newNode)
        });

    }, [props.refInc]);

    return (
        <div className={classes.body}>
            <div className={classes.header}>
                <div className="title"> Workflow Editior </div>
            </div>
            <div className={classes.content}>
                <TrayWidget>
                    <TrayItemWidget model='home' name="Home" color="rgb(192,255,0)" />
                    <TrayItemWidget model='profile' name="Profile" color="rgb(192,255,0)" />
                    <TrayItemWidget model='news' name="News" color="rgb(192,255,0)" />
                    <TrayItemWidget model='singleNews' name="Single News" color="rgb(192,255,0)" />
                </TrayWidget>

                <ReactFlowProvider>
                    <div className={classes.layer} ref={reactFlowWrapper}>
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            onInit={props.refSetter}
                            onDrop={onDrop}
                            onDragOver={onDragOver}
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
    );
}