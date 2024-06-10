import {
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
  FormLabel,
  Button,
  IconButton,
} from "@chakra-ui/react";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

function PasswordInput(props) {
  const [show, setShow] = useState(false);

  const handleClick = () => setShow(!show);

  return (
    <InputGroup size="md">
      <Input pr="4.5rem" type={show ? "text" : "password"} {...props} />
      <InputRightElement width="4.5rem">
        <IconButton
          variant="text"
          icon={show ? <FiEyeOff /> : <FiEye />}
          onClick={handleClick}
        />
      </InputRightElement>
    </InputGroup>
  );
}

export default PasswordInput;
