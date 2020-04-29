import React from "react";
import { Formik, Form } from "formik";
import { TextField, SubmitButton } from "../common/form_fields";
import * as Yup from "yup";
import "../common/Forms.css"

const GDParamForm = (props) => {
  return (
    <div>
      <Formik
        initialValues={{
          xVal: "",
          alpha: "",
          numIter: "",
        }}
        validationSchema={Yup.object({
          xVal: Yup.number().required("X value required"),
          alpha: Yup.number()
            .required("A learning rate is required")
            .positive("Must be positive"),
          numIter: Yup.number()
            .required("Must supply a number of iterations to perform")
            .moreThan(-1, "Must be non-negative")
            .integer("Must be an integer"),
        })}
        validateOnChange={false}
        onSubmit={(values, { setFieldValue, setSubmitting }) => {
          try {
            setSubmitting(true);
            const newX = props.onSubmit(values);
            setFieldValue("xVal", newX, false);
            setSubmitting(false);
          } catch (error) {
              // do nothing since the error is handled by function form
          }
        }}
      >
        <Form className="vertical-form">
          <TextField
            label="X Value: "
            name="xVal"
            type="number"
            placeholder="1.0"
          />
          <TextField
            label="Learning Rate: "
            name="alpha"
            type="number"
            placeholder="0.3"
          />
          <TextField
            label="Number of Iterations: "
            name="numIter"
            type="number"
            placeholder="0"
          />
          <SubmitButton label="Perform Gradient Descent" />
        </Form>
      </Formik>
    </div>
  );
};

export default GDParamForm;
