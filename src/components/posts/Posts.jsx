import React from "react";
import Post from "./Post";
import classes from "./Posts.module.css";

const Posts = () => {
  return (
    <div className={classes.posts}>
      <Post />
    </div>
  );
};

export default Posts;
