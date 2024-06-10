import {
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
  Textarea,
  RadioGroup,
  Stack,
  Radio,
  Flex,
  FormControl,
  FormLabel,
  Checkbox,
  Center,
  Badge,
  useToast,

} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import {
  addResponses,
  getAllResponses,
  editResponses,
  deleteResponses,
} from "../api/quizResquest.js";
import { useAuth } from "../context/AuthContext";

import { verifyTokenRequest } from "../api/userRequest.js";
import { getProfessionalsById } from "../api/professionalRequest.js";
import { getQuizByMatrizProfessional,completedQuiz } from "../api/matrizResquest.js";

import DataTable from "../components/DataTables";
import Searcher from "../components/Searcher";
import Modal from "../components/AlertDialog";
import Tabl from "../components/Table";
import { getAllCareers,addCareer,editCareer } from "../api/matrizResquest.js";



function ResumeForm() {
  const toast = useToast();

  const form = useRef(null);
  const { user } = useAuth();
  const [Quizzes, setQuizzes] = useState([]);
  const [IsCompleteing, setIsCompleteing] = useState(false);
  const [IdQuiz, setIdQuiz] = useState(null);
  const [IdMatriz, setIdMatriz] = useState(null);
  const [Carreras, setCarreras] = useState([]);
  const columns = [
    {
      header: "#",
      accessorKey: "id",
      cell: (props) => props.row.index + 1,
    },
    {
      header: "Titulo",
      accessorKey: "title",
    },
    {
      header: "Descripcion",
      accessorKey: "description",
    },
    {
      header: "Fecha",
      accessorKey: "date",
    },
    {
      header: "Acción",
      accessorKey: "httpMethod",
      cell: (props) => {
        const completed = props.cell.row.original.matriz_quizzes.completed;
        // console.log(completed);

        if(completed!=0){
          return (
            <Center>
              <Badge colorScheme={"green"}>{'Completada'}</Badge>
            </Center>
          )
        }else{
          return (
            <Center>
              <Button colorScheme={"green"} onClick={() => {
                handleQuiz(props.row.original);
              }}>
                Llenar
              </Button>
            </Center>
          )

        }
     
      },
    },
  ];
  const handleQuiz = (row) => {

    setIsCompleteing(true)
    setIdQuiz(row.matriz_quizzes.quizId)
    setIdMatriz(row.matriz_quizzes.idMatriz)
    // console.log(row)

  };

//   const carreras=[
// "TECNOLOGIA SUPERIOR EN ADMINISTRACION",
// "TECNOLOGIA SUPERIOR EN DESARROLLO DE SOFTWARE",
// "TECNOLOGIA SUPERIOR EN ELECTRICIDAD",
// "TECNOLOGIA SUPERIOR EN MECANICA AUTOMOTRIZ",
//   ]
  
  let initialFormProfessional = {
    ci: "",
    firstName: "",
    secondName: "",
    firstLastName: "",
    secondLastName: "",
    bloodType: "",
    birthDate: "",
    gender: "",
    civilStatus: "",
    nationality: "",
    placeBirth: "",
    placeResidence: "",
    direction: "",
    homePhone: "",
    cellPhone: "",
    personalEmail: "",
    institutionalEmail: "",
    image: "",
    id: "",
  };
  const [formProfessional, setFormProfessional] = useState(
    initialFormProfessional
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target));
    toast.promise(completedQuiz({
          idMatriz: IdMatriz,
          quizId: IdQuiz,
        }), {
      loading: {
        title: "Añadiendo...",
        position: "top-right",
      },
      success: (d) => {
        setIsCompleteing(false)
        fetchData()
        return {
          title: "Matriz",
          description: `Encuesta completada correctamaente`,
          isClosable: true,
        };
      },
      error: (e) => ({
        title: "Error",
        description: e.response.data.message,
        isClosable: true,
      }),
    });


    const encuesta = {
      idQuiz: IdQuiz,
      userId: formProfessional.id,
      Questions: [
        {
          idQuestion: 1,
          textResponse: formData.question1,
        },
        {
          idQuestion: 2,
          textResponse: formData.question2,
        },
        {
          idQuestion: 3,
          textResponse: formData.question3,
        },
        {
          idQuestion: 4,
          textResponse: formData.question4,
        },
        {
          idQuestion: 5,
          textResponse: formData.question5,
        },
        {
          idQuestion: 6,
          textResponse: formData.question6,
        },
        {
          idQuestion: 7,
          textResponse: formData.question7,
        },
        {
          idQuestion: 8,
          textResponse: formData.question8,
        },
        {
          idQuestion: 9,
          textResponse: formData.question9,
        },
        {
          idQuestion: 10,
          textResponse: formData.question10,
          idOption: formData.questionOption10,
        },
        {
          idQuestion: 11,
          textResponse: formData.question11,
          idOption: formData.questionOption11,
        },
        {
          idQuestion: 12,
          textResponse: formData.question12,
        },
        {
          idQuestion: 13,
          textResponse: formData.question13,
          idOption: formData.questionOption13,
        },
        {
          idQuestion: 14,
          checkOptions: (() => {
            const checkValues = [];
            for (let i = 0; i <= 9; i++) {
              const value = formData[`question14Option${i}`];
              if (value) {
                checkValues.push({ value });
              }
            }
            return checkValues;
          })(), // <-- Ejecutar la función inmediatamente para obtener el array de valores
        },
        {
          idQuestion: 15,
          textResponse: formData.question15,
        },
        {
          idQuestion: 16,
          checkOptions: (() => {
            const checkValues = [];
            for (let i = 0; i <= 4; i++) {
              const value = formData[`question16Option${i}`];
              if (value) {
                checkValues.push({ value });
              }
            }
            return checkValues;
          })(), // <-- Ejecutar la función inmediatamente para obtener el array de valores
        },
        {
          idQuestion: 17,
          textResponse: formData.question17,
        },
        {
          idQuestion: 18,
          textResponse: formData.question18,
        },
        {
          idQuestion: 19,
          checkOptions: (() => {
            const checkValues = [];
            for (let i = 0; i <= 3; i++) {
              const value = formData[`question19Option${i}`];
              if (value) {
                checkValues.push({ value });
              }
            }
            return checkValues;
          })(), // <-- Ejecutar la función inmediatamente para obtener el array de valores
        },
        {
          idQuestion: 20,
          textResponse: formData.question20,
        },
        {
          idQuestion: 21,
          textResponse: formData.question21,
        },
        {
          idQuestion: 22,
          textResponse: formData.question22,
        },
        {
          idQuestion: 23,
          textResponse: formData.question23,
        },
        {
          idQuestion: 24,
          textResponse: formData.question24,
        },
        {
          idQuestion: 25,
          textResponse: formData.question25,
        },
        {
          idQuestion: 26,
          textResponse: formData.question26,
        },
        {
          idQuestion: 27,
          textResponse: formData.question27,
        },
        {
          idQuestion: 28,
          textResponse: formData.question28,
        },
      ],
    };
    // console.log("------------------------------------");
    // console.log(encuesta);

    encuesta.Questions.forEach((value) => {
      if ((value.textResponse || value.idOption) && !value.checkOptions) {
        value["idQuiz"] = encuesta.idQuiz;
        value["userId"] = encuesta.userId;
        // console.log(value);
        addResponses(value);
      } else if (value.checkOptions) {
        value.checkOptions.forEach((element) => {
          addResponses({
            idQuiz: encuesta.idQuiz,
            idQuestion: value.idQuestion,
            userId: encuesta.userId,
            idOption: element.value,
          });
        });
      }
    });
  };
  async function fetchData() {
    try {
      if(user.userId){
      const resProfessionalById = await getProfessionalsById(user.userId);
      setFormProfessional(resProfessionalById.data);
      const resMatrizProfessional = await getQuizByMatrizProfessional(user.userId);
      setQuizzes(resMatrizProfessional.data.quizzes)
      const resCareer = await getAllCareers();
      const arrayDeStringsCarreras = resCareer.data.map(objeto => objeto.name);
      setCarreras(arrayDeStringsCarreras)

      // setFormProfessional(resCareer.data);
      // console.log(resMatrizProfessional.data.quizzes);
      }
      

    } catch (error) {
      console.error("Error al obtener datos académicos:", error);
    }
  }
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormProfessional({ ...formProfessional, [name]: value });
  };
  useEffect(() => {
    fetchData();
  }, [user]);
  return (

    <Box>
      {!IsCompleteing && (
    <Box>
    <Center>
          <Tabl data={Quizzes} columns={columns} />
          </Center>
    </Box>
  )}
      {IsCompleteing && (
    <form onSubmit={handleSubmit} ref={form}>
    <Box fontSize={50}>
      <Container maxW={"container.xl"}>
        <Grid gap={1} p="20px">
          <GridItem>
            <Heading as="h1" textAlign="center">
              INSTITUTO SUPERIOR TECNOLÓGICO MARIANO SAMANIEGO
            </Heading>
          </GridItem>
          <GridItem>
            <Heading as="h1" textAlign="center">
              ENCUESTA DE EMPLEABILIDAD A GRADUADOS
            </Heading>
          </GridItem>
        </Grid>
      </Container>
      <Container py={2} maxW={"container.xl"} fontSize={"container.sm"}>
        <Grid templateColumns={{ base: "1fr", md: "9fr" }} gap={4} mt={2}>
          <GridItem order={{ base: 2, md: 1 }}>
            <Heading as="h3" size="md" textAlign="center">
              <Box bg="ceruleanBlue.500" color="white" p={2} borderRadius="md">
                DATOS DEL EGRESADO O GRADUADO/A
              </Box>
            </Heading>
            <Grid
              templateColumns={{ base: "1fr", md: "2fr 2fr" }}
              gap={2}
              mt={2}
            >
              <GridItem fontSize={"sm"}>
                <InputGroup>
                  <InputLeftAddon children="Primer Nombre" />
                  <Input type="text" placeholder="Primer Nombre" value={formProfessional.firstName? formProfessional.firstName: ""}
                  onChange={handleChange}/>
                </InputGroup>
              </GridItem>
              <GridItem fontSize={"sm"}>
                <InputGroup>
                  <InputLeftAddon children="Primer Apellido" />
                  <Input type="text" placeholder="Primer Apellido"
                  value={formProfessional.firstLastName? formProfessional.firstLastName: ""}
                  onChange={handleChange} />
                </InputGroup>
              </GridItem>
              <GridItem fontSize={"sm"}>
                <InputGroup>
                  <InputLeftAddon children="Segundo Nombre" />
                  <Input type="text" placeholder="Segundo Nombre" value={formProfessional.secondName? formProfessional.secondName: ""}
                  onChange={handleChange} />
                </InputGroup>
              </GridItem>
              <GridItem fontSize={"sm"}>
                <InputGroup>
                  <InputLeftAddon children="Segundo Apellido" />
                  <Input type="text" placeholder="Segundo Apellido" value={formProfessional.secondLastName? formProfessional.secondLastName: ""}
                  onChange={handleChange}/>
                </InputGroup>
              </GridItem>
              <GridItem fontSize={"sm"}>
                <InputGroup>
                  <InputLeftAddon children="Cedula" />
                  <Input type="text" placeholder="Cedula" 
                  value={formProfessional.ci ? formProfessional.ci : ""}
                  onChange={handleChange}/>
                </InputGroup>
              </GridItem>

              <GridItem fontSize={"sm"}>
                <InputGroup>
                  <InputLeftAddon children="Fecha de nacimiento" />
                  <Input placeholder="Fecha" size="md" type="date" value={formProfessional.birthDate? formProfessional.birthDate: ""}
                  onChange={handleChange}/>
                </InputGroup>
              </GridItem>
              <GridItem fontSize={"sm"}>
                <InputGroup>
                  <InputLeftAddon children="Genero" />
                  <Select placeholder="Seleccione una opción" value={formProfessional.gender? formProfessional.gender: ""}
                  onChange={handleChange}>
                    <option value="F">Femenino</option>
                    <option value="M">Masculino</option>
                  </Select>
                </InputGroup>
              </GridItem>

              <GridItem fontSize={"sm"}>
                <InputGroup>
                  <InputLeftAddon children="Email" />
                  <Input type="text" placeholder="Email" value={formProfessional.personalEmail? formProfessional.personalEmail: ""}
                  onChange={handleChange}/>
                </InputGroup>
              </GridItem>
              <GridItem fontSize={"sm"}>
                <InputGroup>
                  <InputLeftAddon children="Teléfono residencial" />
                  <Input type="tel" placeholder="Teléfono residencial" value={formProfessional.homePhone? formProfessional.homePhone: ""}
                  onChange={handleChange}/>
                </InputGroup>
              </GridItem>
              <GridItem fontSize={"sm"}>
                <InputGroup>
                  <InputLeftAddon children="Teléfono de celular" />
                  <Input type="tel" placeholder="Teléfono de celular" value={formProfessional.cellPhone? formProfessional.cellPhone: ""}
                  onChange={handleChange}/>
                </InputGroup>
              </GridItem>
              <GridItem fontSize={"sm"}>
                <InputGroup mt={3}>
                  <InputLeftAddon w={150} children="Posee título" />
                  <RadioGroup m={"auto"} name="question1">
                    <Stack spacing={5} direction="row">
                      <Radio colorScheme="green" value="Si">
                        Si
                      </Radio>
                      <Radio colorScheme="green" value="No">
                        No
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </InputGroup>
              </GridItem>
            </Grid>
            <Grid
              templateColumns={{ base: "1fr", md: "1fr" }}
              gap={2}
              mt={2}
            >
              <GridItem fontSize={"sm"}>
              
              
                <InputGroup>
                  <InputLeftAddon children="Carrera de la que Egresó" />
                  <Searcher placeholder='Carrera de la que Egresó' data={Carreras} name="question2">

                  </Searcher>
                </InputGroup>
              </GridItem>
              <GridItem fontSize={"sm"}>
                <InputGroup>
                  <InputLeftAddon children="Lugar de Residencia Actual" />
                  <Input
                    type="text"
                    placeholder="Lugar de Residencia Actual"
                  />
                </InputGroup>
              </GridItem>
            </Grid>
          </GridItem>
        </Grid>
      </Container>
      <Container py={2} maxW={"container.xl"} fontSize={"container.sm"}>
        <Heading as="h3" size="md" textAlign="center">
          <Box bg="ceruleanBlue.500" color="white" p={2} borderRadius="md">
            DATOS DEL TRABAJO Y ESTUDIO
          </Box>
        </Heading>
        <Grid
          p={2}
          border="1px solid #ccc"
          borderRadius={8}
          templateColumns={{ base: "1fr", md: "9fr" }}
          gap={4}
          mt={2}
        >
          <GridItem>
            <Grid
              templateColumns={{ base: "1fr", md: "2fr 2fr" }}
              gap={2}
              mt={5}
            >
              <GridItem fontSize={"sm"}>
                <FormControl isRequired display="flex">
                  <FormLabel>Trabaja Actualmente:</FormLabel>
                  <RadioGroup name="question3">
                    <Stack spacing={5} direction="row">
                      <Radio colorScheme="green" value="Si">
                        Si
                      </Radio>
                      <Radio colorScheme="green" value="No">
                        No
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>
              </GridItem>
              <GridItem fontSize={"sm"}>
                <FormControl display="flex">
                  <FormLabel>Tipo de Empresa:</FormLabel>
                  <RadioGroup name="question4">
                    <Stack spacing={5} direction="row">
                      <Radio colorScheme="green" value="Pública">
                        Pública
                      </Radio>
                      <Radio colorScheme="green" value="Privada">
                        Privada
                      </Radio>
                      <Radio colorScheme="green" value="Propia-familiar">
                        Propia-familiar
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>
              </GridItem>
            </Grid>
            <Grid
              templateColumns={{ base: "1fr", md: "1fr" }}
              gap={2}
              mt={2}
            >
              <GridItem fontSize={"sm"}>
                <FormControl>
                  <FormLabel>Nombre de la Empresa:</FormLabel>
                  <Input
                    type="text"
                    variant="flushed"
                    placeholder="Nombre de la Empresa"
                    name="question5"
                  />
                </FormControl>
              </GridItem>
              <GridItem fontSize={"sm"}>
                <FormControl>
                  <FormLabel>Dirección del trabajo:</FormLabel>
                  <Input
                    type="text"
                    variant="flushed"
                    placeholder="Dirección del trabajo"
                    name="question6"
                  />
                </FormControl>
              </GridItem>
              <GridItem fontSize={"sm"}>
                <FormControl>
                  <FormLabel>Teléfono en el trabajo:</FormLabel>
                  <Input
                    type="text"
                    variant="flushed"
                    placeholder="Teléfono en el trabajo"
                    name="question7"
                  />
                </FormControl>
              </GridItem>
              <GridItem fontSize={"sm"}>
                <FormControl display="flex">
                  <FormLabel>
                    ¿Su cargo tiene relación con su perfil profesional?
                  </FormLabel>
                  <RadioGroup name="question8">
                    <Stack spacing={5} direction="row">
                      <Radio colorScheme="green" value="Si">
                        Si
                      </Radio>
                      <Radio colorScheme="green" value="No">
                        No
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>
              </GridItem>
              <GridItem fontSize={"sm"}>
                <FormControl display="flex">
                  <FormLabel>Tiempo de servicio en la empresa:</FormLabel>
                  <RadioGroup name="question9">
                    <Stack spacing={5} direction="row">
                      <Radio colorScheme="green" value="0-6 meses">
                        0-6 meses
                      </Radio>
                      <Radio colorScheme="green" value="6 meses-año">
                        6 meses-año
                      </Radio>
                      <Radio colorScheme="green" value="Más de un año">
                        Más de un año
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>
              </GridItem>
            </Grid>
          </GridItem>
        </Grid>
        <Grid
          p={2}
          border="1px solid #ccc"
          borderRadius={8}
          templateColumns={{ base: "1fr", md: "9fr" }}
          gap={4}
          mt={2}
        >
          <GridItem>
            <Grid
              templateColumns={{ base: "1fr", md: "1fr" }}
              gap={2}
              mt={2}
            >
              <GridItem fontSize={"sm"}>
                <FormControl>
                  <FormLabel>
                    ¿Cuál es su situación laboral actual?
                  </FormLabel>
                  <RadioGroup name="questionOption10">
                    <Stack spacing={5}>
                      <Radio colorScheme="green" value={"1"}>
                        Trabajo en un sector relacionado a mi profesión
                      </Radio>
                      <Radio colorScheme="green" value={"2"}>
                        Trabajo en un sector no relacionado a mi profesión
                      </Radio>
                      <Radio colorScheme="green" value={"3"}>
                        Estoy desempleado
                      </Radio>
                      <Radio colorScheme="green" value={"4"}>
                        Otros
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>
              </GridItem>
              <GridItem fontSize={"sm"}>
                <FormControl>
                  <FormLabel>Explique su respuesta:</FormLabel>
                  <Textarea
                    placeholder="Explique su respuesta"
                    name="question10"
                  />
                </FormControl>
              </GridItem>
            </Grid>
          </GridItem>
        </Grid>

        <Grid
          p={2}
          border="1px solid #ccc"
          borderRadius={8}
          templateColumns={{ base: "1fr", md: "9fr" }}
          gap={4}
          mt={2}
        >
          <GridItem>
            <Grid
              templateColumns={{ base: "1fr", md: "1fr" }}
              gap={2}
              mt={2}
            >
              <GridItem fontSize={"sm"}>
                <FormControl>
                  <FormLabel>¿Cuándo empezó a trabajar?</FormLabel>
                  <RadioGroup name="questionOption11">
                    <Stack spacing={5}>
                      <Radio colorScheme="green" value="1">
                        Antes de graduarse
                      </Radio>
                      <Radio colorScheme="green" value="2">
                        Durante el primer año después de graduarse
                      </Radio>
                      <Radio colorScheme="green" value="3">
                        Un año después de graduarse
                      </Radio>
                      <Radio colorScheme="green" value="4">
                        No trabaja
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>
              </GridItem>
              <GridItem fontSize={"sm"}>
                <FormControl>
                  <FormLabel>
                    Área en la que desarrolla su actividad profesional
                    actualmente:
                  </FormLabel>
                  <Textarea placeholder="Describa..." name="question11" />
                </FormControl>
              </GridItem>
            </Grid>
          </GridItem>
        </Grid>

        <Grid p={2} border="1px solid #ccc" borderRadius={8} gap={4} mt={2}>
          <GridItem fontSize={"sm"}>
            <FormControl>
              <FormLabel>
                ¿Cuál es la relación del trabajo que tiene con la carrera
                que estudió?
              </FormLabel>
              <RadioGroup name="question12">
                <Stack spacing={5}>
                  <Radio colorScheme="green" value="Bastante">
                    Bastante
                  </Radio>
                  <Radio colorScheme="green" value="Mediana">
                    Mediana
                  </Radio>
                  <Radio colorScheme="green" value="Poca">
                    Poca
                  </Radio>
                  <Radio colorScheme="green" value="Ninguna">
                    Ninguna
                  </Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
          </GridItem>
        </Grid>
        <Grid
          p={2}
          border="1px solid #ccc"
          borderRadius={8}
          templateColumns={{ base: "1fr", md: "9fr" }}
          gap={4}
          mt={2}
        >
          <GridItem fontSize={"sm"}>
            <FormControl>
              <FormLabel>
                ¿Cuál fue el factor que más contribuyo para que consiguiera
                su primer empleo?
              </FormLabel>
              <RadioGroup name="questionOption13">
                <Stack spacing={5}>
                  <Radio colorScheme="green" value="1">
                    Título profesional
                  </Radio>
                  <Radio colorScheme="green" value="2">
                    Experiencia laboral
                  </Radio>
                  <Radio colorScheme="green" value="3">
                    Practicas preprofesionales
                  </Radio>
                  <Radio colorScheme="green" value="4">
                    Antecedentes que brinda la carrera
                  </Radio>
                  <Radio colorScheme="green" value="5">
                    Recomendación de terceras personas
                  </Radio>
                  <Radio colorScheme="green" value="6">
                    Otros
                  </Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
          </GridItem>
          <GridItem fontSize={"sm"}>
            <FormControl>
              <FormLabel>Especifique:</FormLabel>
              <Textarea placeholder="Especifique..." name="question13" />
            </FormControl>
          </GridItem>
        </Grid>
        <Grid
          p={2}
          border="1px solid #ccc"
          borderRadius={8}
          templateColumns={{ base: "1fr", md: "9fr" }}
          gap={4}
          mt={2}
        >
          <GridItem fontSize={"sm"}>
            <FormControl>
              <FormLabel>
                ¿Qué conocimientos y habilidades son las más relevantes para
                el desempeño de sus actividades laborales actuales? (Puede
                ser más de uno)
              </FormLabel>
              <RadioGroup>
                <Stack spacing={5}>
                  <Checkbox value={15} name="question14Option0">
                    Gestiona, transfiere y desarrolla soluciones
                    informáticas para ambientes corporativos
                  </Checkbox>
                  <Checkbox value={16} name="question14Option1">
                    Explora problemas y genera diseños y soluciones
                    inteligentes de sistemas informáticos mediante análisis
                    de tecnología y costos de software y hardware
                  </Checkbox>
                  <Checkbox value={17} name="question14Option2">
                    Conforma equipos, procesos y sistemas de desarrollo de
                    tecnologías informáticas con destreza y habilidad
                  </Checkbox>
                  <Checkbox value={18} name="question14Option3">
                    Conocimiento del lenguaje especializado de la ciencia
                  </Checkbox>
                  <Checkbox value={19} name="question14Option4">
                    Conoce los procedimientos de desarrollo, implementación
                    y adecuación de medios informáticos
                  </Checkbox>
                  <Checkbox value={20} name="question14Option5">
                    Habilidad de trabajo en equipo y pro actividad, para
                    adaptarse a los avances
                  </Checkbox>
                  <Checkbox value={21} name="question14Option6">
                    científicos y al desarrollo tecnológico.
                  </Checkbox>
                  <Checkbox value={22} name="question14Option7">
                    Conoce la importancia de la investigación en su propio
                    proceso de formación
                  </Checkbox>
                  <Checkbox value={23} name="question14Option8">
                    Afronta y actúa con confianza y seguridad el análisis y
                    la solución de problemas que se encuentran en la
                    profesión
                  </Checkbox>
                  <Checkbox value={24} name="question14Option9">
                    Participa en procesos emprendedores
                  </Checkbox>
                </Stack>
              </RadioGroup>
            </FormControl>
          </GridItem>
        </Grid>
        <Grid p={2} border="1px solid #ccc" borderRadius={8} gap={4} mt={2}>
          <GridItem fontSize={"sm"}>
            <FormControl>
              <FormLabel>
                ¿Cuál es su percepción general de los/las profesionales del
                ITSFMS?
              </FormLabel>
              <RadioGroup name="question15">
                <Stack
                  spacing={5}
                  direction={{ base: "column", md: "row" }}
                >
                  <Radio colorScheme="green" value="Excelente">
                    Excelente
                  </Radio>
                  <Radio colorScheme="green" value="Muy buena">
                    Muy buena
                  </Radio>
                  <Radio colorScheme="green" value="Buena">
                    Buena
                  </Radio>
                  <Radio colorScheme="green" value="Regular">
                    Regular
                  </Radio>
                  <Radio colorScheme="green" value="Mala">
                    Mala
                  </Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
          </GridItem>
        </Grid>

        <Grid
          p={2}
          border="1px solid #ccc"
          borderRadius={8}
          templateColumns={{ base: "1fr", md: "9fr" }}
          gap={4}
          mt={2}
        >
          <GridItem fontSize={"sm"}>
            <FormControl>
              <FormLabel>
                En su opinión, ¿Cuáles son las principales carencias que
                tiene el programa académico de la carrera en que se graduó?
              </FormLabel>
              <GridItem fontSize={"sm"}>
                <FormControl>
                  <FormLabel>Carrera:</FormLabel>
                  {/* <Input
                    type="text"
                    variant="flushed"
                    placeholder="Carrera"
                    name="question17"
                  /> */}
                  <Searcher placeholder='Carrera' data={Carreras} name="question17">

                  </Searcher>
                </FormControl>
              </GridItem>
              <GridItem fontSize={"sm"}></GridItem>
              <Stack spacing={5}>
                <Checkbox name="question16Option0" value={25}>
                  Falta de actualización en nuevos temas
                </Checkbox>
                <Checkbox name="question16Option1" value={26}>
                  Enseñanza de aplicaciones tecnológicas
                </Checkbox>
                <Checkbox name="question16Option2" value={27}>
                  Actualización de los nuevos programas en software
                </Checkbox>
                <Checkbox name="question16Option3" value={28}>
                  Capacitar continuamente al personal docente
                </Checkbox>
                <Checkbox name="question16Option4" value={29}>
                  Otros
                </Checkbox>
              </Stack>
            </FormControl>
          </GridItem>
          <GridItem fontSize={"sm"}>
            <FormControl>
              <FormLabel>Especifique:</FormLabel>
              <Textarea placeholder="Especifique..." name="question18" />
            </FormControl>
          </GridItem>
        </Grid>
        <Grid
          p={2}
          border="1px solid #ccc"
          borderRadius={8}
          templateColumns={{ base: "1fr", md: "9fr" }}
          gap={4}
          mt={2}
        >
          <GridItem fontSize={"sm"}>
            <FormControl>
              <FormLabel>
                ¿Que recomienda para estrechar las relaciones entre el ISTMS
                y los GRADUADOS?
              </FormLabel>
              <GridItem fontSize={"sm"}>
                <FormControl>
                  <FormLabel>Carrera:</FormLabel>
                  <Searcher placeholder='Carrera' data={Carreras} name="question20">

                  </Searcher>
                  {/* <Input
                    type="text"
                    variant="flushed"
                    placeholder="Carrera"
                    name="question20"
                  /> */}
                </FormControl>
              </GridItem>
              <GridItem fontSize={"sm"}>
                <Stack spacing={5}>
                  <Checkbox value={30} name="question19Option0">
                    Cursos de capacitación y actualización
                  </Checkbox>
                  <Checkbox value={31} name="question19Option1">
                    Hacer reuniones anuales de egresados
                  </Checkbox>
                  <Checkbox value={32} name="question19Option2">
                    Tener acceso a un directorio
                  </Checkbox>
                  <Checkbox value={33} name="question19Option3">
                    Otros
                  </Checkbox>
                </Stack>
              </GridItem>
            </FormControl>
          </GridItem>
          <GridItem fontSize={"sm"}>
            <FormControl>
              <FormLabel>Especifique:</FormLabel>
              <Textarea placeholder="Especifique..." name="question21" />
            </FormControl>
          </GridItem>
        </Grid>
        {/*             */}
        <Grid
          p={2}
          border="1px solid #ccc"
          borderRadius={8}
          gap={4}
          mt={2}
          templateColumns={{ base: "1fr", md: "2fr 2fr" }}
        >
          <GridItem fontSize={"sm"} colSpan={{ base: 1, md: 2 }}>
            <FormControl display="flex">
              <FormLabel>
                ¿Ha realizado usted estudios posteriores?{" "}
              </FormLabel>
              <RadioGroup name="question22">
                <Stack spacing={5} direction="row">
                  <Radio colorScheme="green" value="Si">
                    Si
                  </Radio>
                  <Radio colorScheme="green" value="No">
                    No
                  </Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
          </GridItem>
          <GridItem fontSize={"sm"}>
            <FormControl>
              <FormLabel>Carrera:</FormLabel>
              <Input
                type="text"
                variant="flushed"
                placeholder="Carrera"
                name="question23"
              />
            </FormControl>
          </GridItem>
          <GridItem fontSize={"sm"}>
            <FormControl>
              <FormLabel>Centro de Estudio:</FormLabel>
              <Input
                type="text"
                variant="flushed"
                placeholder="Centro de Estudio"
                name="question24"
              />
            </FormControl>
          </GridItem>
          <GridItem fontSize={"sm"}>
            <FormControl>
              <FormLabel>Año de titulación:</FormLabel>
              <Input
                type="text"
                variant="flushed"
                placeholder="Año de titulación"
                name="question25"
              />
            </FormControl>
          </GridItem>
          <GridItem fontSize={"sm"}>
            <Stack spacing={5}>
              <Checkbox name="question26" value={"En Curso"}>
                En Curso
              </Checkbox>
            </Stack>
          </GridItem>
        </Grid>
        <Grid p={2} border="1px solid #ccc" borderRadius={8} gap={4} mt={2}>
          <GridItem fontSize={"sm"}>
            <FormControl>
              <FormLabel>
                ¿A qué actividades económicas se dedica la institución o
                empresa en la que trabaja?{" "}
              </FormLabel>
              <RadioGroup
                display={{ base: "", md: "flex" }}
                name="question27"
              >
                <Stack spacing={5} flex="1">
                  <Radio
                    colorScheme="green"
                    value="Alimentos fresco y procesados"
                  >
                    Alimentos fresco y procesados
                  </Radio>
                  <Radio
                    colorScheme="green"
                    value="Productos forestales de madera"
                  >
                    Productos forestales de madera
                  </Radio>
                  <Radio
                    colorScheme="green"
                    value="Biotecnología (bioquímica y biomedicina)"
                  >
                    Biotecnología (bioquímica y biomedicina)
                  </Radio>
                  <Radio colorScheme="green" value="Servicios ambientales">
                    Servicios ambientales
                  </Radio>
                  <Radio colorScheme="green" value="Confecciones y calzado">
                    Confecciones y calzado
                  </Radio>
                  <Radio
                    colorScheme="green"
                    value="Tecnología (software, hardware y servicios informáticos)"
                  >
                    Tecnología (software, hardware y servicios informáticos)
                  </Radio>
                  <Radio colorScheme="green" value="Energías renovables">
                    Energías renovables
                  </Radio>
                  <Radio colorScheme="green" value="1Otros">
                    Otros
                  </Radio>
                </Stack>
                <Stack spacing={5} flex="1">
                  <Radio
                    colorScheme="green"
                    value="Vehículos, automotores, carrocerías y partes"
                  >
                    Vehículos, automotores, carrocerías y partes
                  </Radio>
                  <Radio colorScheme="green" value="Industria farmacéutica">
                    Industria farmacéutica
                  </Radio>
                  <Radio colorScheme="green" value="1Construcción">
                    Construcción
                  </Radio>
                  <Radio colorScheme="green" value="1Metalmecánica">
                    Metalmecánica
                  </Radio>
                  <Radio
                    colorScheme="green"
                    value="1Transporte y logística"
                  >
                    Transporte y logística
                  </Radio>
                  <Radio colorScheme="green" value="1Petroquímica">
                    Petroquímica
                  </Radio>
                  <Radio colorScheme="green" value="1Turismo">
                    Turismo
                  </Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
          </GridItem>
        </Grid>
        <Grid p={2} border="1px solid #ccc" borderRadius={8} gap={4} mt={2}>
          <GridItem fontSize={"sm"}>
            <FormControl>
              <FormLabel>
                En su desempeño laboral que tan necesario es el dominio del
                idioma inglés
              </FormLabel>
              <RadioGroup name="question28">
                <Stack spacing={5}>
                  <Radio colorScheme="green" value="Indispensable">
                    Indispensable
                  </Radio>
                  <Radio colorScheme="green" value="No indispensable">
                    No indispensable
                  </Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
          </GridItem>
        </Grid>
      </Container>
    </Box>
    <Button
      position="fixed"
      bottom={4}
      right={4}
      bg="ceruleanBlue.500"
      color="white"
      size="lg"
      zIndex="tooltip"
      type="submit"
      _hover= {
        {
          bg: "ceruleanBlue.600",
        }
      }
    >
      Enviar Encuesta
    </Button>
  </form>
  )}

      


    </Box>
    
  );
}

export default ResumeForm;
