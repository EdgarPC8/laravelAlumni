import {
  Box,
  Text,
  Heading,
  Image,
  Center,
  Stack,
  Button,
  Input,
  IconButton,
  useDisclosure,
  Grid,
  GridItem,
  FormControl,
  FormLabel,
  Spinner,
  FormHelperText,
  CloseButton,
  Avatar,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Container,
  useToast,
  SimpleGrid,
} from "@chakra-ui/react";
import { useEffect, useRef, useState, Fragment } from "react";

import PasswordInput from "../components/PasswordInput";

import { FiEdit2 } from "react-icons/fi";
import { changePassword, updateUserProfile } from "../api/userRequest";
import { urlPhotos } from "../api/axios";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialFormProfile = {
    email: "",
    ci: "",
    firstName: "",
    secondName: "",
    firstLastName: "",
    secondLastName: "",
    currentPassword: "",
    newPassword: "",
  };

  const { user, loadUserProfile } = useAuth();

  const [form, setForm] = useState(initialFormProfile);
  const [photo, setPhoto] = useState(null);
  const hiddenFileInput = useRef();
  const [wantToEdit, setWantToEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const photoUrl = photo
    ? URL.createObjectURL(photo)
    : user.userId
    ? `${urlPhotos}/${user.photo}`
    : "/noPhoto.jpg";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  const newPassword = async (event) => {
    event.preventDefault();
    const passwords = Object.fromEntries(new FormData(event.target));

    // try {

    toast.promise(changePassword(user.userId, passwords), {
      loading: {
        title: "Actualizando...",
        position: "top-right",
      },
      success: (d) => ({
        title: "Actualización",
        description: d.data.message,
        isClosable: true,
      }),
      error: (e) => ({
        title: "Error",
        description: e.response.data.message,
        isClosable: true,
      }),
    });
  };

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      const updateUser = await updateUserProfile(form.userId, {
        ...form,
        photo,
      });
      // console.log(photo);

      await loadUserProfile();
      toast({
        title: "Actualización",
        description: "Datos actualizados correctamente",
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      console.log(error);
    }

    // console.log(updateUser);
  };

  const cancelEdit = () => {
    setIsLoading(true);

    setTimeout(() => {
      setWantToEdit(false);
      setIsLoading(false);
    }, 1500);
  };

  const iWantEdit = () => {
    setIsLoading(true);

    setTimeout(() => {
      setWantToEdit(true);
      setIsLoading(false);
      setForm(user);
    }, 1500);
  };

  const handlePhoto = (event) => {
    hiddenFileInput.current.click();
  };

  const handleFileChange = (event) => {
    setPhoto(event.target.files[0]);
  };

  return (
    <Center h="100vh" bg="bg.100">
      {isLoading ? (
        <Box m={10} boxShadow="md" p={7} borderRadius="xl">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </Box>
      ) : !wantToEdit ? (
        <Box
          boxShadow="md"
          p={7}
          borderRadius="xl"
          bg="white"
          style={{ position: "relative", display: "inline-block" }}
        >
          <IconButton
            bg="white"
            style={{ position: "absolute", top: "0", right: "0" }}
            isRound={true}
            onClick={iWantEdit}
            icon={<FiEdit2 />}
          />

          <Center>
            <div style={{ position: "relative", display: "inline-block" }}>
              <Avatar size="xl" src={`${urlPhotos}/${user.photo}`} />
            </div>
          </Center>

          <Heading as="h4" size="md" mt={10} mb={8} color="ceruleanBlue.900">
            Información del perfil
          </Heading>

          <Stack direction="row" spacing={3} mb={4}>
            <Text as="b">C.I:</Text>
            <Text>{user.ci}</Text>
          </Stack>

          <Stack direction="row" spacing={3} mb={4}>
            <Text as="b">Nombres completos:</Text>
            <Text>
              {user.firstName} {user.secondName} {user.firstLastName}{" "}
              {user.secondLastName}
            </Text>
          </Stack>
          <Stack direction="row" spacing={3} mb={4}>
            <Text as="b">{user.roles.length > 1 ? "Roles:" : "Rol:"}</Text>

            {user.roles.map((rol, index) => (
              <Fragment key={index}>
                <Text>{rol.rol}</Text>
                {index < user.roles.length - 1 && <Text>/</Text>}
              </Fragment>
            ))}
          </Stack>
        </Box>
      ) : (
        <form onSubmit={handleSubmit}>
          <Box m={10} boxShadow="md" p={7} borderRadius="xl" bg="white">
            <Heading as="h4" size="md" mb={9} color="ceruleanBlue.900">
              Editando información
            </Heading>
            <Center>
              <div style={{ position: "relative", display: "inline-block" }}>
                <Avatar src={photoUrl} size="xl" />
                <IconButton
                  bg="white"
                  style={{ position: "absolute", top: "0", right: "0" }}
                  isRound={true}
                  onClick={handlePhoto}
                  icon={<FiEdit2 />}
                />
              </div>
            </Center>
            <Input
              type="file"
              ref={hiddenFileInput}
              onChange={handleFileChange}
              hidden
            />
            <Grid templateColumns="repeat(2, 1fr)" mt="20px" gap={6}>
              <GridItem>
                <Stack spacing="5">
                  <FormControl>
                    <FormLabel>Cédula</FormLabel>
                    <Input
                      type="text"
                      name="ci"
                      value={form.ci}
                      onChange={handleChange}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Segundo Nombre</FormLabel>
                    <Input
                      type="text"
                      name="secondName"
                      value={form.secondName}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Segundo Apellido</FormLabel>
                    <Input
                      type="text"
                      name="secondLastName"
                      value={form.secondLastName}
                      onChange={handleChange}
                    />
                  </FormControl>
                </Stack>
              </GridItem>
              <GridItem>
                <Stack spacing="5">
                  <FormControl>
                    <FormLabel>Primer Nombre</FormLabel>
                    <Input
                      type="text"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Primer Apellido</FormLabel>
                    <Input
                      type="text"
                      name="firstLastName"
                      value={form.firstLastName}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <Button bg="ceruleanBlue.200" onClick={onOpen}>
                    Cambiar Contraseña
                  </Button>
                </Stack>
              </GridItem>
            </Grid>
            <Stack spacing={4} direction="row" align="center" mt="20px">
              <Button
                type="submit"
                bg="ceruleanBlue.500"
                color="white"
                _hover={{
                  bg: "primary.100",
                }}
              >
                Guardar
              </Button>
              <Button onClick={cancelEdit}>Cancelar</Button>
            </Stack>
          </Box>
        </form>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <form onSubmit={newPassword}>
          <ModalContent>
            <ModalHeader>Cambiar Contraseña</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel>Contraseña actual</FormLabel>
                <PasswordInput name="currentPassword" />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Nueva Contraseña</FormLabel>
                <PasswordInput name="newPassword" />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button
                bg="ceruleanBlue.500"
                color="white"
                _hover={{
                  bg: "ceruleanBlue.600",
                }}
                mr={3}
                type="submit"
              >
                Guardar
              </Button>
              <Button onClick={onClose}>Cerrar</Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </Center>
  );
}

export default Profile;
