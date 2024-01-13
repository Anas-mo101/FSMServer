import * as React from 'react';
import {  makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	expand: {
		height: '100%',
	}
}));


export const DemoCanvasWidget = props => {
	const classes = useStyles();

	return (
		<>
			<div className='contentroot' >
				{props.children}
			</div>
		</>
	)
}