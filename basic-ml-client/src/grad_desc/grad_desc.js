import * as math from 'mathjs' 

/**
 * A model that holds logic and state for a function undergoing gradient descent. Once a function is assigned,
 * it should not be mutated.
 */
class GradientDescentModel {
    curX;
    curY;
    varName;

    constructor(funcString) {
        // check for function validity
        try {
            const node = math.parse(funcString)
            const allVars = new Set()
            node.traverse(function (node, path, parent) {
                switch (node.type) {
                  case 'SymbolNode':
                    allVars.add(node.name)
                    break
                  default:
                    
                }
              })

            if (allVars.size > 1) {
                throw new Error("function must have one variable or less")
            } else {
                this.funcString = funcString
                this.funcExpr = math.compile(funcString)
                this.varName = allVars.size == 0 ? null : allVars.values().next().value
                this.derivative = math.derivative(funcString, this.varName)
            }
        }
        catch (error) {
            throw error;
        }
    }

    setX(x) {
        this.curX = x
        this.curY = this.funcExpr.evaluate({[this.varName] : x})
    }

    applyNSteps() {

    }
}