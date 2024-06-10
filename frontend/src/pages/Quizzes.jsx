import Tabl from "../components/Table";
import { useEffect, useState } from "react";
import { getAllQuizzes,addQuiz,editQuiz } from "../api/quizResquest";
import { getAllMatriz,getAllPeriods,getAllCareers,getMatrizFilter,addMatrizQuiz,getMatrizQuizFilter,deleteMatrizQuiz } from "../api/matrizResquest";
import { useRef } from "react";
import SelectData from "../components/SelectData";
import { FaYoutube } from "react-icons/fa";
import {
  Button,
  useDisclosure,
  AlertDialog,
  Grid,
  GridItem,
  Stack,
  useToast,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Flex,
  Box,
  Heading,
  Input,
  InputLeftAddon,
  InputGroup,
  Textarea,
  Checkbox,
  Center,

} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";

function Quizzes() {
  const toast = useToast();
  const [quizzes, setQuizzes] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentUser, setCurrentUser] = useState({});
  const cancelRef = useRef();
  const form = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [id, setId] = useState(0);
  const [matriz, setMatriz] = useState([]);
  const [matrizFilterQuiz, setMatrizFilterQuiz] = useState([]);
  const [Periods, setPeriods] = useState([]);
  const [Careers, setCareers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedOptionCareer, setSelectedOptionCareer] = useState(null);
  const [selectedOptionPeriod, setSelectedOptionPeriod] = useState(null);






  const columns = [
    {
      header: "Id",
      accessorKey: "idQuiz",
      cell: (props) => props.row.index + 1,
    },
    {
      header: "Titulo",
      accessorKey: "title",
    },
    {
      header: "Descripción",
      accessorKey: "description",
    },
    {
      header: "Fecha",
      accessorKey: "date",
    },
    {
      header: "Enviados a",
      cell: (props) => {
        return `${props.row.original.matrices.length} Profesionales`
      },
    },
    {
      header: "Acción",

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
              setCurrentUser(props.row.original);
              onOpen();
            }}
          >
            Eliminar
          </Button>
        </Stack>
      ),
    },
  ];
  const columnsCreateMatriz = [
    {
      header: "#",
      accessorKey: "index",
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
      header: () => (
        <>
       <Checkbox
            isChecked={selectAll}
            onChange={handleSelectAll}
         />
        </>
        
      ),
      accessorKey: "selectAll",
      cell: (props) => (
        <Center>
          <Stack spacing={4} direction="row" align="center">
            <Checkbox
              isChecked={selectAll || props.row.original.isSelected}
              onChange={() => handleCheckboxChange(props.row.index)}
            />
          </Stack>
        </Center>
      ),
    },
  ];
  let initialFormQuiz = {
    title: "",
    description: "",
    date: "",
  };
  const handleSelectAll = () => {
    const updatedMatriz = matriz.map((item) => ({ ...item, isSelected: !selectAll }));
    setMatriz(updatedMatriz);
    setSelectAll(!selectAll);
  
    const selected = updatedMatriz.filter((item) => item.isSelected);
    setSelectedItems(selected);
  };

  const handleCheckboxChange = (index) => {
    const updatedMatriz = matriz.map((item, i) => {
      if (i === index) {
        return { ...item, isSelected: !item.isSelected };
      }
      return item;
    });
    setMatriz(updatedMatriz);
  
    const selected = updatedMatriz.filter((item) => item.isSelected);
  
    setSelectAll(selected.length === matriz.length); // Actualizar selectAll en consecuencia
  
    setSelectedItems(selected);
  };
  

 
  const transformedPeriodos = Periods.map(item => ({
    value: item.id,
    label: `${item.name}`,
  }));
  const transformedCarreras = Careers.map(item => ({
    value: item.idCarreer,
    label: `${item.name}`,
  }));
  const [formQuiz, setFormQuiz] = useState(
    initialFormQuiz
  );
  const handleSelectChangePeriod =async (value, selectedOption) => {

    selectAll?handleSelectAll():null;

    // Verifica si la primera opción está seleccionada
    if (selectedOption === "Seleccione una opción") {
      // Agrega aquí la lógica que deseas ejecutar cuando se selecciona la primera opción
        setSelectedOptionPeriod(null);
        if(!selectedOptionCareer){
          const res = await getMatrizFilter({})
          setMatriz(res.data);
        }else{
          const res = await getMatrizFilter({career:selectedOptionCareer.id})
          setMatriz(res.data);
        }
    }else{
      // whereFilter.career? whereFilter.idPeriod=value: setWhereFilter({idPeriod:value});
      setSelectedOptionPeriod({ id: value, name: selectedOption });

      if(!selectedOptionCareer){
        const res = await getMatrizFilter({idPeriod:value})
        setMatriz(res.data);
      }else{
        const res = await getMatrizFilter({idPeriod:value,career:selectedOptionCareer.id})
        setMatriz(res.data);
      }


    }
  
    // Actualiza el estado normalmente
  };
  const handleSelectChangeCareer =async (value, selectedOption) => {
    selectAll?handleSelectAll():null;

    // Verifica si la primera opción está seleccionada
    if (selectedOption === "Seleccione una opción") {
      // Agrega aquí la lógica que deseas ejecutar cuando se selecciona la primera opción
        setSelectedOptionCareer(null);
        if(!selectedOptionPeriod){
          const res = await getMatrizFilter({})
          setMatriz(res.data);
        }else{
          const res = await getMatrizFilter({idPeriod:selectedOptionPeriod.id})
          setMatriz(res.data);
        }
    }else{
      setSelectedOptionCareer({ id: value, name: selectedOption });

      if(!selectedOptionPeriod){
        const res = await getMatrizFilter({career:value})
        setMatriz(res.data);
      }else{
        const res = await getMatrizFilter({idPeriod:selectedOptionPeriod.id,career:value})
        setMatriz(res.data);
      }
      
    }
  
    // Actualiza el estado normalmente
  };
  // const handleDelete = async () => {
  //   // Obtener los idMatriz de los elementos desmarcados
  //   const deselectedItems = matrizFilterQuizData
  //     .filter(item => !item.isSelected)
  //     .map(item => item.idMatriz);
  
  //   try {
  //     // Eliminar las filas de la tabla MatrizQuiz
  //     await deleteMatrizQuiz(deselectedItems);
  
  //     // Actualizar matrizFilterQuizData después de la eliminación
  //     const updatedMatrizFilterQuizData = matrizFilterQuizData.filter(item => item.isSelected);
  //     setMatrizFilterQuiz(updatedMatrizFilterQuizData);
  //   } catch (error) {
  //     console.error("Error al eliminar filas de la tabla MatrizQuiz:", error);
  //   }
  // };
  
  
  const handleEditRow =async (row) => {
    const {
      title,
      description,
      date,
    } = row;
    form.current.scrollIntoView({ behavior: "smooth", block: "start" });
    // console.log(row.idQuiz)
    setMatriz([]);
    setMatrizFilterQuiz([]);


    const resFilete = await getMatrizQuizFilter(row.idQuiz);
    const matrizFilterQuizData = resFilete.data;

    // Comparar y establecer isSelected en consecuencia
    const updatedMatriz = matriz.map((item) => ({
      ...item,
      isSelected: matrizFilterQuizData.some((filterItem) => filterItem.idMatriz === item.id),
    }));

    setMatriz(updatedMatriz);
    setMatrizFilterQuiz(matrizFilterQuizData);
    setIsEditing(true);
    setId(row.idQuiz);
    setFormQuiz({
      title,
      description,
      date,
    });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    // console.log("Registros Seleccionados:", selectedItems);
   


    if (isEditing) {
      // Filtrar los elementos que ya están en matrizFilterQuiz
      const newSelectedItems = selectedItems.filter(
        (selectedItem) => !matrizFilterQuiz.some((filterItem) => filterItem.idMatriz === selectedItem.id)
      );
      // Filtrar los elementos que ya estaban seleccionados y ahora están deseleccionados
      const deselectedItems = matrizFilterQuiz.filter(
        (selectedItem) => !selectedItems.some((item) => item.id === selectedItem.idMatriz)
      );
    
      // Resto del código...
    
      // console.log(deselectedItems); // Imprimir deselectedItems en la consola
    
      // Realizar la edición solo para los nuevos elementos
      toast.promise(editQuiz(id, formQuiz), {
        loading: {
          title: "Editando...",
          position: "top-right",
        },
        success: (d) => {
          newSelectedItems.forEach((element) => {
            addMatrizQuiz({ idMatriz: element.id, quizId: id });
          });
          deselectedItems.forEach((element) => {
            if(element.completed==0){
              deleteMatrizQuiz(element.idMatriz,element.quizId);
            }
          });
          fetchUsers();
          clear();
    
          return {
            title: "Encuesta",
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

    toast.promise(addQuiz(formQuiz), {
      loading: {
        title: "Añadiendo...",
        position: "top-right",
      },
      success: (d) => ({
        title: "Encuesta",
        description: d.data.message,
        isClosable: true,
      }),
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
      const resMatriz = await getAllMatriz();
      const resQuizzes = await getMatrizQuizFilter(0);
      setQuizzes(resQuizzes.data)
      setMatriz(resMatriz.data);
      const resCareers = await getAllCareers();
      const resPeriods = await getAllPeriods();
      
     
      
      setCareers(resCareers.data)
      setPeriods(resPeriods.data)
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
        <Link to="https://drive.google.com/file/d/1PX_UWgZs_8boMl629Zlh0AVpmh43VmDY/view?usp=sharing" target="_blank">
              <Button colorScheme={"red"}>
                Tutorial
                <FaYoutube/>
              </Button>
            </Link> 
          <form onSubmit={handleSubmit} ref={form}>
            <Grid
              templateColumns={{ base: "1fr", md: "2fr 2fr" }}
              gap={2}
              mt={2}
            >
              <GridItem fontSize={"sm"}>
                <InputGroup>
                  <InputLeftAddon children="Titulo" />
                  <Input type="text" placeholder="Titulo" name="title" value={formQuiz.title ? formQuiz.title : ""}
                    onChange={handleChange} />
                </InputGroup>
              </GridItem>
              <GridItem fontSize={"sm"}>
                <InputGroup>
                  <InputLeftAddon children="Fecha" />
                  <Input placeholder="Fecha" size="md" type="date" name="date" value={
                    formQuiz.date ? formQuiz.date : ""
                  }
                  onChange={handleChange}
                  required/>
                </InputGroup>
              </GridItem>
              <GridItem fontSize={"sm"} colSpan={2}>
                {/* <InputLeftAddon children="Descripción" /> */}
                <Textarea name="description" placeholder="Descripción" value={formQuiz.description ? formQuiz.description : ""}
                    onChange={handleChange} ></Textarea>
              </GridItem>

                            {
                isEditing ?
                (
                  <>
                    <GridItem fontSize={"sm"}>
                      <SelectData title="Periodo" options={transformedPeriodos} onSelectChange={(value, selectedOption) =>
                        handleSelectChangePeriod(value, selectedOption)
                      } />
                    </GridItem>
                    <GridItem fontSize={"sm"}>
                      <SelectData title="Carrera" options={transformedCarreras} onSelectChange={(value, selectedOption) =>
                        handleSelectChangeCareer(value, selectedOption)
                      } />
                    </GridItem>
                    <GridItem fontSize={"sm"} colSpan={2}>
                      Tabla de Matrices
                      <Tabl data={matriz} columns={columnsCreateMatriz} />
                    </GridItem>
                  </>
                ) : null
              }
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
        <Flex alignItems="center" gap="2">
          <Box p="2">
            <Heading size="md">Encuestas</Heading>
          </Box>
        </Flex>
        <Tabl data={quizzes} columns={columns} />


        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay bg="blackAlpha.300" backdropFilter="blur(10px)">
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Eliminar Encuesta
              </AlertDialogHeader>

              <AlertDialogBody>
                ¿Estás seguro de eliminar ha {currentUser.firstName}
                {currentUser.firstLastName}?
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancelar
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => {
                    deleteUser();
                    onClose();
                  }}
                  ml={3}
                >
                  Eliminar
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Box>
    </>
  );
}

export default Quizzes;
