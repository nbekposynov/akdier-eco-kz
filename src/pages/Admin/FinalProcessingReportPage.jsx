import { useState, useEffect } from 'react';
import {
    Typography,
    Box,
    Grid,
    TextField,
    MenuItem,
    Button,
    CircularProgress,
    Select,
    FormControl,
    InputLabel,
    Chip,
    OutlinedInput,
    Checkbox,
    ListItemText
} from '@mui/material';
import OperationsDataGrid from '../../components/DataGrid/OperationsDataGrid';
import useGenerateFinalProcessingReport from '../../hooks/useGenerateFinalProcessingReport';
import useCompaniesList from '../../hooks/useCompaniesList';
import useModeratorsList from '../../hooks/useModeratorsList';
import useExportFinalProcessingReport from '../../hooks/useExportFinalProcessingReport';
import CompanyListService from '../../api/CompanyListService'; // Add this import

// Constants for multi-select dropdown
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

export default function FinalProcessingReportPage() {
    const [filters, setFilters] = useState({
        start_date: '',
        end_date: '',
        company_ids: [],
        moderator_id: ''
    });
    const [searchFilters, setSearchFilters] = useState(null);
    const [searchTriggered, setSearchTriggered] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [loadingCompanies, setLoadingCompanies] = useState(false);

    // Get report data from hooks
    const { report } = useGenerateFinalProcessingReport(searchFilters);
    const { moderators } = useModeratorsList();
    const { exportReport } = useExportFinalProcessingReport();

    // Use moderator_id from filters to fetch filtered companies
    const [filteredCompanies, setFilteredCompanies] = useState([]);
    const { companies: allCompanies } = useCompaniesList();

    // Function to fetch companies based on selected moderator
    const fetchModeratorCompanies = async (moderatorId) => {
        if (!moderatorId) {
            setFilteredCompanies(allCompanies);
            return;
        }

        setLoadingCompanies(true);
        try {
            const data = await CompanyListService.getByModerator(moderatorId);
            setFilteredCompanies(data);
        } catch (error) {
            console.error("Error fetching companies by moderator:", error);
            setFilteredCompanies([]);
        } finally {
            setLoadingCompanies(false);
        }
    };

    // Update companies when moderator changes
    useEffect(() => {
        if (filters.moderator_id) {
            fetchModeratorCompanies(filters.moderator_id);
        } else {
            setFilteredCompanies(allCompanies);
        }
    }, [filters.moderator_id, allCompanies]);

    const handleFilterChange = (field, value) => {
        setFilters(prev => {
            const updated = { ...prev, [field]: value };

            // If moderator changes, reset company selection
            if (field === 'moderator_id') {
                updated.company_ids = [];
            }

            return updated;
        });
    };

    const handleCompaniesChange = (event) => {
        const {
            target: { value },
        } = event;
        setFilters((prev) => ({
            ...prev,
            company_ids: typeof value === 'string' ? value.split(',') : value
        }));
    };

    const handleClearFilters = () => {
        setFilters({
            start_date: '',
            end_date: '',
            company_ids: [],
            moderator_id: ''
        });
        setSearchTriggered(false);
    };

    const handleGenerateReport = () => {
        if (filters.start_date && filters.end_date) {
            setLoading(true);
            setError(null);
            setSearchFilters(filters);
            setSearchTriggered(true);
        } else {
            setError("Выберите период для отчета");
        }
    };

    const handleExport = async () => {
        if (!filters.start_date || !filters.end_date) {
            setError("Выберите период для отчета");
            return;
        }

        try {
            await exportReport(filters);
        } catch (err) {
            setError("Ошибка при экспорте отчета");
        }
    };

    useEffect(() => {
        if (report) {
            setLoading(false);
        }
    }, [report]);

    return (
        <Box sx={{ padding: 2 }}>
            <Typography
                variant="h4"
                gutterBottom
                sx={{ textAlign: 'center', color: '#1a1f35', fontWeight: 'bold', mb: 3 }}
            >
                Отчет по Финальной Обработке
            </Typography>

            <Box sx={{ mb: 3, p: 2, borderRadius: 2, backgroundColor: '#ffffff', boxShadow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            label="Дата от"
                            type="date"
                            value={filters.start_date}
                            InputLabelProps={{ shrink: true }}
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
                            onChange={(e) => handleFilterChange('end_date', e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                            <InputLabel id="moderator-select-label">Модератор</InputLabel>
                            <Select
                                labelId="moderator-select-label"
                                value={filters.moderator_id}
                                onChange={(e) => handleFilterChange('moderator_id', e.target.value)}
                                label="Модератор"
                            >
                                <MenuItem value="">Все модераторы</MenuItem>
                                {moderators.map((mod) => (
                                    <MenuItem key={mod.id} value={mod.id}>
                                        {mod.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
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
                                            const company = filteredCompanies.find(c => c.id === value) ||
                                                allCompanies.find(c => c.id === value);
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
                                ) : filteredCompanies.length > 0 ? (
                                    filteredCompanies.map((company) => (
                                        <MenuItem key={company.id} value={company.id}>
                                            <Checkbox checked={filters.company_ids.indexOf(company.id) > -1} />
                                            <ListItemText primary={company.name} />
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem disabled>
                                        {filters.moderator_id ? "Нет компаний для этого модератора" : "Выберите модератора для фильтрации компаний"}
                                    </MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={1}>
                            <Grid item xs={4}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    sx={{
                                        borderRadius: 2,
                                        backgroundColor: '#4681f4',
                                        color: 'white',
                                        textTransform: 'none'
                                    }}
                                    onClick={handleGenerateReport}
                                    disabled={loading}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Сформировать отчет'}
                                </Button>
                            </Grid>
                            <Grid item xs={4}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    sx={{
                                        borderRadius: 2,
                                        backgroundColor: '#5dbea3',
                                        color: 'white',
                                        textTransform: 'none'
                                    }}
                                    onClick={handleExport}
                                >
                                    Экспорт
                                </Button>
                            </Grid>
                            <Grid item xs={4}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    sx={{
                                        borderRadius: 2,
                                        backgroundColor: '#ef5350',
                                        color: 'white',
                                        textTransform: 'none'
                                    }}
                                    onClick={handleClearFilters}
                                >
                                    Очистить
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                {error && (
                    <Typography color="error" sx={{ mt: 2 }}>
                        {error}
                    </Typography>
                )}
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                searchTriggered && report && (
                    <OperationsDataGrid data={report} unitType="т" />
                )
            )}
        </Box>
    );
}
