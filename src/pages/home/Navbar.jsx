import React, { useContext, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { Link, NavLink } from "react-router-dom";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import "./Navbar.css";
import {
  FaFacebookSquare,
  FaInstagram,
  FaPinterest,
  FaSearch,
  FaTwitter,
} from "react-icons/fa";
import PostsContext from "../../context/postsContext";
import { ImUser } from "react-icons/im";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import NavbarModal from "./modal/NavbarModal";
import url from "../../components/assets/backendUrl";

const BASE_URL = url;

const Navbar = () => {
  const ctx = useContext(PostsContext);
  const [x, setX] = useState("topnav");
  const [showModal, setShowModal] = useState(false);
  const ls = JSON.parse(localStorage.getItem("user"));
<<<<<<< HEAD
  const publicFolder = `${BASE_URL}/images/`;
=======
  const publicFolder = "/images/";
>>>>>>> 733ddc5
  const searchRef = useRef();
  const history = useHistory();
  let profilePic = <ImUser className="topImg" />;

  if (ls) {
    if (ls.profilePic) {
      profilePic = (
        <img
          src={publicFolder + ls.profilePic}
          alt="profile"
          className="topImg"
        />
      );
    }
  }

  const clickHandle = () => {
    if (x === "topnav") {
      setX("topnav responsive");
      setShowModal(true);
    } else {
      setX("topnav");
      setShowModal(false);
    }
  };

  const searchPostsHandler = (e) => {
    e.preventDefault();
    const enteredText = searchRef.current.value;
    ctx.search(enteredText);
  };

  const removeBarHandler = () => {
    setX("topnav");
    setShowModal(false);
  };

  let icon = <AiOutlineMenu style={{ fontSize: "22px", outline: "none" }} />;
  if (x === "topnav responsive") {
    icon = <AiOutlineClose style={{ fontSize: "22px" }} />;
  }

  return (
    <div className={x}>
      <Link to="#" className="icon" onClick={clickHandle}>
        {icon}
      </Link>
      {showModal && (
        <NavbarModal
          className="icon"
          close={() => {
            if (x === "topnav responsive") {
              setX("topnav");
              setShowModal(false);
            }
          }}
        />
      )}

      <div className="topLeft">
        <a href="https://instagram.com" rel="noreferrer" target="_blank">
          <FaInstagram className="topIcon" />
        </a>
        <a href="https://pinterest.com" rel="noreferrer" target="_blank">
          <FaPinterest className="topIcon" />
        </a>
        <a href="https://twitter.com" rel="noreferrer" target="_blank">
          <FaTwitter className="topIcon" />
        </a>
        <a href="https://facebook.com" rel="noreferrer" target="_blank">
          <FaFacebookSquare className="topIcon" />
        </a>
      </div>
      <div className="topCenter">
        {/* <div className="container"> */}
          <NavLink
            to="/"
            exact
            activeClassName="active"
            onClick={() => {
              ctx.resetPosts();
              removeBarHandler();
            }}
          >
            HOME
          </NavLink>

          <div to="#" className="dropdown">
            <button
              className="dropbtn"
              onClick={() => {
                if (ctx.isLoggedIn) {
                  history.replace("/write");
                  removeBarHandler();
                  return;
                }
              }}
            >
              WRITE 
            </button>
            {/* <abbr><IoIosArrowDropdownCircle /></abbr> */}

            {!ctx.isLoggedIn && (
              <div className="dropdown-content">
                <Link to="/login" onClick={removeBarHandler}>
                  Login
                </Link>
                <Link to="/register" onClick={removeBarHandler}>
                  Register
                </Link>
              </div>
            )}
          </div>
        {/* </div> */}
      </div>
      {/* <div className="container">
        <div className="follow-dropdown">
          <button className="follow-dropbtn">
            Follow Me <IoIosArrowDropdownCircle />
          </button>
          <div className="sm-content">
            <Link to="/login" onClick={removeBarHandler}>
              Link 1
            </Link>
            <Link to="#">Link 2</Link>
            <Link to="#">Link 3</Link>
          </div>
        </div>
      </div> */}
      <div className="topRight">
        {ctx.isLoggedIn && (
          <div className="acct-dropdown">
            <button className="acct-dropbtn">
              {ls.username} <IoIosArrowDropdownCircle />
            </button>
            <div className="acct-content">
              <Link to="/settings" onClick={removeBarHandler}>
                My Account
              </Link>
              <Link
                to="/"
                onClick={() => {
                  ctx.logout();
                  removeBarHandler();
                }}
              >
                Logout
              </Link>
            </div>
          </div>
        )}
        <div className="profileDropdown">
          {ctx.isLoggedIn && profilePic}
          {ctx.isLoggedIn && (
            <div className="topDropdownContent">
              <Link to="/settings" onClick={removeBarHandler}>
                Settings
              </Link>
              <Link
                to="/"
                onClick={() => {
                  ctx.logout();
                  removeBarHandler();
                }}
              >
                Logout
              </Link>
            </div>
          )}
        </div>
        <form onSubmit={searchPostsHandler}>
          <div className={`searchContainer searchDropdown`}>
            <input
              type="text"
              name="search"
              placeholder="Search..."
              className="searchInput"
              ref={searchRef}
            />
            <FaSearch
              className="topSearchIcon"
              onClick={() => {
                setX("topnav responsive");
                setShowModal(true);
              }}
            />
            <div className="searchResults">
              {ctx.searchedPosts.map((m) => (
                <Link
                  to={`/posts/${m._id}`}
                  key={m._id}
                  onClick={() => {
                    removeBarHandler();
                    ctx.resetPosts();
                    searchRef.current.value = "";
                  }}
                >
                  {m.title}
                </Link>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Navbar;
