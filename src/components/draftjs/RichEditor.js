import React, { useEffect, useRef, useState } from "react";
import { EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { stateToHTML } from "draft-js-export-html";
import { convertFromHTML } from "draft-convert";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./RichEditor.css";
// import "./EditorContainer.css";
import { useLocation } from "react-router";

const RichEditor = ({ defaultValue, placeholder, value, inner }) => {
  const ls = JSON.parse(localStorage.getItem("user"));

  const [editorState, setEditorState] = useState(EditorState.createWithContent(convertFromHTML(ls.profileBio)));
  // const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const location = useLocation();
  const editor = useRef();
  const x = location.pathname.split("/")[1];

  useEffect(() => {
    let html = stateToHTML(editorState.getCurrentContent());
    value(html);
    console.log(editor.current.editor.editor.innerText);
    // inner(editor.current.editor.editor.innerText)
  }, [value, editorState]);

  console.log(x);

  return (
    <div className="editor">
      <Editor
        editorState={editorState}
        onEditorStateChange={setEditorState}
        placeholder={placeholder}
        defaultValue={defaultValue}
        wrapperClassName="demo-wrapper"
        onChange={() => {
          console.log(editor.current.editor.editor.innerText);
          inner(editor.current.editor.editor.innerText);
          // value(editor.current.editor.editor.innerText);
        }}
        ref={editor}
        toolbar={{
          options: [],
        }}
      />
    </div>
  );
};

export default RichEditor;
