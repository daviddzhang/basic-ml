import React from "react";
import { useField } from "formik";
import "./Forms.css";

const TextField = ({ label, hasInitialErrors, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div className="input-and-error">
      <div className="label-text-row">
        <label className="input-label" htmlFor={props.name}>
          {label}
        </label>
        <input className="text-input" {...field} {...props} />
        </div>
        {(hasInitialErrors || meta.touched) && meta.error ? (
          <div className="error">{meta.error}</div>
        ) : null}
    </div>
  );
};

const SubmitButton = (props) => {
  return (
    <button className="submit-button" type="submit">
      {props.label}
    </button>
  );
};

export { TextField, SubmitButton };
