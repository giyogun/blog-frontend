import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, HashRouter } from "react-router-dom";
import App from "./App";
import { PostsProvider } from "./context/postsContext";

ReactDOM.render(
  // <React.StrictMode>
  <HashRouter>
    <PostsProvider>
      <App />
    </PostsProvider>
  </HashRouter>,
  // </React.StrictMode>,
  document.getElementById("root")
);
