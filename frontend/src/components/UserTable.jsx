import Tabl from "./Table";
import { useEffect, useState } from "react";
import { addUser, getUsers, removeUser } from "../api/userRequest";
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
  Image,
  Heading,
  Spacer,
  Flex,
} from "@chakra-ui/react";

import { useAuth } from "../context/AuthContext";
import { FiUserPlus } from "react-icons/fi";
import { EmailIcon } from "@chakra-ui/icons";
import { Link, useNavigate } from "react-router-dom";

function UserTable() {
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
            colorScheme="yellow"
            onClick={() =>
              navigate(`/editar-usuario/${props.row.original.userId}`)
            }
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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userRequest = await getUsers();

        setUsers(userRequest.data.filter((us) => us.userId !== user.userId));
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
            <Heading size="md">Usuarios</Heading>
          </Box>
          <Spacer />

          <Link to="/agregar-usuario">
            <Button
              leftIcon={<FiUserPlus />}
              bg="ceruleanBlue.500"
              color="white"
              _hover={{
                bg: "ceruleanBlue.600",
              }}
            >
              Añadir usuario
            </Button>
          </Link>
        </Flex>
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

export default UserTable;
