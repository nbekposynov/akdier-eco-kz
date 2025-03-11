import { useState, useEffect } from "react";
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
    TablePagination,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import WasteRecordService from "../../api/WasteRecordService";
import useModeratorsList from "../../hooks/useModeratorsList";
import useCompaniesList from "../../hooks/useCompaniesList";
import useWastes from "../../hooks/useWastes";

const WasteRecordPage = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { wastes, loading: loadingWastes } = useWastes();

    const [filters, setFilters] = useState({
        company_name: "",
        bin: "",
        start_date: "",
        created_to: "",
        moderator_id: "",
        driv_name: "",
        car_num: "",
    });

    const [form, setForm] = useState({
        company_id: "",
        moderator_id: "",
        car_num: "",
        driv_name: "",
        record_date: "",
        items: [],
    });

    const [editingId, setEditingId] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [openFormDialog, setOpenFormDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const { moderators, loading: loadingModerators } = useModeratorsList();
    const { companies, loading: loadingCompanies } = useCompaniesList();

    const fetchRecords = async (filters = {}) => {
        setLoading(true);
        try {
            const data = await WasteRecordService.filterWasteRecords(filters);
            setRecords(data.data || []);
        } catch (err) {
            setError(err.message || "Ошибка загрузки записей");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenFormDialog = (record = null) => {
        if (record) {
            setEditingId(record.id);
            setForm({
                company_id: record.company_id,
                moderator_id: record.moderator_id,
                car_num: record.car_num,
                driv_name: record.driv_name,
                record_date: record.record_date,
                items: record.items || [],
            });
        } else {
            setEditingId(null);
            setForm({
                company_id: "",
                moderator_id: "",
                car_num: "",
                driv_name: "",
                record_date: "",
                items: [],
            });
        }
        setOpenFormDialog(true);
    };

    const handleCloseFormDialog = () => {
        setOpenFormDialog(false);
        setForm({
            company_id: "",
            moderator_id: "",
            car_num: "",
            driv_name: "",
            record_date: "",
            items: [],
        });
    };

    const handleFormSubmit = async () => {
        try {
            if (editingId) {
                await WasteRecordService.updateWasteRecord(editingId, form);
            } else {
                await WasteRecordService.createWasteRecord(form);
            }
            fetchRecords(filters); // Перезагрузить записи после сохранения
            handleCloseFormDialog();
        } catch (err) {
            console.error("Ошибка при сохранении записи:", err);
        }
    };

    const handleOpenDeleteDialog = (id) => {
        console.log("Opening delete dialog for ID:", id); // Debug log
        setDeleteId(id);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setDeleteId(null);
        setOpenDeleteDialog(false);
    };

    const handleDelete = async () => {
        if (!deleteId) {
            console.error("Delete ID is null or undefined");
            return;
        }

        console.log("Attempting to delete record with ID:", deleteId); // Debug log
        setLoading(true);
        try {
            await WasteRecordService.deleteWasteRecord(deleteId);
            console.log("Delete successful");

            // Remove the record from local state
            setRecords(records.filter(record => record.id !== deleteId));

            handleCloseDeleteDialog();
            // Show success notification or feedback here
        } catch (err) {
            console.error("Error deleting record:", err);
            setError(`Ошибка при удалении записи: ${err.message || "Неизвестная ошибка"}`);
        } finally {
            setLoading(false);
        }
    };

    const handleItemChange = (index, field, value) => {
        setForm((prev) => {
            const updatedItems = [...prev.items];
            updatedItems[index] = { ...updatedItems[index], [field]: value };
            return { ...prev, items: updatedItems };
        });
    };

    const handleFilterChange = (field, value) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
    };

    const handleSearch = () => {
        fetchRecords(filters);
    };

    const addItem = () => {
        setForm((prev) => ({
            ...prev,
            items: [...prev.items, { waste_id: "", amount: "" }],
        }));
    };

    const removeItem = (index) => {
        setForm((prev) => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index),
        }));
    };


    useEffect(() => {
        fetchRecords();
    }, []);

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" sx={{ marginBottom: 3 }}>
                Управление записями об отходах
            </Typography>

            {/* Форма поиска */}
            <Box sx={{ display: "flex", gap: 2, marginBottom: 3 }}>
                <TextField
                    label="Название компании"
                    value={filters.company_name}
                    onChange={(e) => handleFilterChange("company_name", e.target.value)}
                />
                <TextField
                    label="БИН компании"
                    value={filters.bin}
                    onChange={(e) => handleFilterChange("bin", e.target.value)}
                />
                <TextField
                    label="Дата от"
                    type="date"
                    value={filters.start_date}
                    onChange={(e) => handleFilterChange("start_date", e.target.value)}
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    label="Дата до"
                    type="date"
                    value={filters.end_date}
                    onChange={(e) => handleFilterChange("end_date", e.target.value)}
                    InputLabelProps={{ shrink: true }}
                />
                <Button
                    variant="contained"
                    startIcon={<SearchIcon />}
                    onClick={handleSearch}
                >
                    Поиск
                </Button>
            </Box>

            {/* Таблица записей */}
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Компания</TableCell>
                            <TableCell>Модератор</TableCell>
                            <TableCell>Дата записи</TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {records.map((record) => (
                            <TableRow key={record.id}>
                                <TableCell>{record.id}</TableCell>
                                <TableCell>{record.company?.name || "Не указано"}</TableCell>
                                <TableCell>{record.moderator?.name || "Не указано"}</TableCell>
                                <TableCell>{new Date(record.record_date).toLocaleDateString('ru-RU')}</TableCell>
                                <TableCell>
                                    <IconButton
                                        onClick={() => handleOpenFormDialog(record)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => handleOpenDeleteDialog(record.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Пагинация */}
            <TablePagination
                component="div"
                count={records.length}
                rowsPerPage={10}
                page={0}
                onPageChange={() => { }}
            />

            {/* Модальное окно для формы */}
            <Dialog open={openFormDialog} onClose={handleCloseFormDialog}>
                <DialogTitle>{editingId ? "Редактировать запись" : "Создать запись"}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Компания"
                        select
                        value={form.company_id}
                        onChange={(e) => setForm((prev) => ({ ...prev, company_id: e.target.value }))}
                        fullWidth
                        margin="dense"
                    >
                        {companies.map((company) => (
                            <MenuItem key={company.id} value={company.id}>
                                {company.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Модератор"
                        select
                        value={form.moderator_id}
                        onChange={(e) =>
                            setForm((prev) => ({ ...prev, moderator_id: e.target.value }))
                        }
                        fullWidth
                        margin="dense"
                    >
                        {moderators.map((moderator) => (
                            <MenuItem key={moderator.id} value={moderator.id}>
                                {moderator.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Номер машины"
                        value={form.car_num}
                        onChange={(e) =>
                            setForm((prev) => ({ ...prev, car_num: e.target.value }))
                        }
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="Имя водителя"
                        value={form.driv_name}
                        onChange={(e) =>
                            setForm((prev) => ({ ...prev, driv_name: e.target.value }))
                        }
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="Дата записи"
                        type="date"
                        value={form.record_date}
                        onChange={(e) =>
                            setForm((prev) => ({ ...prev, record_date: e.target.value }))
                        }
                        fullWidth
                        margin="dense"
                        InputLabelProps={{ shrink: true }}
                    />
                    <Typography variant="h6" sx={{ marginTop: 2 }}>
                        Отходы
                    </Typography>
                    {form.items.map((item, index) => (
                        <Box key={index} sx={{ display: "flex", gap: 2, marginBottom: 3 }}>
                            <TextField
                                label="Отход"
                                select
                                value={item.waste_id}
                                onChange={(e) => handleItemChange(index, "waste_id", e.target.value)}
                                fullWidth
                            >
                                {wastes.map((waste) => (
                                    <MenuItem key={waste.id} value={waste.id}>
                                        {waste.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                label="Количество"
                                value={item.amount}
                                type="number"
                                onChange={(e) => handleItemChange(index, "amount", e.target.value)}
                                fullWidth
                            />
                            <Button color="error" onClick={() => removeItem(index)}>
                                Удалить
                            </Button>
                        </Box>
                    ))}
                    <Button onClick={addItem} variant="contained">
                        Добавить отход
                    </Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseFormDialog}>Отмена</Button>
                    <Button onClick={handleFormSubmit} variant="contained">
                        {editingId ? "Обновить" : "Создать"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Модальное окно для удаления */}
            <Dialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                aria-labelledby="delete-dialog-title"
            >
                <DialogTitle id="delete-dialog-title">
                    Подтверждение удаления
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        Вы уверены, что хотите удалить эту запись?
                        Это действие нельзя отменить.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="primary">
                        Отмена
                    </Button>
                    <Button
                        onClick={handleDelete}
                        color="error"
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : "Удалить"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default WasteRecordPage;
