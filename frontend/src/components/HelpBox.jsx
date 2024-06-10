import React, { useState } from 'react';
import { QuestionOutlineIcon } from '@chakra-ui/icons';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Button,
} from '@chakra-ui/react';

const HelpBox = ({ title = "Titulo", message = "No hay Mensaje" }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          p={0}
          m={0}
          border={0}
          height={0}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <QuestionOutlineIcon
            bg={isHovered ? "yellow" : "lightgray"}
            borderRadius={10}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>{title}</PopoverHeader>
        <PopoverBody>{message}</PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default HelpBox;
