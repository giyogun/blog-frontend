import React, { useContext, useRef, useState } from "react";
import classes from "./TopBar.module.css";
import {
  FaFacebookSquare,
  FaTwitter,
  FaPinterest,
  FaInstagram,
  FaSearch,
} from "react-icons/fa";
import { ImUser } from "react-icons/im";

import { Link, NavLink } from "react-router-dom";
import PostsContext from "../../context/postsContext";
import { IoIosArrowDropdownCircle } from "react-icons/io";

const TopBar = () => {
  const ls = JSON.parse(localStorage.getItem("user"));
  const publicFolder = "http://localhost:5000/images/";
  const [x, setX] = useState(classes.top);

  const searchRef = useRef();
  const ctx = useContext(PostsContext);

  let profilePic = <ImUser className={classes.topImg} />;

  if (ls) {
    if (ls.profilePic) {
      profilePic = (
        <img
          src={publicFolder + ls.profilePic}
          alt="profile"
          className={classes.topImg}
        />
      );
    }
  }

  const searchPostsHandler = (e) => {
    e.preventDefault();
    const enteredText = searchRef.current.value;
    ctx.search(enteredText);
  };

  const clickHandle = () => {
    if (x === classes.top) {
      setX(`${classes.top} ${classes.responsive}`);
    } else {
      setX(classes.top);
    }
  };

  return (
    <div className={x}>
      <Link
          to="#"
          // to="javascript:void(0);"
          className={classes.icon}
          onClick={clickHandle}
        >
          &#9776;
        </Link>
      <div className={classes.topLeft}>
        <a href="https://instagram.com" rel="noreferrer" target="_blank">
          <FaInstagram className={classes.topIcon} />
        </a>
        <a href="https://pinterest.com" rel="noreferrer" target="_blank">
          <FaPinterest className={classes.topIcon} />
        </a>
        <a href="https://twitter.com" rel="noreferrer" target="_blank">
          <FaTwitter className={classes.topIcon} />
        </a>
        <a href="https://facebook.com" rel="noreferrer" target="_blank">
          <FaFacebookSquare className={classes.topIcon} />
        </a>
      </div>
      <div className={classes.topCenter}>
        <ul className={classes.topList}>
          <li className={classes.topListItem}>
            <NavLink
              to="/"
              exact
              activeClassName={classes.active}
              onClick={() => ctx.resetPosts()}
            >
              HOME
            </NavLink>
          </li>
          <li className={classes.topListItem}>
            <NavLink to="/home" activeClassName={classes.active}>
              ABOUT
            </NavLink>
          </li>
          <li className={classes.topListItem}>
            <NavLink to="/home" activeClassName={classes.active}>
              CONTACT
            </NavLink>
          </li>
          <li className={classes.topListItem}>
            <NavLink to="/write" activeClassName={classes.active}>
              WRITE
            </NavLink>
          </li>
          {ctx.isLoggedIn && (
            <li
              className={classes.topListItem}
              onClick={() => {
                ctx.logout();
              }}
            >
              <NavLink to="/">LOGOUT</NavLink>
            </li>
          )}
          <li>
            <div className={classes.dropMenu}>
              <button className={classes.btnDrop}>
                Dropdown <IoIosArrowDropdownCircle />
              </button>
              <div className={classes.content}>
                <Link to="#">Link 1</Link>
                <Link to="#">Link 2</Link>
                <Link to="#">Link 3</Link>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div className={classes.topRight}>
        <div className={classes.dropdown}>
          {ctx.isLoggedIn ? (
            profilePic
          ) : (
            <Link to="/login" className={classes.link}>
              LOGIN
            </Link>
          )}
          {ctx.isLoggedIn && (
            <div className={classes.topDropdownContent}>
              <Link to="/settings">Settings</Link>
            </div>
          )}
        </div>
        <form onSubmit={searchPostsHandler}>
          <div
            className={`${classes.searchContainer} ${classes.searchDropdown}`}
          >
            <input
              type="text"
              name="search"
              placeholder="Search..."
              className={classes.searchInput}
              ref={searchRef}
            />
            <div className={classes.searchResults}>
              {ctx.searchedPosts.map((m) => (
                <Link
                  to={`/posts/${m._id}`}
                  key={m._id}
                  onClick={() => {
                    ctx.resetPosts();
                    searchRef.current.value = "";
                  }}
                >
                  {m.title}
                </Link>
              ))}
            </div>
            <FaSearch className={classes.topSearchIcon} />
          </div>
        </form>
        {/* <NavLink to="/some">Another</NavLink> */}
      </div>
    </div>
  );
};

export default TopBar;
