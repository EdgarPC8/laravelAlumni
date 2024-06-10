import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,PieChart, Pie, Sector, Cell  } from 'recharts';
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
  Stack,
  Radio,
  Flex,
  FormControl,
  FormLabel,
  Checkbox,
} from "@chakra-ui/react";
import ChartsCareers from "../components/ChartsCareers.jsx";
import ChartsResponsesQuiz from "../components/ChartsResponsesQuiz.jsx";


function Chart(){
  return (
    <Box margin={10}>
      <ChartsResponsesQuiz/>
    </Box>
    
  );
};

export default Chart;






