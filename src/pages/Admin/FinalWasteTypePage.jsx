import { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import useFinalWasteTypes from '../../hooks/useFinalWasteTypes';

const FinalWasteTypePage = () => {
    const { types, loading, error, createType, updateType, deleteType } = useFinalWasteTypes();
    const [form, setForm] = useState({ final_name: '', type_operation: '', factor: '' });
    const [editingId, setEditingId] = useState(null);
    const [openFormDialog, setOpenFormDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        const { final_name, type_operation, factor } = form;
        if (!final_name || !type_operation || !factor) {
            alert('Все поля должны быть заполнены');
            return;
        }

        if (editingId) {
            updateType(editingId, form);
            setEditingId(null);
        } else {
            createType(form);
        }
        setForm({ final_name: '', type_operation: '', factor: '' });
        setOpenFormDialog(false);
    };

    const handleEdit = (type) => {
        setEditingId(type.id);
        setForm({ final_name: type.final_name, type_operation: type.type_operation, factor: type.factor });
        setOpenFormDialog(true);
    };

    const handleDelete = () => {
        deleteType(deleteId);
        setDeleteId(null);
        setOpenDeleteDialog(false);
    };

    const openCreateDialog = () => {
        setEditingId(null);
        setForm({ final_name: '', type_operation: '', factor: '' });
        setOpenFormDialog(true);
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" sx={{ marginBottom: 3 }}>
                Управление типами отходов для финального отчета
            </Typography>

            <Button variant="contained" onClick={openCreateDialog} sx={{ marginBottom: 3 }}>
                Создать тип отхода
            </Button>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Название</TableCell>
                            <TableCell>Тип операции</TableCell>
                            <TableCell>Коэффициент</TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {types.map((type) => (
                            <TableRow key={type.id}>
                                <TableCell>{type.id}</TableCell>
                                <TableCell>{type.final_name}</TableCell>
                                <TableCell>{type.type_operation}</TableCell>
                                <TableCell>{type.factor}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEdit(type)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => {
                                            setDeleteId(type.id);
                                            setOpenDeleteDialog(true);
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Модалка для создания/обновления */}
            <Dialog open={openFormDialog} onClose={() => setOpenFormDialog(false)}>
                <DialogTitle>
                    {editingId ? 'Обновить тип отхода' : 'Создать тип отхода'}
                </DialogTitle>
                <DialogContent>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            marginTop: 2,
                        }}
                    >
                        <TextField
                            label="Название"
                            value={form.final_name}
                            onChange={(e) => handleChange('final_name', e.target.value)}
                            fullWidth
                        />
                        <TextField
                            label="Тип операции"
                            value={form.type_operation}
                            onChange={(e) => handleChange('type_operation', e.target.value)}
                            fullWidth
                        />
                        <TextField
                            label="Коэффициент"
                            value={form.factor}
                            onChange={(e) => handleChange('factor', e.target.value)}
                            fullWidth
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenFormDialog(false)}>Отмена</Button>
                    <Button variant="contained" onClick={handleSubmit}>
                        {editingId ? 'Обновить' : 'Создать'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Модалка для удаления */}
            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogTitle>Удалить тип отхода</DialogTitle>
                <DialogContent>
                    <Typography>Вы уверены, что хотите удалить этот тип отхода?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)}>Отмена</Button>
                    <Button variant="contained" color="error" onClick={handleDelete}>
                        Удалить
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default FinalWasteTypePage;