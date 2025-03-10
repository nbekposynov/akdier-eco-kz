import { useState } from "react";
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    CircularProgress,
    MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { slugify } from "transliteration"; // Импорт библиотеки для создания slug
import useWastes from "../../hooks/useWastes"; // Хук для работы с отходами
import useCategories from "../../hooks/useWasteCategories"; // Хук для работы с категориями
import useFinalWasteTypes from "../../hooks/useFinalWasteTypes"; // Хук для работы с финальными типами отходов

const WastePage = () => {
    const {
        wastes = [],
        loading: loadingWastes,
        error: errorWastes,
        createWaste,
        updateWaste,
        deleteWaste,
    } = useWastes();

    const {
        categories = [],
        loading: loadingCategories,
        error: errorCategories,
    } = useCategories();

    const {
        types: finalWasteTypes = [], // Извлекаем `types` из хука
        loading: loadingTypes,
        error: errorTypes,
    } = useFinalWasteTypes();

    const [form, setForm] = useState({
        name: "",
        slug: "",
        category_id: "",
        final_waste_type_id: "",
    });

    const [editingId, setEditingId] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [openFormDialog, setOpenFormDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const handleOpenFormDialog = (waste = null) => {
        if (waste) {
            setEditingId(waste.id);
            setForm({
                name: waste.name,
                slug: waste.slug,
                category_id: waste.category?.id || "",
                final_waste_type_id: waste.finalWasteType?.id || "",
            });
        } else {
            setEditingId(null);
            setForm({ name: "", slug: "", category_id: "", final_waste_type_id: "" });
        }
        setOpenFormDialog(true);
    };

    const handleCloseFormDialog = () => {
        setOpenFormDialog(false);
        setForm({ name: "", slug: "", category_id: "", final_waste_type_id: "" });
    };

    const handleFormSubmit = () => {
        if (editingId) {
            updateWaste(editingId, form);
        } else {
            createWaste(form);
        }
        handleCloseFormDialog();
    };

    const handleOpenDeleteDialog = (id) => {
        setDeleteId(id);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setDeleteId(null);
        setOpenDeleteDialog(false);
    };

    const handleDelete = () => {
        if (deleteId) {
            deleteWaste(deleteId);
        }
        handleCloseDeleteDialog();
    };

    const handleChange = (field, value) => {
        setForm((prev) => {
            const updatedForm = { ...prev, [field]: value };
            if (field === "name") {
                updatedForm.slug = slugify(value, { separator: "-" }); // Автогенерация slug
            }
            return updatedForm;
        });
    };

    if (loadingWastes || loadingCategories || loadingTypes)
        return <CircularProgress />;
    if (errorWastes || errorCategories || errorTypes)
        return <Typography color="error">Ошибка загрузки данных</Typography>;

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" sx={{ marginBottom: 3 }}>
                Управление отходами
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={() => handleOpenFormDialog()}
                sx={{ marginBottom: 3 }}
            >
                Создать отход
            </Button>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Название</TableCell>
                            <TableCell>Slug</TableCell>
                            <TableCell>Категория</TableCell>
                            <TableCell>Финальный тип отхода</TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {wastes.map((waste) => (
                            <TableRow key={waste.id}>
                                <TableCell>{waste.id}</TableCell>
                                <TableCell>{waste.name}</TableCell>
                                <TableCell>{waste.slug}</TableCell>
                                <TableCell>{waste.category?.name || "Без категории"}</TableCell>
                                <TableCell>
                                    {waste.final_waste_type?.final_name || "Не указан"}
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        onClick={() => handleOpenFormDialog(waste)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => handleOpenDeleteDialog(waste.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Модальное окно для формы */}
            <Dialog open={openFormDialog} onClose={handleCloseFormDialog}>
                <DialogTitle>
                    {editingId ? "Редактировать отход" : "Создать отход"}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        label="Название"
                        value={form.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="Slug"
                        value={form.slug}
                        onChange={(e) => handleChange("slug", e.target.value)}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="Категория"
                        value={form.category_id}
                        onChange={(e) => handleChange("category_id", e.target.value)}
                        fullWidth
                        margin="dense"
                        select
                    >
                        {categories.map((category) => (
                            <MenuItem key={category.id} value={category.id}>
                                {category.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Финальный тип отхода"
                        value={form.final_waste_type_id}
                        onChange={(e) =>
                            handleChange("final_waste_type_id", e.target.value)
                        }
                        fullWidth
                        margin="dense"
                        select
                    >
                        {finalWasteTypes.map((type) => (
                            <MenuItem key={type.id} value={type.id}>
                                {type.final_name}
                            </MenuItem>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseFormDialog}>Отмена</Button>
                    <Button onClick={handleFormSubmit} variant="contained">
                        {editingId ? "Обновить" : "Создать"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Модальное окно для подтверждения удаления */}
            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                <DialogTitle>Подтвердите удаление</DialogTitle>
                <DialogContent>
                    Вы уверены, что хотите удалить этот элемент?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>Отмена</Button>
                    <Button onClick={handleDelete} color="error" variant="contained">
                        Удалить
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default WastePage;
