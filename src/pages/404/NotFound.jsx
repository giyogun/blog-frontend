import React, { Fragment } from "react";
import { Helmet } from "react-helmet";
import "./NotFound.css";

const NotFound = () => {
  return (
    <Fragment>
      <Helmet>
        <title>Oops! 404</title>
      </Helmet>
      <div className="centered">
        <p>Page not found</p>
      </div>
    </Fragment>
  );
};

export default NotFound;
