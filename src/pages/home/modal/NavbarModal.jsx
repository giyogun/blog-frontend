import React from "react";
import ReactDOM from "react-dom";
import styles from "./NavbarModal.module.css";

const Backdrop = (props) => {
  return <div className={styles.backdrop} onClick={props.hide} />;
};

const NavbarModal = (props) => {
  return (
    <>
      {ReactDOM.createPortal(
        <Backdrop hide={props.close} />,
        document.getElementById("backdrop")
      )}
    </>
  );
};

export default NavbarModal;
