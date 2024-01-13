import React, { useState, useEffect, useRef } from "react";

import * as Yup from "yup";
import { Formik, FieldArray, Form, Field } from "formik";
import { toast } from "react-toastify";

import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import Dialog from "@material-ui/core/Dialog";
import MenuItem from "@material-ui/core/MenuItem";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import CircularProgress from "@material-ui/core/CircularProgress";

import { i18n } from "../../translate/i18n";

import api from "../../services/api";
import toastError from "../../errors/toastError";

const useStyles = makeStyles(theme => ({
	root: {
		display: "flex",
		flexWrap: "wrap",
	},
	textField: {
		marginRight: theme.spacing(1),
		flex: 1,
	},

	extraAttr: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
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
}));

const CustomEntityModalSchema = Yup.object().shape({
	name: Yup.string().max(50, "Too Long!").required("Required"),
	body: Yup.string(),
	image: Yup.string(),
	entityType: Yup.string().required("Required"),
});

const CustomEntityModal = ({ open, onClose, entityId, initialValues, onSave, types }) => {
	const classes = useStyles();
	const isMounted = useRef(true);

	const initialState = {
		name: "",
		body: "",
		entityType: "",
		picurl: "",
	};

	const [contact, setContact] = useState(initialState);
	const [isNewType, setIsNewType] = useState(false);

	useEffect(() => {
		return () => {
			isMounted.current = false;
		};
	}, []);

	useEffect(() => {
		const fetchContact = async () => {
			if (initialValues) {
				setContact(prevState => {
					return { ...prevState, ...initialValues };
				});
			}

			if (!entityId) return;

			try {
				const { data } = await api.get(`/entity/${entityId}`);
				if (isMounted.current) {
					setContact(data);
				}
			} catch (err) {
				toastError(err);
			}
		};

		fetchContact();
	}, [entityId, open, initialValues]);

	const handleClose = () => {
		onClose();
		setContact(initialState);
	};

	const handleSaveContact = async values => {
		try {
			if(!isNewType) {
				values.entityType = contact.entityType;
			}

			delete values.createdAt;
			delete values.updatedAt;

			if (entityId) {
				await api.put(`/entity/${entityId}`, values);
				handleClose();
			} else {
				const { data } = await api.post("/entity", values);
				if (onSave) {
					onSave(data);
				}
				handleClose();
			}
			toast.success(i18n.t("contactModal.success"));
		} catch (err) {
			toastError(err);
		}
	};

	return (
		<div className={classes.root}>
			<Dialog open={open} onClose={handleClose} maxWidth="lg" scroll="paper">
				<DialogTitle id="form-dialog-title">
					{entityId ? `Edit Entity` : `Add Entity`}
				</DialogTitle>
				<Formik
					initialValues={contact}
					enableReinitialize={true}
					validationSchema={CustomEntityModalSchema}
					onSubmit={(values, actions) => {
						setTimeout(() => {
							handleSaveContact(values);
							actions.setSubmitting(false);
						}, 400);
					}}
				>
					{({ values, errors, touched, isSubmitting }) => (
						<Form>
							<DialogContent dividers>
								<Typography variant="subtitle1" gutterBottom>
									Entity Details
								</Typography>
								
								<Field
									as={TextField}
									label={i18n.t("contactModal.form.name")}
									name="name"
									autoFocus
									error={touched.name && Boolean(errors.name)}
									helperText={touched.name && errors.name}
									variant="outlined"
									margin="dense"
									fullWidth
								/>
								<Select
									label="Select automated flow"
									autoFocus
									helperText={"Automated Flow"}
									variant="outlined"
									margin="dense"
									fullWidth
									value={contact.entityType}
									onChange={val => {
										if(val.target.value === "cus-entity-new-type"){
											setIsNewType(true);
											return;
										}
										setIsNewType(false);

										contact.entityType = val.target.value;
										setContact(() => {
											return { ...values, entityType: val.target.value };
										});
									}}
								>
									<MenuItem value="cus-entity-new-type"> Add New Type </MenuItem>
									{ 
										types.map((q) => <MenuItem selected={contact.entityType === q} value={q}> {q} </MenuItem>)
									}
								</Select>
								{ 
									isNewType && 
									<Field
										as={TextField}
										label="New Type Name"
										name="entityType"
										error={touched.entityType && Boolean(errors.entityType)}
										helperText={touched.entityType && errors.entityType}
										placeholder="Body"
										variant="outlined"
										fullWidth
										margin="dense"
									/>
								}
								<Field
									as={TextField}
									label="Body"
									name="body"
									error={touched.body && Boolean(errors.body)}
									helperText={touched.body && errors.body}
									placeholder="Body"
									variant="outlined"
									fullWidth
									margin="dense"
								/>
								<Field
									as={TextField}
									label="Image URL"
									name="picUrl"
									error={touched.picUrl && Boolean(errors.picUrl)}
									helperText={touched.picUrl && errors.picUrl}
									placeholder="Image URL"
									fullWidth
									margin="dense"
									variant="outlined"
								/>
								
								<Typography
									style={{ marginBottom: 8, marginTop: 12 }}
									variant="subtitle1"
								>
									{i18n.t("contactModal.form.extraInfo")}
								</Typography>

								<FieldArray name="meta">
									{({ push, remove }) => (
										<>
											{values.meta &&
												values.meta.length > 0 &&
												values.meta.map((info, index) => (
													<div
														className={classes.extraAttr}
														key={`${index}-info`}
													>
														<Field
															as={TextField}
															label={i18n.t("contactModal.form.extraName")}
															name={`meta[${index}].name`}
															variant="outlined"
															margin="dense"
															className={classes.textField}
														/>
														<Field
															as={TextField}
															label={i18n.t("contactModal.form.extraValue")}
															name={`meta[${index}].value`}
															variant="outlined"
															margin="dense"
															className={classes.textField}
														/>
														<IconButton
															size="small"
															onClick={() => remove(index)}
														>
															<DeleteOutlineIcon />
														</IconButton>
													</div>
												))}
											<div className={classes.extraAttr}>
												<Button
													style={{ flex: 1, marginTop: 8 }}
													variant="outlined"
													color="primary"
													onClick={() => push({ name: "", value: "" })}
												>
													{`+ ${i18n.t("contactModal.buttons.addExtraInfo")}`}
												</Button>
											</div>
										</>
									)}
								</FieldArray>
							</DialogContent>
							<DialogActions>
								<Button
									onClick={handleClose}
									color="secondary"
									disabled={isSubmitting}
									variant="outlined"
								>
									{i18n.t("contactModal.buttons.cancel")}
								</Button>
								<Button
									type="submit"
									color="primary"
									disabled={isSubmitting}
									variant="contained"
									className={classes.btnWrapper}
								>
									{entityId
										? `${i18n.t("contactModal.buttons.okEdit")}`
										: `${i18n.t("contactModal.buttons.okAdd")}`}
									{isSubmitting && (
										<CircularProgress
											size={24}
											className={classes.buttonProgress}
										/>
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

export default CustomEntityModal;
