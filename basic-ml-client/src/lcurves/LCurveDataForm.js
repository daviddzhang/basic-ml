import React from "react";
import { Formik, Form } from "formik";
import { TextField, SubmitButton } from "../common/form_fields";
import * as Yup from "yup";

const LCurveDataForm = (props) => {
  return (
    <div>
      <Formik
        initialValues={{
          degree: "",
        }}
        initialErrors={{
          degree:
            props.dataError || (props.submittedWithoutData
              ? "Data must be generated before creating learning curves"
              : ""),
        }}
        validationSchema={Yup.object({
          degree: Yup.number()
            .required("Degree of function required")
            .moreThan(-1, "Degree must be non-negative")
            .integer("Degree must be an integer"),
        })}
        validateOnChange={false}
        validateOnBlur={false}
        enableReinitialize={true}
        onSubmit={(values, { setErrors, setSubmitting }) => {
          try {
            setSubmitting(true);
            props.onSubmit(values);
            setSubmitting(false);
          } catch (error) {
            // shouldn't happen unless there's a network error, in which case arbitrarily pick bottom field to display error
            setErrors({ numData: error.message });
          }
        }}
      >
        <Form className="vertical-form">
          <TextField
            label="Degree of function: "
            name="degree"
            type="number"
            placeholder="1"
            hasInitialErrors={true}
          />

          <SubmitButton label="Generate data" />
        </Form>
      </Formik>
    </div>
  );
};

export default LCurveDataForm;
