import generatePlotData from "./function_data_gen"

test("there should be 1000 plot points if y bound permits", () => {
    expect(generatePlotData((x) => x, [-2000, 2000], [-2000, 2000]).length).toBe(1000)
}) 

test("x and y should be evaluated properly", () => {
    var res = []
    for (let i = -500; i <= 499; i++) {
        res.push(i)
    }
    res = res.map(num => [num, num + 2])
    expect(generatePlotData((x) => x + 2, [-500, 500], [-1000, 1000])).toEqual(res)
}) 

test("cut off indices if function is out of y bounds for x - negative/negative", () => {
    const data = generatePlotData((x) => -1 * (x * x), [-500, 500], [-5, 5])
    expect(data[0]).toStrictEqual([-6, -36])
    expect(data[12]).toStrictEqual([6, -36])
})

test("cut off indices if function is out of y bounds for x - negative/positive", () => {
    const data = generatePlotData((x) => (x * x * x), [-500, 500], [-5, 5])
    expect(data[0]).toStrictEqual([-5, -125])
    expect(data[10]).toStrictEqual([5, 125])
})

test("cut off indices if function is out of y bounds for x - positive/positive", () => {
    const data = generatePlotData((x) => (x * x), [-500, 500], [-5, 5])
    expect(data[0]).toStrictEqual([-6, 36])
    expect(data[12]).toStrictEqual([6, 36])
})

test("cut off indices if function is out of y bounds for x - positive/negative", () => {
    const data = generatePlotData((x) => -1 * (x * x * x), [-500, 500], [-5, 5])
    expect(data[0]).toStrictEqual([-5, 125])
    expect(data[10]).toStrictEqual([5, -125])
})