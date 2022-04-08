import React, {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import classes from "./SinglePost.module.css";
import { RiEditLine, RiDeleteBin5Line } from "react-icons/ri";
import { useHistory, useParams } from "react-router";
import PostsContext from "../../context/postsContext";
import useApiCall from "../../hooks/useApiCall";
import { Link } from "react-router-dom";
import DeleteModal from "../UI/DeleteModal";
import url from "../assets/backendUrl";

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

const BASE_URL = url;

const SinglePost = ({ singlePost: post, id: postId }) => {
  const ls = JSON.parse(localStorage.getItem("user"));
  const x = ls?._id;
  // const params = useParams();
  // const { postId } = params;
  const history = useHistory();
  // const [post, setPost] = useState({});
  const [canEdit, setCanEdit] = useState(false);
  // const [pageIsFound, SetPageIsFound] = useState(false);
  const publicFolder = "/images/";

  const ctx = useContext(PostsContext);
  const { isLoggedIn } = ctx;

  // const getOnePost = useCallback((res) => {
  //   if (res.statusText === "OK") {
  //     setPost(res.data);
  //     localStorage.setItem("postInfo", JSON.stringify(res.data));
  //     console.log(res);
  //     SetPageIsFound(true);
  //   } else {
  //     SetPageIsFound(false);
  //   }
  // }, []);

  // const { queryPosts: singlePostQuery } = useApiCall(getOnePost);

  // useEffect(() => {
  //   singlePostQuery({
  //     method: "GET",
  //     url: `http://localhost:5000/api/posts/${postId}`,
  //   });
  // }, [singlePostQuery, postId]);

  useEffect(() => {
    setCanEdit(x === post.userId);
  }, [x, post.userId]);

  const authorClickHandler = (name) => {
    ctx.filterPostsByUser(name);
  };

  const editPostHandler = () => {
    history.push(`/write?edit=${postId}`);
  };


  return (
    <Fragment>
      <div className={classes.singlePost}>
        <div className={classes.singlePostWrapper}>
          {post.photo && (
            <img
              className={classes.singlePostImg}
              src={post?.photo}
              alt=""
            />
          )}
          <h1 className={classes.singlePostTitle}>
            {post.title}
            {isLoggedIn && canEdit && (
              <div className={classes.singlePostEdit}>
                <RiEditLine
                  className={classes.singlePostIcon}
                  onClick={editPostHandler}
                />
                <RiDeleteBin5Line
                  className={classes.singlePostIcon}
                  onClick={() => ctx.modal()}
                />
                {ctx.modalIsShown && <DeleteModal />}
              </div>
            )}
          </h1>
          <div className={classes.singlePostInfo}>
            <span
              className={classes.singlePostAuthor}
              onClick={() => authorClickHandler(post.username)}
            >
              <Link to={`/?user=${post.username}`}>
                Author: <b>{post.username}</b>
              </Link>
            </span>
            <span className={classes.singlePostDate}>
              {postDateHandler(new Date(post.createdAt))}
            </span>
          </div>
          <div
            dangerouslySetInnerHTML={{ __html: post["description"] }}
            className={classes.fullPost}
          ></div>
        </div>
      </div>
    </Fragment>
  );
};

export default SinglePost;
