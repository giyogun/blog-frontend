import React, { useEffect, useRef, useState } from "react";
import { DraftailEditor } from "draftail"
import Editor from "@draft-js-plugins/editor";
import {
  // Editor,
  EditorState,
  RichUtils,
  convertFromRaw,
  convertToRaw,
} from "draft-js";
import createToolbarPlugin from "@draft-js-plugins/static-toolbar";

import "@draft-js-plugins/static-toolbar/lib/plugin.css";
import "draft-js/dist/Draft.css";

const toolbarPlugin = createToolbarPlugin();
const {Toolbar} = toolbarPlugin;
const plugins = [toolbarPlugin];

const AltEditor = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const editor = useRef();
  // useEffect(() => {
  //   const rawEditorData = getSavedEditorData();

  //   if (rawEditorData !== null) {
  //     const contentState = convertFromRaw(rawEditorData);
  //     setEditorState(EditorState.createWithContent(contentState));
  //   }
  // }, []);

  const changeHandler = (e) => {
    const raw = convertToRaw(e.getCurrentContent());

    saveEditorContent(raw);

    setEditorState(e);
  };

  const getSavedEditorData = () => {
    const savedData = localStorage.getItem("editorData");

    return savedData ? JSON.parse(savedData) : null;
  };

  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      // changeHandler(newState);
      setEditorState(newState);
      return true;
    }
    return false;
  };

  const renderContentAsRawJs = () => {
    const contentState = editorState.getCurrentContent();
    const raw = convertToRaw(contentState);

    return JSON.stringify(raw, null, 2);
  };

  const saveEditorContent = (data) => {
    localStorage.setItem("editorData", JSON.stringify(data));
  };

  console.log("RICH");
  return (
    <div>
      <div>
        <DraftailEditor
          handleKeyCommand={handleKeyCommand}
          editorState={editorState}
          // onChange={changeHandler}
          onChange={setEditorState}
          plugins={plugins}
          ref={editor}
        />
        <Toolbar />
      </div>
      {/* <h4>RAW JS</h4> */}
      {/* <pre>{renderContentAsRawJs()}</pre> */}
    </div>
  );
};

export default AltEditor;
