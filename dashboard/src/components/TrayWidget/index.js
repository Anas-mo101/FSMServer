import * as React from 'react';
import {  makeStyles, Container } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '200px',
        background: 'rgb(20, 20, 20)',
        flexGrow: '0',
        flexShrink: '0'
    },
}));

export const TrayWidget = (props) => {
    const classes = useStyles();

	return(
        <div className={classes.root}> {props.children} </div>
    );
};