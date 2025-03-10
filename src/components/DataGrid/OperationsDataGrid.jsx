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
    Chip
} from '@mui/material';

const OperationsDataGrid = ({ data }) => {
    if (!data || !data.operations || !data.wastes || !data.companies || data.companies.length === 0) {
        return (
            <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body1">Нет данных для отображения</Typography>
            </Box>
        );
    }

    const { operations, wastes, companies } = data;

    // Generate colors for operations
    const getOperationColor = (operationIndex) => {
        const colorPalette = [
            '#bbdefb', // Light blue
            '#c8e6c9', // Light green
            '#ffecb3', // Light amber
            '#f8bbd0', // Light pink
            '#d1c4e9', // Light purple
        ];
        return colorPalette[operationIndex % colorPalette.length];
    };

    // Format numbers with units (cubic meters - м³)
    const formatValue = (value) => {
        const numValue = Number(value);
        return numValue === 0 ? '0' : `${numValue.toFixed(2)} м³`;
    };

    // Restructure the data for the specified layout
    const structureData = () => {
        // Create a flat list of rows to display
        const rows = [];

        companies.forEach(company => {
            wastes.forEach(waste => {
                operations.forEach(operation => {
                    const value = company.operations[operation]?.wastes[waste] || 0;

                    // Only include non-zero entries
                    if (value > 0) {
                        rows.push({
                            companyName: company.name,
                            wasteType: waste,
                            quantity: value,
                            operation: operation,
                            operationIndex: operations.indexOf(operation)
                        });
                    }
                });
            });
        });

        return rows;
    };

    const rows = structureData();

    return (
        <Card sx={{ boxShadow: 2, borderRadius: 2 }}>
            <CardHeader
                title="Отчет по финальной переработке отходов"
                sx={{
                    backgroundColor: '#1976d2',
                    color: 'white',
                    py: 1.5
                }}
            />

            <Box sx={{ p: 1.5, display: 'flex', gap: 1, flexWrap: 'wrap', borderBottom: '1px solid #e0e0e0' }}>
                {operations.map((operation, index) => (
                    <Chip
                        key={operation}
                        label={operation}
                        sx={{
                            backgroundColor: getOperationColor(index),
                            fontWeight: 'bold',
                            px: 1
                        }}
                    />
                ))}
            </Box>

            <TableContainer component={Paper} sx={{ maxHeight: 'calc(100vh - 250px)', overflow: 'auto', boxShadow: 'none' }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell
                                sx={{
                                    fontWeight: 'bold',
                                    backgroundColor: '#f5f5f5',
                                    borderBottom: '2px solid #ddd',
                                    width: '25%'
                                }}
                            >
                                Компании
                            </TableCell>

                            <TableCell
                                sx={{
                                    fontWeight: 'bold',
                                    backgroundColor: '#f5f5f5',
                                    borderBottom: '2px solid #ddd',
                                    width: '25%'
                                }}
                            >
                                Типы отходов
                            </TableCell>

                            <TableCell
                                sx={{
                                    fontWeight: 'bold',
                                    backgroundColor: '#f5f5f5',
                                    borderBottom: '2px solid #ddd',
                                    width: '25%',
                                    textAlign: 'center'
                                }}
                            >
                                Количество (м³)
                            </TableCell>

                            <TableCell
                                sx={{
                                    fontWeight: 'bold',
                                    backgroundColor: '#f5f5f5',
                                    borderBottom: '2px solid #ddd',
                                    width: '25%'
                                }}
                            >
                                Тип операции
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {/* Group by company name for rowSpan */}
                        {(() => {
                            const grouped = {};
                            rows.forEach(row => {
                                if (!grouped[row.companyName]) {
                                    grouped[row.companyName] = [];
                                }
                                grouped[row.companyName].push(row);
                            });

                            return Object.keys(grouped).map(companyName => {
                                const companyRows = grouped[companyName];
                                return companyRows.map((row, index) => (
                                    <TableRow
                                        key={`${row.companyName}-${row.wasteType}-${row.operation}`}
                                        sx={{ '&:hover': { backgroundColor: '#f0f7ff' } }}
                                    >
                                        {/* Company name - show once per company */}
                                        {index === 0 && (
                                            <TableCell
                                                rowSpan={companyRows.length}
                                                sx={{
                                                    fontWeight: 'bold',
                                                    borderRight: '1px solid #e0e0e0',
                                                    backgroundColor: '#f9f9f9'
                                                }}
                                            >
                                                {row.companyName}
                                            </TableCell>
                                        )}

                                        {/* Waste type */}
                                        <TableCell>
                                            {row.wasteType}
                                        </TableCell>

                                        {/* Quantity */}
                                        <TableCell align="center">
                                            {formatValue(row.quantity)}
                                        </TableCell>

                                        {/* Operation type */}
                                        <TableCell
                                            sx={{
                                                backgroundColor: `${getOperationColor(row.operationIndex)}20`,
                                                position: 'relative',
                                                paddingLeft: '25px',
                                                '&::before': {
                                                    content: '""',
                                                    display: 'block',
                                                    width: '12px',
                                                    height: '12px',
                                                    backgroundColor: getOperationColor(row.operationIndex),
                                                    borderRadius: '50%',
                                                    position: 'absolute',
                                                    left: '8px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)'
                                                }
                                            }}
                                        >
                                            {row.operation}
                                        </TableCell>
                                    </TableRow>
                                ));
                            });
                        })()}

                        {/* Summary row at the bottom */}
                        {rows.length > 0 && (
                            <TableRow sx={{ backgroundColor: '#455a64' }}>
                                <TableCell
                                    colSpan={2}
                                    sx={{
                                        color: 'white',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Итого по всем компаниям
                                </TableCell>
                                <TableCell
                                    align="center"
                                    sx={{
                                        color: 'white',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {formatValue(companies.reduce((sum, company) => sum + (company.total || 0), 0))}
                                </TableCell>
                                <TableCell sx={{ backgroundColor: '#455a64' }}></TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Card>
    );
};

export default OperationsDataGrid;
