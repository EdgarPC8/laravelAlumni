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
  Stack,
  AccordionButton,
  useToast,
  Flex,
} from "@chakra-ui/react";
import HelpBox from "../components/HelpBox";


import { useEffect, useState, useRef } from "react";
import {
  addProfessionalExperience,
  getAllProfessionalExperience,
  editProfessionalExperience,
  deleteProfessionalExperience,
} from "../api/cvRequest";
import DataTable from "../components/DataTables";
import Modal from "../components/AlertDialog";
import Tabl from "./Table";
import { useAuth } from "../context/AuthContext";

function FormProfessionalExperience() {
  const { user } = useAuth();
  const toast = useToast();

  const initialFormProfessional = {
    // nro: "",
    companyInstitution: "",
    position: "",
    responsibilities: "",
    immediateHead: "",
    telephone: "",
    startDate: "",
    endDate: "",
  };

  const [dataProfessionalExperience, setDataProfessionalExperience] = useState(
    []
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const form = useRef(null);

  const [formProfessional, setFormProfessional] = useState(
    initialFormProfessional
  );

  const [id, setId] = useState(false);

  function clear() {
    setIsEditing(false);
    setId(false);
    setFormProfessional(initialFormProfessional);
  }
  async function fetchData() {
    try {
      const { data } = await getAllProfessionalExperience();
      console.log(data)
      setDataProfessionalExperience(data);
    } catch (error) {
      console.error("Error al obtener datos académicos:", error);
    }
  }
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isEditing) {
      toast.promise(editProfessionalExperience(id, formProfessional), {
        loading: {
          title: "Editando...",
          position: "top-right",
        },
        
        success: (d) => {
          fetchData();
          clear();
          return{
          title: "Experiencia Profesional",
          description: d.data.message,
          isClosable: true,
          }
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
      addProfessionalExperience({
        ...formProfessional,
        professionalId: user.userId,
      }),
      {
        loading: {
          title: "Añadiendo...",
          position: "top-right",
        },
        success: (d) => {
          setDataProfessionalExperience([
            ...dataProfessionalExperience,
            formProfessional,
          ]);

          return {
            title: "Experiencia Profesional",
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
    const {
      nro,
      companyInstitution,
      position,
      responsibilities,
      immediateHead,
      telephone,
      startDate,
      endDate,
    } = row;

    form.current.scrollIntoView({ behavior: "smooth", block: "start" });
    setIsEditing(true);
    setId(row.id);

    setFormProfessional({
      nro,
      companyInstitution,
      position,
      responsibilities,
      immediateHead,
      telephone,
      startDate,
      endDate,
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormProfessional({ ...formProfessional, [name]: value });
  };

  const handleDeleteRow = async (row) => {
    setIsModalOpen(true);
    setId(row.id);
  };
  const handleAcceptDelete = async () => {
    try {
      const { data } = await deleteProfessionalExperience(id);
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
    { header: "Nro.", accessorKey: "nro" },
    { header: (
      <>
      <Flex>
      Empresa/Institución
        <HelpBox title="Empresa/Institución" message="(comience por la última)"/>
      </Flex>
      </>
    ), accessorKey: "companyInstitution" },
    { header: "Cargo", accessorKey: "position" },
    {
      header: "Responsabilidades y/o Actividades",
      accessorKey: "responsibilities",
    },
    { header: "Jefe Inmediato", accessorKey: "immediateHead" },
    { header: "Teléfono", accessorKey: "telephone" },
    { header: "Fecha Inicio", accessorKey: "startDate" },
    { header: "Fecha Fin", accessorKey: "endDate" },

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
              EXPERIENCIA PROFESIONAL (Los ultimos 10 años)
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
                  name="startDate"
                  value={formProfessional.startDate}
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
                  name="endDate"
                  value={formProfessional.endDate}
                  onChange={handleChange}
                />
              </InputGroup>
            </GridItem>
            <GridItem fontSize={"sm"}>
              <InputGroup>
                <InputLeftAddon children="Cargo" />
                <Input
                  type="text"
                  placeholder="Cargo"
                  name="position"
                  value={formProfessional.position}
                  onChange={handleChange}
                />
              </InputGroup>
            </GridItem>
            <GridItem fontSize={"sm"}>
              <InputGroup>
                <InputLeftAddon children="Teléfono" />
                <Input
                  type="text"
                  placeholder="Teléfono"
                  name="telephone"
                  value={formProfessional.telephone}
                  onChange={handleChange}
                />
              </InputGroup>
            </GridItem>
            <GridItem fontSize={"sm"}>
              <InputGroup>
                <InputLeftAddon children="Jefe Inmediato" />
                <Input
                  type="text"
                  placeholder="Jefe Inmediato"
                  name="immediateHead"
                  value={formProfessional.immediateHead}
                  onChange={handleChange}
                />
              </InputGroup>
            </GridItem>
            <GridItem fontSize={"sm"}>
              <InputGroup>
                <InputLeftAddon children="Responsabiliades y/o Actividades" />
                <Input
                  type="text"
                  placeholder="Responsabiliades y/o Actividades"
                  name="responsibilities"
                  value={formProfessional.responsibilities}
                  onChange={handleChange}
                />
              </InputGroup>
            </GridItem>
          </Grid>
          <Grid gap={2} mt={2} mb={2}>
            <GridItem fontSize={"sm"}>
              <InputGroup>
                <InputLeftAddon children="Empresa/Institución" />
                <Input
                  type="text"
                  placeholder="Comience por la ultima"
                  name="companyInstitution"
                  value={formProfessional.companyInstitution}
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
          <Tabl columns={columns} data={dataProfessionalExperience} />
        </AccordionPanel>
      </AccordionItem>
    </form>
  );
}

export default FormProfessionalExperience;
