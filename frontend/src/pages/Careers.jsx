import Tabl from "../components/Table";
import { useEffect, useState } from "react";
import { getAllCareers,addCareer,editCareer } from "../api/matrizResquest.js";
import { useRef } from "react";
import {
  useDisclosure,
  Grid,
  GridItem,
  useToast,
  Box,
  Heading,
  Spacer,
  Input,
  InputLeftAddon,
  InputGroup,
  Button,
  Stack,
  Flex,
} from "@chakra-ui/react";

import { useAuth } from "../context/AuthContext";
import { FiUserPlus } from "react-icons/fi";
import { EmailIcon } from "@chakra-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import Modal from "../components/AlertDialog";


function UserTable() {
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const form = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataCareers, setDataCareers] =
    useState([]);
  const [id, setId] = useState(false);


  const initialProfessionalMerits = {
    name: "",
  };
  const [formCareers, setFormCareers] = useState(
    initialProfessionalMerits
  );
  const handleAcceptDelete = async () => {
    try {
      // const { data } = await deleteCareers(id);
      // fetchData();
      // clear();
    } catch (error) {
      console.log(error);
    }
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormCareers({ ...formCareers, [name]: value });
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [currentUser, setCurrentUser] = useState({});
  const cancelRef = useRef();
  

  const deleteUser = () => {
    toast.promise(removeUser(currentUser.userId), {
      loading: {
        title: "Eliminando...",
        position: "top-right",
      },
      success: (d) => ({
        title: "Usuario",
        description: d.data.message,
        isClosable: true,
      }),
      error: (e) => ({
        title: "Error",
        description: e.response.data.message,
        isClosable: true,
      }),
    });

    setUsers(users.filter((user) => user.userId !== currentUser.userId));
  };

  const columns = [
    {
      header: "#",
      accessorKey: "userId",
      cell: (props) => props.row.index + 1,
    },
    {
      header: "Nombre de la carrera",
      accessorKey: "name",
    },
    {
      header: "Acción",

      cell: (props) => (
        <Stack spacing={4} direction="row" align="center">
          <Button
            colorScheme="yellow"
            onClick={() => {
              handleEditRow(props.row.original);
            }}
          >
            Editar
          </Button>
          {/* <Button
            colorScheme="red"
            onClick={() => {
              setCurrentUser(props.row.original);
              onOpen();
            }}
          >
            Eliminar
          </Button> */}
        </Stack>
      ),
    },
  ];
  const handleEditRow = (row) => {
    const { idCarreer,name} = row;
    form.current.scrollIntoView({ behavior: "smooth", block: "start" });
    setIsEditing(true);
    setId(row.idCarreer);
    setFormCareers({
      name,
    });
    console.log(formCareers)
  };
  function clear() {
    setIsEditing(false);
    setId(false);
    setFormCareers(initialProfessionalMerits);
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(formCareers)

    if (isEditing) {
      toast.promise(
        editCareer(id, formCareers),
        {
          loading: {
            title: "Editando...",
            position: "top-right",
          },
          success: (d) => {
            fetchData();
            clear();
            return {
              title: "Carreras",
              description: d.data.message,
              isClosable: true,
            };
          },
          error: (e) => ({
            title: "Error",
            description: e.response.data.message,
            isClosable: true,
          }),
        }
      );

      return;
    }

    toast.promise(
      addCareer(formCareers),
      {
        loading: {
          title: "Añadiendo...",
          position: "top-right",
        },
        success: (d) => {
          setDataCareers([
            ...dataCareers,
            formCareers,
          ]);

          return {
            title: "Carreras",
            description: d.data.message,
            isClosable: true,
          };
        },
        error: (e) => ({
          title: "Error",
          description: e.response.data.message,
          isClosable: true,
        }),
      }
    );

    clear();
  };
  async function fetchData() {
    try {
      const { data } = await getAllCareers();
      setDataCareers(data);
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  }
  useEffect(() => {
    fetchData();
  }, [user]);

  return (
    <>
      <Box p={10}>
        <Flex alignItems="center" gap="2">
          <Box p="2">
            <Heading size="md">Carreras</Heading>
          </Box>
          <Spacer />

         
        </Flex>
        <form onSubmit={handleSubmit} ref={form}>
          <Grid
            gap={2}
            mt={2}
            mb={2}
            templateColumns={{ base: "1fr", md: "2fr 2fr" }}
          >
            <GridItem colSpan={2} fontSize={"sm"}>
              <InputGroup>
                <InputLeftAddon children="Carrera:" />
                <Input
                  type="text"
                  placeholder="Carrera"
                  name="name"
                  value={formCareers.name}
                  onChange={handleChange}
                />
              </InputGroup>
              <Button
                type="submit"
                mt={4}
                bg="ceruleanBlue.500"
                color={"white"}
              >
                {!isEditing ? "Guardar" : "Editar"}
              </Button>
            </GridItem>
          </Grid>
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onAccept={handleAcceptDelete}
            title="Datos"
            message="¿Estas Seguro que deseas eliminar?"
          ></Modal>
          <Tabl columns={columns} data={dataCareers} />
    </form>
      </Box>
    </>
  );
}

export default UserTable;
