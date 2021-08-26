import React, { useState, useLayoutEffect, useRef } from "react";
import store from "../scripts/store";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";
import { blue } from "@material-ui/core/colors";
import IndeterminateCheckBoxIcon from "@material-ui/icons/IndeterminateCheckBox";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";

// theme for materialUI
const useStyles = makeStyles((theme) => ({
  root: {
    height: "170px",
    margin: "5px auto",
    border: "1px solid steelblue",
    paddingLeft: 5,
    BorderAllRounded: 5,
    //paddingTop: "30px",

    width: "100%",
    width: 200,
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    overflow: "auto",
    maxHeight: 400,
    overscrollBehavior: "contain",
  },
  deletebtn: {
    color: "secondary",
  },
  wrapIcon: {
    verticalAlign: "middle",
    display: "inline-flex",
  },
}));

export default function PlayLists() {
  const classes = useStyles();
  const spinnerRef = useRef(null);
  const listRef = useRef(null);

  const [playlists, setPlaylists] = useState([]);

  const iconSize = 35;
  useLayoutEffect(() => {
    const setEffect = async () => {
      var storedPlaylists = await store.getContextMenuObject("playlists");
      if (storedPlaylists[0]?.playlists.length > 0) {
        setPlaylists(storedPlaylists[0].playlists);
        listRef.current?.classList.remove("hidden");
      }
    };
    setEffect();
    //const sotredPlaylists = await store.getContextMenuObject("playlists");
  }, []);

  const loadPlayLists = () => {
    spinnerRef.current?.classList.remove("hidden");
    spinnerRef.current?.classList.add("spinner");

    chrome.tabs.query({}, function (tabs) {
      tabs.forEach((tab) => {
        if (
          // this has to be changed to check only if the link is youtube
          new RegExp("https://www.youtube.com/*", "g").test(tab.url)
        ) {
          chrome.tabs.sendMessage(
            tab.id,
            { msg: "storePlayLists", tabUrl: tab.url },
            async (res) => {
              if (chrome.runtime.lastError) {
                console.log("Error setting");
              }
              //check if res is received
              // if (res.res == "saved") {
              // var storedPlaylists = window.localStorage.getItem("playlists");

              var timer = setInterval(async () => {
                var storedPlaylists = await store.getContextMenuObject(
                  "playlists"
                );

                if (storedPlaylists[0]?.playlists.length > 0) {
                  spinnerRef.current?.classList.add("hidden");
                  listRef.current?.classList.remove("hidden");
                  setPlaylists(storedPlaylists[0].playlists);
                  chrome.runtime.sendMessage({
                    msg: "playlistsStored",
                  });

                  clearTimeout(timer);
                }
              }, 100);
            }
          );
        }
      });
    });
  };

  const handleToggle = (value) => async () => {
    const currentIndex = playlists.indexOf(value);
    const newChecked = [...playlists];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    store.addContextMenuObject("playlists", newChecked);
    setPlaylists(newChecked);
    chrome.runtime.sendMessage({
      msg: "removePlayList",
      removePlayList: value,
    });
  };

  return (
    <>
      <Grid container direction="row" alignItems="center">
        <PlaylistAddIcon
          clasName="playListIcon"
          onClick={loadPlayLists}
          style={{
            fontSize: iconSize,
            color: blue[500],
            paddingLeft: "20px",
            paddingRight: "10px",
            cursor: "pointer",
          }}
        />
        <span style={{ fontSize: 15, fontWeight: "bold", color: "#07152d" }}>
          Import PlayLists
        </span>
      </Grid>

      {!playlists.length ? (
        <div className={`hidden`} ref={spinnerRef}>
          <CircularProgress color="secondary" />
        </div>
      ) : null}
      <List className={`hidden ${classes.root}`} ref={listRef}>
        {playlists.map((value, index) => {
          const labelId = value;

          return (
            <ListItem
              key={index}
              role={undefined}
              dense
              button
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <IndeterminateCheckBoxIcon
                  className="deletebtn"
                  edge="start"
                  checked={playlists.indexOf(value) !== -1}
                  disableRipple
                  style={{ fontSize: iconSize, color: "#f50057" }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={value} />
            </ListItem>
          );
        })}
      </List>
    </>
  );
}
