import Tabl from "../components/Table";
import { useEffect, useState } from "react";
import { getAllPeriods,addPeriod,editPeriod } from "../api/matrizResquest.js";
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
  const [dataPeriods, setDataPeriods] =
    useState([]);
  const [id, setId] = useState(false);


  const initialProfessionalMerits = {
    name: "",
  };
  const [formPeriods, setFormPeriods] = useState(
    initialProfessionalMerits
  );
  const handleAcceptDelete = async () => {
    try {
      // const { data } = await deletePeriods(id);
      // fetchData();
      // clear();
    } catch (error) {
      console.log(error);
    }
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormPeriods({ ...formPeriods, [name]: value });
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
      header: "Nombre del Periodo",
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
    const { id,name} = row;
    form.current.scrollIntoView({ behavior: "smooth", block: "start" });
    setIsEditing(true);
    setId(row.id);
    setFormPeriods({
      name,
    });
    console.log(formPeriods)
  };
  function clear() {
    setIsEditing(false);
    setId(false);
    setFormPeriods(initialProfessionalMerits);
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(formPeriods)

    if (isEditing) {
      toast.promise(
        editPeriod(id, formPeriods),
        {
          loading: {
            title: "Editando...",
            position: "top-right",
          },
          success: (d) => {
            fetchData();
            clear();
            return {
              title: "Periodos",
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
      addPeriod(formPeriods),
      {
        loading: {
          title: "Añadiendo...",
          position: "top-right",
        },
        success: (d) => {
          setDataPeriods([
            ...dataPeriods,
            formPeriods,
          ]);

          return {
            title: "Periodos",
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
      const { data } = await getAllPeriods();
      setDataPeriods(data);
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
                <InputLeftAddon children="Periodo:" />
                <Input
                  type="text"
                  placeholder="Periodo"
                  name="name"
                  value={formPeriods.name}
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
          <Tabl columns={columns} data={dataPeriods} />
    </form>
      </Box>
    </>
  );
}

export default UserTable;
