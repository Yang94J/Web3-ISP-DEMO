import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import styles from "../styles/Layout.module.css";

const Layout = ({ children, connect, header }) => {
  return (
    <>
      <Header connect={connect} header={header}/>
      <main className={styles.main}>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
