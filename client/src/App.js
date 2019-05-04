import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";
import 'semantic-ui-css/semantic.min.css';

import PrivateRoute from "./utils/PrivateRoute"; // routes that require auth
import PublicRoute from "./utils/PublicRoute"; // require NO auth

import Main from './screens/main.screen';
import NoMatch from './screens/nomatch.screen';

const OvnisWorld = props => {
  return (
    <div>
      <p>Hola</p>
    </div>
  );
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route exact path="/" component={Main} />
            <Route component={NoMatch} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
