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
  Link,
} from "@chakra-ui/react";

import PasswordInput from "../components/PasswordInput";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRoles } from "../api/userRequest";

function LoginPage() {
  const { signin, isAuthenticated, errors } = useAuth();
  const [roles, setRoles] = useState([]);

  // console.log(errors)

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = Object.fromEntries(new FormData(event.target));
    // console.log(JSON.stringify(data));
    signin(data);
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const loadRoles = async () => {
      const { data } = await getRoles();
      setRoles(data);
    };
    loadRoles();
  }, []);

  return (
    <Container
      maxW="lg"
      alignItems="center"

      py={{ base: "12", md: "24" }}
      px={{ base: "0", sm: "8" }}
    >
      <Stack spacing="7">
        <Stack spacing="6">
          <Stack spacing={{ base: "2", md: "3" }} textAlign="center">
            <Heading size={{ base: "xs", md: "sm" }}>
              Inicia Sesión en tu cuenta.
            </Heading>
            <Text>Es un gusto tenerte de vuelta 😄</Text>
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

                  <FormControl>
                    <FormLabel htmlFor="username">Usuario</FormLabel>
                    <Input id="username" name="username" />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Contraseña</FormLabel>
                    <PasswordInput name="password" />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="roles">Roles disponibles</FormLabel>
                    <Select placeholder="Seleccione un rol" name="rol">
                      {roles.map((rol) => (
                        <option key={rol.id} value={rol.rol}>
                          {rol.rol}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
                <Button
                  bg="ceruleanBlue.500"
                  color="white"
                  type="submit"
                  _hover={{
                    bg: "ceruleanBlue.600",
                  }}
                >
                  Iniciar Sesión
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
