import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Sector, Cell } from 'recharts';
import {
    Box,
    Heading,
    Flex,
    Text,
} from "@chakra-ui/react";
import {
    getProfesionalsCareers,
} from "../api/chartsResquest.js";
import { useEffect, useState, useRef } from "react";

const data01 = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
    { name: 'Group D', value: 200 },
];
const data02 = [
    { name: 'F', value: 100 },
    { name: 'M', value: 300 },
    { name: 'F', value: 100 },
    { name: 'M', value: 200 },
    { name: 'F', value: 120 },
    { name: 'M', value: 180 },
    { name: 'F', value: 30 },
    { name: 'M', value: 170 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const GENDER_COLORS = {
    'F': '#FF1493', // Rosa para F
    'M': '#0000FF', // Azul para M
    // Puedes agregar más colores para otros géneros si es necesario
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + (radius + 10) * Math.cos(-midAngle * RADIAN); // Ajuste en x
    const y = cy + (radius + 10) * Math.sin(-midAngle * RADIAN); // Ajuste en y

    return (
        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="middle">
            {`${(percent * 100).toFixed(2)}%`}
        </text>
    );
};



function ChartsCareers() {
    const [ListGroupCareers, setListGroupCareers] = useState([]);

    async function fetchData() {
        try {
            const { data } = await getProfesionalsCareers();
            let countByCareers = {};
            data.forEach(student => {
                if (!countByCareers[student.career]) {
                    countByCareers[student.career] = {
                        totalStudents: 0,
                        genderCounts: {
                            'F': 0,
                            'M': 0
                        }
                    };
                }

                countByCareers[student.career].totalStudents++;

                // Check if the gender value is either 'F' or 'M' before incrementing
                if (student.gender === 'F' || student.gender === 'M') {
                    countByCareers[student.career].genderCounts[student.gender]++;
                } else {
                    // Handle unexpected gender values by incrementing an 'other' count or any other action needed
                    // For example, incrementing an 'other' count:
                    countByCareers[student.career].genderCounts['Other'] = (countByCareers[student.career].genderCounts['Other'] || 0) + 1;
                }
            });

            // Transforming data into the desired format

            let data03 = Object.keys(countByCareers).map(career => {
                return {
                    name: career,
                    value: countByCareers[career].totalStudents,
                };
            });
            let data04 = Object.keys(countByCareers).flatMap(career => {
                const genderCounts = countByCareers[career].genderCounts;
                return Object.keys(genderCounts)
                    .filter(gender => genderCounts[gender] !== 0) // Filtrar valores diferentes de cero
                    .map(gender => ({
                        name: `${career} ${gender}`,
                        value: genderCounts[gender]
                    }));
            });
            
            setListGroupCareers([data03, data04])
        } catch (error) {
            console.error("Error al obtener datos académicos:", error);
        }
    }
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Box>
            <Heading textAlign={"center"}>
                Representacion grafica de las carreras
            </Heading>
            <Flex justifyContent="center" alignItems="center" mt={5}>
                <Box>
                    <Flex direction="column">
                        <Heading mb={5} size="sm">Carreras</Heading>
                        {
                            ListGroupCareers && ListGroupCareers[0] && ListGroupCareers[0].length > 0 &&
                            ListGroupCareers[0].map((entry, index) => (
                                <Flex align="center" key={`legend-${index}`} mb={2}>
                                    <Box w="20px" h="20px" bg={COLORS[index % COLORS.length]} mr={2} borderRadius="4px" />
                                    <Text fontSize="sm">{entry.name}({entry.value})</Text>
                                </Flex>
                            ))
                        }
                    </Flex>
                    <Flex direction="column">
                        <Heading size="sm">Genero</Heading>
                        <Flex align="center" mb={2}>
                            <Box w="20px" h="20px" bg={GENDER_COLORS.F} mr={2} borderRadius="4px" />
                            <Text mr={10} fontSize="sm">Mujeres</Text>
                            <Box w="20px" h="20px" bg={GENDER_COLORS.M} mr={2} borderRadius="4px" />
                            <Text fontSize="sm">Hombres</Text>
                        </Flex>
                    </Flex>
                </Box>
                <Box m={5} width="xl">
                    <Heading size="sm" textAlign={"center"}>Gráfico</Heading>
                    <ResponsiveContainer width="100%" height={350}>
                        <PieChart width={400} height={400}>
                            <Pie
                                data={ListGroupCareers && ListGroupCareers[0] && ListGroupCareers[0].length > 0 &&
                                    ListGroupCareers[0]}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomizedLabel}
                                outerRadius={110}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {ListGroupCareers && ListGroupCareers[0] && ListGroupCareers[0].length > 0 &&
                                    ListGroupCareers[0].map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                            </Pie>
                            <Pie
                                data={ListGroupCareers && ListGroupCareers[1] && ListGroupCareers[1].length > 0 && ListGroupCareers[1]}
                                dataKey="value"
                                cx="50%"
                                cy="50%"
                                innerRadius={120}
                                outerRadius={140}
                                fill="#82ca9d"
                                label
                            >
                                {ListGroupCareers && ListGroupCareers[1] && ListGroupCareers[1].length > 0 &&
                                    ListGroupCareers[1].map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={GENDER_COLORS[entry.name.charAt(entry.name.length - 1)]} />
                                    ))
                                }
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </Box>
            </Flex>
        </Box>
    );
}

export default ChartsCareers;




