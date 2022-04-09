import React, { useCallback, useEffect, useRef, useState } from "react";
import { EditorState, convertToRaw, convertFromRaw, RichUtils } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { stateToHTML } from "draft-js-export-html";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./EditorContainer.css";
import { useLocation } from "react-router";
import useApiCall from "../../hooks/useApiCall";
import url from "../assets/backendUrl";

// const ls = JSON.parse(localStorage.getItem("postData"));
const BASE_URL = url;

const EditorContainer = ({ defaultValue, placeholder, value, inner }) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const location = useLocation();
  const postId = location.search.split("=")[1];
  const editor = useRef();
  const x = location.pathname.split("/")[1];

  const getOnePost = useCallback((res) => {
    if (res.statusText === "OK") {
        const raw = res.data;
        const toJSON = JSON.parse(raw.rawDescription);
        const content = convertFromRaw(toJSON);
        const b = EditorState.createWithContent(content).getCurrentContent();
        inner(convertToRaw(b));
        setEditorState(EditorState.createWithContent(content));
      }
  }, [inner]);

  const { queryPosts: singlePostQuery } = useApiCall(getOnePost);

  useEffect(() => {
    let mounted = !!postId;
    if (mounted) {
      singlePostQuery({
        method: "GET",
        url: `${BASE_URL}/posts/${postId}`,
      });
    }
    return () => {
      mounted = false;
    };
  }, [singlePostQuery, postId]);
  
  useEffect(() => {
    const html = stateToHTML(editorState.getCurrentContent());
    value(html);
  }, [editorState, value]);

  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      setEditorState(newState);
      return true;
    }
    return false;
  };

  return (
    <Editor
      editorState={editorState}
      onEditorStateChange={setEditorState}
      handleKeyCommand={handleKeyCommand}
      placeholder={placeholder}
      defaultValue={defaultValue}
      wrapperClassName="demo-wrapper"
      onChange={() => {
        const raw = convertToRaw(editorState.getCurrentContent());
        inner(raw);
      }}
      ref={editor}
      toolbar={{
        options: [
          "inline",
          "blockType",
          "list",
          "textAlign",
          "fontSize",
          "list",
          "link",
          "embedded",
          "image",
        ],
        textAlign: { inDropdown: true },
        inline: {
          inDropdown: true,
          options: [
            "bold",
            "italic",
            "underline",
            "strikethrough",
            "monospace",
          ],
        },
        blockType: { inDropdown: false, options: ["H1", "H2", "H3"] },
        list: { inDropdown: false },
        image: {
          alt: { present: true, mandatory: true },
        },
      }}
    />
  );
};

export default EditorContainer;
