import {
  Box,
  Input,
  Grid,
  GridItem,
  InputLeftAddon,
  InputGroup,
  Button,
  TableContainer,
  Table,
  Th,
  Td,
  Tr,
  Thead,
  Tbody,
  Tfoot,
  AccordionItem,
  AccordionPanel,
  AccordionIcon,
  AccordionButton,
  Stack,
  useToast,
  Flex,
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import {
  addTeachingExperience,
  getAllTeachingExperience,
  editTeachingExperience,
  deleteTeachingExperience,
} from "../api/cvRequest";

import Modal from "../components/AlertDialog";
import Tabl from "./Table";
import { useAuth } from "../context/AuthContext";
import HelpBox from "../components/HelpBox";



function FormTeaching() {
  const initialFormTeaching = {
    educationalInstitution: "",
    subject: "",
    startDate: "",
    endDate: "",
    modality: "",
    place: "",
    country: "",
  };

  const toast = useToast();
  const { user } = useAuth();


  const [dataTeachingExperience, setDataTeachingExperience] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const form = useRef(null);

  const [id, setId] = useState(false);
  const [formTeaching, setFormTeaching] = useState(initialFormTeaching);

  function clear() {
    setIsEditing(false);
    setId(false);
    setFormTeaching(initialFormTeaching);
  }

  async function fetchData() {
    try {
      const { data } = await getAllTeachingExperience();
      setDataTeachingExperience(data);
    } catch (error) {
      console.error("Error al obtener datos académicos:", error);
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isEditing) {
      toast.promise(editTeachingExperience(id, formTeaching), {
        loading: {
          title: "Editando...",
          position: "top-right",
        },
        success: (d) => {
          fetchData();
          clear();
          return {
            title: "Experiencia docente",
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
      addTeachingExperience({ ...formTeaching, professionalId: user.userId }),
      {
        loading: {
          title: "Añadiendo...",
          position: "top-right",
        },
        success: (d) => {
          setDataTeachingExperience([...dataTeachingExperience, formTeaching]);
          return {
            title: "Experiencia docente",
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
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormTeaching({ ...formTeaching, [name]: value });
  };

  
  const handleEditRow = (row) => {
    const {
      educationalInstitution,
      subject,
      startDate,
      endDate,
      modality,
      place,
      country,
    } = row;
    form.current.scrollIntoView({ behavior: "smooth", block: "start" });
    setIsEditing(true);
    setId(row.id);
    setFormTeaching({
      educationalInstitution,
      subject,
      startDate,
      endDate,
      modality,
      place,
      country,
    });
  };
  const handleDeleteRow = async (row) => {
    setIsModalOpen(true);
    setId(row.id);
  };
  const handleAcceptDelete = async () => {
    try {
      const { data } = await deleteTeachingExperience(id);
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
    { header: "Institución Educativa", accessorKey: "educationalInstitution" },
    { header: "Materia /Componente Educativo", accessorKey: "subject" },
    { header: "Fecha Inicio", accessorKey: "startDate" },
    { header: "Fecha Fin", accessorKey: "endDate" },
    { header: (
      <>
      <Flex>
      Modalidad
        <HelpBox title="Modalidad" message="(Presencial, Distancia, Online)"/>
      </Flex>
      </>
    ), accessorKey: "modality" },
    { header: "Lugar", accessorKey: "place" },
    { header: "País", accessorKey: "country" },
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
            Editar
          </Button>
          <Button
            colorScheme="red"
            onClick={() => {
              handleDeleteRow(props.row.original);
            }}
          >
            Eliminar
          </Button>
        </Stack>
      ),
    },
  ];

  return (
    <form onSubmit={handleSubmit} ref={form}>
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box as="span" flex="1" textAlign="left">
              EXPERIENCIA DOCENTE
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
                <InputLeftAddon children="Fecha Inicio" />
                <Input
                  placeholder="Fecha"
                  size="md"
                  type="date"
                  required
                  name="startDate"
                  value={formTeaching.startDate}
                  onChange={handleChange}
                />
              </InputGroup>
            </GridItem>
            <GridItem fontSize={"sm"}>
              <InputGroup>
                <InputLeftAddon children="Fecha Fin" />
                <Input
                  placeholder="Fecha"
                  size="md"
                  type="date"
                  required
                  name="endDate"
                  value={formTeaching.endDate}
                  onChange={handleChange}
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
                  value={formTeaching.place}
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
                  value={formTeaching.country}
                  onChange={handleChange}
                />
              </InputGroup>
            </GridItem>
            <GridItem fontSize={"sm"}>
              <InputGroup>
                <InputLeftAddon children="Materia" />
                <Input
                  type="text"
                  placeholder="Materia/Componente Educativo"
                  required
                  name="subject"
                  value={formTeaching.subject}
                  onChange={handleChange}
                />
              </InputGroup>
            </GridItem>
            <GridItem fontSize={"sm"}>
              <InputGroup>
                <InputLeftAddon children="Modalidad" />
                <Input
                  type="text"
                  placeholder="Modalidad"
                  name="modality"
                  value={formTeaching.modality}
                  onChange={handleChange}
                />
              </InputGroup>
            </GridItem>
          </Grid>
          <Grid gap={2} mt={2} mb={2}>
            <GridItem fontSize={"sm"}>
              <InputGroup>
                <InputLeftAddon children="Institución Educativa" />
                <Input
                  type="text"
                  placeholder="Institución Educativa"
                  required
                  name="educationalInstitution"
                  value={formTeaching.educationalInstitution}
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
          <Tabl columns={columns} data={dataTeachingExperience} />
        </AccordionPanel>
      </AccordionItem>
    </form>
  );
}

export default FormTeaching;
