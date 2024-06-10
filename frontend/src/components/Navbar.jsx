import React from "react";
import {
  Box,
  Button,
  HStack,
  Stack,
  Menu,
  MenuButton,
  Avatar,
  Text,
  MenuList,
  MenuItem,
  useDisclosure,
  MenuDivider,
  IconButton,
  VStack,
  Image,
  Flex,
  Center,
  AvatarBadge,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
  Badge,
} from "@chakra-ui/react";
import { useRef } from "react";

import { Link } from "react-router-dom";

import NavLink from "./NavLink";

import {
  FiHome,
  FiFile,
  FiAward,
  FiFileText,
  FiUser,
  FiLogOut,
  FiTarget,
} from "react-icons/fi";
import { FaYoutube } from "react-icons/fa";
import { PiFiles } from "react-icons/pi";


import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { useAuth } from "../context/AuthContext";
import { urlPhotos } from "../api/axios";
import { FaChartPie } from "react-icons/fa";
import { TbBrandMatrix } from "react-icons/tb";
import { CgCalendarDates } from "react-icons/cg";
import { GiBookPile } from "react-icons/gi";

const Navbar = () => {
  const btnRef = useRef();
  const { isAuthenticated, logout, user, isLoading } = useAuth();

  const { isOpen, onOpen, onClose } = useDisclosure();
  

  const LinksToNoAuth = [
    {
      name: "Inicio",
      path: "/",
      icon: <FiHome />,
    },
    // {
    //   name: "Curriculos",
    //   path: "/curriculos",
    //   icon: <FiHome />,
    // },
  ];

  const Links = {
    programador: [
      {
        name: "Actividad",
        path: "/actividad",
        icon: <FiTarget />,
      },
      {
        name: "Inicio",
        path: "/",
        icon: <FiHome />,
      },
      {
        name: "Usuarios",
        path: "/usuarios",
        icon: <FiUser />,
      },
      {
        name: "Graficos",
        path: "/charts",
        icon: <FaChartPie />,
      },
      {
        name: "Curriculos",
        path: "/curriculos",
        icon: <FiFile />,
      },
      {
        name: "Hoja de Vida",
        path: "/cv",
        icon: <FiAward />,
      },
      {
        name: "Encuesta",
        path: "/quiz",
        icon: <FiFileText />,
      },
      {
        name: "Encuestas",
        path: "/quizzes",
        icon: <PiFiles />,
      },
      {
        name: "Matrices",
        path: "/matriz",
        icon: <TbBrandMatrix />,
      },
      {
        name: "Carreras",
        path: "/carreras",
        icon: <GiBookPile />,
      },
      {
        name: "Periodos",
        path: "/periodos",
        icon: <CgCalendarDates />,
      },
      {
        name: "Tutoriales",
        path: "/tutoriales",
        icon: <FaYoutube />,
      },
    ],

    administrador: [
      {
        name: "Inicio",
        path: "/",
        icon: <FiHome />,
      },
      {
        name: "Graficos",
        path: "/charts",
        icon: <FaChartPie />,
      },
      {
        name: "Curriculos",
        path: "/curriculos",
        icon: <FiFile />,
      },
      {
        name: "Hoja de Vida",
        path: "/cv",
        icon: <FiAward />,
      },
      {
        name: "Encuesta",
        path: "/quiz",
        icon: <FiFileText />,
      },
      {
        name: "Encuestas",
        path: "/quizzes",
        icon: <PiFiles />,
      },
      {
        name: "Matrices",
        path: "/matriz",
        icon: <TbBrandMatrix />,
      },
      {
        name: "Carreras",
        path: "/carreras",
        icon: <GiBookPile />,
      },
      {
        name: "Periodos",
        path: "/periodos",
        icon: <CgCalendarDates />,
      },
      {
        name: "Tutoriales",
        path: "/tutoriales",
        icon: <FaYoutube />,
      },
    ],
    profesional: [
      {
        name: "Hoja de Vida",
        path: "/cv",
        icon: <FiAward />,
      },
      {
        name: "Encuesta",
        path: "/quiz",
        icon: <FiFileText />,
      },
    ],
  };

  return (
    <>
      <Box p={2}>
        <Flex alignItems="center" justifyContent={"space-between"}>
          <HStack spacing={8} alignItems={"center"}>
            <IconButton
              size={"md"}
              icon={<HamburgerIcon />}
              aria-label={"Open Menu"}
              ref={btnRef}
              onClick={onOpen}
            />

            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              <Image
                borderRadius="full"
                boxSize="50px"
                src="http://www.marianosamaniego.edu.ec/eva/pluginfile.php/1/core_admin/logo/0x200/1679244973/logoistms.jpeg"
                // src="../public/logoistms.jpeg"
                alt="Dan Abramov"
              />
              {!isAuthenticated &&
                LinksToNoAuth.map((link) => (
                  <Link to={link.path} key={link.name}>
                    <NavLink>{link.name}</NavLink>
                  </Link>
                ))}
            </HStack>
          </HStack>

          {isAuthenticated ? (
            <Flex>
              <Center>
                <Badge colorScheme="purple" mr={5}>
                  {user.loginRol}
                </Badge>
                <Link to="/perfil">
                  <Avatar
                    size={"sm"}
                    mr="10px"
                    src={`${urlPhotos}/${user.photo}`}
                  >
                    <AvatarBadge boxSize="1.25em" bg="green.500" />
                  </Avatar>
                </Link>
              </Center>
            </Flex>
          ) : isOpen ? (
            ""
          ) : (
            <Flex alignItems="center">
              <HStack spacing={4}>
                <Link to="/register">
                  <Button>Registrarse</Button>
                </Link>
                <Link to="/login">
                  <Button>Iniciar Sesión</Button>
                </Link>
              </HStack>
            </Flex>
          )}
        </Flex>
      </Box>

      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          
          

          <DrawerBody>
            {!isLoading && isAuthenticated ? (
              <Stack align="start" spacing={4} flex="1" mr={4}>
                {user.loginRol && (
                  Links[user.loginRol].map((link) => (
                    <Link to={link.path} key={link.name} onClick={onClose}>
                      <NavLink icon={link.icon}>{link.name}</NavLink>
                    </Link>
                  ))
                ) }
              </Stack>
            ) : (
              <Stack align="start" spacing={4} flex="1" mr={4}>
                {LinksToNoAuth.map((link) => (
                  <Link to={link.path} key={link.name} onClick={onClose}>
                    <NavLink icon={link.icon}>{link.name}</NavLink>
                  </Link>
                ))}
              </Stack>
            )}
          </DrawerBody>

          <DrawerFooter>
            {isAuthenticated ? (
              <Link to="/login">
                <IconButton icon={<FiLogOut />} onClick={logout} />
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button onClick={onClose}>Registrarse</Button>
                </Link>
                <Link to="/login">
                  <Button onClick={onClose} mr={4}>
                    Iniciar Sesión
                  </Button>
                </Link>
              </>
            )}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Navbar;
