import React from "react";
import { Route, Redirect } from "react-router-dom";

import api from "../lib/api";

const PublicRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      api.authenticated === true ? (
        <Redirect to="/astroworld" />
      ) : (
        <Component {...props} />
      )
    }
  />
);

export default PublicRoute;
