import React, { useState, useEffect } from 'react';
import { FormControl, FormLabel, Flex, Text } from '@chakra-ui/react';
import PasswordInput from "./PasswordInput";

const ComparePasswords = ({ firstInput = { name: 'password', label: 'Contraseña' }, setFormValid }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(false);
  const [passwordLengthError, setPasswordLengthError] = useState(false);
  const [confirmPasswordLengthError, setConfirmPasswordLengthError] = useState(false);
  const [bothFieldsFilled, setBothFieldsFilled] = useState(false);

  useEffect(() => {
    const isPasswordValid = password.length > 0 ? password.length < 8 : false;
    const isConfirmPasswordValid = confirmPassword.length > 0 ? confirmPassword.length < 8 : false;

    setPasswordLengthError(isPasswordValid);
    setConfirmPasswordLengthError(isConfirmPasswordValid);

    const passwordsMatch = password === confirmPassword;
    setPasswordMatch(passwordsMatch);

    const isFormValid = !isPasswordValid && !isConfirmPasswordValid && passwordsMatch;
    setFormValid(isFormValid);

    // Check if both fields have content
    setBothFieldsFilled(password.length > 0 && confirmPassword.length > 0);
  }, [password, confirmPassword, setFormValid]);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  return (
    <Flex flexDirection="column">
      <FormControl isRequired>
        <FormLabel>{firstInput.label}</FormLabel>
        <PasswordInput
        maxLength={20}
          name={firstInput.name}
          onChange={handlePasswordChange}
        />
        {passwordLengthError && (
          <Text color="red" fontSize="sm">La contraseña debe tener al menos 8 caracteres</Text>
        )}
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Confirmar Contraseña</FormLabel>
        <PasswordInput
        maxLength={20}
          onChange={handleConfirmPasswordChange}
        />
        {confirmPasswordLengthError && (
          <Text color="red" fontSize="sm">La contraseña debe tener al menos 8 caracteres</Text>
        )}
       
        {bothFieldsFilled && !passwordMatch && (
          <Text color="red" fontSize="sm">Las contraseñas no coinciden</Text>
        )}
      </FormControl>
    </Flex>
  );
};

export default ComparePasswords;
