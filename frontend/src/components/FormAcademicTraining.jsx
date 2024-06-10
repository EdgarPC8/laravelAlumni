import {
  Box,
  Input,
  Grid,
  GridItem,
  InputLeftAddon,
  InputGroup,
  Select,
  Button,
  AccordionItem,
  AccordionPanel,
  AccordionIcon,
  AccordionButton,
  useToast,
  Stack,
  Flex,
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import {
  addAcademicTraining,
  getAllAcademicTraining,
  editAcademicTraining,
  deleteAcademicTraining,
} from "../api/cvRequest";
import DataTable from "../components/DataTables";
import HelpBox from "../components/HelpBox";
import Modal from "../components/AlertDialog";
import Tabl from "./Table";
import { useAuth } from "../context/AuthContext";
import { reorderDate } from "../helpers/date.js";
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';


function FormAcademicTraining() {
  const toast = useToast();
  const { user } = useAuth();

  const initialFormAcademic = { type: "", date: "", place: "", country: "", obtainedTitle: "", educationalInstitution: "", senescytRegistrationN: "", };

  const [ListAcademicTraining, setListAcademicTraining] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const form = useRef(null);

  const [id, setId] = useState(0);

  const [formAcademic, setFormAcademic] = useState(initialFormAcademic);

  function clear() {
    setIsEditing(false);
    setId(false);
    setFormAcademic(initialFormAcademic);
  }

  async function fetchData() {
    try {
      const { data } = await getAllAcademicTraining();
      setListAcademicTraining(data);
    } catch (error) {
      console.error("Error al obtener datos académicos:", error);
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isEditing) {
      toast.promise(editAcademicTraining(id, formAcademic), {
        loading: {
          title: "Editando...",
          position: "top-right",
        },
        success: (d) => {
          fetchData();
          clear();
          return {
            title: "Formación académica",
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

      return;
    }

    toast.promise(
      addAcademicTraining({ ...formAcademic, professionalId: user.userId }),
      {
        loading: {
          title: "Añadiendo...",
          position: "top-right",
        },
        success: (d) => {
          setListAcademicTraining([...ListAcademicTraining, formAcademic]);

          return {
            title: "Formación académica",
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
  const handleEditRow = (row) => {
    form.current.scrollIntoView({ behavior: "smooth", block: "start" });
    const {
      type,
      obtainedTitle,
      educationalInstitution,
      date,
      place,
      country,
      senescytRegistrationN,
    } = row;

    setIsEditing(true);
    setId(row.id);
    setFormAcademic({
      type,
      obtainedTitle,
      educationalInstitution,
      date,
      place,
      country,
      senescytRegistrationN,
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormAcademic({ ...formAcademic, [name]: value });
  };

  const handleDeleteRow = async (row) => {
    setIsModalOpen(true);
    setId(row.id);
  };
  const handleAcceptDelete = async () => {
    try {
      const { data } = await deleteAcademicTraining(id);
      fetchData();
      clear();
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      header: (
        <>
        <Flex>
        Tipo
          <HelpBox title="Tipo de Formacion Academica" message="(Secundaria, Tercer Nivel, Cuarto Nivel)"/>
        </Flex>
        </>
      ),
      accessorKey: "type",
      width: "10000000px", // Puedes ajustar el ancho según tus necesidades
    
    },
    {
      header: "Título Obtenido",
      accessorKey: "obtainedTitle",
      width: "1500000px", // Puedes ajustar el ancho según tus necesidades
    },
    {
      header: "Institución Educativa",
      accessorKey: "educationalInstitution",
      width: "200px", // Puedes ajustar el ancho según tus necesidades
    },
    {
      header: "Fecha",
      accessorKey: "date",
      width: "100px", // Puedes ajustar el ancho según tus necesidades
    },
    {
      header: "Lugar",
      accessorKey: "place",
      width: "150px", // Puedes ajustar el ancho según tus necesidades
    },
    {
      header: "País",
      accessorKey: "country",
      width: "100px", // Puedes ajustar el ancho según tus necesidades
    },
    {
      header: "Nro de registro senescyt",
      accessorKey: "senescytRegistrationN",
      width: "150px", // Puedes ajustar el ancho según tus necesidades
    },
    {
      header: "Accion",
      cell: (props) => (
        <Stack spacing={4} direction="row" align="center">
          <Button
            colorScheme="yellow"
            onClick={() => {
              handleEditRow(props.row.original);
            }}
          >
            {/* <EditIcon /> */}
            Editar
          </Button>
          <Button
            colorScheme="red"
            onClick={() => {
              handleDeleteRow(props.row.original);
            }}
          >
            {/* <DeleteIcon /> */}
            Eliminar
          </Button>
        </Stack>
      ),
      width: "150px", // Puedes ajustar el ancho según tus necesidades
    },
  ];


  return (
    <form onSubmit={handleSubmit} ref={form}>
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box as="span" flex="1" textAlign="left">
              FORMACIÓN ACADÉMICA
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>

          <Grid
            gap={2}
            mt={2}
            mb={2}
            templateColumns={{ base: "1fr", md: "2fr 2fr" }}
          >
            <GridItem fontSize={"sm"}>
              <InputGroup>
                <InputLeftAddon children="Tipo" />
                <Select
                  placeholder="Seleccione una opción"
                  name="type"
                  value={formAcademic.type}
                  onChange={handleChange}
                >
                  <option value="Secundaria">Secundaria</option>
                  <option value="Tercer Nivel">Tercer Nivel</option>
                  <option value="Cuarto Nivel">Cuarto Nivel</option>
                </Select>
              </InputGroup>
            </GridItem>
            <GridItem fontSize={"sm"}>
              <InputGroup>
                <InputLeftAddon children="Fecha" />
                <Input
                  placeholder="Fecha"
                  size="md"
                  type="date"
                  name="date"
                  value={formAcademic.date}
                  onChange={handleChange}
                  required
                />
              </InputGroup>
            </GridItem>
            <GridItem fontSize={"sm"}>
              <InputGroup>
                <InputLeftAddon children="Lugar" />
                <Input
                  type="text"
                  placeholder="Lugar"
                  name="place"
                  value={formAcademic.place}
                  onChange={handleChange}
                />
              </InputGroup>
            </GridItem>
            <GridItem fontSize={"sm"}>
              <InputGroup>
                <InputLeftAddon children="País" />
                <Input
                  type="text"
                  placeholder="País"
                  name="country"
                  value={formAcademic.country}
                  onChange={handleChange}
                />
              </InputGroup>
            </GridItem>
          </Grid>
          <Grid gap={2} mt={2} mb={2}>
            <GridItem fontSize={"sm"}>
              <InputGroup>
                <InputLeftAddon children="Título Obtenido" />
                <Input
                  type="text"
                  placeholder="Título Obtenido"
                  name="obtainedTitle"
                  value={formAcademic.obtainedTitle}
                  onChange={handleChange}
                  required
                />
              </InputGroup>
            </GridItem>
            <GridItem fontSize={"sm"}>
              <InputGroup>
                <InputLeftAddon children="Institución Educativa" />
                <Input
                  type="text"
                  placeholder="Institución Educativa"
                  name="educationalInstitution"
                  value={formAcademic.educationalInstitution}
                  onChange={handleChange}
                  required
                />
              </InputGroup>
            </GridItem>
            <GridItem fontSize={"sm"}>
              <InputGroup>
                <InputLeftAddon children="Nro. de registro SENESCYT" />
                <Input
                  type="text"
                  placeholder="Nro. de registro SENESCYT"
                  name="senescytRegistrationN"
                  value={formAcademic.senescytRegistrationN}
                  onChange={handleChange}
                />
              </InputGroup>
            </GridItem>
            <GridItem
              colSpan={2}
              order={{ base: 1, md: 1 }}
              textAlign={"right"}
            >
              <Button
                type="submit"
                mt={4}
                bg="ceruleanBlue.500"
                color={"white"}
                _hover={{ bg: "primary.100" }}
                data-purpose="create"
              >
                {!isEditing ? "Guardar" : "editar"}
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
          <Tabl columns={columns} data={ListAcademicTraining} />
        </AccordionPanel>
      </AccordionItem>
    </form>
  );
}

export default FormAcademicTraining;
