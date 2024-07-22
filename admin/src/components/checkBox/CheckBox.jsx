import { Checkbox, FormControlLabel } from "@mui/material";
import React from "react";

const CheckBox = ({ item, checked, onChange }) => {
  return (
    <div>
      <FormControlLabel>
        control={<Checkbox checked={checked} onChange={() => onChange(item)} />}
      </FormControlLabel>
    </div>
  );
};

export default CheckBox;
