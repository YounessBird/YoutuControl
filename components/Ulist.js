import React, { useState, useLayoutEffect } from "react";
import store from "../scripts/store";
import List from "./List";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import PausePresentationIcon from "@material-ui/icons/PausePresentation";
import RepeatIcon from "@material-ui/icons/Repeat";
import PageviewIcon from "@material-ui/icons/Pageview";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import { red, purple, orange } from "@material-ui/core/colors";
function Ulist() {
  const [state, setState] = useState({
    Loop: true,
    Play: true,
    Pause: true,
    Next: true,
    Back: true,
    Search: true,
    Save: true,
  });
  const iconSize = 35;
  useLayoutEffect(() => {
    const optionMenuState = store.getOptionsMenuObject("options");
    optionMenuState && setState(optionMenuState);
  }, []);

  const handleChange = (event) => {
    store.addOptionsMenuObject("options", {
      ...state,
      [event.target.name]: event.target.checked,
    });
    setState((state) => ({
      ...state,
      [event.target.name]: event.target.checked,
    }));
    chrome.runtime.sendMessage({
      msg: { text: "changeMenu", [event.target.name]: event.target.checked },
    });
  };

  return (
    <ul className="list">
      <PlayCircleFilledIcon
        className="icon"
        style={{ fontSize: iconSize, color: red[500] }}
      />
      <List title={"Play"} state={state.Play} onChange={handleChange} />
      <PausePresentationIcon
        className="icon"
        style={{ fontSize: iconSize, color: red[500] }}
      />
      <List title={"Pause"} state={state.Pause} onChange={handleChange} />
      <SkipNextIcon
        className="icon"
        style={{ fontSize: iconSize, color: red[500] }}
      />
      <List title={"Next"} state={state.Next} onChange={handleChange} />
      <SkipPreviousIcon
        className="icon"
        style={{ fontSize: iconSize, color: red[500] }}
      />
      <List title={"Back"} state={state.Back} onChange={handleChange} />
      <RepeatIcon
        className="icon"
        style={{ fontSize: iconSize, color: orange[500] }}
      />
      <List title={"Loop"} state={state.Loop} onChange={handleChange} />
      <PageviewIcon
        className="icon"
        style={{ fontSize: iconSize, color: purple[500] }}
      />
      <List title={"Search"} state={state.Search} onChange={handleChange} />
    </ul>
  );
}

export default Ulist;
