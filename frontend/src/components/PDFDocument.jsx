import React from 'react';
import { PDFViewer, Document, Page, Text, View, StyleSheet,Image } from '@react-pdf/renderer';
import { urlPhotos } from "../api/axios";
import { reorderDateString } from "../helpers/date.js";



const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    Infocol: {
        width: '70%', // Ancho para los datos personales
    },
    photoCol: {
        width: '30%', // Ancho para la foto
    },
    page: {
        flexDirection: 'column',
        padding: 30,
    },
    section: {
        marginBottom: 10,
    },
    titleInstitution: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
    },
    heading: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
    },
    subTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    inputGroup: {
        marginBottom: 8,
        alignItems: 'flex-start',
        flexDirection: 'row', // Para alinear elementos en fila
        justifyContent: 'flex-start', // Para alinear elementos en el inicio de la fila
    },
    inputLabel: {
        width: 160, // Ancho del label
        fontSize: 10,
        marginRight: 5, // Espacio a la derecha del label
    },
    input: {
        fontSize: 10,
    },
    photo: {
        width: 148,
        height: 184,
        marginTop:20,
      },
    table: {
        width: '100%',
        marginBottom: 10,
        borderTop: 1,
        borderRight: 1,
        borderColor: '#000',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#000',

    },
    tableColTh: {
        fontSize: 10,
        flex: 1,
        padding: 5,
        textAlign: 'center',
        backgroundColor: '#f2f2f2', // Color de fondo para los encabezados
        borderLeftWidth: 1,
        borderColor: '#000',
    },
    tableColTd: {
        fontSize: 10,
        flex: 1,
        padding: 5,
        textAlign: 'center',
        borderLeftWidth: 1,
        borderColor: '#000',
    },
});

const PDFDocument = ({ data,cv }) => {
    const imageURL = `${urlPhotos}/${data.image}`;
    const personalInfo = [
        { label: 'Cedula', value: data.ci },
        { label: 'Primer Apellido', value: data.firstName },
        { label: 'Segundo Apellido', value: data.secondName },
        { label: 'Primer Nombre', value: data.firstLastName },
        { label: 'Segundo Nombre', value: data.secondLastName },
        { label: 'Genero', value: data.gender },
        { label: 'Tipo de Sangre', value: data.bloodType },
        { label: 'Fecha de nacimiento', value: data.birthDate },
        { label: 'Estado Civil', value: data.civilStatus },
        { label: 'Nacionalidad', value: data.nationality },
        { label: 'Teléfono de domicilio', value: data.homePhone },
        { label: 'Teléfono de celular', value: data.cellPhone },
        { label: 'Lugar de Nacimiento', value: data.placeBirth },
        { label: 'Dirección de domicilio', value: data.direction },
        { label: 'Lugar de residencia', value: data.placeResidence },
        { label: 'Correo Institucional', value: data.institutionalEmail },
        { label: 'Correo Personal', value: data.personalEmail },
    ];

    // const FormacionAcademica = {
    //     header: [
    //         { width: '50%', title: 'Tipo' },
    //         { width: '50%', title: 'Titulo Obtenido' },
    //         { width: '50%', title: 'Institucion educativa' },
    //         { width: '50%', title: 'Fecha' },
    //         { width: '50%', title: 'Lugar' },
    //         { width: '50%', title: 'Pais' },
    //         { width: '50%', title: 'Nro' },
    //     ],
    //     values: [
    //         { 0: "dedede", 1: "Todededrres", 2: "deded", 3: "bng", 4: "gfhfgh", 5: "fghfgh", 6: "hgfhfgh", },
    //     ],
    // }
    // const ExperienciaDocente = {
    //     header: [
    //         { width: '50%', title: 'Institución' },
    //         { width: '50%', title: 'Materia' },
    //         { width: '50%', title: 'Fecha Inicio' },
    //         { width: '50%', title: 'Fecha Fin' },
    //         { width: '50%', title: 'Modalidad' },
    //         { width: '50%', title: 'Lugar' },
    //         { width: '50%', title: 'País' },
    //     ],
    //     values: [
    //         { 0: "dedede", 1: "Todededrres", 2: "deded", 3: "bng", 4: "gfhfgh", 5: "fghfgh", 6: "hgfhfgh", },
    //     ],
    // }
    // const Cursos = {
    //     header: [
    //         { width: '50%', title: 'Tipos' },
    //         { width: '50%', title: 'Nombre' },
    //         { width: '50%', title: 'Organizado por:' },
    //         { width: '50%', title: 'Lugar' },
    //         { width: '30%', title: 'Duracion (Horas)' },
    //         {
    //             width: '80%', row: [
    //                 { col: [{ title: 'Fechas de Realización' }] },
    //                 {
    //                     col: [
    //                         { title: 'Fecha Inicio' }, { title: 'Fecha Fin' }
    //                     ]
    //                 }
    //             ]
    //         },

    //         { width: '40%', title: 'Tipo de Participación' },
    //     ],
    //     values: [
    //         { 0: "wqwqw", 1: "Todededrres", 2: "deded", 3: "bng", 4: "gfhfgh", 5: "05-07-2000", 6: "05-07-2000", 7: 'DEDED' },
    //     ],
    //     valuesPorcentajes: [
    //         "50%",
    //         "50%",
    //         "50%",
    //         "50%",
    //         "30%",
    //         "40%",
    //         "40%",
    //         "40%",
    //     ],
    // };
    // const ProduccionIntelectual = {
    //     header: [
    //         { width: '50%', title: 'Tipo' },
    //         { width: '50%', title: 'Nombre/Titulo' },
    //         { width: '50%', title: 'Tipo de Autoria' },
    //         { width: '50%', title: 'Fecha' },
    //         { width: '50%', title: 'Enlace Web' },
    //     ],
    //     values: [
    //         { 0: "dedede", 1: "Todededrres", 2: "deded", 3: "bng", 4: "gfhfgh"},
    //     ],
    // }
    // const Libros = {
    //     header: [
    //         { width: '50%', title: 'Titulo' },
    //         { width: '50%', title: 'Tipo' },
    //         { width: '50%', title: 'Tipo de Autoria' },
    //         { width: '50%', title: 'ISB N' },
    //         {
    //             width: '80%', row: [
    //                 { col: [{ title: 'Editorial' }] },
    //                 {
    //                     col: [
    //                         { title: 'Nombre' }, { title: 'Origen' }
    //                     ]
    //                 }
    //             ]
    //         },
    //         { width: '50%', title: 'Año' },
    //     ],
    //     values: [
    //         { 0: "dedede", 1: "Todededrres", 2: "deded", 3: "bng", 4: "gfhfgh", 5: "gfhfgh", 6: "gfhfgh"},
    //     ],
    //     valuesPorcentajes: [
    //         "50%",
    //         "50%",
    //         "50%",
    //         "50%",
    //         "40%",
    //         "40%",
    //         "50%",
    //     ],
    // }
    // const MeritosAcademicos = {
    //     header: [
    //         { width: '50%', title: 'Nombre' },
    //         { width: '50%', title: 'Fecha' },
    //         { width: '50%', title: 'Tipo' },
    //         { width: '50%', title: 'Otorgado por' },
    //         { width: '50%', title: 'Pais' },
    //         { width: '50%', title: 'Lugar' },
    //     ],
    //     values: [
    //         { 0: "dedede", 1: "Todededrres", 2: "deded", 3: "bng", 4: "gfhfgh", 5: "gfhfgh"},
    //     ],
    // }
    // const Idiomas = {
    //     header: [
    //         { width: '30%', title: 'Idioma' },
    //         {
    //             width: '90%', row: [
    //                 { col: [{ title: 'Nivel de dominio' }] },
    //                 {
    //                     col: [
    //                         { title: 'Hablado' }, { title: 'Escritura' },{ title: 'Comprensión' }
    //                     ]
    //                 }
    //             ]
    //         },
    //         { width: '50%', title: 'Tipo de Certificación' },
           
    //     ],
    //     values: [
    //         { 0: "dedede", 1: "Medio", 2: "Alto", 3: "Alto", 4: "gfhfgh"},
    //     ],
    //     valuesPorcentajes: [
    //         "30%",
    //         "30%",
    //         "30%",
    //         "30%",
    //         "50%",
    //     ],
    // }
    // const ExperienciaProfesional = {
    //     header: [
    //         { width: '50%', title: 'Empresa/Institución' },
    //         { width: '50%', title: 'Cargo' },
    //         { width: '50%', title: 'Responsabilidades y/o Actividades' },
    //         { width: '50%', title: 'Jefe Inmediato' },
    //         { width: '50%', title: 'Teléfono' },
    //         { width: '50%', title: 'Fecha Inicio' },
    //         { width: '50%', title: 'Fecha Fin' },
    //     ],
    //     values: [
    //         { uno: "dedede", dos: "Todededrres", tres: "deded", cuatro: "bng", cinco: "gfhfgh", seis: "gfhfgh", siete: "gfhfgh"},
    //     ],
    // }


    const renderTable = (Table) => {
        const calcColumnWidth = (widthPercentage) => {
            return { flexBasis: widthPercentage };
        };
    
        const getCellContent = (rowIndex, colKey) => {
            const cellData = Table.values[rowIndex][colKey];
            return <Text>{reorderDateString(cellData)}</Text>;
        };
    
        const numRows = Table.header.reduce((acc, col) => (col.row ? Math.max(acc, col.row.length) : acc), 0);
    
        const getPorcentaje = (colIndex, colCount) => {
            const totalColumns = colCount || 1;
            return Table.valuesPorcentajes && Table.valuesPorcentajes[colIndex]
                ? Table.valuesPorcentajes[colIndex]
                : (100 / totalColumns).toString() + '%';
        };
    
        return (
            <View style={styles.table}>
                <View style={styles.tableRow}>
                    {Table.header.map((col, colIndex) => (
                        col.row ? (
                            <View
                                style={{
                                    ...styles.tableColTh,
                                    ...calcColumnWidth(col.width),
                                    padding: 0
                                }}
                                key={colIndex}
                            >
                                {col.row.map((rowObj, rowIndex) => (
                                    <View
                                        style={{
                                            ...styles.tableRow,
                                            borderBottomWidth: rowIndex === numRows - 1 ? 0 : 1, // Última fila sin borde inferior
                                        }}
                                        key={rowIndex}
                                    >
                                        {rowObj.col.map((column, columnIndex) => (
                                            <View
                                                style={{
                                                    ...styles.tableColTd,
                                                    ...calcColumnWidth(getPorcentaje(columnIndex, rowObj.col.length)),
                                                    borderLeftWidth: columnIndex === 0 ? 0 : 1, // Primer columna sin borde izquierdo
                                                }}
                                                key={columnIndex}
                                            >
                                                {column.title && (
                                                    <Text>
                                                        {column.title}
                                                    </Text>
                                                )}
                                            </View>
                                        ))}
                                    </View>
                                ))}
                            </View>
                        ) : (
                            <View
                                style={{
                                    ...styles.tableColTh,
                                    ...calcColumnWidth(col.width),
                                }}
                                key={colIndex}
                            >
                                <Text>
                                    {col.title}
                                </Text>
                            </View>
                        )
                    ))}
                </View>
    
                {Table.values.map((row, rowIndex) => (
                    <View style={styles.tableRow} key={rowIndex}>
                        {Object.keys(row).map((key, colIndex) => {
                            const width = getPorcentaje(colIndex, Object.keys(row).length);
                            return (
                                <View
                                    style={{
                                        ...styles.tableColTd,
                                        ...calcColumnWidth(width),
                                    }}
                                    key={colIndex}
                                >

                                    {getCellContent(rowIndex, colIndex)}
                                </View>
                            );
                        })}
                    </View>
                ))}
            </View>
        );
    };
    
    const renderPersonalData = () => {
        return (
            personalInfo.map((info, index) => (
                <View style={styles.inputGroup} key={index}>
                    <Text style={styles.inputLabel}>{info.label}:</Text>
                    <View style={styles.input}>
                        <Text>{info.value}</Text>
                    </View>
                </View>
            ))
        );
    };
    return (
        <Document>
        <Page size="A4" style={styles.page}>
            <Text style={styles.titleInstitution}>INSTITUTO SUPERIOR TECNOLÓGICO "MARIANO SAMANIEGO"</Text>
            <View style={styles.section}>
                <Text style={styles.heading}>HOJA DE VIDA</Text>
                <View style={styles.row}>
                    <View style={styles.Infocol}>
                        <Text style={styles.subTitle}>Datos Personales</Text>
                        {renderPersonalData()}
                    </View>
                    {/* <View style={styles.photoCol}>
                        <Text style={styles.subTitle}>Foto</Text>
                        <View style={styles.photo}></View>
                    </View> */}
                    <View style={styles.photoCol}>
                    <Image src={imageURL} style={styles.photo} />
                    </View>
                </View>
            </View>

            {Object.entries(cv).map(([section, data]) => {
                const { values, title = '' } = data;
                if (values && values.length > 0) {
                    return (
                        <View style={styles.section} key={section}>
                            <Text style={styles.subTitle}>{title}</Text>
                            {renderTable(data)}
                        </View>
                    );
                }
                return null;
            })}
        </Page>
    </Document>
    );
};

export default PDFDocument;