import Editor, { createEditorStateWithText } from "@draft-js-plugins/editor";
import { EditorState, AtomicBlockUtils } from "draft-js";
import createImagePlugin from "@draft-js-plugins/image";
import { useRef, useState } from "react";
import { FaRegImage } from "react-icons/fa";

const imagePlugin = createImagePlugin();
const plugins = [imagePlugin];

const text = "Click on the button to insert your image";

const SimpleImageEditor = () => {
  const [editorState, setEditorState] = useState(
    createEditorStateWithText(text)
  );
  const editor = useRef();

  const insertImage = (editorState, base64) => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      "image",
      "IMMUTABLE",
      { src: base64 }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity,
    });
    return AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, "");
  };

  return (
    <div>
      <div onClick={() => editor.current.focus()}>
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          plugins={plugins}
          // modifier={imagePlugin.addImage}
          ref={editor}
        />
      </div>
      {/* <FaRegImage
        editorState={editorState}
        onChange={setEditorState}
        modifier={imagePlugin.addImage}
      /> */}
    </div>
  );
};

export default SimpleImageEditor;
