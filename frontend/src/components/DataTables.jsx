import React, { useState } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Button,
  Flex,
  Box,
  TableContainer,
  Tfoot,
  Icon,
  Select,
  TableCaption,
  Grid,
GridItem,
} from '@chakra-ui/react';
import { CloseIcon, ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon, ChevronUpIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';


function DataTable({ header, keyValues, data, numberRow = false, defaultRowsPerPage = 10, title = 'Titulo...',
  buttons = { buttonEdit: false, buttonDelete: false, buttonAdd: false, handleDeleteRow: null, handleEditRow: null } }) {

  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = currentPage * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(value); // Resetear a la primera página al cambiar las filas por página
  };

  const filteredData = data.filter((row) =>
    Object.values(row).some(
      (value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  // const endIndex = Math.min(startIndex + rowsPerPage, filteredData.length);


  const sortedData = () => {
    const sortableData = [...filteredData];
    if (sortConfig.key !== null) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  };

  const currentRows = sortedData().slice(startIndex, endIndex);


  const changePage = (page) => {
    if (page < 0 || page >= Math.ceil(filteredData.length / rowsPerPage)) {
      return;
    }
    setCurrentPage(page);
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? (
        <Icon as={ChevronDownIcon} />
      ) : (
        <Icon as={ChevronUpIcon} />
      );
    }
    return null;
  };

  return (
    <>
     <Box p={3} border="1px solid #ccc" borderRadius={8}>
      <Grid gap={2} mt={2} mb={2} templateColumns={{base:"",md:"1fr 13fr" }} >
            <GridItem fontSize={"sm"}>
            <Select w={20} onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </Select>
            </GridItem>
            <GridItem fontSize={"sm"} display="flex">
              <Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <Button onClick={() => setSearchTerm('')} ml={2}>
                <CloseIcon />
              </Button>
            </GridItem>
          </Grid>
      <TableContainer mb={4}>
        <Table size="sm">
        <TableCaption placement='top' fontSize={"xl"} textAlign='left'>
          {title}
        </TableCaption>
          <Thead>
            <Tr>
              {numberRow && <Th>#</Th>}
              {header.map((head, index) => (
                <Th
                  key={index}
                  onClick={() => requestSort(keyValues[index])}
                  cursor="pointer"
                >
                  {head}
                  {getSortIcon(keyValues[index])}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {currentRows.map((row, rowIndex) => (
              <Tr key={rowIndex}>
                {numberRow && <Td>{startIndex + rowIndex + 1}</Td>}
                {keyValues.map((key, keyIndex) => (
                  <Td key={keyIndex}>{row[key]}</Td>
                ))}
                <Td>
                  {buttons.buttonEdit && (
                    <Button
                      type="button"
                      m={1}
                      bg="yellow"
                      _hover={{ bg: "yellow.300" }}
                      color={"white"}
                      onClick={(event) => buttons.handleEditRow(row, event)}
                    >
                      <EditIcon />
                    </Button>
                  )}
                  {buttons.buttonDelete && (
                    <Button
                      type="button"
                      m={1}
                      bg="red"
                      _hover={{ bg: "red.600" }}
                      color={"white"}
                      onClick={(event) => buttons.handleDeleteRow(row,event)}
                    >
                      <DeleteIcon />
                    </Button>
                  )}
                </Td>

              </Tr>
            ))}
          </Tbody>


          <Tfoot>
            <Tr>
              <Td colSpan={header.length + (numberRow ? 1 : 0)}>
                <Flex justify="space-between" alignItems="center">
                  <Box fontSize="sm">
                    Mostrando{' '}
                    {startIndex + 1} a {Math.min(endIndex, filteredData.length)} de{' '}
                    {filteredData.length} datos
                  </Box>
                  <Flex>
                    <Button
                      onClick={() => changePage(currentPage - 1)}
                      mr={2}
                      leftIcon={<ChevronLeftIcon />}
                    >
                      Previous
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <Button
                        key={i}
                        type="button"
                        variant={currentPage === i ? 'solid' : 'outline'}
                        onClick={() => changePage(i)}
                      >
                        {i + 1}
                      </Button>
                    ))}
                    <Button
                      onClick={() => changePage(currentPage + 1)}
                      ml={2}
                      rightIcon={<ChevronRightIcon />}
                    >
                      Next
                    </Button>

                  </Flex>
                </Flex>
              </Td>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    </Box>
    </>
   
  );
}



export default DataTable;
