import {
  Container,
  Stack,
  Heading,
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Select,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Grid,
  GridItem,
  InputGroup,
  InputLeftAddon,
  useToast
} from "@chakra-ui/react";

import ComparePasswords from "../components/ComparePasswords";
import InputCi from "../components/InputCi";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { registerUser } from "../api/registerRequest";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const toast = useToast();
  const navigate = useNavigate();



  const { signin, isAuthenticated, errors } = useAuth();

  const [formValidCi, setFormValidCi] = useState(false); 
  const [formValidPassword, setFormValidPassword] = useState(false); 

  const handleSubmit = (event) => {
    event.preventDefault();
    if (formValidCi && formValidPassword) {

    
      const data = Object.fromEntries(new FormData(event.target));
      data.username = data.ci;
      //agrea el ci al username para uqe se guarde
      toast.promise(registerUser(data), {
        loading: {
          title: "Registrando...",
          position: "top-right",
        },
        success: (d) => {
          navigate('/login');

  
          return {
            title: "Registracion",
            description: d.data.message,
            isClosable: true,
          };
        },
        error: (e) => ({
          title: "Error",
          description: e.response.data.message,
          isClosable: true,
        }),
      });
    } else {
      console.log('El formulario no es válido');
    }
  };
  useEffect(() => {
  }, []);
  return (
    <Container
      maxW="xl"
      alignItems="center"

      // py={{ base: "12", md: "24" }}
      // px={{ base: "0", sm: "8" }}
    >
      <Stack spacing="20">
        <Stack spacing="10">
          <Stack spacing={{ base: "2", md: "3" }} textAlign="center">
            <Heading size={{ base: "xs", md: "sm" }}>
              Registrate.
            </Heading>
            <Text>Por favor ingresa los datos solicitados 😄</Text>
          </Stack>
          <Box
            py={{ base: "0", sm: "8" }}
            px={{ base: "4", sm: "10" }}
            bg={{ base: "transparent", sm: "bg.surface" }}
            boxShadow={{ base: "none", sm: "md" }}
            borderRadius={{ base: "none", sm: "xl" }}
          >
            <form onSubmit={handleSubmit}>
              <Stack spacing="6">
                <Stack spacing="5">
                  {!errors.message ? (
                    ""
                  ) : (
                    <Alert status="error">
                      <AlertIcon />
                      <AlertTitle>Autenticación</AlertTitle>
                      <AlertDescription>{errors.message}</AlertDescription>
                    </Alert>
                  )}

<Grid templateColumns={{ base: "1fr", md: "2fr 2fr" }} gap={2} mt={2}>
            <GridItem fontSize={"sm"} colSpan={2}>
              <FormControl isRequired>
                <FormLabel htmlFor="username">Cedula</FormLabel>
                {/* <Input type="text" placeholder="Cedula" name="ci" isRequired/> */}
                <InputCi isRequired setFormValid={setFormValidCi}/>
              </FormControl>
            </GridItem>
            <GridItem fontSize={"sm"}colSpan={2}>
              <ComparePasswords setFormValid={setFormValidPassword}/>
            </GridItem>

            <GridItem fontSize={"sm"}>
              <FormControl isRequired>
                <FormLabel htmlFor="username">Primer Apellido</FormLabel>
                <Input type="text" placeholder="Primer Apellido" name="firstLastName"/>
              </FormControl>
            </GridItem>
            <GridItem fontSize={"sm"}>
              <FormControl>
                <FormLabel htmlFor="username">Segundo Apellido</FormLabel>
                <Input type="text" placeholder="Segundo Apellido" name="secondLastName"/>
              </FormControl>
            </GridItem>
            <GridItem fontSize={"sm"}>
              <FormControl isRequired>
                <FormLabel htmlFor="username">Primer Nombre</FormLabel>
                <Input type="text" placeholder="Primer Nombre" name="firstName"/>
              </FormControl>
            </GridItem>
            <GridItem fontSize={"sm"}>
              <FormControl>
                <FormLabel htmlFor="username">Segundo Nombre</FormLabel>
                <Input type="text" placeholder="Segundo Nombre" name="secondName"/>
              </FormControl>
            </GridItem>
{/* 
            <GridItem fontSize={"sm"}colSpan={2}>
              <InputGroup>
                <InputLeftAddon children="Genero" />
                <Select
                  placeholder="Seleccione una opción"
                  name="gender"
                  isRequired
                >
                  <option value="F">Femenino</option>
                  <option value="M">Masculino</option>
                </Select>
              </InputGroup>
            </GridItem> */}
            </Grid>
                </Stack>
                <Button
                  bg="ceruleanBlue.500"
                  color="white"
                  type="submit"
                  isDisabled={!formValidCi || !formValidPassword}
                  _hover={{
                    bg: "ceruleanBlue.600",
                  }}
                >
                  Registrarse
                </Button>
              </Stack>
            </form>
          </Box>
        </Stack>
      </Stack>
    </Container>
  );
}

export default LoginPage;