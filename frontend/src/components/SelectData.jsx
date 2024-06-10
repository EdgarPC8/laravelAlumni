import React from 'react';
import { Select, InputGroup, InputLeftAddon } from '@chakra-ui/react';

const SelectData = ({ title = "Seleccione", options = [], onSelectChange }) => {

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    onSelectChange(selectedValue);
  };

  return (
    <>
      <InputGroup>
        <InputLeftAddon children={title} />
        <Select
          placeholder="Seleccione una opción"
          onChange={(e) => onSelectChange(e.target.value, e.target.selectedOptions[0].text)}
        >
          {options.map((option) => (
            <option key={option.label + option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </InputGroup>
    </>
  );
};

export default SelectData;
