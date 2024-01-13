import * as React from 'react';
import {  makeStyles, Container } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
        color: 'white',
		fontFamily: 'Helvetica, Arial',
		padding: '5px',
		margin: '0px 10px',
		borderRadius: '5px',
		marginBottom: '2px',
		cursor: 'pointer'
    },
}));


export const TrayItemWidget = props => {

    const classes = useStyles();

    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
      };

	return (
        <div
            color={props.color}
            draggable={true}
            onDragStart={(event) => onDragStart(event, props.model)}
            className={classes.root + " tray-item"}
            style={{border: `solid 1px ${props.color}`, margin: '10px 5px'}}
        >
            {props.name}
        </div>
    )
}