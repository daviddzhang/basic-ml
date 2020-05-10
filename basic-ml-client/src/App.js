import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import Home from './basic_pages/Home'
import NoPage from './common/404'
import Nav from './common/Nav'
import Contact from './basic_pages/Contact'
import GradientDescent from './grad_desc/GradientDescent'
import LinearRegression from "./lin_reg/LinearRegression"
import LearningCurves from "./lcurves/LearningCurves"

function App() {
  return (
    <BrowserRouter>
    <Nav />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/linreg" exact component={LinearRegression} />
        <Route path="/graddesc" exact component={GradientDescent} />
        <Route path="/lcurve" exact component={LearningCurves} />
        <Route path="/contact" exact component={Contact} />
        <Route path="/" component={NoPage} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
