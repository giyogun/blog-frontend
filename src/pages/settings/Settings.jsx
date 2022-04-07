import React, { useCallback, useContext, useRef, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import classes from "./Settings.module.css";
import { FaRegUserCircle } from "react-icons/fa";
import { ImUser } from "react-icons/im";
import useApiCall from "../../hooks/useApiCall";
import DeleteModal from "../../components/UI/DeleteModal";
import PostsContext from "../../context/postsContext";
import url from "../../components/assets/backendUrl";

const BASE_URL = url;

const Settings = () => {
  const ctx = useContext(PostsContext);
  const ls = JSON.parse(localStorage.getItem("user"));
  const { profilePic } = ls;
  const [selectedFile, setSelectedFile] = useState(null);
  const [ppIsValid, setPpIsValid] = useState(!!profilePic);
  const [bio, setBio] = useState("");
  const [inner, setInner] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  // const bioRef = useRef();
  const twitterRef = useRef();
  const facebookRef = useRef();
  const linkedInRef = useRef();
<<<<<<< HEAD
  const publicFolder = `${BASE_URL}/images/`;
=======
  const publicFolder = "/images/";
>>>>>>> 733ddc5

  const userUpdate = useCallback((res) => {
    if (res.statusText === "OK") {
      localStorage.setItem("user", JSON.stringify(res.data));
      window.location.reload();
    }
  }, []);

  const uploadImg = useCallback((res) => {
    console.log(res);
  }, []);

  const { queryPosts } = useApiCall(userUpdate);
  const { queryPosts: uploadImageQuery } = useApiCall(uploadImg);

  const picChangeHandler = (e) => {
    const x = e.target.files[0].name;
    const y = /\.(jpg|JPG|jpeg|JPEG|png|PNG|)$/;

    if (x.match(y)) {
      setSelectedFile(e.target.files[0]);
      setPpIsValid(true);
    } else {
      window.alert("Only images allowed");
    }
  };

  const updateInfoHandler = (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    const newUserInfo = { userId: ls._id };

    if (!!email) {
      newUserInfo.email = email;
    }
    if (!!password) {
      newUserInfo.password = password;
    }

    const canMakePostReq = !!email || !!password || selectedFile;

    if (canMakePostReq) {
      queryPosts({
<<<<<<< HEAD
        url: `${BASE_URL}/users/${ls._id}`,
=======
        url: `/api/users/${ls._id}`,
>>>>>>> 733ddc5
        method: "PUT",
        body: newUserInfo,
      });
    }
    console.log(ppIsValid);
  };

  const profileHandler = (e) => {
    e.preventDefault();

    const twitter = twitterRef.current.value;
    const facebook = facebookRef.current.value;
    const linkedIn = linkedInRef.current.value;

    const words = bio.split(" ");
    if (words.length < 5 && inner) {
      window.alert(
        "Surely there's more to know about you than " + words.length + " words!"
      );
      return;
    }

    const newUserInfo = { userId: ls._id };

    if (!!bio) {
      newUserInfo.profileBio = bio;
    }
    if (!!twitter) {
      newUserInfo.twitterAcct = twitter;
    }
    if (!!facebook) {
      newUserInfo.facebookAcct = facebook;
    }
    if (!!linkedIn) {
      newUserInfo.linkedInAcct = linkedIn;
    }

    if (selectedFile) {
      const data = new FormData();
      const filename = Date.now() + selectedFile.name;
      data.append("name", filename);
      data.append("file", selectedFile);
      newUserInfo.profilePic = filename;
      uploadImageQuery({
<<<<<<< HEAD
        url: `${BASE_URL}/upload`,
=======
        url: `/api/upload`,
>>>>>>> 733ddc5
        method: "POST",
        body: data,
      });
    }

    const canMakePostReq =
      !!bio || !!twitter || facebook || linkedIn || selectedFile;

    if (canMakePostReq) {
      queryPosts({
<<<<<<< HEAD
        url: `${BASE_URL}/users/${ls._id}`,
=======
        url: `/api/users/${ls._id}`,
>>>>>>> 733ddc5
        method: "PUT",
        body: newUserInfo,
      });
    }
  };

  let picSrc = publicFolder + ls.profilePic;

  if (selectedFile) {
    picSrc = URL.createObjectURL(selectedFile);
  }
  return (
    <div className={classes.settings}>
      {ctx.modalIsShown && <DeleteModal />}
      <div className={classes.settingsWrapper}>
        <div className={classes.settingsTitle}>
          <span className={classes.settingsUpdateTitle}>My Profile</span>
        </div>
        <form className={classes.settingsForm} onSubmit={profileHandler}>
          <label>Profile Picture</label>
          <div className={classes.settingsPP}>
            {ppIsValid ? (
              <img src={picSrc} alt="" />
            ) : (
              <ImUser className={classes.ppIcon} />
            )}
            <label htmlFor="fileInput">
              <FaRegUserCircle className={classes.settingsPPIcon} />
            </label>
            <input
              type="file"
              id="fileInput"
              style={{ display: "none" }}
              accept=".jpg, .JPG, .jpeg, .JPEG, .png, .PNG"
              onChange={picChangeHandler}
            />
          </div>
          <label>Public Bio</label>
          <textarea
            placeholder="Let your readers know about you..."
            defaultValue={ls.profileBio ? ls.profileBio : ""}
            onChange={(e) => setBio(e.target.value)}
          />
          <label>Twitter</label>
          <input
            type="text"
            ref={twitterRef}
            placeholder="Enter your Twitter username"
            defaultValue={ls.twitterAcct && ls.twitterAcct}
          />
          <label>Facebook</label>
          <input
            type="text"
            ref={facebookRef}
            placeholder="Enter your Facebook username"
            defaultValue={ls.facebookAcct && ls.facebookAcct}
          />
          <label>LinkedIn</label>
          <input
            type="text"
            ref={linkedInRef}
            placeholder="Enter your LinkedIn username"
            defaultValue={ls.linkedInAcct && ls.linkedInAcct}
          />
          <button className={classes.settingsSubmit}>Save Changes</button>
        </form>
      </div>
      <div className={classes.settingsWrapper}>
        <div className={classes.settingsTitle}>
          <span className={classes.settingsUpdateTitle}>Account Settings</span>
          <span
            onClick={() => ctx.modal()}
            className={classes.settingsDeleteTitle}
          >
            Delete Account
          </span>
        </div>
        <form className={classes.settingsForm} onSubmit={updateInfoHandler}>
          <label>Username</label>
          <input type="text" value={ls.username} disabled />
          <label>Email</label>
          <input type="email" placeholder={ls.email} ref={emailRef} />
          <label>Password</label>
          <input type="password" ref={passwordRef} />
          <button className={classes.settingsSubmit}>Update</button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
