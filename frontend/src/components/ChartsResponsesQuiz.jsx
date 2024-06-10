import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Sector, Cell } from 'recharts';
import {
    Box,
    Heading,
    Flex,
    Text,
    Grid,
    GridItem,
    Stack,
    Button,
    Center,
} from "@chakra-ui/react";
import {
    getProfesionalsCareers,
    getAllResponses
} from "../api/chartsResquest.js";
import { useEffect, useState, useRef } from "react";

import ChartPastel from "./ChartPastel.jsx";

import Tabl from "./Table";
import { getMatrizQuizFilter,getMatrizFilter } from "../api/matrizResquest";


import { getAllQuizzes,addQuiz,editQuiz } from "../api/quizResquest";

const data01 = [
    { name: 'Si', value: 25 },
    { name: 'No', value: 43 },
];

const questionToFilter = [1,2,3,4,8,9,15,22,27,28];


function ChartsResponsesQuiz() {

  const [Responses, setResponses] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [TitleAndDescription, setTitleAndDescription] = useState(null);

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
            colorScheme="green"
            onClick={() => {
              handleEditRow(props.row.original);
            }}
          >
            Ver Resultados
          </Button>
        </Stack>
      ),
    },
  ];
        
  function groupByQuestionId(data) {
    const groupedData = {};
  
    data.forEach((item) => {
      const idQuestion = item.question.idQuestion;
      const questionText = item.question.questionText; // Obtener el texto de la pregunta
  
      if (!groupedData[idQuestion]) {
        groupedData[idQuestion] = {
          TextQuestion: questionText,
          responses: [],
        };
      }
  
      groupedData[idQuestion].responses.push(item.textResponse);
    });
  
    return groupedData;
  }
  
  function countTextResponses(groupedData) {
    
    const countData = {};
  
    Object.keys(groupedData).forEach((idQuestion) => {
        const questionData = groupedData[idQuestion];
        const responses = questionData.responses;
    
        const responseCounts = responses.reduce((acc, response) => {
          if (!acc[response]) {
            acc[response] = 1;
          } else {
            acc[response]++;
          }
    
          return acc;
        }, {});
        countData[idQuestion] = {
          TextQuestion: questionData.TextQuestion,
          responses: Object.keys(responseCounts).map((textResponse) => ({
            name: textResponse,
            value: responseCounts[textResponse],
          })),
        };
      
    });
  
    return countData;
  }
  const handleEditRow =async (row) => {
    // console.log(row)
    const resPeriods = await getAllResponses(row.idQuiz);
    const responseData = resPeriods.data;
    const groupedByQuestionId = groupByQuestionId(responseData);
    const countedResponses = countTextResponses(groupedByQuestionId);
    setResponses(countedResponses);

    setTitleAndDescription(

      (
        <>
          <Center>
            <Heading as="h2" size="2xl">
              {row.title}
            </Heading>
          </Center>
          <Box>
            <Center>
              {row.date}
            </Center>
          </Box>
          <Box>
            <Center>
              {row.description}
            </Center>
          </Box>
        </>
      )
    )
  };
  function contarTareasCompletadas(tareas) {
    // console.log(tareas)
    // Inicializar contadores
    let completadas = 0;
    let noCompletadas = 0;
  
    // Recorrer el array de objetos
    for (let i = 0; i < tareas.length; i++) {
      // Verificar el valor de la propiedad 'completed'
      if (tareas[i].completed === 1) {
        completadas++;
      } else if (tareas[i].completed === 0) {
        noCompletadas++;
      }
      // Puedes agregar más condiciones si hay otros valores posibles de 'completed'
    }
  
    // Devolver el resultado como un objeto
    return {
      completadas: completadas,
      noCompletadas: noCompletadas
    };
  }
  
  // // Ejemplo de uso
  // const arrayDeTareas = [
  //   { id: 1, completed: 1 },
  //   { id: 2, completed: 0 },
  //   { id: 3, completed: 1 },
  //   // ... más objetos
  // ];
  
  // const resultado = contarTareasCompletadas(arrayDeTareas);
  // console.log("Completadas: " + resultado.completadas);
  // console.log("No completadas: " + resultado.noCompletadas);



  async function getMatrizQuizCompleted(id) {
    try {
      
         const res = await getMatrizQuizFilter(id);
        // console.log(res.data)
        return res.data;
      

    } catch (error) {
        console.error("Error al obtener datos académicos:", error);
    }
}
  

    async function fetchData() {
        try {
            const resQuizzes = await getMatrizQuizFilter(0);
            setQuizzes(resQuizzes.data)
            // console.log(resQuizzes.data)
          

        } catch (error) {
            console.error("Error al obtener datos académicos:", error);
        }
    }
    useEffect(() => {
        fetchData();
    }, []);
   
    

    

    return (
      <Box>
        <Tabl data={quizzes} columns={columns} />
        {TitleAndDescription&&TitleAndDescription}
        <Grid
          templateColumns={{ base: "1fr", md: "4fr 4fr" }}
          gap={2}
          mt={2}
        >
          {Responses && Object.keys(Responses).map((key) => {
      if(questionToFilter.includes(Number(key))){
        // console.log(key)
        const element = Responses[key];
        // Puedes pasar el elemento como prop a ChartPastel y renderizarlo dentro del componente
        return (
          <GridItem key={key} fontSize={"sm"}>
            <ChartPastel title={element.TextQuestion} data={element.responses} />
          </GridItem>
        );
      }
           
          })}
        </Grid>
      </Box>
    );
      
}

export default ChartsResponsesQuiz;




