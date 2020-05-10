import React from "react";
import { Formik, Form } from "formik";
import { TextField, SubmitButton } from "../common/form_fields";
import * as Yup from "yup";
import "../common/Forms.css";

const LinRegModelForm = (props) => {
  return (
    <div>
      <Formik
        initialValues={{
          numFeatures: "",
          lambda: "",
        }}
        initialErrors={{
          lambda: props.modelError,
        }}
        validationSchema={Yup.object({
          numFeatures: Yup.number()
            .required("Number of features required")
            .positive("Must be positive")
            .integer("Must be an integer"),
          lambda: Yup.number()
            .required("A regularization parameter is required")
            .min(0, "Must be non-negative"),
        })}
        enableReinitialize={true}
        validateOnChange={false}
        onSubmit={(values, { setErrors, setSubmitting }) => {
          try {
            setSubmitting(true);
            props.onSubmit(values);
            setSubmitting(false);
          } catch (error) {
            // shouldn't happen unless there's a network error, in which case arbitrarily pick bottom field to display error
            setErrors({ lambda: error.message });
          }
        }}
      >
        <Form className="vertical-form">
          <TextField
            label="Number of features: "
            name="numFeatures"
            type="number"
            placeholder="1"
          />
          <TextField
            label="Regularization parameter: "
            name="lambda"
            type="number"
            placeholder="1.0"
          />
          <SubmitButton label="Train Linear Regression Model" />
        </Form>
      </Formik>
    </div>
  );
};

export default LinRegModelForm;
