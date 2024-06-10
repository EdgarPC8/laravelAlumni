import Tabl from "../components/Table";
import SelectData from "../components/SelectData";
import Modal from "../components/AlertDialog";
import { useEffect, useState } from "react";
import { addUser, getUsers, removeUser, changePassword } from "../api/userRequest";
import { getAllProfessionals, addProfessional } from "../api/professionalRequest";
import { getAllMatriz, addMatriz, removeMatriz, getAllCareers, getAllPeriods } from "../api/matrizResquest";
import { useRef } from "react";
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import Papa from "papaparse"; // Asegúrate de instalar papaparse: npm install papaparse
import { FaYoutube } from "react-icons/fa";

import {
  Button,
  useDisclosure,
  Grid,
  GridItem,
  Stack,
  useToast,
  Flex,
  Box,
  Heading,
  Center,
  Textarea,
  InputGroup,
  InputLeftAddon,
  Input,
  Text,
} from "@chakra-ui/react";

import { useAuth } from "../context/AuthContext";
import { FiUserPlus } from "react-icons/fi";
import { EmailIcon } from "@chakra-ui/icons";
import { Link, useNavigate } from "react-router-dom";

function Matriz() {
  const navigate = useNavigate();
  const toast = useToast();
  const hiddenFileInputCSVRef = useRef(null);
  const { user } = useAuth();
  const [matricesData, setMatricesData] = useState([]);
  const [Careers, setCareers] = useState([]);
  const [Periods, setPeriods] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [createMatriz, setCreateMatriz] = useState([]);
  const [alertDialogMessage, setAlertDialogMessage] = useState('');
  const [csvFile, setCSVFile] = useState(null);


  const [selectedOptionCareer, setSelectedOptionCareer] = useState(null);
  const [selectedOptionPeriod, setSelectedOptionPeriod] = useState(null);

  const [selectedModality, setSelectedModality] = useState(null);
  const [year, setYear] = useState("");

  const [selectedModalityVisible, setSelectedModalityVisible] = useState(true);
  const [yearVisible, setYearVisible] = useState(true);
  const [ButtonCargarCsvVisible, setButtonCargarCsvVisible] = useState(true);

  const [isSelectModalOpen, setSelectModalOpen] = useState(false);
  const [isDeleteUserModalOpen, setDeleteUserModalOpen] = useState(false);

  const [DataMatriz, setDataMatriz] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [id, setId] = useState(0);

  const columns = [
    {
      header: "#",
      accessorKey: "id",
      cell: (props) => props.row.index + 1,
    },
    {
      header: "Nombres Completos",
      accessorKey: "fullname",
      accessorFn: (row) =>
        `
        ${row.professional.firstName} ${row.professional.secondName} ${row.professional.firstLastName} ${row.professional.secondLastName}`,
    },
    {
      header: "Cedula",
      accessorKey: "professional.ci",
    },
    {
      header: "Carrera",
      accessorKey: "carreer.name",
    },
    {
      header: "Periodo",
      accessorKey: "period.name",
    },
    {
      header: "Modalidad",
      accessorKey: "modality",
    },
    {
      header: "Fecha de Grado",
      accessorKey: "grateDate",
    },
    {
      header: "Acción",

      cell: (props) => (
        <Center>

          <Stack spacing={4} direction="row" align="center">
            {/* <Button
            colorScheme="yellow"
            onClick={() => {
              handleEditRow(props.row.original);
            }}
          >
           <EditIcon></EditIcon>
          </Button> */}

            <Button
              colorScheme="red"
              onClick={() => {
                setDataMatriz(props.row.original);
                // console.log(props.row.original)
                setDeleteUserModalOpen(true)
              }}
            >
              <DeleteIcon></DeleteIcon>
            </Button>

          </Stack>
        </Center>

      ),
    },
  ];
  const columnsProfessionals = [
    {
      header: "#",
      accessorKey: "userId",
      cell: (props) => props.row.index + 1,
    },
    {
      header: "Cedula",
      accessorKey: "ci",
    },
    {
      header: "Nombres Completos",
      accessorKey: "fullname",
      accessorFn: (row) =>
        `
        ${row.firstName} ${row.secondName} ${row.firstLastName} ${row.secondLastName}
        `,
    },
    {
      header: "Fecha",
      accessorKey: "birthDate",
    },
    {
      header: "Acción",

      cell: (props) => (
        <Center>
          <Stack spacing={4} direction="row">
            <Button
              colorScheme="green"
              onClick={() => {
                handleAddProfessionalRow(props.row.original);
              }}
            >
              +          </Button>
          </Stack>
        </Center>

      ),
    },
  ];
  const columnsCreateMatriz = [
    {
      header: "#",
      accessorKey: "id",
      cell: (props) => props.row.index + 1,
    },
    {
      header: "Nombres Completos",
      accessorKey: "fullname",
      accessorFn: (row) =>
        `
        ${row.firstName} ${row.secondName} ${row.firstLastName} ${row.secondLastName}
          `,
    },
    {
      header: "Cedula",
      accessorKey: "ci",
    },
    {
      header: "Carrera",
      accessorKey: "carreerName",
    },
    {
      header: "Periodo",
      accessorKey: "periodName",
    },
    {
      header: "Modalidad",
      accessorKey: "modality",
    },
    {
      header: "Fecha de Grado",
      accessorKey: "grateDate",
    },
    {
      header: "Acción",

      cell: (props) => (
        <Center>

          <Stack spacing={4} direction="row" align="center">
            {/* <Button
              colorScheme="yellow"
              onClick={() => {
                handleEditRow(props.row.original);
              }}
            >
             <EditIcon></EditIcon>
            </Button> */}

            <Button
              colorScheme="red"
              onClick={() => {
                handleDeleteProfessionalRow(props.row.original);
              }}
            >
              -         </Button>

          </Stack>
        </Center>

      ),
    },
  ];

  const transformedCarreras = Careers.map(item => ({
    value: item.idCarreer,
    label: `${item.name}`,
  }));
  const transformedPeriodos = Periods.map(item => ({
    value: item.id,
    label: `${item.name}`,
  }));

  let initialFormQuiz = {
    title: "",
    description: "",
    date: "",
  };
  const [formQuiz, setFormQuiz] = useState(
    initialFormQuiz
  );
  const handleCSV =  () => {
    if (!selectedOptionCareer || !selectedOptionPeriod) {
      // Muestra el AlertDialog con el mensaje correspondiente
      setAlertDialogMessage("Por favor, seleccione una carrera y período")
      setSelectModalOpen(true);
      return;
    }
    setButtonCargarCsvVisible(false)
    hiddenFileInputCSVRef.current.click();
  };

  const handleFileChangeCSV = async (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) {
      console.error("Selecciona un archivo CSV antes de cargar.");
      return;
    }

    setYearVisible(false)
    setSelectedModalityVisible(false)
    setSelectedModality(true)
    setYear(true)

    Papa.parse(selectedFile, {
      complete:async (result) => {
        // El resultado de Papaparse contiene la información del CSV
        // console.log("Datos CSV:", result.data);
        // CEDULA	APELLIDO_1	APELLIDO_2	NOMBRE_1	NOMBRE_2	FECHA_NAC	GENERO	TELEFONO	CORREO	MODALIDAD	FECHA_GRADO
        const nombresCampos = ['ci', 'firstLastName', 'secondLastName', 'firstName', 'secondName', 
        'birthDate', 'gender', 'phone', 'email', 'modality', 'grateDate'];
        // Crear otro array de objetos usando los nombres de propiedades como nombres de campos
        const nuevoArray = result.data.map((element) => {
          const nuevoObjeto = {};
          Object.keys(element).forEach((key, index) => {
            nuevoObjeto[nombresCampos[index]] = element[key];
            nuevoObjeto.carreerName = selectedOptionCareer.name;
            nuevoObjeto.periodName = selectedOptionPeriod.name;
            nuevoObjeto.carreerId = selectedOptionCareer.id;
            nuevoObjeto.periodId = selectedOptionPeriod.id;
          });
          return nuevoObjeto;
        });

        const nuevoArrayRepetidos = nuevoArray.map((element) => {
          const elementoEnProfessionals = professionals.find((objeto) => objeto.ci === element.ci);
          if (elementoEnProfessionals) {
            // Actualiza los campos del nuevoArray con los campos correspondientes del profesional
            // console.log(elementoEnProfessionals)
            element.birthDate = elementoEnProfessionals.birthDate;
            element.firstName = elementoEnProfessionals.firstName;
            element.secondName = elementoEnProfessionals.secondName;
            element.firstLastName = elementoEnProfessionals.firstLastName;
            element.secondLastName = elementoEnProfessionals.secondLastName;
            element.id = elementoEnProfessionals.id;
            return element;
          }
          return false;
        }).filter(Boolean); // Elimina elementos falsos (que no tuvieron coincidencias)

        const nuevoArrayNoRepetidos = nuevoArray.filter((element) => {
          return !professionals.some((objeto) => objeto.ci === element.ci);
        });

        // console.log("\nNuevo array de objetos con 'ci' repetido en professionals:");
        // console.log(nuevoArrayRepetidos);

        // console.log("\nNuevo array de objetos con 'ci' no repetido en professionals:");
        // console.log(nuevoArrayNoRepetidos);

        let newArray=[]

        if(nuevoArrayNoRepetidos.length>0){
          const promises = nuevoArrayNoRepetidos.map(async (element) => {
            const response = await addUser({
              ci: element.ci,
              username: element.ci,
              firstName: element.firstName,
              secondName: element.secondName,
              firstLastName: element.firstLastName,
              secondLastName: element.secondLastName,
              password: element.ci,
              roles: [2],
            });
        
            const professional = response.data.user;
            element.id=professional.userId
        
            await addProfessional({
              firstName: professional.firstName,
              secondName: professional.secondName,
              firstLastName: professional.firstLastName,
              secondLastName: professional.secondLastName,
              ci: professional.ci,
              userId: professional.userId,
            });
        
            return element;
          });
        // Verificar si el toast fue exitoso antes de mostrar otro toast
        const newArray = await Promise.all(promises);

        // Verificar si el toast fue exitoso antes de mostrar otro toast
        toast({
          title: `${newArray.length} Profesionales Nuevos`,
          description: `Se agregaron nuevos profesionales del archivo csv`,
          status: "success",
          position: "top-right",
          isClosable: true,
        });
        setCreateMatriz((prevCreateMatriz) => [...prevCreateMatriz, ...newArray]);
        }


        setCreateMatriz((prevCreateMatriz) => [...prevCreateMatriz, ...nuevoArrayRepetidos]);
        
        // setProfessionals((prevProfessionals) => {
        //   const filteredProfessionals = prevProfessionals.filter(
        //     (prof) => !nuevoArrayRepetidos.some((rep) => rep.ci === prof.ci)
        //   );
        //   return [...filteredProfessionals];
        // });
        // event.target.value = null;
      event.target.value = null;

      },
      header: true, // Si el archivo CSV tiene encabezados
      dynamicTyping: true, // Intenta convertir los valores a números automáticamente
      skipEmptyLines: true, // Omite las líneas vacías
    });
    // fetchUsers()
    // setButtonCargarCsvVisible(true)
    // const resProfessionals = await getAllProfessionals();
    // setProfessionals(resProfessionals.data);
  };

  const handleSelectChangeCareer = (value, selectedOption) => {
    // Verifica si la primera opción está seleccionada
    if (selectedOption === "Seleccione una opción") {
      // Agrega aquí la lógica que deseas ejecutar cuando se selecciona la primera opción
      setSelectedOptionCareer(null);
    } else {

      setSelectedOptionCareer({ id: value, name: selectedOption });
    }

    // Actualiza el estado normalmente
  };

  const handleSelectChangePeriod = (value, selectedOption) => {
    // Verifica si la primera opción está seleccionada
    if (selectedOption === "Seleccione una opción") {
      // Agrega aquí la lógica que deseas ejecutar cuando se selecciona la primera opción
      setSelectedOptionPeriod(null);
    } else {

      setSelectedOptionPeriod({ id: value, name: selectedOption });
    }

    // Actualiza el estado normalmente
  };

  const handleSelectChangeModality = (value, selectedOption) => {
    // Verifica si la primera opción está seleccionada

    if (selectedOption === "Seleccione una opción") {
      // Agrega aquí la lógica que deseas ejecutar cuando se selecciona la primera opción
      setSelectedModality(null);

    } else {
      setSelectedModality(value);
    }

    // Actualiza el estado normalmente
  };

  const handleChangeYear = (event) => {
    let inputValue = event.target.value;

    // Elimina cualquier caracter no numérico
    inputValue = inputValue.replace(/\D/g, '');

    // Actualiza el estado solo si la cadena resultante es numérica y no está vacía
    if (/^\d+$/.test(inputValue) || inputValue === '') {
      setYear(inputValue);
    }
  };

  const handleAddProfessionalRow = (row) => {
    if (!selectedOptionCareer || !selectedOptionPeriod || !selectedModality || !year) {
      // Muestra el AlertDialog con el mensaje correspondiente
      setAlertDialogMessage("Por favor, seleccione una carrera, período, modalidad y año.")
      setSelectModalOpen(true);
      return;
    }
    row.carreerName = selectedOptionCareer.name;
    row.periodName = selectedOptionPeriod.name;
    row.carreerId = selectedOptionCareer.id;
    row.periodId = selectedOptionPeriod.id;
    row.modality = selectedModality;
    row.grateDate = year;
    setCreateMatriz((prevCreateMatriz) => [...prevCreateMatriz, row]);

    setProfessionals((prevProfessionals) => prevProfessionals.filter(professional => professional.id !== row.id));
  };
  const handleDeleteProfessionalRow = (row) => {
    // Agrega el row al inicio de createMatriz

    setProfessionals((prevCreateMatriz) => [row, ...prevCreateMatriz]);

    // Elimina el row del array original (professionals)
    setCreateMatriz((prevProfessionals) => prevProfessionals.filter(professional => professional.id !== row.id));
  };

  const handleSubmit = () => {
    if (!selectedOptionCareer || !selectedOptionPeriod || !selectedModality || !year) {
      // Muestra el AlertDialog con el mensaje correspondiente
      setAlertDialogMessage("Por favor, seleccione una carrera, período, modalidad y año.")
      setSelectModalOpen(true);
      return;
    }

    // matricesData es un array de objetos que cada objeto tiene como onjeto 
    // con key llamado carreer y period, carreer tiene como parametro idCarreer y period tiene como
    // parametros id.
    // insertArrayMatriz tiene dos objetos data y name lo que esta dentro de data es un array de objeto que tiene parametros career y idPeriod
    // quiero que filtres los que tengas los mismos valores se eliminen del array de obeto de insertArrayMatriz.data

    const insertArrayMatriz = createMatriz.map(objeto => {
      const { id, carreerId, periodId, firstLastName, firstName, grateDate, modality } = objeto;
      return { data: { idProfessional: id, career: carreerId, idPeriod: periodId, name: firstLastName, grateDate: grateDate, modality: modality }, name: `${firstName} ${firstLastName}` }
    });

//   // Filtrar objetos que cumplen con la condición
// const filteredObjects = insertArrayMatriz.filter(insertObj => {
//   // Encontrar un objeto en matricesData que cumple con la condición
//   const matchingObj = matricesData.find(matrizObj => {
//       return (parseInt(insertObj.data.idPeriod) == parseInt(matrizObj.period.id)&&
//       parseInt(insertObj.data.career) == parseInt(matrizObj.carreer.idCarreer)&&
//       parseInt(insertObj.data.idProfessional) == parseInt(matrizObj.professional.id));
//   });

//   // Devolver true solo si se encuentra una coincidencia
//   return !matchingObj;
// });

const objetosExistsmatriz = [];
const objetosAddMatriz = [];

insertArrayMatriz.filter(insertObj => {
  // Encontrar un objeto en matricesData que cumple con la condición
  const matchingObj = matricesData.find(matrizObj => {
      return (parseInt(insertObj.data.idPeriod) == parseInt(matrizObj.period.id) &&
              parseInt(insertObj.data.career) == parseInt(matrizObj.carreer.idCarreer) &&
              parseInt(insertObj.data.idProfessional) == parseInt(matrizObj.professional.id));
  });

  // Determinar en cuál array almacenar el objeto
  if (matchingObj) {
    // Si hay una coincidencia, almacenar en el array de objetos que cumplen
    objetosExistsmatriz.push(matchingObj);
    return false; // No incluir en el resultado final
  } else {
    // Si no hay coincidencia, almacenar en el array de objetos que no cumplen
    objetosAddMatriz.push(insertObj);
    return true; // Incluir en el resultado final
  }
});

// Ahora, objetosExistsmatriz contiene los objetos que cumplen la condición,
// // y objetosAddMatriz contiene los que no cumplen.
// console.log("Objetos que cumplen:", objetosExistsmatriz);
// console.log("Objetos que no cumplen:", objetosAddMatriz);



if(objetosExistsmatriz.length>0){
  toast({
    title: `Las Matrices ya existen`,
    description: `${objetosExistsmatriz.length>1?`Las ${objetosExistsmatriz.length} Matrices que quieres agregar ya existen`:`La Matriz que quieres agregar ya existe`}`,
    status: "warning",
    position: "top-right",
    isClosable: true,
  });
}
if(objetosAddMatriz.length<=5){
  objetosAddMatriz.forEach(element => {
    toast.promise(addMatriz(element.data), {
      loading: {
        title: "Añadiendo...",
        position: "top-right",
      },
      success: (d) => {
        fetchUsers();
        return {
          title: "Matriz",
          description: `${element.name} ${d.data.message}`,
          isClosable: true,
        };
      },
      error: (e) => ({
        title: "Error",
        description: e.response.data.message,
        isClosable: true,
      }),
    });

  });
}else{
  objetosAddMatriz.forEach(element => {
    addMatriz(element.data)
  });
  toast({
    title: `${objetosAddMatriz.length} Matrices Nuevas`,
    description: `Se agregaron nuevas matrices correctamente`,
    status: "success",
    position: "top-right",
    isClosable: true,
  });
  fetchUsers();

}
    


    
    // if (isEditing) {
    //   toast.promise(editQuiz(id, formQuiz), {
    //     loading: {
    //       title: "Editando...",
    //       position: "top-right",
    //     },
    //     success: (d) => ({
    //       title: "Encuesta",
    //       description: d.data.message,
    //       isClosable: true,
    //     }),
    //     error: (e) => ({
    //       title: "Error",
    //       description: e.response.data.message,
    //       isClosable: true,
    //     }),
    //   });
    //   fetchUsers();

    //   return;
    // }


    fetchUsers();

  };


  const deleteMatriz = () => {
    toast.promise(removeMatriz(DataMatriz.id), {
      loading: {
        title: "Eliminando...",
        position: "top-right",
      },
      success: (d) => {
        // Acciones a ejecutar en caso de éxito
        setDataMatriz(null);
        setDeleteUserModalOpen(false);
        setMatricesData((prevmatricesData) => prevmatricesData.filter(item => item.id !== DataMatriz.id));

        return {
          title: "Matriz",
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


  async function fetchUsers() {
    try {
      const resMatriz = await getAllMatriz();
      const resProfessionals = await getAllProfessionals();
      const resCareers = await getAllCareers();
      const resPeriods = await getAllPeriods();
      setMatricesData(resMatriz.data);
      setProfessionals(resProfessionals.data);
      setCareers(resCareers.data)
      setPeriods(resPeriods.data)
      setYearVisible(true)
      setSelectedModalityVisible(true)
      setYear("")
      // setSelectedModality(null)
      setButtonCargarCsvVisible(true)
      setCreateMatriz([])

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
        <Box>
        <Link to="https://drive.google.com/file/d/1J-iEj4FcFRHoddaAfc3ZLgVvb05w3EM_/view?usp=sharing" target="_blank">
              <Button colorScheme={"red"}>
                Tutorial
                <FaYoutube/>
              </Button>
            </Link> 
          <Grid
            templateColumns={{ base: "1fr", md: "4fr 4fr" }}
            gap={2}
            mt={2}
          >
            <GridItem fontSize={"sm"}>
              {/* <Textarea value={textValue} /> */}
              

              {selectedModalityVisible && (
                <SelectData
                  title="Modalidad"
                  options={[{ value: "Presencial", label: "Presencial" },{ value: "Hibrida", label: "Hibrida" },{ value: "En Linea", label: "En Linea" }]}
                  onSelectChange={(value, selectedOption) =>
                    handleSelectChangeModality(value, selectedOption)
                  }
                />
              )}


            </GridItem>
            <GridItem fontSize={"sm"}>
              {yearVisible && (
                <InputGroup>
                  <InputLeftAddon children="Año" />
                  <Input
                    name="year"
                    type="text"
                    maxLength={4}
                    placeholder="yyyy"
                    onChange={handleChangeYear}
                    value={year}
                  />
                </InputGroup>
              )}

            </GridItem>
          </Grid>
          <Grid
            templateColumns={{ base: "1fr", md: "6fr 4fr" }}
            gap={2}
            mt={2}
          >
            <GridItem fontSize={"sm"}>
              {/* <Textarea value={textValue} /> */}
              <SelectData title="Carrera" options={transformedCarreras}
                onSelectChange={(value, selectedOption) =>
                  handleSelectChangeCareer(value, selectedOption)
                } />

            </GridItem>
            <GridItem fontSize={"sm"}>
              <Link to="/carreras">
                <Button colorScheme="green">Agregar</Button>
              </Link>

            </GridItem>

            <GridItem fontSize={"sm"}>
              <SelectData title="Periodo" options={transformedPeriodos} onSelectChange={(value, selectedOption) =>
                handleSelectChangePeriod(value, selectedOption)
              } />
            </GridItem>
            <GridItem fontSize={"sm"}>
              <Link to="/periodos">
                <Button colorScheme="green">Agregar</Button>
              </Link>
            </GridItem>


          </Grid>
          <Grid
            templateColumns={{ base: "1fr", md: "2fr 4fr" }}
            gap={2}
            mt={2}
          >
            <GridItem fontSize={"sm"}>
              <Center>
                <Text padding={7} fontSize={"2xl"}>Profesionales</Text>
              </Center>
              <Tabl data={professionals} columns={columnsProfessionals} />
            </GridItem>
            <GridItem fontSize={"sm"}>
              <Center>
                <Text padding={2} fontSize={"2xl"}>Enlace para crear Matrices</Text>
              </Center>
              <Center>
                {ButtonCargarCsvVisible ? (
                  <Button
                    type="button"
                    mt={4}
                    bg="ceruleanBlue.500"
                    color={"white"}
                    onClick={handleCSV}
                  >
                    Cargar archivo.csv
                  </Button>
                ) : (
                  <Button
                    type="button"
                    mt={4}
                    bg="red.300"
                    color={"white"}
                    onClick={fetchUsers}
                  >
                    Limpiar Tabla
                  </Button>
                )}
                <Link to="https://drive.google.com/file/d/1tYWSHiKaDsI_QCwAPrpI1dP0nShRps_Y/view?usp=sharing" target="_blank">
              <Button colorScheme={"red"} mt={4}>
                <FaYoutube/>
              </Button>
              </Link> 
              </Center>

              <Input
                type="file"
                ref={hiddenFileInputCSVRef}
                onChange={handleFileChangeCSV}
                accept=".csv"
                hidden
              />


              <Tabl data={createMatriz} columns={columnsCreateMatriz} />
            </GridItem>
            <GridItem colSpan={2} fontSize={"sm"}>
              <Center>
                <Button
                  type="button"
                  mt={4}
                  bg="ceruleanBlue.500"
                  color={"white"}
                  onClick={handleSubmit}  // Reemplaza "tuFuncion" con la función que deseas ejecutar
                >
                  Guardar
                </Button>

              </Center>

            </GridItem>
          </Grid>
        </Box>
        <Flex alignItems="center" gap="2">
          <Box p="2">
            <Heading size="md">Matrices</Heading>
          </Box>
        </Flex>
        <Tabl data={matricesData} columns={columns} />

        <Modal
          isOpen={isSelectModalOpen}
          onAccept={() => setSelectModalOpen(false)}
          title="Seleccione los campos"
          message={alertDialogMessage || 'Por favor, seleccione una carrera, período, modalidad y año.'}
        />

        <Modal
          isOpen={isDeleteUserModalOpen}
          onClose={() => setDeleteUserModalOpen(false)}
          onAccept={deleteMatriz}
          title="Eliminar de la Matriz"
          message={`¿Estás seguro de eliminar a ${DataMatriz ? DataMatriz.professional.firstName : ''} ${DataMatriz ? DataMatriz.professional.firstLastName : ''} de la Matriz?`}
        // message={alertDialogMessage || `¿Estás seguro de eliminar a?`}
        />
      </Box>
    </>
  );
}

export default Matriz;
