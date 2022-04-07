import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router";
import useApiCall from "../hooks/useApiCall";

const PostsContext = React.createContext({
  blogPosts: [],
  blogPost: {},
  searchedPosts: [],
  isLoggedIn: false,
  isLoading: true,
  modalIsShown: true,
  // post: {},
  error: null,
  categories: [],
  modal: () => {},
  createPost: () => {},
  updatePost: () => {},
  deletePost: () => {},
  getCategories: function () {},
  clear: () => {},
  login: () => {},
  logout: () => {},
  filterPosts: () => {},
  search: () => {},
  resetPosts: () => {},
  filterPostsByUser: () => {},
  register: () => {},
  deregister: () => {},
});

// const BASE_URL = "http://localhost:5000/api";

const capitalize = (text) => {
  const result = text.charAt(0).toUpperCase() + text.slice(1);

  return result;
};

const ls = JSON.parse(localStorage.getItem("user"));

export const PostsProvider = (props) => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [posts1, setPosts1] = useState([]);
  const [cats, setCats] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(!!ls);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();

  const getAllCats = useCallback((res) => {
    if (res.statusText === "OK") {
      setCats(res.data);
    }
  }, []);

  const { queryPosts: getCats } = useApiCall(getAllCats);

  
  const createPostFunc = useCallback(
    (res) => {
      if (res.statusText === "OK") {
        setIsLoading(true);
        history.replace("/posts/" + res.data._id);
      }
      console.log(res);
      setIsLoading(false);
    },
    [history]
  );

  const { queryPosts: createPostQuery } = useApiCall(createPostFunc);

  const updatePostFunc = useCallback(
    (res) => {
      if (res.statusText === "OK") {
        history.replace("/posts/" + res.data._id);
        setIsLoading(false);
      }
    },
    [history]
  );

  const { queryPosts: updatePostQuery } = useApiCall(updatePostFunc);

  const getAllPosts = useCallback((res) => {
    if (res.statusText === "OK") {
      const reverse = res.data.reverse();
      setPosts(reverse);
      setIsLoading(false);
    }
  }, []);

  const { queryPosts } = useApiCall(getAllPosts);

  const getPostsByUser = useCallback((res) => {
    if (res.statusText === "OK") {
      const reverse = res.data.reverse();
      setPosts(reverse);
    }
  }, []);

  const { queryPosts: queryPostByUser } = useApiCall(getPostsByUser);

  const deleteSinglePost = useCallback(
    (res) => {
      if (res.statusText === "OK") {
        setIsLoading(true);
        console.log("Post Deleted");
        queryPosts({ method: "GET", url: `/api/posts` });
        history.replace("/");
      }
      setIsLoading(false);
      console.log(res);
    },
    [history, queryPosts]
  );

  const { queryPosts: deletePostQuery } = useApiCall(deleteSinglePost);

  const filterAllPosts = useCallback((res, cat) => {
    const filteredPosts = res.data.filter((m) => m.categories.includes(cat));

    setPosts(filteredPosts);
    setIsLoading(false);
  }, []);

  const { queryPosts: filterPosts } = useApiCall(filterAllPosts);

  const searchPosts = useCallback((res, cat, title) => {
    const posts = res.data.filter((m) => m.title.includes(capitalize(title)));

    setPosts1(posts);
  }, []);

  const { queryPosts: postsSearch } = useApiCall(searchPosts);

  const loginApi = useCallback(
    (res) => {
      if (res.statusText === "OK") {
        localStorage.setItem("user", JSON.stringify(res.data));

        setIsLoggedIn(true);
        history.push("/write");
      } else {
        setErrorMessage(res);
      }
    },
    [history]
  );

  const { queryPosts: userLogin } = useApiCall(loginApi);

  const registration = (res) => {
    if (res.statusText === "OK") {
      setIsLoading(true);

      history.push("/login");
    } else {
      setErrorMessage(res);
    }
    console.log(res);
    // history.replace("/login");
    setIsLoading(false);
    // }
  };

  const { queryPosts: registerQuery } = useApiCall(registration);

  const deregistration = (res) => {
    if (res.statusText === "OK") {
      logoutHandler();
      console.log("User Deleted");
      queryPosts({ method: "GET", url: `/api/posts` });
      // history.push("/register");
      setIsLoading(false);
    }
  };

  const { queryPosts: deleteUserQuery } = useApiCall(deregistration);

  useEffect(() => {
    queryPosts({ method: "GET", url: `/api/posts` });
  }, [queryPosts]);

  useEffect(() => {
    getCats({ method: "GET", url: `/api/categories` });
  }, [getCats]);

  const getPostsByUserHandler = (name) => {
    queryPostByUser({
      method: "GET",
      url: `/api/posts?user=${name}`,
    });
  };

  const createPostHandler = (config) => {
    createPostQuery({
      method: "POST",
      url: `/api/posts/`,
      body: config,
    });
  };

  const updatePostHandler = (config) => {
    setIsLoading(true);
    updatePostQuery({
      method: "PUT",
      url: `/api/posts/${config.id}`,
      body: config,
    });
  };

  const deletePostHandler = (config) => {
    // setIsLoading(true);
    deletePostQuery({
      method: "DELETE",
      url: `/api/posts/${config.id}`,
      body: config,
    });
  };

  const registrationHandler = (username, email, password) => {
    // setIsLoading(true);
    registerQuery({
      url: `/api/auth/register`,
      method: "POST",
      body: {
        username,
        email,
        password,
      },
    });
  };

  const loginHandler = (username, pass) => {
    userLogin({
      method: "POST",
      body: { username, password: pass },
      url: `/api/auth/login`,
    });
  };

  const logoutHandler = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("user");
  };

  const filterPostsHandler = (category) => {
    setIsLoading(true);
    filterPosts({ method: "GET", url: `/api/posts` }, category);
  };

  const searchPostsHandler = (enteredText) => {
    postsSearch({ method: "GET", url: `/api/posts` }, null, enteredText);
  };

  const resetPostsHandler = () => {
    queryPosts({ method: "GET", url: `/api/posts` });
    setPosts1([]);
  };

  const clearErrorMessage = () => {
    setErrorMessage(null);
  };

  const getCategoriesHandler = () => {
    getCats({ method: "GET", url: `/api/categories` });
  };

  const deleteUserHandler = (config) => {
    setIsLoading(true);
    deleteUserQuery({
      method: "DELETE",
      url: `/api/users/${config.id}`,
      body: config,
    });
  };

  const modalHandler = () => {
    setShowModal((m) => !m);
  };

  const contextData = {
    blogPosts: posts,
    searchedPosts: posts1,
    isLoggedIn: isLoggedIn,
    isLoading: isLoading,
    modalIsShown: showModal,
    // post: singlePost,
    error: errorMessage,
    categories: cats,
    modal: modalHandler,
    createPost: createPostHandler,
    updatePost: updatePostHandler,
    deletePost: deletePostHandler,
    getCategories: getCategoriesHandler,
    clear: clearErrorMessage,
    login: loginHandler,
    logout: logoutHandler,
    filterPosts: filterPostsHandler,
    search: searchPostsHandler,
    resetPosts: resetPostsHandler,
    filterPostsByUser: getPostsByUserHandler,
    // getPost: getPostHandler,
    register: registrationHandler,
    deregister: deleteUserHandler,
  };
  return (
    <PostsContext.Provider value={contextData}>
      {props.children}
    </PostsContext.Provider>
  );
};

export default PostsContext;
