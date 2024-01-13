import React from "react";

import {
  makeStyles,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
      flexWrap: "wrap",
    },
    btnWrapper: {
      position: "relative",
    },
    textField: {
        width: "80%",
        margin: "0px 20px"
    },
    buttonProgress: {
      position: "absolute",
      top: "50%",
      left: "50%",
      marginTop: -12,
      marginLeft: -12,
    },
    textQuickAnswerContainer: {
      width: "100%",
      margin: "10px 0px"
    },
    nodeEditorConatiner: {
      height: "500px"
    }
}));

const McqModal = ({
    open,
    onClose,
    handleValues,
    setHandleValues,
  }) => {
    const classes = useStyles();
  
    const handleClose = () => {
      onClose();
    };

    const inputs = handleValues.map((value, i) => {
      return <div className={classes.textQuickAnswerContainer}>
            <label htmlFor="text"> option {i} </label>
            <input key={i} name={i} className={classes.textField} defaultValue={value ?? ""} />
        </div>
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        let values = [];
        for (let index = 0; index < handleValues.length; index++) {
            const value = event.target[index].value;
            values.push(value);
        }
        setHandleValues(values);
        onClose();
    };
  
    return (
      <div className={classes.root}>
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth scroll="paper">
            <DialogTitle id="form-dialog-title"> Mulitple Choice Values </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent dividers>
                    { inputs }
                </DialogContent>
                <DialogActions>
                    <Button type="submit" className={classes.btnWrapper}>
                        Done
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
      </div>
    );
};

export default McqModal;