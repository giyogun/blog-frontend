import React from "react";
import classes from "./Header.module.css";

const Header = () => {
  return (
    <div className={classes.header}>
      <div className={classes.headerContainer}>
        <div className={classes.box}>
          <span className={classes.headerTitleSm}>The Infotainment</span>
          <span className={classes.headerTitleLg}>Hub</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
