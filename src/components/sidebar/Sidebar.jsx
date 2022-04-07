import React, {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useHistory, useLocation } from "react-router";
import classes from "./Sidebar.module.css";
import {
  FaFacebookSquare,
  FaTwitter,
  FaPinterest,
  FaLinkedin,
} from "react-icons/fa";
import PostsContext from "../../context/postsContext";
import useApiCall from "../../hooks/useApiCall";
import url from "../assets/backendUrl";

const BASE_URL = url;

const Sidebar = () => {
  const [post, setPost] = useState({});
  const [userData, setUserData] = useState({});
  const singlePost = useCallback((res) => {
    setPost(res.data);
  }, []);
  const { queryPosts } = useApiCall(singlePost);

  const singleUser = useCallback((res) => {
    setUserData(res.data);
    // console.log(res);
  }, []);
  const { queryPosts: queryUser } = useApiCall(singleUser);

  const ctx = useContext(PostsContext);
  const { filterPosts, categories } = ctx;

  const history = useHistory();
  const location = useLocation();
<<<<<<< HEAD
  const publicFolder = `${BASE_URL}/images/`;
=======
  const publicFolder = "/images/";
>>>>>>> 733ddc5
  const { pathname } = location;

  const arr = pathname.split("/")[2];

  useEffect(() => {
    if (arr) {
      queryPosts({
        method: "GET",
<<<<<<< HEAD
        url: `${BASE_URL}/posts/${arr}`,
=======
        url: `/api/posts/${arr}`,
>>>>>>> 733ddc5
      });
    }
  }, [queryPosts, arr]);

  useEffect(() => {
    if (post.userId) {
      queryUser({
        method: "GET",
<<<<<<< HEAD
        url: `${BASE_URL}/users/${post.userId}`,
=======
        url: `/api/users/${post.userId}`,
>>>>>>> 733ddc5
      });
    } else {
      return;
    }
    // console.log(1);
  }, [queryUser, post.userId]);

  const bio = userData ? userData : {};

  const dynamic = (
    <div className={classes.sidebarItem}>
      <span className={classes.sidebarTitle}>FOLLOW ME</span>
      <div className={classes.sidebarSocial}>
        <a
          href={
            arr
              ? `https://linkedin.com/${bio?.linkedInAcct}`
              : "https://linkedin.com"
          }
          rel="noreferrer"
          target="_blank"
        >
          <FaLinkedin className={classes.sidebarIcon} />
        </a>
        <a href="https://pinterest.com" rel="noreferrer" target="_blank">
          <FaPinterest className={classes.sidebarIcon} />
        </a>
        <a
          href={
            arr
              ? `https://twitter.com/${bio?.twitterAcct}`
              : "https://twitter.com"
          }
          rel="noreferrer"
          target="_blank"
        >
          <FaTwitter className={classes.sidebarIcon} />
        </a>
        <a
          href={
            arr
              ? `https://facebook.com/${bio?.facebookAcct}`
              : "https://facebook.com"
          }
          rel="noreferrer"
          target="_blank"
        >
          <FaFacebookSquare className={classes.sidebarIcon} />
        </a>
      </div>
    </div>
  );

  return (
    <Fragment>
      <div className={classes.sidebar}>
        <div className={classes.sidebarItem}>
          {arr && <span className={classes.sidebarTitle}>ABOUT ME</span>}
          {arr && (
            <img
              src={
                arr && userData.profilePic
                  ? publicFolder + userData?.profilePic
                  : "https://themegoods-cdn-pzbycso8wng.stackpathdns.com/grandblog/demo/wp-content/uploads/2015/11/aboutme.jpg"
              }
              alt=""
            />
          )}
          {arr && <article>{bio.profileBio}</article>}
        </div>
        <div className={classes.sidebarItem}>
          <span className={classes.sidebarTitle}>CATEGORIES</span>
          <ul className={classes.sidebarList}>
            {categories.map((c) => (
              <li
                key={c._id}
                className={classes.sidebarListItem}
                onClick={() => {
                  history.push(`/?cat=${c.name}`);

                  filterPosts(c.name);
                }}
              >
                {c.label}
              </li>
            ))}
          </ul>
        </div>
        {arr && dynamic}
      </div>
    </Fragment>
  );
};

export default Sidebar;
