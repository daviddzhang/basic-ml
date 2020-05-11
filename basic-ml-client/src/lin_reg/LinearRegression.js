import React from "react";
import PageLayout from "../common/PageLayout";
import Plot from "../common/graphing/Plot";
import LinRegDataForm from "./LinRegDataForm";
import LinRegModelForm from "./LinRegModelForm";
import { generateCoefficientsFunc } from "../utils/ml_utils";
import axios from "axios";

class LinearRegression extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      submittedWithoutData: false,
      dataError: "",
      modelError: "",
      funcEval: null,
    };
  }

  generateData = (values) => {
    const degree = values.degree;
    const numData = values.numData;

    axios
      .get("https://basic-ml-api.herokuapp.com/api/linreg/generate", {
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
        .post("https://basic-ml-api.herokuapp.com/api/linreg/fit", {
          data: this.state.data.scatter,
          num_features: numFeatures,
          lambda: lambda,
        })
        .then((response) => {
          const coefficients = response.data.coefficients;
          this.setState({ funcEval: generateCoefficientsFunc(coefficients) });
          const newData = Object.assign({}, this.state.data);
          newData.functions = [(x) => this.state.funcEval.evaluate({ x: x })];
          this.setState({ data: newData, modelError: "" });
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
        <h2 className="page-layout__small-header">Instructions</h2>
        <p className="page-layout__content">
          Linear regression is a great introduction to machine learning. In its
          simplest form, it's something that we've most likely all seen before
          at some point, whether from plotting spreadsheet data or taking a
          statistics class. This module lets you generate sample data conforming
          to some random function of the specified polynomial degree. With the
          data generated, you can then train a regularized linear regression
          model and see its trained parameters plotted on the graph as a
          function. You can see the impacts that regularization, model
          complexity, and number of training examples can have on your final
          model in the form of variance/bias or overfitting/underfitting. These
          ideas can be further explored in the Learning Curves module.
          <br />
          <b>Note</b>: The number of features field relates to generating
          polynomial features out of our single feature to produce a non-linear
          model. For example, if our feature is x and we select our number of
          features to be 3, we will generate 2 new features, x^2 and x^3 to
          capture more complexity in the data.
          <br /> <br />
          To start off, I would suggest submitting the placeholder values you
          see in each field. After you see your model's parameters plotted on
          the graph, feel free to play around with the parameters! If you
          generate data from a high degree function, you might have to zoom out
          a bit to see all your data points. Even though the dataset used to train
          our model is unrealistically simple, having instant visual feedback
          on tuning parameters is a great way to develop intuition for the
          aforementioned concepts of variance, bias, and regularization.
        </p>
        <br/>
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
      </PageLayout>
    );
  }
}

export default LinearRegression;
