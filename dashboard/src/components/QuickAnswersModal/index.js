import React, { useState, useEffect, useRef } from "react";

import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";

import { NodeEditior } from "../NodeEditior";

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
  root: {
    flexWrap: "wrap",
  },
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
  textQuickAnswerContainer: {
    width: "100%",
  },
  nodeEditorConatiner: {
    height: "500px"
  }
}));

const QuickAnswerSchema = Yup.object().shape({
  title: Yup.string()
    .min(2, "Too Short!")
    .max(15, "Too Long!")
    .required("Required"),
  flow: Yup.string(),
});

const QuickAnswersModal = ({
  open,
  onClose,
  quickAnswerId,
  initialValues,
  onSave,
}) => {
  const classes = useStyles();

  const initialState = {
    title: "",
    flow: "",
  };

  const [quickAnswer, setQuickAnswer] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);

 
  useEffect(() => {
    const fetchQuickAnswer = async () => {
      setIsLoading(true);
      if (initialValues) {
        setQuickAnswer((prevState) => {
          return { ...prevState, ...initialValues };
        });
      }

      if (!quickAnswerId) {
        setIsLoading(false);
        setFlow({});
        return;
      };

      try {
        const { data } = await api.get(`/flow/${quickAnswerId}`);
        setQuickAnswer(data);
        setFlow(restoreFlow(data.flow));
      } catch (err) {
        toastError(err);
      }

      setIsLoading(false);
    };

    fetchQuickAnswer();
  }, [quickAnswerId, open, initialValues]);

  const handleClose = () => {
    onClose();
    setQuickAnswer(initialState);
  };

  const handleSaveQuickAnswer = async (values) => {
    try {
      values.flow = getFlowStringfied();
      if (quickAnswerId) {
        await api.put(`/flow/${quickAnswerId}`, values);
        handleClose();
      } else {
        const { data } = await api.post("/flow", values);
        if (onSave) {
          onSave(data);
        }
        handleClose();
      }
      toast.success(i18n.t("quickAnswersModal.success"));
    } catch (err) {
      toastError(err);
    }
  };

  // ============ NODE EDITOR ===============

  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [flow, setFlow] = useState({});
 
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
    try{
      const flow = JSON.parse(flowString);
      if (flow) {
        return {
          nodes: flow.nodes || [ ],
          edges: flow.edges || [ ],
        };
      }
    } catch(e) {
      return {};
    }
    return {};
  };

  // ======================================

  return (
    <div className={classes.root}>
      <Dialog open={open} onClose={handleClose} maxWidth="xl" fullWidth scroll="paper">
        <DialogTitle id="form-dialog-title">
          {quickAnswerId ? `${i18n.t("quickAnswersModal.title.edit")}` : `${i18n.t("quickAnswersModal.title.add")}`}
        </DialogTitle>
        <Formik
          initialValues={quickAnswer}
          enableReinitialize={true}
          validationSchema={QuickAnswerSchema}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              handleSaveQuickAnswer(values);
              actions.setSubmitting(false);
            }, 400);
          }}
        >
          {({ values, errors, touched, isSubmitting }) => (
            <Form>
              <DialogContent dividers>
                <div className={classes.textQuickAnswerContainer}>
                  <Field
                    as={TextField}
                    label={i18n.t("quickAnswersModal.form.shortcut")}
                    name="title"
                    autoFocus
                    error={touched.title && Boolean(errors.title)}
                    helperText={touched.title && errors.title}
                    variant="outlined"
                    margin="dense"
                    className={classes.textField}
                    fullWidth
                  />
                </div>
                <div className={classes.nodeEditorConatiner}>
                  { isLoading ? <CircularProgress size={24} className={classes.buttonProgress} />  : <NodeEditior refInc={reactFlowInstance} refSetter={setReactFlowInstance} flow={flow} /> }
                </div>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleClose}
                  color="secondary"
                  disabled={isSubmitting}
                  variant="outlined"
                >
                  {i18n.t("quickAnswersModal.buttons.cancel")}
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  disabled={isSubmitting}
                  variant="contained"
                  className={classes.btnWrapper}
                >
                  {quickAnswerId
                    ? `${i18n.t("quickAnswersModal.buttons.okEdit")}`
                    : `${i18n.t("quickAnswersModal.buttons.okAdd")}`}
                  {isSubmitting && (
                    <CircularProgress size={24} className={classes.buttonProgress} />
                  )}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </div>
  );
};

export default QuickAnswersModal;
