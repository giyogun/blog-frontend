import React, { useContext, useEffect, useRef, useState } from "react";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineMail,
  AiOutlineUser,
} from "react-icons/ai";
import { FaKey } from "react-icons/fa";
import { GrClose } from "react-icons/gr";
import { useHistory } from "react-router";
import PostsContext from "../../context/postsContext";
import useClientVal from "../../hooks/useClientVal";
import "./RegisterForm.css";

const RegisterForm = () => {
  const ctx = useContext(PostsContext);
  const { error, clear } = ctx;
  const [passwordType, setPasswordType] = useState("password");
  const history = useHistory();
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

  let emailError = <p className="errorText">Email cannot be blank!</p>;

  if (email.trim() !== "") {
    if (!emailCheck.test(email)) {
      emailError = <p className="errorText">Please enter a valid email</p>;
    }
  }

  let passwordError = <p className="errorText">Password cannot be blank!</p>;

  if (password.trim() !== "") {
    if (!passwordCheck.test(password)) {
      passwordError = (
        <p className="errorText">Include a number and special character</p>
      );
    }
  }

  let formIsValid = false;
  if (nameValueIsValid && emailValueIsValid && passwordValueIsValid) {
    formIsValid = true;
  }

  const submitHandler = (e) => {
    e.preventDefault();

    submitEmail();
    submitPassword();
    submitUsername();

    if (formIsValid) {
      ctx.register(username, email, password);
    }

    if (!formIsValid) return;
  };

  const showPasswordHandler = () => {
    const passwordState = passwordType === "password" ? "text" : "password";
    setPasswordType(passwordState);
  };

  let togglePasswordIcon = (
    <AiOutlineEyeInvisible onClick={showPasswordHandler} className="eye-icon" />
  );

  if (passwordType === "text") {
    togglePasswordIcon = (
      <AiOutlineEye onClick={showPasswordHandler} className="eye-icon" />
    );
  }

  const usernameClasses = !nameHasError ? "regInput" : `regInput invalid`;

  const emailClasses = !emailHasError ? "regInput" : `regInput invalid`;

  const passwordClasses = !passwordHasError ? "regInput" : `regInput invalid`;

  return (
    <div className="reg">
      <form className="regForm" onSubmit={submitHandler}>
        <h1>Create Account</h1>
        <hr />
        <label id="icon">
          <AiOutlineUser />
        </label>
        <input
          type="text"
          className={usernameClasses}
          placeholder="Username"
          onChange={nameChangeHandler}
          onBlur={nameBlurHandler}
          value={username}
          ref={userNameRef}
        />
        {error === "Username is not available" && (
          <p className="errorText">{error}</p>
        )}
        {nameHasError && <p className="errorText">Please enter a username!</p>}

        <label id="icon">
          <AiOutlineMail />
        </label>
        <input
          type="email"
          className={emailClasses}
          placeholder="Email"
          onChange={emailChangeHandler}
          onBlur={emailBlurHandler}
          value={email}
          ref={emailRef}
        />
        {error === "Email is already registered" && (
          <p className="errorText">{error}</p>
        )}
        {emailHasError && emailError}

        <label id="icon">
          <FaKey />
        </label>
        <input
          className={passwordClasses}
          type={passwordType}
          placeholder="Enter your password"
          onBlur={passwordBlurHandler}
          onChange={passwordChangeHandler}
          minLength="6"
        />
        {togglePasswordIcon}
        {passwordHasError && passwordError}
        <hr />
        <div class="btn-block">
          <button type="submit" className="btn-submit">
            Submit
          </button>
        </div>
        <p className="regSignIn">
          Already have an account?{" "}
          <button className="signInBtn" onClick={() => history.push("/login")}>
            Sign in
          </button>
        </p>
      </form>

      <GrClose className="closeBtn" onClick={() => history.push("/login")} />
    </div>
    // <div>
    //   <h1>Create An Account</h1>
    //   <form action="/" onSubmit={submitHandler}>
    //     <hr />
    //     <div class="account-type">
    //       <input
    //         type="radio"
    //         value="none"
    //         id="radioOne"
    //         name="account"
    //         checked
    //       />
    //       <label for="radioOne" class="radio">
    //         Personal
    //       </label>
    //       <input type="radio" value="none" id="radioTwo" name="account" />
    //       <label for="radioTwo" class="radio">
    //         Company
    //       </label>
    //     </div>
    //     {/* {error && (
    //       <div style={{ backgroundColor: "red", width: "calc(100% - 24px)" }}>
    //         <p style={{ color: "white", padding: "5px" }}>
    //           Please fill this field
    //         </p>
    //       </div>
    //     )} */}
    //     <hr />
    //     <label id="icon" for="name">
    //       <i class="fas fa-envelope"></i>
    //     </label>
    //     <input type="text" name="name" id="name" placeholder="Email" className={`email ${x}`} />
    //     {error && <p style={{ color: "red", padding: "5px" }}>
    //           Email is required
    //         </p>}
    //     {/* <div> */}
    //       <label id="icon" for="name">
    //         <i class="fas fa-user"></i>
    //       </label>
    //       <input
    //         type="text"
    //         name="name"
    //         className={`name1 ${x}`}
    //         placeholder="Name"
    //         ref={nameRef}
    //       />
    //       {error && <p style={{ color: "red", padding: "5px" }}>
    //           Name is required
    //         </p>}
    //     {/* </div> */}
    //     <label id="icon" for="name">
    //       <i class="fas fa-unlock-alt"></i>
    //     </label>
    //     <input
    //       type="password"
    //       name="name"
    //       className={`password ${x}`}
    //       placeholder="Password"
    //     />
    //     <AiOutlineEyeInvisible style={{marginLeft: "-30px"}} />
    //     {error && <p style={{ color: "red", padding: "5px" }}>
    //           Password is required
    //         </p>}
    //     {/* <button class="unmask" type="button" title="Mask/Unmask password to check content">Unmask</button> */}
    //     <hr />
    //     <div class="gender">
    //       <input type="radio" value="none" id="male" name="gender" checked />
    //       <label for="male" class="radio">
    //         Male
    //       </label>
    //       <input type="radio" value="none" id="female" name="gender" />
    //       <label for="female" class="radio">
    //         Female
    //       </label>
    //     </div>
    //     <hr />
    //     <div class="btn-block">
    //       <p>
    //         By clicking Register, you agree on our{" "}
    //         <a href="https://www.w3docs.com/privacy-policy">
    //           Privacy Policy for W3Docs
    //         </a>
    //         .
    //       </p>
    //       <button type="submit" className="btn-submit">
    //         Submit
    //       </button>
    //     </div>
    //   </form>
    // </div>
  );
};

export default RegisterForm;
