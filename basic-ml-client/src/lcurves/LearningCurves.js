import React from "react";
import PageLayout from "../common/PageLayout";
import FixedDataPlot from "../common/graphing/FixedDataPlot";
import LCurveDataForm from "./LCurveDataForm";
import LCurveCreateForm from "./LCurveCreateForm";
import axios from "axios";
import { zipXY } from "../common/graphing/plot_utils";

class LearningCurves extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      scatterData: {},
      lineData: {},
      submittedWithoutData: false,
      dataError: "",
      curveError: "",
    };
  }

  generateData = (values) => {
    const degree = values.degree;

    axios
      .get("https://basic-ml-api.herokuapp.com/api/lcurve/data", {
        params: {
          degree: degree,
        },
      })
      .then((response) => {
        this.setState({
          scatterData: { scatter: response.data.data },
          lineData: {},
          submittedWithoutData: false,
          dataError: "",
        });
      })
      .catch((error) => {
        this.setState({ dataError: error.response.data || error.message });
      });
  };

  createCurves = (values) => {
    if (!this.state.scatterData.scatter) {
      this.setState({ submittedWithoutData: true });
      return;
    } else {
      const numFeatures = values.numFeatures;
      const lambda = values.lambda;

      axios
        .post("https://basic-ml-api.herokuapp.com/api/lcurve/create", {
          data: this.state.scatterData.scatter,
          num_features: numFeatures,
          lambda: lambda,
        })
        .then((response) => {
          const trainingSizes = response.data.training_sizes;
          const cvScores = response.data.cv_score;
          const trainScores = response.data.training_score;

          const cvLine = zipXY(trainingSizes, cvScores);
          const trainLine = zipXY(trainingSizes, trainScores);

          // reset existing lines
          this.setState({ lineData: {} });
          this.setState({
            lineData: {
              lines: [
                {
                  data: cvLine,
                  name: "CV Score",
                },
                {
                  data: trainLine,
                  name: "Training Score",
                },
              ],
            },
            curveError: "",
          });
        })
        .catch((error) => {
          this.setState({ curveError: error.response.data || error.message });
        });
    }
  };

  render() {
    return (
      <PageLayout>
        <h1 className="page-layout__header">Learning Curves</h1>
        <h2 className="page-layout__small-header">Instructions</h2>
        <p className="page-layout__content">
          Learning curves are a great tool to help analyze your machine learning
          model. In this module, you can generate a dataset conforming to some
          random polynomial function of the specified degree (displayed in the
          mini plot above the input fields) and create learning curves by
          training a linear regression model with the supplied hyperparameters.
          The model is trained on a total of 1600 data points with the CV and
          training scores being calculated at regular intervals from 1 training
          example to 1600 training examples.
          <br />
          <br />
          To see high bias and an underfitted model manifest itself in learning
          curves, generate some data belonging to a high degree polynomial.
          However, use only one feature for your model and/or a high
          regularization constant - you should see both CV and training scores
          converging at a very high cost. To see high variance and an overfitted
          model, you can keep the same data but use more features than the
          degree of your function and a lower regularization parameter - you
          should see the CV and training scores converging at a much lower cost.
          <br />
          <br />
          <b>
            IMPORTANT: Due to the way the API is deployed, it may be asleep if
            you are the first person to use the site in a while. If generating
            data or submitting a form has seemingly no effect, please give it
            several seconds to wake up and try again. This may require
            refreshing the entire site.
          </b>
        </p>
        <br />
        <div className="plot-form-module">
          <FixedDataPlot
            data={this.state.lineData}
            id="line-plot"
            xLabel="Number of Training Examples"
            yLabel="MSE Cost"
          />
          <div className="plot-form-module__forms">
            <label className="plot-title">Data</label>
            <FixedDataPlot data={this.state.scatterData} id="data-plot-small" />
            <LCurveDataForm
              onSubmit={this.generateData}
              submittedWithoutData={this.state.submittedWithoutData}
              dataError={this.state.dataError}
            />
            <br />
            <LCurveCreateForm
              onSubmit={this.createCurves}
              curveError={this.state.curveError}
            />
          </div>
        </div>
      </PageLayout>
    );
  }
}

export default LearningCurves;
