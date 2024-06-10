import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  ButtonGroup,
  Button,
  Avatar,
  Input,
  Flex,
  Text,
  Center,
  Spacer,
  IconButton,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  FiChevronsLeft,
  FiChevronsRight,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";

import { FiArrowUp, FiArrowDown } from "react-icons/fi";



import { renderCellContent } from "../helpers/date.js";


function Tabl({ data, columns }) {
  const [sort, setSort] = useState([]);
  const [filter, setFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting: sort,
      globalFilter: filter,
    },
    onSortingChange: setSort,
    onGlobalFilterChange: setFilter,
  });

  return (
    <TableContainer>
      <Flex>
        <Center>
          <ButtonGroup size="sm" p={5} isAttached variant="outline">
            <IconButton
              icon={<FiChevronsLeft />}
              onClick={() => table.setPageIndex(0)}
            />
            <IconButton
              icon={<FiChevronLeft />}
              onClick={() => table.previousPage()}
            />
            <Center>
              <Text mx={3}>{table.getState().pagination.pageIndex + 1}</Text>
            </Center>
            <IconButton
              icon={<FiChevronRight />}
              onClick={() => table.nextPage()}
            />
            <IconButton
              icon={<FiChevronsRight />}
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            />
          </ButtonGroup>
        </Center>

        <Spacer />
        <Center>
          <Input
            placeholder="Buscar"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </Center>
      </Flex>
      <Table variant="simple">
        {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
              whiteSpace="normal" // Permite el retorno de línea en lugar de desbordamiento

                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}

                  {
                    { asc: <FiArrowUp />, desc: <FiArrowDown /> }[
                      header.column.getIsSorted() ?? null
                    ]
                  }
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody>
  {table.getRowModel().rows.map((row) => (
    <Tr key={row.id}>
      {row.getVisibleCells().map((cell) => (
        <Td key={cell.id} whiteSpace="normal" p={1}>
          {renderCellContent(cell.column.columnDef.cell, cell.getContext())}
        </Td>
      ))}
    </Tr>
  ))}
</Tbody>
      </Table>
    </TableContainer>
  );
}

export default Tabl;
