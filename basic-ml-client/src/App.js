import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import Home from './home/Home'
import NoPage from './common/404'
import Nav from './common/Nav'

function App() {
  return (
    <BrowserRouter>
    <Nav />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/" component={NoPage} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
