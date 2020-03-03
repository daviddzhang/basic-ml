import numpy as np
import sympy as sp


# For now this will only support one variable functions, mainly because plotting it wouldn't be trivial
class GradientDescentFunction:
    x = sp.Symbol('x')

    def __init__(self, function, startPoint, alpha):
        self.function = sum(sp.sympify(v) * self.x ** i for i, v in enumerate(function[::-1]))
        self.derivative = sp.diff(self.function, self.x)
        self.curX = startPoint
        self.alpha = alpha

    def getY(self):
        return self.function.subs(self.x, self.curX)

    def getCurSlope(self):
        return self.derivative.subs(self.x, self.curX)

    def iterate(self):
        curSlope = self.getCurSlope()
        self.curX = self.curX - (self.alpha * curSlope)

    def iterateNTimes(self, n):
        for i in range(n):
            self.iterate()
