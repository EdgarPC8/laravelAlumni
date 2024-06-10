import {
  Badge,
  Box,
  Heading,
  Button,
  ButtonGroup,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import { getLogs } from "../api/logsRequest";
import Tabl from "../components/Table";
import { backup, updateDataBaseRequest } from "../api/configResquest";
import { saveAs } from "file-saver";

function Logger() {
  const toast = useToast();
  const hiddenFileInput = useRef();
  const [fileDb, setFileDb] = useState(null);

  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const loadLogs = async () => {
      const { data } = await getLogs();
      setLogs(data);
    };

    loadLogs();
  }, []);

  const colorsBadge = {
    PUT: "yellow",
    DELETE: "red",
    POST: "green",
  };

  const columns = [
    {
      header: "#",
      accessorKey: "id",
      cell: (props) => props.row.index + 1,
    },
    {
      header: "Método http",
      accessorKey: "httpMethod",
      cell: (props) => (
        <Badge colorScheme={colorsBadge[props.row.original.httpMethod]}>
          {props.row.original.httpMethod}
        </Badge>
      ),
    },
    {
      header: "Punto de acceso",
      accessorKey: "endPoint",
    },
    {
      header: "Sistema",
      accessorKey: "system",
    },
    {
      header: "Descripcion",
      accessorKey: "description",
    },
    {
      header: "Acción",
      accessorKey: "action",
    },
    {
      header: "Fecha",
      accessorKey: "date",
    },
  ];

  const handleBackup = async () => {
    try {
      const { data } = await backup();

      // Lógica para guardar el archivo en una carpeta específica
      saveFileToFolder(data, "./");

      // Puedes mostrar un mensaje de éxito o realizar otras acciones aquí
    } catch (error) {
      console.error("Error al realizar la copia de seguridad:", error);
    }
  };

  const handleFileDb = () => {
    hiddenFileInput.current.click();
  };

  const handleFileChange = (event) => {
    setFileDb(event.target.files[0]);
  };

  const saveFileToFolder = (fileData, folderPath) => {
    const blob = new Blob([JSON.stringify(fileData, null, 2)], {
      type: "application/json",
    });
    const fileName = `backup_alumni${Date.now()}.json`;
    const filePath = `${folderPath}/${fileName}`;

    // Usa la librería file-saver para guardar el archivo
    saveAs(blob, filePath);
  };

  const updateDataBase = async () => {
    // console.log(a);
    toast.promise(updateDataBaseRequest(), {
      loading: {
        title: "Actualizando...",
        position: "top-right",
      },
      success: (d) => ({
        title: "Base de Datos",
        description: d.data.message,
        isClosable: true,
      }),
      error: (e) => ({
        title: "Error",
        description: e.response.data.message,
        isClosable: true,
      }),
    });
  };

  return (
    <Box p={10}>
      <Heading>Actividad del sitio</Heading>
      <Input
        type="file"
        ref={hiddenFileInput}
        onChange={handleFileChange}
        hidden
      />

      <ButtonGroup size="sm" isAttached variant="outline">
        <Button onClick={handleBackup} colorScheme="blue" my={4}>
          Realizar Copia de Seguridad
        </Button>
        <Button my={4} colorScheme="green" onClick={updateDataBase}>
          Actualizar Base de Datos
        </Button>
        <Button my={4} colorScheme="orange" onClick={handleFileDb}>
          Subir Base de Datos
        </Button>
      </ButtonGroup>

      <Tabl data={logs} columns={columns} />
    </Box>
  );
}

export default Logger;
