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
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import useWasteCategories from '../../hooks/useWasteCategories';
import { slugify } from 'transliteration'; // Импорт функции slugify из библиотеки

const WasteCategoryPage = () => {
    const {
        categories,
        loading,
        error,
        createCategory,
        updateCategory,
        deleteCategory,
    } = useWasteCategories();

    const [form, setForm] = useState({ name: '', slug: '' });
    const [editingId, setEditingId] = useState(null);
    const [openFormDialog, setOpenFormDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const handleChange = (field, value) => {
        setForm((prev) => {
            const updatedForm = { ...prev, [field]: value };

            if (field === 'name') {
                updatedForm.slug = slugify(value, { separator: '-' });
            }

            return updatedForm;
        });
    };

    const handleSubmit = async () => {
        try {
            if (editingId) {
                await updateCategory(editingId, form);
            } else {
                await createCategory(form);
            }
            setForm({ name: '', slug: '' });
            setEditingId(null);
            setOpenFormDialog(false);
        } catch (error) {
            console.error("Ошибка при сохранении категории:", error);
            // Можно здесь добавить отображение ошибки пользователю
        }
    };

    const handleEdit = (category) => {
        setEditingId(category.id);
        setForm({ name: category.name, slug: category.slug });
        setOpenFormDialog(true);
    };

    const handleDelete = async () => {
        try {
            await deleteCategory(deleteId);
            setDeleteId(null);
            setOpenDeleteDialog(false);
        } catch (error) {
            console.error("Ошибка при удалении категории:", error);
            // Можно здесь добавить отображение ошибки пользователю
        }
    };

    const openCreateDialog = () => {
        setEditingId(null);
        setForm({ name: '', slug: '' });
        setOpenFormDialog(true);
    };

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">Ошибка загрузки данных</Typography>;

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" sx={{ marginBottom: 3 }}>
                Управление категориями отходов
            </Typography>

            <Button variant="contained" onClick={openCreateDialog} sx={{ marginBottom: 3 }}>
                Создать категорию
            </Button>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Название</TableCell>
                            <TableCell>Slug</TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categories.map((category) => (
                            <TableRow key={category.id}>
                                <TableCell>{category.id}</TableCell>
                                <TableCell>{category.name}</TableCell>
                                <TableCell>{category.slug}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEdit(category)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => {
                                            setDeleteId(category.id);
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
                    {editingId ? 'Обновить категорию' : 'Создать категорию'}
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
                            label="Название категории"
                            value={form.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            fullWidth
                        />
                        <TextField
                            label="Slug категории"
                            value={form.slug}
                            onChange={(e) => handleChange('slug', e.target.value)}
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
                <DialogTitle>Удалить категорию</DialogTitle>
                <DialogContent>
                    <Typography>Вы уверены, что хотите удалить эту категорию?</Typography>
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

export default WasteCategoryPage;
