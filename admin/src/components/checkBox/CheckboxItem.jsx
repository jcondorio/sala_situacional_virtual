import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

const CheckboxItem = ({ item, checked, onChange }) => {
  return (
    <FormControlLabel
      control={<Checkbox checked={checked} value={item.ano} onChange={onChange} />}
      label={item.ano}
    />
  );
};

export default CheckboxItem;