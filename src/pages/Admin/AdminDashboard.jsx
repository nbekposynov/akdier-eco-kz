import { useState, useEffect } from 'react';
import { Typography, Box, Grid, TextField, MenuItem, Button, Checkbox, ListItemText, OutlinedInput, FormControl, InputLabel, Select, CircularProgress } from '@mui/material';
import DataGridComponent from '../../components/DataGrid/DataGridComponent';
import useGenerateReport from '../../hooks/useGenerateReport';
import useCompaniesList from '../../hooks/useCompaniesList';
import useModeratorsList from '../../hooks/useModeratorsList';
import useExportReport from '../../hooks/useExportReport';
import CompanyListService from '../../api/CompanyListService';

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

export default function AdminDashboard() {
    const [filters, setFilters] = useState({
        start_date: '',
        end_date: '',
        moderator_id: '',
        company_ids: [], // Changed from company_id to company_ids for multiple selection
        car_num: '',
        driv_name: ''
    });
    const [searchTriggered, setSearchTriggered] = useState(false);
    const [filteredCompanies, setFilteredCompanies] = useState([]);
    const [loadingCompanies, setLoadingCompanies] = useState(false);

    const { report } = useGenerateReport(searchTriggered ? filters : null);
    const { moderators } = useModeratorsList();
    const { companies } = useCompaniesList();
    const { exportReport } = useExportReport();

    // Function to fetch companies based on selected moderator
    const fetchCompaniesForModerator = async (moderatorId) => {
        if (!moderatorId) {
            setFilteredCompanies(companies);
            return;
        }

        setLoadingCompanies(true);
        try {
            const data = await CompanyListService.getByModerator(moderatorId);
            setFilteredCompanies(data);
        } catch (error) {
            console.error("Error fetching companies for moderator:", error);
            setFilteredCompanies([]);
        } finally {
            setLoadingCompanies(false);
        }
    };

    // Update companies when moderator changes
    useEffect(() => {
        if (filters.moderator_id) {
            fetchCompaniesForModerator(filters.moderator_id);
        } else {
            setFilteredCompanies(companies);
        }
    }, [filters.moderator_id, companies]);

    const handleFilterChange = (field, value) => {
        setFilters(prev => {
            const updated = { ...prev, [field]: value };

            // Reset company selection when moderator changes
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
        // On autofill we get a stringified value.
        const selectedCompanies = typeof value === 'string' ? value.split(',') : value;
        setFilters((prev) => ({ ...prev, company_ids: selectedCompanies }));
    };

    const handleGenerateReport = () => {
        setSearchTriggered(true);
    };

    const handleExport = async () => {
        try {
            await exportReport(filters);
        } catch (error) {
            alert(error.message);
        }
    };

    const isFiltersValid =
        filters.start_date &&
        filters.end_date &&
        filters.moderator_id &&
        filters.company_ids.length > 0;

    return (
        <Box sx={{ padding: 2 }}>
            <Typography
                variant="h4"
                gutterBottom
                sx={{ textAlign: 'center', color: '#1a1f35', fontWeight: 'bold', marginBottom: 3 }}
            >
                Отчеты
            </Typography>

            <Box sx={{ marginBottom: 3, padding: 2, borderRadius: 4, backgroundColor: '#ffffff', boxShadow: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label="Дата от"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={filters.start_date}
                            onChange={(e) => handleFilterChange('start_date', e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label="Дата до"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={filters.end_date}
                            onChange={(e) => handleFilterChange('end_date', e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            select
                            fullWidth
                            label="Модератор"
                            value={filters.moderator_id}
                            onChange={(e) => handleFilterChange('moderator_id', e.target.value)}
                        >
                            <MenuItem value="">Выберите модератора</MenuItem>
                            {moderators.map((moderator) => (
                                <MenuItem key={moderator.id} value={moderator.id}>
                                    {moderator.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={4}>
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
                                renderValue={(selected) => {
                                    if (selected.length === 0) {
                                        return <em>Выберите компании</em>;
                                    }
                                    return selected.map(id => {
                                        const company = filteredCompanies.find(c => c.id === id) ||
                                            companies.find(c => c.id === id);
                                        return company?.name || id;
                                    }).join(', ');
                                }}
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
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label="Поиск по номеру машины"
                            value={filters.car_num}
                            InputLabelProps={{ shrink: true }}
                            onChange={(e) => handleFilterChange('car_num', e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label="Поиск по имени водителя"
                            value={filters.driv_name}
                            InputLabelProps={{ shrink: true }}
                            onChange={(e) => handleFilterChange('driv_name', e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Grid container spacing={1}>
                            <Grid item xs={4}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    disabled={!isFiltersValid}
                                    sx={{
                                        borderRadius: 2,
                                        backgroundColor: !isFiltersValid ? '#d6d6d6' : '#4681f4',
                                        color: 'white',
                                        textTransform: 'none',
                                        fontSize: '0.875rem',
                                        '&:hover': { backgroundColor: !isFiltersValid ? '#d6d6d6' : '#3a6ac7' },
                                    }}
                                    onClick={handleGenerateReport}
                                >
                                    Поиск
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
                                        textTransform: 'none',
                                        fontSize: '0.875rem',
                                        '&:hover': { backgroundColor: '#4ca98e' },
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
                                        backgroundColor: '#dd7973',
                                        color: 'white',
                                        textTransform: 'none',
                                        fontSize: '0.875rem',
                                        '&:hover': { backgroundColor: '#c56b65' },
                                    }}
                                    onClick={() => {
                                        setFilters({
                                            start_date: '',
                                            end_date: '',
                                            moderator_id: '',
                                            company_ids: [],
                                            car_num: '',
                                            driv_name: ''
                                        });
                                        setSearchTriggered(false);
                                    }}
                                >
                                    Очистить
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>

            {report && report.companies && report.companies.length > 0 && (
                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12}>
                        <DataGridComponent data={report} />
                    </Grid>
                </Grid>
            )}
        </Box>
    );
}
