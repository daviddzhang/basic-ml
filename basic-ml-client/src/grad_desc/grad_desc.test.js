import GradientDescentModel from "./grad_desc";

var constantModel;
var linearModel;
var quadraticModel;
var polynomialModel;

beforeEach(() => {
  constantModel = new GradientDescentModel("2");
  linearModel = new GradientDescentModel("z");
  quadraticModel = new GradientDescentModel("y^2");
  polynomialModel = new GradientDescentModel("x^4 - 3x^3 + 2x^2 + x - 1");
});

test("throw error if multiple variables entered", () => {
  expect(() => new GradientDescentModel("x + y")).toThrow(Error);
});

test("throw error if invalid syntax is entered", () => {
  expect(() => new GradientDescentModel("x * / x")).toThrow(Error);
});

test("expression with redundant + and - should be okay", () => {
  expect(() => new GradientDescentModel("x + - 2 - + 1")).not.toThrow(Error);
});

test("model to eval constant expressions properly", () => {
  expect(constantModel.evalFunc(1)).toBe(2);
  expect(constantModel.evalFunc(-1)).toBe(2);
  expect(constantModel.evalFunc(0)).toBe(2);
});

test("model to eval linear expressions properly", () => {
  expect(linearModel.evalFunc(1)).toBe(1);
  expect(linearModel.evalFunc(-1)).toBe(-1);
  expect(linearModel.evalFunc(0)).toBe(0);
  expect(linearModel.evalFunc(4)).toBe(4);
});

test("model to eval quadratic expressions properly", () => {
  expect(quadraticModel.evalFunc(1)).toBe(1);
  expect(quadraticModel.evalFunc(-1)).toBe(1);
  expect(quadraticModel.evalFunc(0)).toBe(0);
  expect(quadraticModel.evalFunc(4)).toBe(16);
});

test("model to eval polynomial expressions properly", () => {
  expect(polynomialModel.evalFunc(1)).toBe(0);
  expect(polynomialModel.evalFunc(-1)).toBe(4);
  expect(polynomialModel.evalFunc(0)).toBe(-1);
});

test("model should have correct x and y based on setting new x for constant expression", () => {
  constantModel.setX(1);
  expect(constantModel.curX).toBe(1);
  expect(constantModel.curY).toBe(2);
});

test("model should have correct x and y based on setting new x for linear expression", () => {
  linearModel.setX(2);
  expect(linearModel.curX).toBe(2);
  expect(linearModel.curY).toBe(2);
});

test("model should have correct x and y based on setting new x for quadratic expression", () => {
  quadraticModel.setX(-2);
  expect(quadraticModel.curX).toBe(-2);
  expect(quadraticModel.curY).toBe(4);
});

test("model should have correct x and y based on setting new x for polynomial expression", () => {
  polynomialModel.setX(1);
  expect(polynomialModel.curX).toBe(1);
  expect(polynomialModel.curY).toBe(0);
});

test("applying gd to constant model should have no effect", () => {
  constantModel.setX(4);
  constantModel.setLearningRate(1);
  expect(constantModel.curX).toBe(4);
  expect(constantModel.curY).toBe(2);
  constantModel.applyNSteps(2);
  expect(constantModel.curX).toBe(4);
  expect(constantModel.curY).toBe(2);
});

test("applying gd to linear model should yield correct results", () => {
  linearModel.setX(4);
  linearModel.setLearningRate(1);
  expect(linearModel.curX).toBe(4);
  expect(linearModel.curY).toBe(4);
  linearModel.applyNSteps(2);
  expect(linearModel.curX).toBe(2);
  expect(linearModel.curY).toBe(2);
});

test("applying gd to quadratic model should yield correct results", () => {
  quadraticModel.setX(2);
  quadraticModel.setLearningRate(1);
  expect(quadraticModel.curX).toBe(2);
  expect(quadraticModel.curY).toBe(4);
  quadraticModel.applyNSteps(2);
  expect(quadraticModel.curX).toBe(2);
  expect(quadraticModel.curY).toBe(4);
});

test("applying gd to polynomial model should yield correct results", () => {
  polynomialModel.setX(2);
  polynomialModel.setLearningRate(1);
  expect(polynomialModel.curX).toBe(2);
  expect(polynomialModel.curY).toBe(1);
  polynomialModel.applyNSteps(1);
  expect(polynomialModel.curX).toBe(-3);
  expect(polynomialModel.curY).toBe(176);
});

test("changing the learning rate should change gd", () => {
  quadraticModel.setX(2);
  quadraticModel.setLearningRate(0.5);
  expect(quadraticModel.curX).toBe(2);
  expect(quadraticModel.curY).toBe(4);
  quadraticModel.applyNSteps(2);
  expect(quadraticModel.curX).toBe(0);
  expect(quadraticModel.curY).toBe(0);
});
