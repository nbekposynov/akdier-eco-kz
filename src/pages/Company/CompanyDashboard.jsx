import { useState, useEffect } from 'react';
import {
    Typography,
    Box,
    Grid,
    TextField,
    Button,
    CircularProgress,
    Paper,
    Card,
    CardContent,
    Alert
} from '@mui/material';
import DataGridComponent from '../../components/DataGrid/DataGridComponent';
import useCompanyReports from '../../hooks/useCompanyReports';
import { CalendarMonth, Download } from '@mui/icons-material';

export default function CompanyDashboard() {
    const [filters, setFilters] = useState({
        start_date: '',
        end_date: '',
    });
    const [searchTriggered, setSearchTriggered] = useState(false);
    const { reports, loading, error, exportReport } = useCompanyReports(searchTriggered ? filters : null);

    // Get current user info from localStorage
    const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
    const companyName = userInfo.name || 'Компания';

    // Для отладки - проверяем полученные данные отчетов
    useEffect(() => {
        console.log("Reports data received:", reports);
    }, [reports]);

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const handleGenerateReport = () => {
        // Проверяем заполнение полей
        if (!filters.start_date || !filters.end_date) {
            alert('Пожалуйста, выберите даты начала и окончания периода');
            return;
        }
        setSearchTriggered(true);
        console.log("Search triggered with filters:", filters);
    };

    const handleExport = async () => {
        try {
            await exportReport(filters);
        } catch (err) {
            console.error('Export error:', err);
            alert(`Ошибка при экспорте: ${err.message}`);
        }
    };

    const handleClearFilters = () => {
        setFilters({
            start_date: '',
            end_date: '',
        });
        setSearchTriggered(false);
    };

    // Set current month date range when component loads
    useEffect(() => {
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        const formatDate = (date) => {
            return date.toISOString().split('T')[0]; // YYYY-MM-DD format
        };

        setFilters({
            start_date: formatDate(firstDayOfMonth),
            end_date: formatDate(lastDayOfMonth),
        });
    }, []);

    // Проверяем наличие данных для отображения (упрощаем проверку)
    const hasReportData = reports && reports.companies && reports.companies.length > 0;

    return (
        <Box sx={{ padding: 2 }}>
            <Typography
                variant="h4"
                gutterBottom
                sx={{ textAlign: 'center', color: '#1a1f35', fontWeight: 'bold', mb: 3 }}
            >
                Панель управления {companyName}
            </Typography>

            {/* Summary cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                    <Card sx={{ backgroundColor: '#4caf50', color: 'white', height: '100%' }}>
                        <CardContent>
                            <Typography variant="h5">Текущий месяц</Typography>
                            <Typography variant="h3" sx={{ mt: 2 }}>
                                {reports?.summary?.current_month || '0'} м³
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>Объем отходов</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card sx={{ backgroundColor: '#2196f3', color: 'white', height: '100%' }}>
                        <CardContent>
                            <Typography variant="h5">Всего переработано</Typography>
                            <Typography variant="h3" sx={{ mt: 2 }}>
                                {reports?.summary?.total || '0'} м³
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>За все время</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card sx={{ backgroundColor: '#ff9800', color: 'white', height: '100%' }}>
                        <CardContent>
                            <Typography variant="h5">Всего отчетов</Typography>
                            <Typography variant="h3" sx={{ mt: 2 }}>
                                {reports?.summary?.reports_count || '0'}
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>Количество записей</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Filter section */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label="Дата от"
                            type="date"
                            value={filters.start_date}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                                startAdornment: <CalendarMonth sx={{ color: 'action.active', mr: 1 }} />
                            }}
                            onChange={(e) => handleFilterChange('start_date', e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label="Дата до"
                            type="date"
                            value={filters.end_date}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                                startAdornment: <CalendarMonth sx={{ color: 'action.active', mr: 1 }} />
                            }}
                            onChange={(e) => handleFilterChange('end_date', e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Grid container spacing={1}>
                            <Grid item xs={4}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    color="primary"
                                    disabled={!filters.start_date || !filters.end_date || loading}
                                    onClick={handleGenerateReport}
                                >
                                    {loading ? <CircularProgress size={24} /> : 'Показать'}
                                </Button>
                            </Grid>
                            <Grid item xs={4}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    color="secondary"
                                    onClick={handleExport}
                                    startIcon={<Download />}
                                >
                                    Экспорт
                                </Button>
                            </Grid>
                            <Grid item xs={4}>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    color="error"
                                    onClick={handleClearFilters}
                                >
                                    Очистить
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>

            {/* Error message */}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Reports data grid - упрощаем, просто передаем весь объект reports */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress />
                </Box>
            ) : searchTriggered && reports ? (
                <>
                    {hasReportData ? (
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Отчеты по отходам
                            </Typography>
                            {/* Просто передаем весь объект reports, как в AdminDashboard */}
                            <DataGridComponent data={reports} />
                        </Box>
                    ) : (
                        <Alert severity="info">По заданным параметрам данных не найдено</Alert>
                    )}
                </>
            ) : (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography>
                        Выберите период и нажмите "Показать" для просмотра отчетов
                    </Typography>
                </Paper>
            )}
        </Box>
    );
}