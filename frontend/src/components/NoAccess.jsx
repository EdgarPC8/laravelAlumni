import {
  Box,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";

function NoAccess() {
  return (
    <Box m={3}>
      <Alert
        borderRadius="md"
        status="error"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="300px"
      >
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          Error
        </AlertTitle>
        <AlertDescription maxWidth="sm">No tiene acceso</AlertDescription>
      </Alert>
    </Box>
  );
}

export default NoAccess;
