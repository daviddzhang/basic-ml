import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import Home from './basic_pages/Home'
import NoPage from './common/404'
import Nav from './common/Nav'
import Contact from './basic_pages/Contact'

function App() {
  return (
    <BrowserRouter>
    <Nav />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/contact" exact component={Contact} />
        <Route path="/" component={NoPage} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
