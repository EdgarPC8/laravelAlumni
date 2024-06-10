import {
  Box,
  Input,
  Grid,
  GridItem,
  InputLeftAddon,
  InputGroup,
  Select,
  Button,
  TableContainer,
  Table,
  Th,
  Td,
  Tr,
  Thead,
  Stack,
  Tbody,
  Tfoot,
  AccordionItem,
  AccordionPanel,
  AccordionIcon,
  AccordionButton,
  useToast,
  Flex,
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import HelpBox from "../components/HelpBox";

import {
  addAcademicProfessionalMerits,
  getAllAcademicProfessionalMerits,
  editAcademicProfessionalMerits,
  deleteAcademicProfessionalMerits,
} from "../api/cvRequest";
import DataTable from "../components/DataTables";
import Modal from "../components/AlertDialog";
import Tabl from "./Table";
import { useAuth } from "../context/AuthContext";

function FormProfessionalMerits() {
  const { user } = useAuth();

  const initialProfessionalMerits = {
    name: "",
    date: "",
    type: "",
    grantedBy: "",
    country: "",
    location: "",
  };

  const toast = useToast();

  const [dataAcademicProfessionalMerits, setDataAcademicProfessionalMerits] =
    useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const form = useRef(null);
    
    const [formProfessionalMerits, setFormProfessionalMerits] = useState(
      initialProfessionalMerits
      );
      
      const [isEditing, setIsEditing] = useState(false);
  const [id, setId] = useState(false);

  function clear() {
    setIsEditing(false);
    setId(false);
    setFormProfessionalMerits(initialProfessionalMerits);
  }
  async function fetchData() {
    try {
      const { data } = await getAllAcademicProfessionalMerits();
      setDataAcademicProfessionalMerits(data);
    } catch (error) {
      console.error("Error al obtener datos académicos:", error);
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormProfessionalMerits({ ...formProfessionalMerits, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isEditing) {
      toast.promise(
        editAcademicProfessionalMerits(id, formProfessionalMerits),
        {
          loading: {
            title: "Editando...",
            position: "top-right",
          },
          success: (d) => {
            fetchData();
            clear();
            return {
              title: "Méritos Académicos",
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
      addAcademicProfessionalMerits({
        ...formProfessionalMerits,
        professionalId: user.userId,
      }),
      {
        loading: {
          title: "Añadiendo...",
          position: "top-right",
        },
        success: (d) => {
          setDataAcademicProfessionalMerits([
            ...dataAcademicProfessionalMerits,
            formProfessionalMerits,
          ]);

          return {
            title: "Méritos Académicos",
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
    const { name, date, type, grantedBy, country, location } = row;
    form.current.scrollIntoView({ behavior: "smooth", block: "start" });
    setIsEditing(true);
    setId(row.id);
    setFormProfessionalMerits({
      name,
      date,
      type,
      grantedBy,
      country,
      location,
    });
  };
  const handleDeleteRow = async (row) => {
    setIsModalOpen(true);
    setId(row.id);
  };
  const handleAcceptDelete = async () => {
    try {
      const { data } = await deleteAcademicProfessionalMerits(id);
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
    { header: "Nombre", accessorKey: "name" },
    { header: "Fecha", accessorKey: "date" },
    { header: (
      <>
      <Flex>
      Tipo
        <HelpBox title="Tipo" message="(Nacional, Internacional)"/>
      </Flex>
      </>
    ), accessorKey: "type" },
    { header: "Otorgado Por", accessorKey: "grantedBy" },
    { header: "País", accessorKey: "country" },
    { header: "Lugar", accessorKey: "location" },

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
              MÉRITOS ACADÉMICOS Y PROFESIONALES
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
                <InputLeftAddon children="País" />
                <Input
                  type="text"
                  placeholder="País"
                  name="country"
                  value={formProfessionalMerits.country}
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
                  name="location"
                  value={formProfessionalMerits.location}
                  onChange={handleChange}
                />
              </InputGroup>
            </GridItem>
            <GridItem fontSize={"sm"}>
              <InputGroup>
                <InputLeftAddon children="Tipo" />
                <Input
                  type="text"
                  placeholder="(Nacional, Internacional)"
                  name="type"
                  value={formProfessionalMerits.type}
                  onChange={handleChange}
                />
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
                  value={formProfessionalMerits.date}
                  onChange={handleChange}
                />
              </InputGroup>
            </GridItem>
          </Grid>
          <Grid gap={2} mt={2} mb={2}>
            <GridItem fontSize={"sm"}>
              <InputGroup>
                <InputLeftAddon children="Nombre" />
                <Input
                  type="text"
                  placeholder="Nombre"
                  name="name"
                  value={formProfessionalMerits.name}
                  onChange={handleChange}
                />
              </InputGroup>
            </GridItem>
            <GridItem fontSize={"sm"}>
              <InputGroup>
                <InputLeftAddon children="Otorgado Por" />
                <Input
                  type="text"
                  placeholder="Otorgado Por"
                  name="grantedBy"
                  value={formProfessionalMerits.grantedBy}
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
          <Tabl columns={columns} data={dataAcademicProfessionalMerits} />
        </AccordionPanel>
      </AccordionItem>
    </form>
  );
}

export default FormProfessionalMerits;
