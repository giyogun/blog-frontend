import { convertFromHTML } from "draft-convert";
import { EditorState, RichUtils } from "draft-js";

import { stateToHTML } from "draft-js-export-html";
import createInlineToolbarPlugin from "draft-js-inline-toolbar-plugin";
import "draft-js-inline-toolbar-plugin/lib/plugin.css";
import createSideToolbarPlugin from "draft-js-side-toolbar-plugin";
import "draft-js-side-toolbar-plugin/lib/plugin.css";
import "draft-js/dist/Draft.css";
import { DraftailEditor } from "draftail";
import "draftail/dist/draftail.css";
import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useLocation } from "react-router";
import useApiCall from "../../hooks/useApiCall";
import "./Draftail.css";
import { FaBold, FaItalic, FaUnderline, FaStrikethrough } from "react-icons/fa";
import SimpleImageEditor from "./SimpleImageEditor";


const inlineToolbarPlugin = createInlineToolbarPlugin();
const { InlineToolbar } = inlineToolbarPlugin;

const sideToolbarPlugin = createSideToolbarPlugin();
const { SideToolbar } = sideToolbarPlugin;

const plugins = [inlineToolbarPlugin, sideToolbarPlugin];

const Draftail = ({ defaultValue, placeholder, value }) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [display, setDisplay] = useState("none");
  const location = useLocation();
  const postId = location.search.split("=")[1];

  const editor = useRef();
  const [styleLeft, setStyleLeft] = useState();
  const [styleTop, setStyleTop] = useState();

  const getOnePost = useCallback((res) => {
    if (res.statusText === "OK") {
      setEditorState(
        EditorState.createWithContent(convertFromHTML(res.data.description))
      );
    }
  }, []);

  const { queryPosts: singlePostQuery } = useApiCall(getOnePost);

  useEffect(() => {
    if (postId) {
      singlePostQuery({
        method: "GET",
        url: `http://localhost:5000/api/posts/${postId}`,
      });
    }
  }, [singlePostQuery, postId]);

  useEffect(() => {
    let html = stateToHTML(editorState.getCurrentContent());
    value(html);
    console.log(111);
  }, [value, editorState]);

  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      setEditorState(newState);
      return "handled";
    }

    return "not-handled";
  };

  const boldClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, "BOLD"));
    // setDisplay("none");
  };

  const ItalicsClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, "ITALIC"));
    // setDisplay("none");
  };

  const handleUnderline = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, "UNDERLINE"));
    // setDisplay("none");
  };

  const handleStrikethrough = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, "STRIKETHROUGH"));
    // setDisplay("none");
  };

  const mouseUpHandler = (e) => {
    let s = document.getSelection();
    let text = s.toString();
    // let oRect = oRange.getBoundingClientRect();
    if (text !== "") {
      setDisplay("block");

      let rect = s.getRangeAt(0).getBoundingClientRect();

      setStyleTop(`calc(${rect.top}px - 30px)`);
      setStyleLeft(`calc(${rect.left}px + calc(${rect.width}px / 2) - 40px)`);
    } else {
      setDisplay("none");
    }
  };

  const mouseDownHandler = (e) => {
    // document.getSelection().removeAllRanges();
    // e.stopPropagation();
    // // setShowBold(false);
    //   setDisplay("none");

  };


  const inlineStyles = (
    <div
      className="toolbar"
      style={{ left: styleLeft, top: styleTop, display: display }}
    >
      <FaBold onClick={boldClick} className="bold"/>
      <FaItalic onClick={ItalicsClick} className="italic"/>
      <FaUnderline className="under" onClick={handleUnderline}/>
      <FaStrikethrough className="strike" onClick={handleStrikethrough}/>
    </div>
  );


  return (
    <Fragment
      // className="App"
      // onPointerUp={mouseUpHandler}
      // onPointerDown={mouseDownHandler}
    >
      {/* {bold} */}
      {/* {inlineStyles} */}
      <DraftailEditor
        editorState={editorState}
        handleKeyCommand={handleKeyCommand}
        onChange={setEditorState}
        defaultValue={defaultValue}
        placeholder={placeholder}
        plugins={plugins}
        ref={editor}
      />
      {/* <SimpleImageEditor /> */}
      <InlineToolbar />
      <SideToolbar />
    </Fragment>
  );
};

export default Draftail;
