import React from "react";
import { Formik, Form } from "formik";
import { TextField, SubmitButton } from "../common/form_fields";
import * as Yup from "yup";

const GDFunctionForm = (props) => {
  return (
    <div>
      <Formik
        initialValues={{
          function: "",
        }}
        initialErrors={{
            function: props.submittedWithoutFunction ? "A function must be defined before performing gradient descent" : ""
        }}
        validationSchema={Yup.object({
          function: Yup.string().required("Function required"),
        })}
        validateOnChange={false}
        validateOnBlur={false}
        enableReinitialize={true}
        onSubmit={(values, { setErrors }) => {
            try {
                props.onSubmit(values)
            }
            catch (error) {
                setErrors({function: error.message})
            }
            
        }}
      >
        <Form className="vertical-form">
          <TextField
            label="Function: "
            name="function"
            type="text"
            placeholder="x^2"
            hasInitialErrors={true}
          />

          <SubmitButton label="Submit function" />
        </Form>
      </Formik>
    </div>
  );
};

export default GDFunctionForm;
