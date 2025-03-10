import { useState } from 'react';
import {
    Typography,
    Box,
    Paper,
    TextField,
    Button,
    CircularProgress,
    Alert,
    Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { UserService } from '../../api/UserService';

export default function AddCompanyPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        bin_company: '',
        description: '',
        role: 'company' // Always company role
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const userData = {
                ...formData,
                // The API will automatically assign the company to the current moderator
            };

            await UserService.createUser(userData);
            setSuccess('Компания успешно добавлена');

            // Reset form
            setFormData({
                name: '',
                email: '',
                password: '',
                bin_company: '',
                description: '',
                role: 'company'
            });

            // Redirect after successful creation
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);

        } catch (err) {
            console.error('Error adding company:', err);
            setError(err.response?.data?.message || 'Ошибка при создании компании');
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = () => {
        return (
            formData.name.trim() !== '' &&
            formData.email.trim() !== '' &&
            formData.password.trim() !== '' &&
            formData.bin_company.trim() !== ''
        );
    };

    return (
        <Box sx={{ padding: 2 }}>
            <Typography
                variant="h4"
                gutterBottom
                sx={{ textAlign: 'center', color: '#1a1f35', fontWeight: 'bold', mb: 3 }}
            >
                Добавить новую компанию
            </Typography>

            <Paper sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {success}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Название компании"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                margin="normal"
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="БИН компании"
                                name="bin_company"
                                value={formData.bin_company}
                                onChange={handleChange}
                                required
                                margin="normal"
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                margin="normal"
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Пароль"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                margin="normal"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Описание"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                multiline
                                rows={4}
                                margin="normal"
                            />
                        </Grid>

                        <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => navigate('/dashboard')}
                            >
                                Отмена
                            </Button>

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={loading || !isFormValid()}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Добавить компанию'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
}
