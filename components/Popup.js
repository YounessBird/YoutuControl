import React from "react";
import "../css/popup.css";
import Ulist from "./Ulist";
import PlayLists from "./PlayLists";
import Header from "./Header";

function Popup() {
  return (
    <>
      <Header />
      <div className="container">
        <div className="page-title">Options</div>
        <div className="list-container">
          <Ulist />
        </div>
        <PlayLists />
      </div>
    </>
  );
}

export default Popup;
