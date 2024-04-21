import React from "react";
import styles from "./Loader.module.css";
export const Loader = ({ ...restProps }) => {
  return (
    <div className={styles.loader_box} {...restProps}>
      <span className={styles.loader}></span>
    </div>
  );
};
