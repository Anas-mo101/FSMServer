import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
	mainPaper: {
		margin: "0px",
	}
}));


export default function Title(props) {
	const classes = useStyles();

	return (
		<Typography classes={classes.mainPaper} variant="h5" color="primary" gutterBottom>
			{props.children}
		</Typography>
	);
}
