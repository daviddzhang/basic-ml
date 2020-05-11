import React from "react";
import PageLayout from "../common/PageLayout";
import GradientDescentModel from "./grad_desc";
import GDFunctionForm from "./GDFunctionForm";
import GDParamForm from "./GDParamForm";
import Plot from "../common/graphing/Plot";

class GradientDescent extends React.Component {
  constructor(props) {
    super(props);

    this.state = { model: null, data: {}, submittedWithoutFunction: false };
  }

  funcHandleSubmit = (values) => {
    const newGDModel = new GradientDescentModel(values.function);
    this.setState({
      model: newGDModel,
      data: { functions: [(x) => newGDModel.evalFunc(x)] },
    });
  };

  performGD = (values) => {
    // make sure that a model has been defined before attempting to do gradient descent
    if (this.state.model === null) {
      this.setState({ submittedWithoutFunction: true });
      // throw exception here to avoid needing to return an x value
      throw new Error("Attempting to perform GD without model");
    } else {
      this.setState({ submittedWithoutFunction: false });
      this.state.model.setX(values.xVal);
      this.state.model.setLearningRate(values.alpha);
      setTimeout(this.state.model.applyNSteps(values.numIter), 500);
      const newData = Object.assign({}, this.state.data);
      newData.points = [[this.state.model.curX, this.state.model.curY]];
      this.setState({ data: newData });
      return this.state.model.curX.toFixed(3);
    }
  };

  render() {
    return (
      <PageLayout>
        <h1 className="page-layout__header">Gradient Descent</h1>
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
          <br /> <br />
          <b>
            IMPORTANT: if you try to perform a large number of iterations
            (tens of millions), the site might not be able to handle it and
            crash. Sorry!
          </b>
        </p>
        <br/>
        <div className="plot-form-module">
          <Plot data={this.state.data} />
          <div className="plot-form-module__forms">
            <GDFunctionForm
              onSubmit={this.funcHandleSubmit}
              submittedWithoutFunction={this.state.submittedWithoutFunction}
            />
            <br />
            <GDParamForm onSubmit={this.performGD} />
          </div>
        </div>
      </PageLayout>
    );
  }
}

export default GradientDescent;
