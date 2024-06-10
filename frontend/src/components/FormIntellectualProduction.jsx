import {
  Box,
  Input,
  Grid,
  GridItem,
  InputLeftAddon,
  InputGroup,
  Button,
  AccordionItem,
  AccordionPanel,
  AccordionIcon,
  AccordionButton,
  useToast,
  Stack,
  Flex,
} from "@chakra-ui/react";
import HelpBox from "../components/HelpBox";

import { useEffect, useState } from "react";
import {
  addIntellectualProduction,
  deleteIntellectualProduction,
  editIntellectualProduction,
  getAllIntellectualProduction,
} from "../api/cvRequest";

import Modal from "../components/AlertDialog";
import Tabl from "./Table";
import { useAuth } from "../context/AuthContext";

function FormIntellectualProduction() {
  const { user } = useAuth();
  const toast = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [id, setId] = useState(0);

  const [dataIntellectualProduction, setDataIntellectualProduction] = useState(
    []
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  const initialFormIntellectual = {
    type: "",
    name: "",
    typeAuthorship: "",
    date: "",
    webLink: "",
  };

  const [form, setForm] = useState(initialFormIntellectual);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  const clear = () => {
    setIsEditing(false);
    setId(0);
    setForm(initialFormIntellectual);
  };

  const handleEditRow = (row) => {
    const { type, name, typeAuthorship, date, webLink } = row;
    setIsEditing(true);
    setForm({ type, name, typeAuthorship, date, webLink });
    setId(row.id);
  };

  const handleDeleteRow = (row) => {
    setIsModalOpen(true);
    setId(row.id);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isEditing) {
      toast.promise(editIntellectualProduction(id, form), {
        loading: {
          title: "Editando...",
          position: "top-right",
        },
        success: (d) => {
          fetchData();
          clear();

          return {
            title: "Producción Intelectual",
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
      addIntellectualProduction({ ...form, professionalId: user.userId }),
      {
        loading: {
          title: "Añadiendo...",
          position: "top-right",
        },
        success: (d) => {
          setDataIntellectualProduction([...dataIntellectualProduction, form]);

          return {
            title: "Producción Intelectual",
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

  const handleAcceptDelete = async () => {
    try {
      const { data } = await deleteIntellectualProduction(id);
      fetchData();
      clear();
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    try {
      const { data } = await getAllIntellectualProduction();
      setDataIntellectualProduction(data);
    } catch (error) {
      console.error("Error al obtener datos académicos:", error);
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
          <HelpBox title="Tipo" message="(Divulgación, Indexadas, ISI, SCOPUS, IEEE, Otros)
          
          ISI: Institute for Scientific Information,  Instituto para la Información Científica.
          SCOPUS: base de datos de referencias bibliográficas y citas.
          IEEE: Institute of Electrical and Electronics Engineers, Instituto de Ingenieros Eléctricos y Electrónicos.
"/>
        </Flex>
        </>
      ),
      accessorKey: "type",
    },
    {
      header: "Nombre",
      accessorKey: "name",
    },
    {
      header:  (
        <>
        <Flex>
        Tipo de Autoria
          <HelpBox title="Tipo de Autoria" message="(Autor Principal, Co-autor, Evaluador)"/>
        </Flex>
        </>
      ),
      accessorKey: "typeAuthorship",
    },
    {
      header: "Fecha",
      accessorKey: "date",
    },
    {
      header: "Enlace web",
      accessorKey: "webLink",
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
    <form onSubmit={handleSubmit}>
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box as="span" flex="1" textAlign="left">
              PRODUCCIÓN INTELECTUAL
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
                <Input
                  type="text"
                  placeholder="Tipo"
                  name="type"
                  onChange={handleChange}
                  value={form.type}
                />
              </InputGroup>
            </GridItem>
            <GridItem fontSize={"sm"}>
              <InputGroup>
                <InputLeftAddon children="Tipo de Autoria" />
                <Input
                  type="text"
                  placeholder="Tipo de Autoria"
                  name="typeAuthorship"
                  onChange={handleChange}
                  value={form.typeAuthorship}
                />
              </InputGroup>
            </GridItem>
            <GridItem fontSize={"sm"}>
              <InputGroup>
                <InputLeftAddon children="Fecha Inicio" />
                <Input
                  placeholder="Fecha"
                  size="md"
                  type="date"
                  name="date"
                  onChange={handleChange}
                  value={form.date}
                />
              </InputGroup>
            </GridItem>
          </Grid>
          <Grid gap={2} mt={2} mb={2}>
            <GridItem fontSize={"sm"}>
              <InputGroup>
                <InputLeftAddon children="Nombre/Titulo" />
                <Input
                  type="text"
                  placeholder="Nombre/Titulo"
                  name="name"
                  onChange={handleChange}
                  value={form.name}
                />
              </InputGroup>
            </GridItem>
            <GridItem fontSize={"sm"}>
              <InputGroup>
                <InputLeftAddon children="Enlace Web" />
                <Input
                  type="text"
                  placeholder="Enlace Web"
                  name="webLink"
                  onChange={handleChange}
                  value={form.webLink}
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
          />

          <Tabl columns={columns} data={dataIntellectualProduction} />
        </AccordionPanel>
      </AccordionItem>
    </form>
  );
}

export default FormIntellectualProduction;
