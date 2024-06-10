import {
  ChakraProvider,
  Box,
  Heading,
  Input,
  Container,
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
  Tbody,
  Tfoot,
  Textarea,
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionIcon,
  AccordionButton,
  RadioGroup,
  useToast,
  Stack,
  Radio,
  Flex,
  FormControl,
} from "@chakra-ui/react";

import { useEffect, useState, useRef } from "react";
import {
  addLanguages,
  getAllLanguages,
  editLanguages,
  deleteLanguages,
} from "../api/cvRequest";
import DataTable from "../components/DataTables";
import Modal from "../components/AlertDialog";
import Tabl from "./Table";
import { useAuth } from "../context/AuthContext";
import HelpBox from "../components/HelpBox";


function FormLanguages() {
  const { user } = useAuth();
  const toast = useToast();
  const initialFormLenguages = {
    name: "",
    speakingLevel: "",
    writingLevel: "",
    comprehensionLevel: "",
    typeCertification: "",
  };

  const [dataLanguages, setDataLanguages] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const form = useRef(null);

  const [formLanguage, setFormLanguage] = useState(initialFormLenguages);

  const [id, setId] = useState(false);

  function clear() {
    setIsEditing(false);
    setId(false);

    setFormLanguage(initialFormLenguages);
  }
  async function fetchData() {
    try {
      const { data } = await getAllLanguages();
      setDataLanguages(data);
    } catch (error) {
      console.error("Error al obtener datos académicos:", error);
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormLanguage({ ...formLanguage, [name]: value });
  };

  const handleChangeSpeaking = (value) => {
    setFormLanguage({ ...formLanguage, speakingLevel: value });
  };

  const handleChangeWriting = (value) => {
    setFormLanguage({ ...formLanguage, writingLevel: value });
  };

  const handleChangeComprehension = (value) => {
    setFormLanguage({ ...formLanguage, comprehensionLevel: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // setFormLanguage({ ...formLanguage, professionalId: user.userId });

    if (isEditing) {
      toast.promise(editLanguages(id, formLanguage), {
        loading: {
          title: "Editando...",
          position: "top-right",
        },
        success: (d) => {
          fetchData();
          clear();
          return {
            title: "Idiomas",
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
      addLanguages({ ...formLanguage, professionalId: user.userId }),
      {
        loading: {
          title: "Añadiendo...",
          position: "top-right",
        },
        success: (d) => {
          setDataLanguages([...dataLanguages, formLanguage]);

          return {
            title: "Idiomas",
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
      name,
      speakingLevel,
      writingLevel,
      comprehensionLevel,
      typeCertification,
    } = row;

    setIsEditing(true);
    setId(row.id);
    setFormLanguage({
      name,
      speakingLevel,
      writingLevel,
      comprehensionLevel,
      typeCertification,
    });
  };
  const handleDeleteRow = async (row) => {
    setIsModalOpen(true);
    setId(row.id);
  };
  const handleAcceptDelete = async () => {
    try {
      const { data } = await deleteLanguages(id);
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
      header: "Idioma (diferente al hablado)",
      accessorKey: "name",
    },
    {
      header: "Hablado Básico/Medio/Alto",
      accessorKey: "speakingLevel",
    },
    {
      header: "Escritura Básico/Medio/Alto",
      accessorKey: "writingLevel",
    },
    {
      header: "Comprensión Básico/Medio/Alto",
      accessorKey: "comprehensionLevel",
    },
    {
      header: (
        <>
        <Flex>
        Tipo de certificación
          <HelpBox title="Tipo de certificación" message="(TOEFL, TOEIC, CPE, IELTS, PET, Otro) 
          TOEFL: Test of English as a Foreign Language.
          TOEIC: Test of English for International Communication.
          CPE: Certificate of Proficiency in English.
          IELTS: International English Language Testing System.
          PET: Preliminary English Test.
"/>
        </Flex>
        </>
      ),
      accessorKey: "typeCertification",
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
              IDIOMAS
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <Grid gap={2} mt={2} mb={2}>
            <GridItem fontSize={"sm"}>
              <InputGroup>
                <InputLeftAddon children="Nombre" />
                <Input
                  type="text"
                  placeholder="Diferente al Nativo"
                  name="name"
                  value={formLanguage.name}
                  onChange={handleChange}
                />
              </InputGroup>
            </GridItem>
            <GridItem fontSize={"sm"}>
              <InputGroup>
                <InputLeftAddon children="Tipo de Certificación" />
                <Input
                  type="text"
                  placeholder="(TOEPI, TOEIC, CPE, IELTS, PET, Otro)"
                  name="typeCertification"
                  value={formLanguage.typeCertification}
                  onChange={handleChange}
                />
              </InputGroup>
            </GridItem>
            <GridItem fontSize={"sm"} border="1px solid #ccc" borderRadius={8}>
              <Grid templateColumns={{ base: "1fr", md: "1fr 4fr" }}>
                <GridItem fontSize={"lg"} margin={"auto"}>
                  Nivel de Dominio:
                </GridItem>
                <GridItem fontSize={"sm"}>
                  <InputGroup mt={3}>
                    <InputLeftAddon w={150} children="Hablado" />
                    <RadioGroup
                      m={"auto"}
                      name="speakingLevel"
                      value={formLanguage.speakingLevel}
                      onChange={handleChangeSpeaking}
                    >
                      <Stack spacing={5} direction="row">
                        <Radio colorScheme="green" value="Ninguno">
                          Ninguno
                        </Radio>
                        <Radio colorScheme="green" value="Básico">
                          Básico
                        </Radio>
                        <Radio colorScheme="green" value="Medio">
                          Medio
                        </Radio>
                        <Radio colorScheme="green" value="Alto">
                          Alto
                        </Radio>
                      </Stack>
                    </RadioGroup>
                  </InputGroup>
                  <InputGroup mt={3}>
                    <InputLeftAddon w={150} children="Escritura" />
                    <RadioGroup
                      m={"auto"}
                      name="writingLevel"
                      value={formLanguage.writingLevel}
                      onChange={handleChangeWriting}
                    >
                      <Stack spacing={5} direction="row">
                        <Radio colorScheme="green" value="Ninguno">
                          Ninguno
                        </Radio>
                        <Radio colorScheme="green" value="Básico">
                          Básico
                        </Radio>
                        <Radio colorScheme="green" value="Medio">
                          Medio
                        </Radio>
                        <Radio colorScheme="green" value="Alto">
                          Alto
                        </Radio>
                      </Stack>
                    </RadioGroup>
                  </InputGroup>
                  <InputGroup mt={3}>
                    <InputLeftAddon w={150} children="Comprensión" />
                    <RadioGroup
                      m={"auto"}
                      name="comprehensionLevel"
                      value={formLanguage.comprehensionLevel}
                      onChange={handleChangeComprehension}
                    >
                      <Stack spacing={5} direction="row">
                        <Radio colorScheme="green" value="Ninguno">
                          Ninguno
                        </Radio>
                        <Radio colorScheme="green" value="Básico">
                          Básico
                        </Radio>
                        <Radio colorScheme="green" value="Medio">
                          Medio
                        </Radio>
                        <Radio colorScheme="green" value="Alto">
                          Alto
                        </Radio>
                      </Stack>
                    </RadioGroup>
                  </InputGroup>
                </GridItem>
              </Grid>
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

          <Tabl data={dataLanguages} columns={columns} />
        </AccordionPanel>
      </AccordionItem>
    </form>
  );
}

export default FormLanguages;
