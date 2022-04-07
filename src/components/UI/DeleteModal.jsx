import React, { useCallback, useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useLocation, useParams } from "react-router";
import PostsContext from "../../context/postsContext";
import useApiCall from "../../hooks/useApiCall";
import styles from "../UI/DeleteModal.module.css";

const userInfo = localStorage.getItem("user");

const Backdrop = () => {
  const ctx = useContext(PostsContext);

  return <div className={styles.backdrop} onClick={() => ctx.modal()} />;
};

const ModalOverlay = () => {
  const ctx = useContext(PostsContext);
  const [user, setUser] = useState(JSON.parse(userInfo));
  const [post, setPost] = useState({});
  const [isSettings, setIsSettings] = useState(false);
  const [isPost, setIsPost] = useState(false);
  const [message, setMessage] = useState("");
  const location = useLocation();
  const { pathname } = location;
  const page = pathname.split("/")[2];
  const params = useParams();
  const { postId } = params;

  const getOnePost = useCallback((res) => {
    if (res.statusText === "OK") {
      setPost(res.data);
    }
  }, []);

  const { queryPosts: singlePostQuery } = useApiCall(getOnePost);

  useEffect(() => {
    if (!page) {
      setUser(JSON.parse(userInfo));
      setMessage("your account");
      setIsSettings(true);
    } else {
      singlePostQuery({
        method: "GET",
        url: `/api/posts/${postId}`,
      });
      setMessage("this post");
      setIsPost(true);
    }
  }, [page, postId, singlePostQuery]);

  const deleteHandler = () => {
    if (isPost) {
      ctx.deletePost({
        userId: post?.userId,
        id: post?._id,
      });
      ctx.modal();
      return;
    } else if (isSettings) {
      ctx.deregister({
        userId: user?._id,
        id: user?._id,
      });
      ctx.modal();
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.content}>
        <p>{`Are you sure you want to delete ${message}?`}</p>
      </div>
      <footer className={styles.actions}>
        <button className={styles.btn} onClick={deleteHandler}>
          Yes
        </button>
        <button className={styles.btn} onClick={() => ctx.modal()}>
          No
        </button>
      </footer>
    </div>
  );
};

const DeleteModal = (props) => {
  return (
    <>
      {ReactDOM.createPortal(<Backdrop />, document.getElementById("backdrop"))}
      {ReactDOM.createPortal(
        <ModalOverlay hide={props.close} />,
        document.getElementById("overlay")
      )}
    </>
  );
};

export default DeleteModal;
