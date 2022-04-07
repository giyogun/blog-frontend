import React, { useContext, useEffect, useRef } from "react";
import classes from "./Register.module.css";
import { GrClose } from "react-icons/gr";
import { useHistory } from "react-router";
import useClientVal from "../../hooks/useClientVal";
import PostsContext from "../../context/postsContext";

const Register = () => {
  const ctx = useContext(PostsContext);
  const { error, clear } = ctx;
  const history = useHistory();
  const validityArg = (value) => value.trim() !== "";

  const emailCheck = /^([a-zA-Z0-9_\-.+]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/;

  const passwordCheck = /(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[\W]).{6,}$/;

  const {
    value: username,
    hasError: nameHasError,
    inputChangeHandler: nameChangeHandler,
    inputBlurHandler: nameBlurHandler,
    validity: nameValueIsValid,
    submit: submitUsername,
  } = useClientVal(validityArg);

  const {
    value: email,
    hasError: emailHasError,
    inputBlurHandler: emailBlurHandler,
    inputChangeHandler: emailChangeHandler,
    validity: emailValueIsValid,
    submit: submitEmail,
  } = useClientVal((value) => value.trim() !== "" && emailCheck.test(value));

  const {
    value: password,
    hasError: passwordHasError,
    inputBlurHandler: passwordBlurHandler,
    inputChangeHandler: passwordChangeHandler,
    validity: passwordValueIsValid,
    submit: submitPassword,
  } = useClientVal((value) => value.trim() !== "" && passwordCheck.test(value));

  let emailError = <p className={classes.errorText}>Email cannot be blank!</p>;

  if (email.trim() !== "") {
    if (!emailCheck.test(email)) {
      emailError = (
        <p className={classes.errorText}>Please enter a valid email</p>
      );
    }
  }

  let passwordError = (
    <p className={classes.errorText}>Password cannot be blank!</p>
  );

  if (password.trim() !== "") {
    if (!passwordCheck.test(password)) {
      passwordError = (
        <p className={classes.errorText}>Include a number and special char</p>
      );
    }
  }

  let formIsValid = false;
  if (nameValueIsValid && emailValueIsValid && passwordValueIsValid) {
    formIsValid = true;
  }
  const formSubmitHandler = (e) => {
    e.preventDefault();

    submitEmail();
    submitPassword();
    submitUsername();

    if (formIsValid) {
      ctx.register(username, email, password);
    }

    if (!formIsValid) return;
  };

  const usernameClasses = !nameHasError
    ? classes.regInput
    : `${classes.regInput} ${classes.invalid}`;

  const emailClasses = !emailHasError
    ? classes.regInput
    : `${classes.regInput} ${classes.invalid}`;

  const passwordClasses = !passwordHasError
    ? classes.regInput
    : `${classes.regInput} ${classes.invalid}`;

  const emailRef = useRef();
  const userNameRef = useRef();

  useEffect(() => {
    if (error === "Email is already registered") {
      emailRef.current.focus();
      setTimeout(() => {
        clear();
      }, 5000);
    } else if (error === "Username is not available") {
      userNameRef.current.focus();
      setTimeout(() => {
        clear();
      }, 5000);
    }
  }, [clear, error]);

  return (
    <div className={classes.reg}>
      <span className={classes.regTitle}>Create Account</span>
      <form onSubmit={formSubmitHandler}>
        <div className={classes.regForm}>
          <div className={usernameClasses}>
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter your username..."
              onChange={nameChangeHandler}
              onBlur={nameBlurHandler}
              value={username}
              ref={userNameRef}
            />
            {error === "Username is not available" && (
              <p className={classes.errorText}>{error}</p>
            )}
            {nameHasError && (
              <p className={classes.errorText}>Please enter a username!</p>
            )}
          </div>
          <div className={emailClasses}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email..."
              onChange={emailChangeHandler}
              onBlur={emailBlurHandler}
              value={email}
              ref={emailRef}
            />
            {error === "Email is already registered" && (
              <p className={classes.errorText}>{error}</p>
            )}
            {emailHasError && emailError}
          </div>
          <div className={passwordClasses}>
            <label>Password</label>
            <input
              className={classes.regInput}
              type="password"
              placeholder="Enter your password"
              onBlur={passwordBlurHandler}
              onChange={passwordChangeHandler}
              minLength="6"
            />
            {passwordHasError && passwordError}
          </div>
          <button className={classes.regButton}>Continue</button>
        </div>
      </form>
      <p className={classes.regSignIn}>
        Already have an account?{" "}
        <button
          className={classes.signInBtn}
          onClick={() => history.push("/login")}
        >
          Sign in
        </button>
      </p>
      <GrClose
        className={classes.closeBtn}
        onClick={() => history.push("/login")}
      />
    </div>
  );
};

export default Register;
