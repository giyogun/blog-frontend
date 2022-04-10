import React, { Fragment, useContext, Suspense } from "react";
import { Redirect, Route, Switch } from "react-router";
import PostsContext from "./context/postsContext";
import Navbar from "./pages/home/Navbar";
import "./App.css";

const Home = React.lazy(() => import("./pages/home/Home"));
const Login = React.lazy(() => import("./pages/login/Login"));
const Settings = React.lazy(() => import("./pages/settings/Settings"));
const Single = React.lazy(() => import("./pages/single/Single"));
const Write = React.lazy(() => import("./pages/write/Write"));
const RegisterForm = React.lazy(() => import("./pages/register/RegisterForm"));
const NotFound = React.lazy(() => import("./pages/404/NotFound"));

function App() {
  const ctx = useContext(PostsContext);
  return (
    <Fragment>
      {ctx.isLoading ? (
        <div className="loading"></div>
      ) : (
        <div>
          <Navbar />
          <Suspense fallback={<div className="loading"></div>}>
            <Switch>
              <Route path="/" exact>
                <Home />
              </Route>
              <Route path="/register">
                {ctx.isLoggedIn ? (
                  <Redirect to="/settings" />
                ) : (
                  <RegisterForm />
                )}
              </Route>
              <Route path="/login">
                {!ctx.isLoggedIn ? <Login /> : <Redirect to="/write" />}
              </Route>
              <Route path="/settings" exact>
                {ctx.isLoggedIn ? <Settings /> : <Redirect to="/login" />}
              </Route>
              <Route path="/posts/:postId">
                <Single />
              </Route>
              <Route path="/write">
                {ctx.isLoggedIn ? <Write /> : <Redirect to="/login" />}
              </Route>
              <Route path="/not-found">
                <NotFound />
              </Route>
              <Route path="*">
                <NotFound />
              </Route>
            </Switch>
          </Suspense>
        </div>
      )}
    </Fragment>
  );
}

export default App;
