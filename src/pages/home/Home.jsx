import React, { Fragment } from "react";
import Header from "../../components/header/Header";
import Posts from "../../components/posts/Posts";
import Sidebar from "../../components/sidebar/Sidebar";
import classes from "./Home.module.css";

const Home = () => {
  return (
    <Fragment>
      <Header />
      <div className={classes.home}>
        <Posts />
        <Sidebar />
      </div>
    </Fragment>
  );
};

export default Home;
