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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    OutlinedInput,
    Checkbox,
    ListItemText,
    Tabs,
    Tab,
    Alert
} from '@mui/material';
import { AddCircle, CalendarMonth, Download } from '@mui/icons-material';
import DataGridComponent from '../../components/DataGrid/DataGridComponent';
import useModeratorReports from '../../hooks/useModeratorReports';
import useCompaniesList from '../../hooks/useCompaniesList.JSX';
import { useNavigate } from 'react-router-dom';

// Tabs panel component
function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`moderator-tabpanel-${index}`}
            aria-labelledby={`moderator-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

// Constants for multi-select
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

export default function ModeratorDashboard() {
    const [tabValue, setTabValue] = useState(0);
    const [filters, setFilters] = useState({
        start_date: '',
        end_date: '',
        company_ids: []
    });
    const [searchTriggered, setSearchTriggered] = useState(false);
    const { reports, loading, error, exportReport } = useModeratorReports(searchTriggered ? filters : null);
    const navigate = useNavigate();

    // Get current user info
    const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
    const moderatorName = userInfo.name || 'Модератор';
    const moderatorId = userInfo.id; // Получаем ID модератора

    // Используем модифицированный хук для получения компаний данного модератора
    const { companies, loading: loadingCompanies } = useCompaniesList(moderatorId);

    // Для отладки - проверяем структуру полученных данных
    useEffect(() => {
        console.log("Reports data received in ModeratorDashboard:", reports);
    }, [reports]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const handleCompaniesChange = (event) => {
        const {
            target: { value },
        } = event;
        setFilters(prev => ({
            ...prev,
            company_ids: typeof value === 'string' ? value.split(',') : value
        }));
    };

    const handleGenerateReport = () => {
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
            company_ids: []
        });
        setSearchTriggered(false);
    };

    const handleAddCompany = () => {
        navigate('/add-company');
    };

    const handleAddReport = () => {
        navigate('/add-report');
    };

    // Проверяем наличие данных для отображения (используя тот же подход, что и в CompanyDashboard)
    const hasReportData = reports && reports.companies && reports.companies.length > 0;

    // Set current month date range when component loads
    useEffect(() => {
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        const formatDate = (date) => {
            return date.toISOString().split('T')[0]; // YYYY-MM-DD format
        };

        // Теперь не нужно вручную устанавливать moderator_id, он добавляется в useModeratorReports
        setFilters({
            start_date: formatDate(firstDayOfMonth),
            end_date: formatDate(lastDayOfMonth),
            company_ids: []
        });
    }, []);

    return (
        <Box sx={{ padding: 2 }}>
            <Typography
                variant="h4"
                gutterBottom
                sx={{ textAlign: 'center', color: '#1a1f35', fontWeight: 'bold', mb: 3 }}
            >
                Панель управления модератора: {moderatorName}
            </Typography>

            <Tabs
                value={tabValue}
                onChange={handleTabChange}
                centered
                sx={{
                    mb: 3,
                    '& .MuiTab-root': {
                        fontSize: '1rem',
                        textTransform: 'none',
                        fontWeight: 'bold'
                    }
                }}
            >
                <Tab label="Статистика и отчеты" />
                <Tab label="Управление компаниями" />
            </Tabs>

            {/* Reports Tab */}
            <TabPanel value={tabValue} index={0}>
                {/* Summary cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={4}>

                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card sx={{ backgroundColor: '#2196f3', color: 'white', height: '100%' }}>
                            <CardContent>
                                <Typography variant="h5">Всего компаний</Typography>
                                <Typography variant="h3" sx={{ mt: 2 }}>
                                    {companies?.length || '0'}
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>Под управлением</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                    </Grid>
                </Grid>

                {/* Filter section */}
                <Paper sx={{ p: 2, mb: 3 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={3}>
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
                        <Grid item xs={12} md={3}>
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
                        <Grid item xs={12} md={3}>
                            <FormControl fullWidth disabled={loadingCompanies}>
                                <InputLabel id="companies-select-label">
                                    {loadingCompanies ? "Загрузка компаний..." : "Компании"}
                                </InputLabel>
                                <Select
                                    labelId="companies-select-label"
                                    multiple
                                    value={filters.company_ids}
                                    onChange={handleCompaniesChange}
                                    input={<OutlinedInput label={loadingCompanies ? "Загрузка компаний..." : "Компании"} />}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => {
                                                const company = companies.find(c => c.id === value);
                                                return <Chip key={value} label={company?.name || value} size="small" />;
                                            })}
                                        </Box>
                                    )}
                                    MenuProps={MenuProps}
                                >
                                    {loadingCompanies ? (
                                        <MenuItem disabled>
                                            <CircularProgress size={20} sx={{ mr: 1 }} />
                                            Загрузка компаний...
                                        </MenuItem>
                                    ) : companies.length > 0 ? (
                                        companies.map((company) => (
                                            <MenuItem key={company.id} value={company.id}>
                                                <Checkbox checked={filters.company_ids.indexOf(company.id) > -1} />
                                                <ListItemText primary={company.name} />
                                            </MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem disabled>
                                            Нет доступных компаний
                                        </MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={3}>
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

                {/* Add new report button */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<AddCircle />}
                        onClick={handleAddReport}
                    >
                        Добавить новый отчет
                    </Button>
                </Box>

                {/* Error message */}
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {/* Reports data grid - используем тот же подход, что и в CompanyDashboard */}
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
                                {/* Передаем весь объект reports, как в CompanyDashboard */}
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
            </TabPanel>

            {/* Companies Tab */}
            <TabPanel value={tabValue} index={1}>
                <Box sx={{ textAlign: 'right', mb: 3 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddCircle />}
                        onClick={handleAddCompany}
                    >
                        Добавить новую компанию
                    </Button>
                </Box>

                {loadingCompanies ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : companies.length > 0 ? (
                    <Grid container spacing={2}>
                        {companies.map(company => (
                            <Grid item xs={12} md={6} lg={4} key={company.id}>
                                <Card sx={{ height: '100%' }}>
                                    <CardContent>
                                        <Typography variant="h6" component="div">
                                            {company.name}
                                        </Typography>
                                        <Typography color="text.secondary" gutterBottom>
                                            БИН: {company.bin_company || 'Не указан'}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                            {company.description || 'Описание отсутствует'}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Paper sx={{ p: 4, textAlign: 'center' }}>
                        <Typography>
                            У вас пока нет компаний. Нажмите "Добавить новую компанию" чтобы создать компанию.
                        </Typography>
                    </Paper>
                )}
            </TabPanel>
        </Box>
    );
}