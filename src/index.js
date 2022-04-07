import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { PostsProvider } from "./context/postsContext";

ReactDOM.render(
  // <React.StrictMode>
    <BrowserRouter>
      <PostsProvider>
        <App />
      </PostsProvider>
    </BrowserRouter>,
  // </React.StrictMode>,
  document.getElementById("root")
);
