import { TextField, Button, Container, Typography, Box, Avatar, Paper, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { useState } from 'react';
import logo from '../../assets/logo.png'; // Логотип

const LoginPage = ({ setRole, setToken }) => { // Получаем setRole через пропсы
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { handleLogin } = useAuth();
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const onSubmit = async () => {
        setError('');
        try {
            const response = await handleLogin(email, password);
            console.log("Login response:", response); // Вывод полного ответа для отладки

            // Добавляем проверку на наличие данных
            if (!response || !response.user) {
                throw new Error("Некорректный ответ от сервера");
            }

            const { token, role, user } = response;

            localStorage.setItem('token', token);
            localStorage.setItem('user_role', role);

            // Сохраняем полные данные пользователя в localStorage
            const userInfo = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                // Дополнительно сохраняем специфичные поля для компаний
                bin_company: user.bin_company,
                moderator_id: user.moderator_id
            };

            localStorage.setItem('user_info', JSON.stringify(userInfo));

            // Выводим сохраненные данные для отладки
            console.log("Saved user info:", userInfo);
            console.log("User info in localStorage:", localStorage.getItem('user_info'));

            // Устанавливаем глобальные состояния для роли и токена
            setRole(role);
            setToken(token);

            // Переходим на страницу дашборда
            navigate('/dashboard');
        } catch (error) {
            console.error("Login error:", error);
            setError(error.message || "Произошла ошибка при входе");
        }
    };


    return (
        <Container
            maxWidth="sm"
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh', // Задает высоту на весь экран
            }}
        >
            <Paper
                elevation={3}
                style={{
                    padding: '2rem',
                    borderRadius: '1rem',
                    overflow: 'hidden',
                    textAlign: 'center',
                }}
            >
                <Box textAlign="center" mb={4}>
                    <Avatar
                        src={logo}
                        alt="Logo"
                        style={{
                            margin: '0 auto',
                            width: '100px',
                            height: '100px',
                        }}
                    />
                </Box>
                <Typography variant="h4" align="center" gutterBottom>
                    Авторизация
                </Typography>
                <TextField
                    fullWidth
                    margin="normal"
                    label="Электронная почта"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Пароль"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={togglePasswordVisibility}>
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                {error && (
                    <Typography
                        variant="body2"
                        color="error"
                        style={{
                            marginTop: '1rem',
                            textAlign: 'center', // Центрируем ошибку
                        }}
                    >
                        {error}
                    </Typography>
                )}
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={onSubmit}
                    style={{ marginTop: '1rem', padding: '0.75rem' }}
                >
                    Авторизация
                </Button>
            </Paper>
        </Container >
    );
};

export default LoginPage;
