// ... otras importaciones
import { AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, AlertDialogCloseButton, useDisclosure, Button, } from "@chakra-ui/react";
import React from "react";

function Modal({
  isOpen,
  onClose,
  onAccept,
  button = false,
  title = null,
  message = null,
}) {
  const cancelRef = React.useRef();

  const handleAccept = () => {
    onAccept(); // Ejecuta la función onAccept cuando se hace clic en "Aceptar"
    if (onClose) {
      onClose(); // Cierra el modal solo si onClose está definida
    }
  };

  return (
    <>
      {button && <Button onClick={onOpen}>Discard</Button>}
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>{title}</AlertDialogHeader>
          {onClose && <AlertDialogCloseButton />}
          <AlertDialogBody>{message}</AlertDialogBody>
          <AlertDialogFooter>
            {onClose && (
              <Button ref={cancelRef} onClick={onClose}>
                Cancelar
              </Button>
            )}
            <Button colorScheme="red" ml={3} onClick={handleAccept}>
              Aceptar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default Modal;
