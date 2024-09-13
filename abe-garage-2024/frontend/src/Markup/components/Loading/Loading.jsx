import React from "react"; 
import classes from "./Loading.module.css";
import loadingGif from "../../../assets/images/preloader.gif"; 

function Loading() {
  // Defining the Loading functional component
  return (
    <div className={classes.wrapper}>
      {" "}
      {/* Container div with styling from the CSS module */}
      <img src={loadingGif} alt="" /> {/* Displaying the loading GIF */}
    </div>
  );
}

export default Loading;
