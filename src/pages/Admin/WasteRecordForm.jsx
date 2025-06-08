import { useState } from 'react';
import { Box, Grid, TextField, MenuItem, Button, Typography } from '@mui/material';
import WasteItem from '../../components/WasteItem/WasteItem';
import useModeratorsList from '../../hooks/useModeratorsList';
import useCompaniesList from '../../hooks/useCompaniesList';
import useWastesType from '../../hooks/useWastesType';
import WasteRecordService from '../../api/WasteRecordService';

const WasteRecordForm = () => {
    const [form, setForm] = useState({
        company_id: '',
        moderator_id: '',
        car_num: '',
        driv_name: '',
        record_date: '',
        items: [],
    });

    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const { moderators, loading: loadingModerators } = useModeratorsList();
    const { companies, loading: loadingCompanies } = useCompaniesList();
    const { wastes, loading: loadingWastes } = useWastesType();

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleAddItem = () => {
        if (!form.company_id || !form.moderator_id) {
            alert('Пожалуйста, заполните поля "Компания" и "Модератор" перед добавлением отхода.');
            return;
        }
        setForm((prev) => ({
            ...prev,
            items: [...prev.items, {
                waste_id: '', amount: '', factor: null
            }],
        }));
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
            setLoadingSubmit(true);

            // Подготавливаем данные для отправки
            const submitData = { ...form };

            // Обрабатываем factor для каждого item
            submitData.items = form.items.map(item => {
                const processedItem = { ...item };

                // Если factor равен null, undefined или 0, удаляем его из объекта
                if (processedItem.factor === null || processedItem.factor === undefined || processedItem.factor === 0) {
                    delete processedItem.factor;
                }

                return processedItem;
            });

            console.log('Отправляемые данные:', submitData);

            await WasteRecordService.createWasteRecord(submitData);
            alert('Запись успешно создана!');

            setForm({
                company_id: '',
                moderator_id: '',
                car_num: '',
                driv_name: '',
                record_date: '',
                items: [],
            });
        } catch (error) {
            console.error('Ошибка при создании записи:', error);
            alert(`Не удалось создать запись: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoadingSubmit(false);
        }
    };

    const isAddItemDisabled = !form.company_id || !form.moderator_id; // Проверка на заполненность полей
    const isSubmitDisabled = !form.company_id || !form.moderator_id || form.items.length === 0; // Запретить создание записи, если нет отходов

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" sx={{ marginBottom: 3, textAlign: 'center' }}>
                Создание записи отходов
            </Typography>
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
                    >
                        {companies.map((company) => (
                            <MenuItem key={company.id} value={company.id}>
                                {company.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Модератор"
                        fullWidth
                        select
                        value={form.moderator_id}
                        onChange={(e) => handleChange('moderator_id', e.target.value)}
                        disabled={loadingModerators}
                    >
                        {moderators.map((moderator) => (
                            <MenuItem key={moderator.id} value={moderator.id}>
                                {moderator.name}
                            </MenuItem>
                        ))}
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
                        label="Имя водителя"
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
                    />
                </Grid>
                {/* Динамические элементы */}
                <Grid item xs={12}>
                    <Typography variant="h6">Пункты отходов</Typography>
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
                        disabled={isAddItemDisabled} // Отключить кнопку, если компания и модератор не выбраны
                    >
                        Добавить отход
                    </Button>
                </Grid>
                {/* Кнопка отправки */}
                <Grid item xs={12}>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        color="primary"
                        disabled={isSubmitDisabled} // Отключить кнопку, если поля не заполнены
                    >
                        {loadingSubmit ? 'Создание...' : 'Создать запись'}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default WasteRecordForm;
