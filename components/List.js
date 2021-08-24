import React from "react";
import "../css/popup.css";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";

//use material ui instead
function List({ title, state, onChange }) {
  return (
    <li>
      <FormControlLabel
        className="MuiFormControlLabel-labelPlacementStar"
        label={title}
        labelPlacement="start"
        control={
          <Switch
            checked={state}
            onChange={onChange}
            name={title}
            className="switchbtn"
          />
        }
      />
    </li>
  );
}

export default List;
