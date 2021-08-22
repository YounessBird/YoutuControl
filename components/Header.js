import React from "react";
import SettingsRemoteIcon from "@material-ui/icons/SettingsRemoteRounded";
import SettingsIcon from "@material-ui/icons/Settings";
import { blue, blueGrey } from "@material-ui/core/colors";
export default function Header() {
  return (
    <header>
      <SettingsRemoteIcon style={{ color: blue[500] }} />
      <div className="title">
        <span className="logo-title-color">Youtu</span>Control
      </div>
      <SettingsIcon className="settings" />
    </header>
  );
}
