import Tabl from "../components/Table";
import DataTable from "../components/DataTables";
import { useEffect, useState } from "react";
import { addUser, getUsers, removeUser } from "../api/userRequest";
import { getAllProfessionals } from "../api/professionalRequest";
import { urlPhotos } from "../api/axios";
import { useRef } from "react";
import {
  Button,
  useDisclosure,
  AlertDialog,
  Avatar,
  Grid,
  GridItem,
  Stack,
  useToast,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Box,
  Heading,
  Spacer,
  Flex,
} from "@chakra-ui/react";
import { FaEye } from "react-icons/fa";

import { useAuth } from "../context/AuthContext";
import { FiUserPlus } from "react-icons/fi";
import { EmailIcon } from "@chakra-ui/icons";
import { Link, useNavigate } from "react-router-dom";


function Resumes() {
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  const [users, setUsers] = useState([]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [currentUser, setCurrentUser] = useState({});
  const cancelRef = useRef();

  const deleteUser = () => {
    toast.promise(removeUser(currentUser.userId), {
      loading: {
        title: "Eliminando...",
        position: "top-right",
      },
      success: (d) => ({
        title: "Usuario",
        description: d.data.message,
        isClosable: true,
      }),
      error: (e) => ({
        title: "Error",
        description: e.response.data.message,
        isClosable: true,
      }),
    });

    setUsers(users.filter((user) => user.userId !== currentUser.userId));
  };

  const columns = [
    {
      header: "Id",
      accessorKey: "userId",
      cell: (props) => props.row.index + 1,
    },
    {
      header: "Cédula",
      accessorKey: "ci",
    },

    {
      header: "Nombres Completos",
      accessorKey: "fullname",
      accessorFn: (row) =>
        `
        ${row.firstName} ${row.secondName} ${row.firstLastName} ${row.secondLastName}`,
    },

    {
      header: "Foto",
      accessorKey: "photo",
      cell: (props) => (
        <Avatar
          name={props.row.original.firstName}
          src={
            props.row.original.photo &&
            `${urlPhotos}/${props.row.original.photo}`
          }
        />
      ),
    },
    {
      header: "Acción",

      cell: (props) => (
        <Stack spacing={4} direction="row" align="center">

          <Button
            colorScheme="red"
            leftIcon={<FaEye />}
            onClick={() =>
              navigate(`/cvProfessionalPdf/${props.row.original.userId}`)
            }
          >
            PDF
          </Button>
        </Stack>
      ),
    },
  ];


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userRequest = await getAllProfessionals();

        setUsers(userRequest.data);
        // console.log(users);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, [user]);
  



  return (
    <>
 

      <Box p={10}>
        <Flex alignItems="center" gap="2">
          <Box p="2">
            <Heading size="md">Curriculos</Heading>
          </Box>
          <Spacer />
         
        </Flex>

        {/* <DataTable header={headerprueba} keyValues={valuesprueba} data={["ddsdsd","dsdsdsssss"]}></DataTable> */}

        <Tabl data={users} columns={columns} />

        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay bg="blackAlpha.300" backdropFilter="blur(10px)">
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Eliminar Usuario
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

export default Resumes;
