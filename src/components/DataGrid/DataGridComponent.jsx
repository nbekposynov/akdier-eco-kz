import React from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Box,
    Card,
    CardHeader,
    Chip,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    FileDownload as DownloadIcon,
    Print as PrintIcon
} from '@mui/icons-material';

const DataGridComponent = ({ data }) => {
    if (!data || !data.headers || !data.companies || data.companies.length === 0) {
        return (
            <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body1">Нет данных для отображения</Typography>
            </Box>
        );
    }

    const { headers, companies } = data;
    const headerKeys = Object.keys(headers);

    const getColorByIndex = (index) => {
        const colorPalette = [
            '#bbdefb', // Light blue
            '#c8e6c9', // Light green
            '#ffecb3', // Light amber
            '#f8bbd0', // Light pink
            '#d1c4e9', // Light purple
            '#b2dfdb', // Light teal
            '#ffccbc', // Light deep orange
            '#d7ccc8', // Light brown
            '#cfd8dc', // Light blue-grey
            '#e1bee7'  // Light purple
        ];
        return colorPalette[index % colorPalette.length];
    };

    // Create a mapping of categories to colors
    const categoryColorMap = {};
    headerKeys.forEach((key, index) => {
        categoryColorMap[key] = getColorByIndex(index);
    });

    // Get color for a specific category
    const getCategoryColor = (categoryKey) => {
        return categoryColorMap[categoryKey] || '#f5f5f5';
    };

    // Format numbers with units (cubic meters - м³)
    const formatValue = (value) => {
        const numValue = Number(value);
        return numValue === 0 ? '0' : `${numValue.toFixed(2)} м³`;
    };

    return (
        <Card>
            <CardHeader
                title="Отчет по отходам"
                sx={{
                    backgroundColor: '#1976d2',
                    color: 'white'
                }}
            />

            <Box sx={{ p: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {headerKeys.map(key => (
                    <Chip
                        key={key}
                        label={headers[key].name}
                        sx={{
                            backgroundColor: getCategoryColor(key),
                            fontWeight: 'bold'
                        }}
                    />
                ))}
            </Box>

            <TableContainer component={Paper} sx={{ maxHeight: 600, overflow: 'auto' }}>
                <Table stickyHeader>
                    <TableHead>
                        {/* First header row - Category names */}
                        <TableRow>
                            <TableCell
                                sx={{
                                    fontWeight: 'bold',
                                    backgroundColor: '#f5f5f5',
                                    position: 'sticky',
                                    left: 0,
                                    zIndex: 3,
                                    borderRight: '1px solid #ddd',
                                    borderBottom: 0
                                }}
                                rowSpan={2}
                            >
                                Компания
                            </TableCell>

                            {headerKeys.map(key => (
                                <TableCell
                                    key={key}
                                    colSpan={headers[key].wastes.length + 1}
                                    align="center"
                                    sx={{
                                        fontWeight: 'bold',
                                        backgroundColor: getCategoryColor(key),
                                        borderRight: '2px solid #ddd',
                                        borderBottom: 0
                                    }}
                                >
                                    {headers[key].name}
                                </TableCell>
                            ))}
                        </TableRow>

                        {/* Second header row - Waste type names */}
                        <TableRow>
                            {headerKeys.map(key => {
                                return [
                                    ...headers[key].wastes.map(waste => (
                                        <TableCell
                                            key={waste}
                                            align="center"
                                            sx={{
                                                fontWeight: 'bold',
                                                backgroundColor: '#f5f5f5'
                                            }}
                                        >
                                            {/* Extract the waste name part - handle different formats */}
                                            {waste.includes(' ') ? waste.split(' ').slice(1).join(' ') : waste}
                                        </TableCell>
                                    )),
                                    <TableCell
                                        key={`${key}-total`}
                                        align="center"
                                        sx={{
                                            fontWeight: 'bold',
                                            backgroundColor: '#f0f0f0',
                                            borderRight: '2px solid #ddd'
                                        }}
                                    >
                                        Итого
                                    </TableCell>
                                ];
                            })}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {companies.map((company, index) => (
                            <TableRow
                                key={company.id || index}
                                sx={{
                                    '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' },
                                    '&:hover': { backgroundColor: '#f0f7ff' }
                                }}
                            >
                                <TableCell
                                    sx={{
                                        position: 'sticky',
                                        left: 0,
                                        backgroundColor: index % 2 ? '#ffffff' : '#f9f9f9',
                                        zIndex: 1,
                                        borderRight: '1px solid #ddd',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {company.name}
                                </TableCell>

                                {headerKeys.map(key => {
                                    const wastes = headers[key].wastes;
                                    return [
                                        ...wastes.map(waste => (
                                            <TableCell
                                                key={`${company.name}-${waste}`}
                                                align="center"
                                                sx={{
                                                    ...(company[waste] > 0 && {
                                                        backgroundColor: `${getCategoryColor(key)}40`
                                                    })
                                                }}
                                            >
                                                {formatValue(company[waste] || 0)}
                                            </TableCell>
                                        )),
                                        <TableCell
                                            key={`${company.name}-${key}-total`}
                                            align="center"
                                            sx={{
                                                fontWeight: 'bold',
                                                borderRight: '2px solid #ddd',
                                                backgroundColor: `${getCategoryColor(key)}60`
                                            }}
                                        >
                                            {formatValue(company[`${key}_total`] || 0)}
                                        </TableCell>
                                    ];
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Card>
    );
};

export default DataGridComponent;

