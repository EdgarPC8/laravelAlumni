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
  RadioGroup,
  useToast,
  Stack,
  Radio,
  Flex,
} from "@chakra-ui/react";
import HelpBox from "../components/HelpBox";

import { useEffect, useState, useRef } from "react";
import {
  addCoursesWorkshops,
  getAllCoursesWorkshops,
  editCoursesWorkshops,
  deleteCoursesWorkshops,
} from "../api/cvRequest";
import DataTable from "../components/DataTables";
import Modal from "../components/AlertDialog";
import Tabl from "./Table";
import { useAuth } from "../context/AuthContext";

function FormCourses() {
  const { user } = useAuth();
  const toast = useToast();
  const initialFormCourses = {
    startDate: "",
    endDate: "",
    place: "",
    type: "",
    duration: "",
    typeParticipation: "",
    name: "",
    organizedBy: "",
  };

  const [dataCourseWorkShops, setDatasCoursesWorkshops] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const form = useRef(null);

  const [id, setId] = useState(0);
  const [formCourse, setFormCourse] = useState(initialFormCourses);

  async function fetchData() {
    try {
      const { data } = await getAllCoursesWorkshops();
      setDatasCoursesWorkshops(data);
    } catch (error) {
      console.error("Error al obtener datos académicos:", error);
    }
  }
  function clear() {
    setId(false);
    setFormCourse(initialFormCourses);
    setIsEditing(false);
  }
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isEditing) {
      toast.promise(editCoursesWorkshops(id, formCourse), {
        loading: {
          title: "Editando...",
          position: "top-right",
        },
        success: (d) => {
          fetchData();
          clear();

          return {
            title: "Cursos",
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
      addCoursesWorkshops({ ...formCourse, professionalId: user.userId }),
      {
        loading: {
          title: "Añadiendo...",
          position: "top-right",
        },
        success: (d) => {
          setDatasCoursesWorkshops([...dataCourseWorkShops, formCourse]);
          return {
            title: "Cursos",
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormCourse({ ...formCourse, [name]: value });
  };

  const handleEditRow = (row) => {
    const {
      startDate,
      endDate,
      place,
      type,
      duration,
      typeParticipation,
      name,
      organizedBy,
    } = row;
    form.current.scrollIntoView({ behavior: "smooth", block: "start" });
    setIsEditing(true);
    setId(row.id);

    setFormCourse({
      startDate,
      endDate,
      place,
      type,
      duration,
      typeParticipation,
      name,
      organizedBy,
    });
  };

  const handleDeleteRow = async (row) => {
    setIsModalOpen(true);
    setId(row.id);
  };

  const handleChangeTypeParticiopation = (value) => {
    setFormCourse({ ...formCourse, typeParticipation: value });
  };

  const handleAcceptDelete = async () => {
    try {
      const { data } = await deleteCoursesWorkshops(id);
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
    { header: (
      <>
      <Flex>
      Tipo
        <HelpBox title="Tipo" message="(Curso, Seminario, Taller, Congreso, Otro)"/>
      </Flex>
      </>
    ), accessorKey: "type" },
    { header: "Nombre", accessorKey: "name" },
    { header: "Organizado Por:", accessorKey: "organizedBy" },
    { header: "Lugar", accessorKey: "place" },
    { header: "Duracion (Horas)", accessorKey: "duration" },
    { header: "Fecha Inicio", accessorKey: "startDate" },
    { header: "Fecha Fin", accessorKey: "endDate" },
    {
      header: "Tipo de Participación Asistente/Expositor",
      accessorKey: "typeParticipation",
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
              CURSOS, TALLERES, SEMINARIOS, CONGRESOS, Y /U OTROS
              (Certificaciones hasta 5 años)
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
                  value={formCourse.startDate}
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
                  value={formCourse.endDate}
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
                  value={formCourse.place}
                  onChange={handleChange}
                />
              </InputGroup>
            </GridItem>
            <GridItem fontSize={"sm"}>
              <InputGroup>
                <InputLeftAddon children="Tipo" />
                <Input
                  type="text"
                  placeholder="(Curso, Seminario, Taller, Congreso, Otro)"
                  name="type"
                  value={formCourse.type}
                  onChange={handleChange}
                />
              </InputGroup>
            </GridItem>
            <GridItem fontSize={"sm"}>
              <InputGroup>
                <InputLeftAddon children="Duración" />

                <Input
                  type="number"
                  placeholder="En Horas"
                  name="duration"
                  value={formCourse.duration}
                  onChange={handleChange}
                />
              </InputGroup>
            </GridItem>

            <GridItem fontSize={"sm"}>
              <InputGroup>
                <InputLeftAddon children="Tipo participación" />
                <RadioGroup
                  m={"auto"}
                  value={formCourse.typeParticipation}
                  onChange={handleChangeTypeParticiopation}
                  name="typeParticipation"
                >
                  <Stack spacing={5} direction="row">
                    <Radio colorScheme="green" value="Asistente">
                      Asistente
                    </Radio>
                    <Radio colorScheme="green" value="Expositor">
                      Expositor
                    </Radio>
                  </Stack>
                </RadioGroup>
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
                  value={formCourse.name}
                  onChange={handleChange}
                />
              </InputGroup>
            </GridItem>
            <GridItem fontSize={"sm"}>
              <InputGroup>
                <InputLeftAddon children="Organizado Por" />
                <Input
                  type="text"
                  placeholder="Organizado Por"
                  name="organizedBy"
                  value={formCourse.organizedBy}
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
          <Tabl columns={columns} data={dataCourseWorkShops} />
        </AccordionPanel>
      </AccordionItem>
    </form>
  );
}

export default FormCourses;
