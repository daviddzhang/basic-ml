import React from "react";
import { Formik, Form } from "formik";
import { TextField, SubmitButton } from "../common/form_fields";
import * as Yup from "yup";

const LinRegDataForm = (props) => {
  return (
    <div>
      <Formik
        initialValues={{
          degree: "",
          numData: "",
        }}
        initialErrors={{
          numData:
            props.dataError || (props.submittedWithoutData
              ? "Data must be generated before training your model"
              : ""),
        }}
        validationSchema={Yup.object({
          degree: Yup.number()
            .required("Degree of function required")
            .moreThan(-1, "Degree must be non-negative")
            .integer("Degree must be an integer"),
          numData: Yup.number()
            .required("Must supply number of training points to generate")
            .positive(
              "Must supply a positive number of data points to generate"
            )
            .integer("Number of data must be an integer"),
        })}
        validateOnChange={false}
        enableReinitialize={true}
        onSubmit={(values, { setErrors }) => {
          try {
            props.onSubmit(values);
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
          <TextField
            label="# of training examples: "
            name="numData"
            type="number"
            placeholder="20"
          />

          <SubmitButton label="Generate data" />
        </Form>
      </Formik>
    </div>
  );
};

export default LinRegDataForm;
