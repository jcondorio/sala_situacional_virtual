import { useState } from 'react';

const useCheckboxHandler = () => {
  const [datachecked, setDataChecked] = useState([]);

  const handleCheckedIras = (event) => {
    const { value, checked } = event.target;
    setDataChecked(prevDataChecked => {
      if (checked) {
        return [...prevDataChecked, value];
      } else {
        return prevDataChecked.filter(item => item !== value);
      }
    });
  };

  return { datachecked, setDataChecked, handleCheckedIras };
};

export default useCheckboxHandler;