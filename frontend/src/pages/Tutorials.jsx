import Tabl from "../components/Table";
import Modal from "../components/AlertDialog";
import { useEffect, useState } from "react";
import {
  getAllTutorials,
  addTutorials,
  editTutorials,
  deleteTutorials,
} from "../api/configResquest";
import { useRef } from "react";
import SelectData from "../components/SelectData";
import { FaYoutube } from "react-icons/fa";
import {
  Button,
  Grid,
  GridItem,
  Stack,
  useToast,
  Flex,
  Box,
  Heading,
  Input,
  InputLeftAddon,
  InputGroup,
  Textarea,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function TutorialsPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [TutorialsData, setTutorialsData] = useState([]);
  const form = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [id, setId] = useState(0);
  const [isDeleteTutoModalOpen, setDeleteTutoModalOpen] = useState(false);


  const columnsProgramador = [
    {
      header: "Id",
      accessorKey: "id",
      cell: (props) => props.row.index + 1,
    },
    {
      header: "Titulo",
      accessorKey: "name",
    },
    {
      header: "Descripción",
      accessorKey: "description",
    },
    {
      header: "url",
      accessorKey: "url",
    },
    {
      header: "Acción",

      cell: (props) => (
        <Stack spacing={4} direction="row" align="center">
          <Link to={props.row.original.url} target="_blank">
            <Button colorScheme={"red"}>

              <FaYoutube />
            </Button>
          </Link>
          <Button
            colorScheme="yellow"
            onClick={() => {
              handleEditRow(props.row.original);
            }}
          >
            Editar
          </Button>
          <Button
            colorScheme="orange"
            onClick={() => {
              setId(props.row.original.id);
              setDeleteTutoModalOpen(true);
            }}
          >
            Eliminar
          </Button>

        </Stack>
      ),
    },
  ];
  const columns = [
    {
      header: "Id",
      accessorKey: "id",
      cell: (props) => props.row.index + 1,
    },
    {
      header: "Titulo",
      accessorKey: "name",
    },
    {
      header: "Descripción",
      accessorKey: "description",
    },
    {
      header: "Acción",

      cell: (props) => (
        <Stack spacing={4} direction="row" align="center">
          <Link to={props.row.original.url} target="_blank">
            <Button colorScheme={"red"}>
              <FaYoutube />
            </Button>
          </Link>
        </Stack>
      ),
    },
  ];

  let initialFormQuiz = {
    name: "",
    description: "",
    url: "",
  };

  const [formQuiz, setFormQuiz] = useState(
    initialFormQuiz
  );

  const deleteHandle = () => {
    toast.promise(deleteTutorials(id), {
      loading: {
        title: "Eliminando...",
        position: "top-right",
      },
      success: (d) => {
        clear()
        fetchUsers()
        return {
          title: "Tutorial",
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
  };
  const handleEditRow = async (row) => {
    const {
      name,
      description,
      url,
    } = row;
    form.current.scrollIntoView({ behavior: "smooth", block: "start" });
    // console.log(row.idQuiz)
    setIsEditing(true);
    setId(row.id);
    setFormQuiz({
      name,
      description,
      url,
    });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    // console.log("Registros Seleccionados:", selectedItems);

    if (isEditing) {

      toast.promise(editTutorials(id, formQuiz), {
        loading: {
          title: "Editando...",
          position: "top-right",
        },
        success: (d) => {
          fetchUsers();
          clear();
          return {
            title: "Tutoriales",
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

      fetchUsers();
      clear();

      return;
    }

    toast.promise(addTutorials(formQuiz), {
      loading: {
        title: "Añadiendo...",
        position: "top-right",
      },
      success: (d) => {
        fetchUsers();
        clear();
        return {
          title: "Tutoriales",
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
    fetchUsers();
    clear();

  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormQuiz({ ...formQuiz, [name]: value });
  };
  const clear = () => {
    setIsEditing(false);
    setId(false);
    setFormQuiz(initialFormQuiz);
  };
  async function fetchUsers() {
    try {
      const resTutorials = await getAllTutorials();
      setTutorialsData(resTutorials.data);

    } catch (error) {
      console.error("Error al obtener datos académicos:", error);
    }
  }
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <Box p={10}>
        {
          user.loginRol=="programador"&&(
            <Box>
          <form onSubmit={handleSubmit} ref={form}>
            <Grid
              templateColumns={{ base: "1fr", md: "2fr 2fr" }}
              gap={2}
              mt={2}
            >
              <GridItem fontSize={"sm"}>
                <InputGroup>
                  <InputLeftAddon children="Titulo" />
                  <Input type="text" placeholder="Titulo" name="name" value={formQuiz.name ? formQuiz.name : ""}
                    onChange={handleChange} />
                </InputGroup>
              </GridItem>
              <GridItem fontSize={"sm"}>
                <InputGroup>
                  <InputLeftAddon children="Link" />
                  <Input type="text" placeholder="Titulo" name="url" value={formQuiz.url ? formQuiz.url : ""}
                    onChange={handleChange} />
                </InputGroup>

              </GridItem>
              <GridItem fontSize={"sm"} colSpan={2}>
                {/* <InputLeftAddon children="Descripción" /> */}
                <Textarea name="description" placeholder="Descripción" value={formQuiz.description ? formQuiz.description : ""}
                  onChange={handleChange} ></Textarea>
              </GridItem>
              <GridItem fontSize={"sm"}>
                <Button type="submit" mt={4} bg="ceruleanBlue.500" color={"white"}>
                  {!isEditing ? "Guardar" : "Editar"}
                </Button>
                {isEditing && (
                  <Button
                    mt={4}
                    ml={4}
                    colorScheme="red"
                    onClick={() => {
                      clear();
                    }}
                  >
                    Cancelar Edición
                  </Button>
                )}
              </GridItem>

            </Grid>
          </form>
        </Box>

          )
        }
        
        <Flex alignItems="center" gap="2">
          <Box p="2">
            <Heading size="md">Encuestas</Heading>
          </Box>
        </Flex>
        <Tabl data={TutorialsData} columns={user.loginRol=="programador"?columnsProgramador:columns} />
        <Modal
          isOpen={isDeleteTutoModalOpen}
          onClose={() => setDeleteTutoModalOpen(false)}
          onAccept={deleteHandle}
          title="Eliminar de la Matriz"
          message={`¿Estás seguro de eliminar el tutorial?`}
        // message={alertDialogMessage || `¿Estás seguro de eliminar a?`}
        />

      </Box>
    </>
  );
}

export default TutorialsPage;
