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
    Alert,
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

    // Добавим состояния для пагинации
    const [totalRecords, setTotalRecords] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [filters, setFilters] = useState({
        company_name: "",
        bin: "",
        start_date: "",
        end_date: "", // Изменено на end_date
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

    const fetchRecords = async (filters = {}, page = 1) => {
        setLoading(true);
        try {
            // Добавляем параметр страницы
            const searchParams = { ...filters, page };

            // Логируем для отладки
            console.log("Sending request with params:", searchParams);

            const data = await WasteRecordService.filterWasteRecords(searchParams);
            console.log("API response:", data);

            // Проверяем структуру ответа и обрабатываем данные
            if (data.data) {
                setRecords(data.data);

                // Обработка мета-данных пагинации
                if (data.meta) {
                    setTotalRecords(data.meta.total);
                    setCurrentPage(data.meta.current_page - 1); // MUI использует 0-based индексы
                    setRowsPerPage(data.meta.per_page);
                }
            } else {
                // Если ответ в другом формате
                setRecords(Array.isArray(data) ? data : []);
                console.warn("Unexpected response format:", data);
            }

            setError(null);
        } catch (err) {
            console.error("Error fetching records:", err);
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
                record_date: record.record_date ? record.record_date.split('T')[0] : '', // Форматирование даты
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
            if (!form.items.length) {
                setError("Необходимо добавить хотя бы один отход");
                return;
            }

            // Валидация данных формы
            if (!form.company_id || !form.moderator_id || !form.record_date) {
                setError("Заполните все обязательные поля");
                return;
            }

            // Проверка на ненулевые значения количества
            const hasZeroAmount = form.items.some(item => !item.amount || parseFloat(item.amount) <= 0);
            if (hasZeroAmount) {
                setError("Количество отходов должно быть больше нуля");
                return;
            }

            console.log("Submitting form data:", form);

            if (editingId) {
                await WasteRecordService.updateWasteRecord(editingId, form);
            } else {
                await WasteRecordService.createWasteRecord(form);
            }

            // Обновляем список после успешного сохранения
            fetchRecords(filters, currentPage + 1);
            handleCloseFormDialog();
        } catch (err) {
            console.error("Ошибка при сохранении записи:", err);
            setError(err.response?.data?.message || "Ошибка при сохранении");
        }
    };

    const handleOpenDeleteDialog = (id) => {
        console.log("Opening delete dialog for ID:", id);
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

        console.log("Attempting to delete record with ID:", deleteId);
        setLoading(true);
        try {
            await WasteRecordService.deleteWasteRecord(deleteId);
            console.log("Delete successful");

            // Обновляем список после удаления
            fetchRecords(filters, currentPage + 1);
            handleCloseDeleteDialog();
            // Можно добавить сообщение об успешном удалении
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
        // Сбрасываем на первую страницу при новом поиске
        setCurrentPage(0);
        fetchRecords(filters, 1);
    };

    // Обработчики пагинации
    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage);
        fetchRecords(filters, newPage + 1); // +1 потому что API ожидает 1-based индексы
    };

    const handleChangeRowsPerPage = (event) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setCurrentPage(0); // Сбрасываем на первую страницу

        // Обновляем фильтры с новым размером страницы
        const newFilters = { ...filters, per_page: newRowsPerPage };
        setFilters(newFilters);
        fetchRecords(newFilters, 1);
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

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" sx={{ marginBottom: 3 }}>
                Управление записями об отходах
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {/* Форма поиска */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, marginBottom: 3 }}>
                <TextField
                    label="Название компании"
                    value={filters.company_name}
                    onChange={(e) => handleFilterChange("company_name", e.target.value)}
                    size="small"
                />
                <TextField
                    label="БИН компании"
                    value={filters.bin}
                    onChange={(e) => handleFilterChange("bin", e.target.value)}
                    size="small"
                />
                <TextField
                    label="Дата от"
                    type="date"
                    value={filters.start_date}
                    onChange={(e) => handleFilterChange("start_date", e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                />
                <TextField
                    label="Дата до"
                    type="date"
                    value={filters.end_date}
                    onChange={(e) => handleFilterChange("end_date", e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    size="small"
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
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : records.length > 0 ? (
                            records.map((record) => (
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
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    Нет данных
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Пагинация */}
            <TablePagination
                component="div"
                count={totalRecords}
                rowsPerPage={rowsPerPage}
                page={currentPage}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
                labelRowsPerPage="Записей на странице:"
            />

            {/* Диалоги и формы без изменений */}
            {/* ... */}
        </Box>
    );
};

export default WasteRecordPage;