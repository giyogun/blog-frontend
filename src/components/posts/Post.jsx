import React, { Fragment, useContext } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import PostsContext from "../../context/postsContext";
import url from "../assets/backendUrl";
import classes from "./Post.module.css";

const postDateHandler = (x) => {
  let displayedDate;
  const now = new Date();
  const curr = now.getTime();
  const postDate = x.getTime();
  const diff = curr - postDate;
  const inMins = diff * 0.00001667;
  const inHours = diff * 0.0000002778;
  const inDays = inHours * 0.041667;
  displayedDate = `${Math.floor(inMins)} ${
    inMins >= 2 ? "minutes" : "minute"
  } ago`;
  if (inMins > 60) {
    displayedDate = `${Math.floor(inHours)} ${
      inHours >= 2 ? "hours" : "hour"
    } ago`;
  }

  if (inHours > 24) {
    displayedDate = `${Math.floor(inDays)} ${inDays >= 2 ? "days" : "day"} ago`;
  }

  if (inDays > 6) {
    displayedDate = x.toDateString();
  }

  return displayedDate;
};

const Post = () => {
  const ctx = useContext(PostsContext);

  const history = useHistory();

  const filterPostsHandler = (cat) => {
    ctx.filterPosts(cat);
    history.push(`?cat=${cat}`);
  };

  if (ctx.filtered && ctx.blogPosts.length === 0) {
    return (
      <p style={{ textAlign: "center", padding: "10px" }}>
        No posts in this category yet
      </p>
    );
  }

  return (
    <Fragment>
      {ctx.blogPosts.map((post) => {
        let html = post.description;
        let div = document.createElement("div");
        div.innerHTML = html;
        let text = div.textContent || div.innerText || "";
        return (
          <div className={classes.post} key={post._id}>
            {post.photo && (
              <img className={classes.postImg} src={post?.photo} alt="" />
            )}
            <div className={classes.postInfo}>
              <div className={classes.postCats}>
                {post.categories.map((c, index) => (
                  <span
                    key={index}
                    className={classes.postCat}
                    onClick={() => filterPostsHandler(c.label)}
                  >
                    {c.label}
                  </span>
                ))}
              </div>
              <Link to={`/posts/${post._id}`}>
                <span className={classes.postTitle}>{post.title}</span>
              </Link>
              <hr />
              <span className={classes.postDate}>
                {postDateHandler(new Date(post.createdAt))}
              </span>

              <p className={classes.postDesc}>{text}</p>
            </div>
          </div>
        );
      })}
    </Fragment>
  );
};

export default Post;
