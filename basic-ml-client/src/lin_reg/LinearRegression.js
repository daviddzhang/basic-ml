import React from "react";
import PageLayout from "../common/PageLayout";
import Plot from "../common/graphing/Plot";
import LinRegDataForm from "./LinRegDataForm";
import LinRegModelForm from "./LinRegModelForm";
import { evalCoefficients } from "../utils/ml_utils"
import axios from "axios";

class LinearRegression extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      submittedWithoutData: false,
      dataError: "",
      modelError: "",
    };
  }

  generateData = (values) => {
    const degree = values.degree;
    const numData = values.numData;

    axios
      .get("/api/linreg/generate", {
        params: {
          degree: degree,
          numExamples: numData,
        },
      })
      .then((response) => {
        this.setState({
          data: { scatter: response.data.data },
          submittedWithoutData: false,
          dataError: "",
        });
      })
      .catch((error) => {
        this.setState({ dataError: error.response.data || error.message });
      });
  };

  trainModel = (values) => {
    if (!this.state.data.scatter) {
      this.setState({ submittedWithoutData: true });
      return;
    } else {
      const numFeatures = values.numFeatures;
      const lambda = values.lambda;

      axios
        .post("/api/linreg/fit", {
          data: this.state.data.scatter,
          num_features: numFeatures,
          lambda: lambda,
        })
        .then((response) => {
          const coefficients = response.data.coefficients;
          console.log(coefficients)
          const newData = Object.assign({}, this.state.data);
          newData.functions = [(x) => evalCoefficients(x, coefficients)]
          this.setState({ data: newData });
        })
        .catch((error) => {
          this.setState({ modelError: error.response.data || error.message });
        });
    }
  };

  render() {
    return (
      <PageLayout>
        <h1 className="page-layout__header">Linear Regression</h1>
        <div className="plot-form-module">
          <Plot data={this.state.data} />
          <div className="plot-form-module__forms">
            <LinRegDataForm
              onSubmit={this.generateData}
              submittedWithoutData={this.state.submittedWithoutData}
              dataError={this.state.dataError}
            />
            <br />
            <LinRegModelForm
              onSubmit={this.trainModel}
              modelError={this.state.modelError}
            />
          </div>
        </div>
        <br />
        <h2 className="page-layout__small-header">Instructions</h2>
        <p className="page-layout__content">
          Gradient descent is a core concept that deals with the "learning" part
          of "machine learning." In this module, you can choose your own simple
          function (<b>one variable only, no trig functions</b>) to treat as a
          cost function and perform gradient descent on. After inputting a valid
          function, you can choose a starting x value, learning rate, and number
          of iterations to start performing gradient descent. The red dot that
          appears after submitting the aforementioned parameters represents your
          current "cost" - as you perform more iterations of gradient descent,
          you should see your dot approaching a local/absolute minimum.
          <br /> <br />
          To start off, I would suggest submitting the placeholder values you
          see in each field. After you get the red dot, increase the number of
          iterations to 1 begin stepping through gradient descent. From there,
          you can change up your function, play with the learning rates, and
          experiment to your heart's content! Note that you can zoom and drag in
          the plot.
          <br /> <br />
          It's important to mention that any function that this module accepts
          is far less complex than any real cost function you'd see out in the
          field: it would be rare to find a model with only one feature.
          However, I do think this can help build a visual picture as to what's
          happening on a feature-by-feature basis when using partial derivatives
          to perform gradient descent for a model with many features. It's also
          helpful to see how learning rate (especially a bad learning rate), can
          impact the process.
        </p>
      </PageLayout>
    );
  }
}

export default LinearRegression;
