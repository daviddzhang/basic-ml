import * as math from "mathjs";

/**
 * A model that holds logic and state for a function undergoing gradient descent. Once a function is assigned,
 * it should not be mutated.
 */
class GradientDescentModel {
  curX;
  curY;
  varName;
  learningRate = 1.0;

  constructor(funcString) {
    // check for function validity
    const node = math.parse(funcString);
    const allVars = new Set();
    node.traverse(function (node, path, parent) {
      switch (node.type) {
        case "SymbolNode":
          allVars.add(node.name);
          break;
        default:
      }
    });

    if (allVars.size > 1) {
      throw new Error("function must have one variable or less");
    } else {
      this.funcString = funcString;
      this.funcExpr = math.compile(funcString);
      this.varName = allVars.size === 0 ? null : allVars.values().next().value;

      // for some reason math.js doesn't like getting derivative of constants
      this.derivative = allVars.size ? math.compile(math.derivative(funcString, this.varName).toString()) : math.compile("0");
    }
  }

  evalFunc(x) {
    return this.funcExpr.evaluate({ [this.varName]: x });
  }

  evalDerivative(x) {
    return this.derivative.evaluate({ [this.varName]: x });
  }

  calcYBasedOnCurX() {
    return this.funcExpr.evaluate({ [this.varName]: this.curX });
  }

  /**
   * Sets the model's x to the given value. Also sets the model's y value to match the given x.
   *
   * @param {number} x x-value to set
   */
  setX(x) {
    this.curX = x;
    this.curY = this.calcYBasedOnCurX();
  }

  setLearningRate(alpha) {
    this.learningRate = alpha;
  }

  /**
   * Applies a step of gradient descent on the model and updates curX and curY accordingly
   */
  applyStep() {
    this.curX =
      this.curX -
      this.learningRate *
        this.derivative.evaluate({ [this.varName]: this.curX });
  }

  /**
   * Applies n iterations of gradient descent
   *
   * @param {number} n number of iterations to run
   */
  applyNSteps(n) {
    for (let i = 0; i < n; i++) {
      this.applyStep();
    }
    this.curY = this.calcYBasedOnCurX();
  }
}

export default GradientDescentModel;
