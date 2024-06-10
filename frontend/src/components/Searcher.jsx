import React, { useState, useEffect } from 'react';
import { Input, Box, Text, Portal } from '@chakra-ui/react';

const Searcher = ({ placeholder = 'Buscar', data = [],name="" }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const inputRef = React.useRef(null);

  useEffect(() => {
    const results = data.filter(item =>
      item.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5); // Limit to 5 results

    setSearchResults(results);
  }, [searchTerm, data]);

  useEffect(() => {
    if (inputRef.current) {
      const inputPosition = inputRef.current.getBoundingClientRect();
      setPosition({
        top: inputPosition.bottom + window.scrollY,
        left: inputPosition.left + window.scrollX,
      });
    }
  }, [showResults]);

  const handleInputChange = event => {
    setSearchTerm(event.target.value);
    setShowResults(!!event.target.value);
  };

  const handleItemClick = value => {
    setSearchTerm(value);
    setShowResults(false);
  };

  return (
    <Box position="relative" width="100%">
      <Input
        name={name}
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleInputChange}
        ref={inputRef}
        width="100%" // Establecer el ancho al 100%
      />
      {showResults && (
        <Portal>
          <Box
            style={{
              position: 'absolute',
              top: `${position.top}px`,
              left: `${position.left}px`,
              zIndex: '9999', // Valor alto para z-index
              width: inputRef.current ? inputRef.current.offsetWidth : 'unset',
              maxWidth: '100%', // Establecer el ancho máximo
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
              borderRadius: '4px',
              padding: '4px', // Ajusta el padding interno
              maxHeight: '200px', // Altura máxima para el cuadro de búsqueda
              overflowY: 'auto', // Agrega scroll si hay muchos resultados
              backgroundColor: 'white',
              display: searchResults.length ? 'block' : 'none',
            }}
          >
            {searchResults.map((result, index) => (
              <Text
                key={index}
                p="2"
                cursor="pointer"
                borderBottom={index < searchResults.length - 1 ? '1px solid #E2E8F0' : 'none'}
                _hover={{ bg: '#EDF2F7' }}
                onClick={() => handleItemClick(result)}
              >
                {result}
              </Text>
            ))}
          </Box>
        </Portal>
      )}
    </Box>
  );
};

export default Searcher;
