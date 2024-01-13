import React from "react";
import { BrowserRouter, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import LoggedInLayout from "../layout";
import Dashboard from "../pages/Dashboard/";
import Login from "../pages/Login/";
import Users from "../pages/Users";
import QuickAnswers from "../pages/QuickAnswers/";
import { AuthProvider } from "../context/Auth/AuthContext";
import Route from "./Route";

const Routes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Switch>
          <Route exact path="/login" component={Login} />
          <LoggedInLayout>
            <Route exact path="/" component={Dashboard} isPrivate />
            <Route exact path="/users" component={Users} isPrivate />
            <Route exact path="/quickAnswers" component={QuickAnswers} isPrivate />
          </LoggedInLayout>
        </Switch>
        <ToastContainer autoClose={3000} />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default Routes;
