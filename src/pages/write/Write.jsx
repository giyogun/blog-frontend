import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { MdAddCircleOutline } from "react-icons/md";
import { useHistory, useLocation } from "react-router";
import EditorContainer from "../../components/draftjs/EditorContainer";
import PostsContext from "../../context/postsContext";
import useApiCall from "../../hooks/useApiCall";
import Select from "react-select";

import classes from "./Write.module.css";
import Card from "./ui/Card";
import url from "../../components/assets/backendUrl";

const BASE_URL = url;

function Write() {
  const ls = JSON.parse(localStorage.getItem("user"));
  const ctx = useContext(PostsContext);
  const [previewSource, setPreviewSource] = useState();
  const [fileInputState, setFileInputState] = useState("");
  const location = useLocation();
  const history = useHistory();
  const [post, setPost] = useState({});
  const [cats, setCats] = useState([]);
  const [textFieldIsEmpty, setTextFieldIsEmpty] = useState(false);
  const [isEditState, setIsEditState] = useState(false);
  const [isMaxedOut, setIsMaxedOut] = useState();
  const titleRef = useRef();
  const [bodyText, setBodyText] = useState(null);
  const [rawBodyText, setRawBodyText] = useState(null);
  const postId = location.search.split("=")[1];

  const { _id } = ls;

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

  useEffect(() => {
    if (postId) {
      singlePostQuery({
        method: "GET",
        url: `${BASE_URL}/posts/${postId}`,
      });
    }
  }, [singlePostQuery, postId]);

  let errorMessage;

  const postHandler = (e) => {
    e.preventDefault();
    const title = titleRef.current.value;
    let formIsValid = !!bodyText && bodyText !== "<p><br></p>" && !!title;

    let a = "";
    rawBodyText?.blocks.forEach((r) => {
      a += r.text;
    });

    if (!formIsValid) {
      window.alert("Please fill all fields");
      return;
    } else if (a.trim() === "") {
      window.alert("Please enter some text");
      return;
    }

    if (isEditState) {
      const updatedPost = {
        title: title,
        description: bodyText,
        rawDescription: JSON.stringify(rawBodyText),
        id: post._id,
        username: post.username,
      };

      if (cats.length > 0) {
        updatedPost.categories = cats;
      }

      if (previewSource) {
        imageUpload(previewSource, isEditState, updatedPost);
        return;
      } else {
        ctx.updatePost(updatedPost);
        
      }
    } else {
      const newPost = {
        title: title,
        description: bodyText,
        rawDescription: JSON.stringify(rawBodyText),
        username: ls.username,
        userId: _id,
      };

      if (cats.length > 0) {
        newPost.categories = cats;
      }

      if (previewSource) {
        imageUpload(previewSource, isEditState, newPost);
        return;
      } else {
        ctx.createPost(newPost);
        console.log(newPost);
      }
    }
  };
  
  const imageUpload = async (base64EncodedImage, state, payload) => {
    try {
      const res = await fetch(`${BASE_URL}/image`, {
        method: "POST",
        body: JSON.stringify({ data: base64EncodedImage }),
        headers: { "Content-type": "application/json" },
      });
      const data = await res.json();

      payload.photo = data.msg.url;
	  

      if (state) {
        ctx.updatePost(payload);
      } else {
        ctx.createPost(payload);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const changeHandler = (e) => {
    const x = e.target.files[0];
    // const x = e.target.files[0].name;
    const y = /\.(jpg|JPG|jpeg|JPEG|png|PNG|)$/;

    if (x.name.match(y)) {
      previewFile(x);
    } else {
      window.alert("Only images allowed");
    }
  };
  
  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  let pic;
  if (postId) {
    pic = post?.photo;
    if (!post.photo) {
      pic =
        "https://presentageministries.org/wp-content/uploads/2019/07/placeholder.png";
    }
    if (previewSource) {
      pic = previewSource;
    }
    
  } else {
    pic =
      "https://presentageministries.org/wp-content/uploads/2019/07/placeholder.png";
    if (previewSource) {
      pic = previewSource;
    }
  }

  return (
    <Card>
      <div className={classes.control}>
        <img src={pic} alt="article header" className={classes.writeImg} />
      </div>

      <form className={classes.form} onSubmit={postHandler}>
        <div className={classes.control}>
          <label htmlFor="fileInput">
            <MdAddCircleOutline className={classes.writeIcon} />
          </label>
          <input
            type="file"
            id="fileInput"
            accept=".jpg, .JPG, .jpeg, .JPEG, .png, .PNG"
            style={{ display: "none" }}
            onChange={changeHandler}
			value={fileInputState}
          />
          <input
            type="text"
            placeholder={!isEditState ? "Title" : ""}
            defaultValue={isEditState ? post.title : ""}
            ref={titleRef}
            className={classes.writeInput}
            autoFocus={true}
            required
          />
        </div>
        <div className={classes.editor}>
          <EditorContainer
            placeholder={!isEditState ? "Tell your story..." : ""}
            defaultValue={isEditState ? bodyText : ""}
            value={(enteredText) => setBodyText(enteredText)}
            inner={useCallback((text) => setRawBodyText(text), [])}
            required
          />
        
          {textFieldIsEmpty && errorMessage}
          <div className={classes.selectGroup}>
            <Select
              options={isMaxedOut ? [] : ctx.categories}
              isClearable={true}
              isMulti={true}
              isSearchable={true}
              placeholder="Select a category..."
              onChange={(e) => {
                setCats(e);
                if (e.length === 2) setIsMaxedOut(true);
                if (e.length < 2) setIsMaxedOut(false);
                console.log(ctx.categories);
              }}
              noOptionsMessage={() => "Maximum of two options allowed"}
              defaultValue={post?.categories}
            />
          </div>
        </div>
        <div className={classes.actions}>
          <button type="submit">Publish</button>
        </div>
      </form>
    </Card>
  );
}

export default Write;
