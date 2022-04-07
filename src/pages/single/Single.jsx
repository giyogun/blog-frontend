import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import url from "../../components/assets/backendUrl";
import SinglePost from "../../components/posts/SinglePost";
import Sidebar from "../../components/sidebar/Sidebar";
import useApiCall from "../../hooks/useApiCall";
import classes from "./Single.module.css";

const BASE_URL = url;

const Single = () => {
  const [pageIsFound, setPageIsFound] = useState();
  const [post, setPost] = useState({});

  const params = useParams();
  const { postId } = params;

  const getOnePost = useCallback((res) => {
    if (res.statusText === "OK") {
      if (res.data !== null) {
        setPost(res.data);
        localStorage.setItem("postInfo", JSON.stringify(res.data));
        console.log(res);
        setPageIsFound(true);
      } else if (res.data === null) {
        window.location.replace("/not-found");
      }
    } else {
      setPageIsFound(false);
      console.log(res);
      window.location.replace("/not-found");
    }
  }, []);

  const { queryPosts: singlePostQuery } = useApiCall(getOnePost);

  useEffect(() => {
    singlePostQuery({
      method: "GET",
      url: `${BASE_URL}/posts/${postId}`,
    });
  }, [singlePostQuery, postId]);

  return (
    <Fragment>
      {pageIsFound && (
        <div className={classes.single}>
          <SinglePost singlePost={post} id={postId} />
          <Sidebar />
        </div>
      )}
    </Fragment>
  );
};

export default Single;
