import { useState, useEffect } from 'react';
import { Box, Grid, TextField, MenuItem, Button, Typography, CircularProgress, Alert } from '@mui/material';
import WasteItem from '../../components/WasteItem/WasteItem';
import useCompaniesList from '../../hooks/useCompaniesList';
import useWastesType from '../../hooks/useWastesType';
import WasteRecordService from '../../api/WasteRecordService';
import { useNavigate } from 'react-router-dom';

const AddReportPage = () => {
    const navigate = useNavigate();
    // Получаем данные модератора из localStorage
    const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
    const moderatorId = userInfo.id;

    const [form, setForm] = useState({
        company_id: '',
        moderator_id: moderatorId, // Автоматически устанавливаем ID модератора
        car_num: '',
        driv_name: '',
        record_date: new Date().toISOString().split('T')[0], // Текущая дата по умолчанию
        items: [],
    });

    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Получаем только компании данного модератора
    const { companies, loading: loadingCompanies } = useCompaniesList(moderatorId);
    const { wastes, loading: loadingWastes } = useWastesType();

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleAddItem = () => {
        if (!form.company_id) {
            setError('Пожалуйста, выберите компанию перед добавлением отхода.');
            return;
        }
        setForm((prev) => ({
            ...prev,
            items: [...prev.items, { waste_id: '', amount: '' }],
        }));
        setError('');
    };

    const handleRemoveItem = (index) => {
        setForm((prev) => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index),
        }));
    };

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...form.items];
        updatedItems[index][field] = value;
        setForm((prev) => ({ ...prev, items: updatedItems }));
    };

    const handleSubmit = async () => {
        try {
            setError('');
            setLoadingSubmit(true);

            // Проверяем заполнение обязательных полей
            if (!form.company_id) {
                setError('Выберите компанию');
                return;
            }
            if (form.items.length === 0) {
                setError('Добавьте хотя бы один отход');
                return;
            }
            if (!form.record_date) {
                setError('Укажите дату');
                return;
            }

            // Проверяем корректность заполнения всех отходов
            for (let i = 0; i < form.items.length; i++) {
                if (!form.items[i].waste_id || !form.items[i].amount) {
                    setError(`Заполните все поля для отхода #${i + 1}`);
                    return;
                }
                if (parseFloat(form.items[i].amount) <= 0) {
                    setError(`Объем отхода #${i + 1} должен быть больше нуля`);
                    return;
                }
            }

            await WasteRecordService.createWasteRecord(form);
            setSuccess(true);

            // Сброс формы
            setForm({
                company_id: '',
                moderator_id: moderatorId,
                car_num: '',
                driv_name: '',
                record_date: new Date().toISOString().split('T')[0],
                items: [],
            });

            // Переход на дашборд после успешного создания
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);

        } catch (error) {
            console.error('Ошибка при создании записи:', error);
            setError(error.response?.data?.message || 'Не удалось создать запись');
        } finally {
            setLoadingSubmit(false);
        }
    };

    const isAddItemDisabled = !form.company_id;

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" sx={{ marginBottom: 3, textAlign: 'center' }}>
                Создание записи отходов
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 3 }}>
                    Запись успешно создана!
                </Alert>
            )}

            <Grid container spacing={3}>
                {/* Поля формы */}
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Компания"
                        fullWidth
                        select
                        value={form.company_id}
                        onChange={(e) => handleChange('company_id', e.target.value)}
                        disabled={loadingCompanies}
                        required
                    >
                        {loadingCompanies ? (
                            <MenuItem disabled>Загрузка компаний...</MenuItem>
                        ) : companies.length > 0 ? (
                            companies.map((company) => (
                                <MenuItem key={company.id} value={company.id}>
                                    {company.name}
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled>Нет доступных компаний</MenuItem>
                        )}
                    </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Номер машины"
                        fullWidth
                        value={form.car_num}
                        onChange={(e) => handleChange('car_num', e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="ФИО водителя"
                        fullWidth
                        value={form.driv_name}
                        onChange={(e) => handleChange('driv_name', e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Дата записи"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={form.record_date}
                        onChange={(e) => handleChange('record_date', e.target.value)}
                        required
                    />
                </Grid>

                {/* Динамические элементы */}
                <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                        Пункты отходов
                    </Typography>

                    {form.items.map((item, index) => (
                        <WasteItem
                            key={index}
                            index={index}
                            item={item}
                            wastes={wastes}
                            onChange={handleItemChange}
                            onRemove={handleRemoveItem}
                        />
                    ))}

                    <Button
                        onClick={handleAddItem}
                        variant="outlined"
                        sx={{ marginTop: 2 }}
                        disabled={isAddItemDisabled}
                    >
                        Добавить отход
                    </Button>
                </Grid>

                {/* Кнопки управления */}
                <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => navigate('/dashboard')}
                    >
                        Отмена
                    </Button>

                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        color="primary"
                        disabled={loadingSubmit}
                    >
                        {loadingSubmit ? <CircularProgress size={24} /> : 'Создать запись'}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AddReportPage;
