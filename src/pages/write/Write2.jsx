import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import classes from "./Write.module.css";
import { MdAddCircleOutline } from "react-icons/md";
import { useHistory, useLocation } from "react-router";
import useApiCall from "../../hooks/useApiCall";
import PostsContext from "../../context/postsContext";
import Draftail from "./Draftail";
import EditorContainer from "../../components/draftjs/EditorContainer";

const Write2 = () => {
  const ls = JSON.parse(localStorage.getItem("user"));
  const ctx = useContext(PostsContext);
  const [selectedFile, setSelectedFile] = useState("");
  const location = useLocation();
  const history = useHistory();
  const [post, setPost] = useState({});
  const [isEditState, setIsEditState] = useState(false);
  const [bodyText, setBodyText] = useState(null);
  const postId = location.search.split("=")[1];
  const titleRef = useRef();
  const publicFolder = "http://localhost:5000/images/";

  const uploadImage = useCallback((data) => {}, []);
  const { _id } = ls;

  // const [boldClass, setBoldClass] = useState(classes.toolbar);

  const getOnePost = useCallback(
    (res) => {
      if (res.statusText) {
        const x = res.data.userId === _id;
        if (!x) {
          history.push("/write");
        }
        setIsEditState(x);
        setPost(res.data);
      } else {
        history.push("/write");
      }
    },
    [history, _id]
  );

  const { queryPosts: singlePostQuery } = useApiCall(getOnePost);
  const { queryPosts: uploadImageQuery } = useApiCall(uploadImage);

  useEffect(() => {
    if (postId) {
      singlePostQuery({
        method: "GET",
        url: `http://localhost:5000/api/posts/${postId}`,
      });
    }
  }, [singlePostQuery, postId]);

  const updatePostHandler = (e) => {
    e.preventDefault();
    const newTitle = titleRef.current.value;
    // const newBody = bodyRef.current.value;

    if (!bodyText || !newTitle) {
      window.alert("Please fill all fields");
      return;
    }

    if (isEditState) {
      const updatedPost = {
        title: newTitle,
        description: bodyText,
        id: post._id,
        username: post.username,
      };

      if (selectedFile) {
        const data = new FormData();
        const filename = Date.now() + selectedFile.name;
        data.append("name", filename);
        data.append("file", selectedFile);
        updatedPost.photo = filename;
        if (!bodyText || !newTitle) {
          window.alert("Please fill all fields");
          return;
        } else {
          uploadImageQuery({
            url: `http://localhost:5000/api/upload`,
            method: "POST",
            body: data,
          });
        }
      }
      if (bodyText && newTitle) {
        ctx.updatePost(updatedPost);
      }
    } else {
      const newPost = {
        title: newTitle,
        description: bodyText,
        username: ls.username,
        userId: _id,
      };
      if (selectedFile) {
        const data = new FormData();
        const filename = Date.now() + selectedFile.name;
        data.append("name", filename);
        data.append("file", selectedFile);
        newPost.photo = filename;
        if (!bodyText || !newTitle) {
          window.alert("Please fill all fields");
          return;
        } else {
          uploadImageQuery({
            url: `http://localhost:5000/api/upload`,
            method: "POST",
            body: data,
          });
        }
      }
      if (bodyText && newTitle) {
        ctx.createPost(newPost);
      }
    }
  };

  const changeHandler = (e) => {
    const x = e.target.files[0].name;
    const y = /\.(jpg|JPG|jpeg|JPEG|png|PNG|)$/;

    if (x.match(y)) {
      setSelectedFile(e.target.files[0]);
    } else {
      window.alert("Only images allowed");
    }


  };

  let pic;
  if (postId) {
    pic = publicFolder + post.photo;
    if (!post.photo) {
      pic =
        "https://presentageministries.org/wp-content/uploads/2019/07/placeholder.png";
    }
    if (selectedFile) {
      pic = URL.createObjectURL(selectedFile);
    }
  } else {
    pic =
      "https://presentageministries.org/wp-content/uploads/2019/07/placeholder.png";
    if (selectedFile) {
      pic = URL.createObjectURL(selectedFile);
    }
  }

  // const xHandler = (e)=>{
  //   setBodyText(e);
  // }
  // const bold = <button className={boldClass}>BOLD</button>;

  return (
    <div className={classes.write}>
      <img src={pic} alt="article header" className={classes.writeImg} />
      <form className={classes.writeForm} onSubmit={updatePostHandler}>
        <div className={classes.writeFormGroup}>
          <label htmlFor="fileInput">
            <MdAddCircleOutline className={classes.writeIcon} />
          </label>
          <input
            type="file"
            id="fileInput"
            accept=".jpg, .JPG, .jpeg, .JPEG, .png, .PNG"
            style={{ display: "none" }}
            onChange={changeHandler}
          />
          <input
            type="text"
            placeholder={!isEditState ? "Title" : ""}
            defaultValue={isEditState ? post.title : ""}
            ref={titleRef}
            className={classes.writeInput}
            autoFocus={true}
          />
        </div>
        <div className={classes.editor}>
          <EditorContainer
            placeholder={!isEditState ? "Tell your story..." : ""}
            defaultValue={isEditState ? bodyText : ""}
            value={(enteredText) => setBodyText(enteredText)}
          />
        </div>
        {/* <Draftail
          placeholder={!isEditState ? "Tell your story..." : ""}
          defaultValue={isEditState ? bodyText : ""}
          value={(enteredText) => setBodyText(enteredText)}
        /> */}
        <button className={classes.writeSubmit}>Publish</button>
      </form>
      {/* {bold} */}
    </div>
  );

};

export default Write2;
