import { Fragment, useContext } from "react";
import { Redirect, Route, Switch } from "react-router";
import PostsContext from "./context/postsContext";
import Home from "./pages/home/Home";
import Navbar from "./pages/home/Navbar";
import Login from "./pages/login/Login";
// import Register from "./pages/register/Register";
import Settings from "./pages/settings/Settings";
import Single from "./pages/single/Single";
import "./App.css";
import Write from "./pages/write/Write";
import NotFound from "./pages/404/NotFound";
import RegisterForm from "./pages/register/RegisterForm";

function App() {
  const ctx = useContext(PostsContext);
  return (
    <Fragment>
      {ctx.isLoading ? (
        <div className="loading"></div>
      ) : (
        <div>
          <Navbar />
          <Switch>
            <Route path="/" exact>
              <Home />
            </Route>
            <Route path="/register">
              {ctx.isLoggedIn ? <Redirect to="/settings" /> : <RegisterForm />}
            </Route>
            {/* <Route path="/register">
              {ctx.isLoggedIn ? <Redirect to="/settings" /> : <Register />}
            </Route> */}
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
        </div>
      )}
    </Fragment>
  );
}

export default App;
