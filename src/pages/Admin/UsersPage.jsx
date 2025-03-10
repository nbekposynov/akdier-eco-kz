import React, { useEffect, useState } from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TextField,
    IconButton,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Tooltip,
    CircularProgress,
    Alert,
    Stack,
    InputAdornment
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    Add as AddIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import { useUsers } from '../../hooks/useUsers';

export const UsersPage = () => {
    const {
        users,
        loading,
        error,
        meta,
        filters,
        fetchUsers,
        updateUser,
        deleteUser,
        createUser
    } = useUsers();

    const [search, setSearch] = useState('');
    const [role, setRole] = useState('all');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [editUser, setEditUser] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [editFormData, setEditFormData] = useState({
        name: '',
        email: '',
        role: '',
        bin_company: '',
        description: ''
    });
    const [newUserData, setNewUserData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'company',
        bin_company: '',
        description: ''
    });

    const isAdmin = localStorage.getItem('user_role') === 'admin';

    useEffect(() => {
        const params = {
            page: page + 1,
            per_page: rowsPerPage,
            search,
        };

        if (role !== 'all') {
            params.role = role;
        }

        fetchUsers(params);
    }, [page, rowsPerPage, search, role]);

    // Show success message for 3 seconds then hide it
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleEditClick = (user) => {
        setEditUser(user);
        setEditFormData({
            name: user.name,
            email: user.email,
            role: user.role,
            bin_company: user.bin_company || '',
            description: user.description || ''
        });
    };

    const handleEditSave = async () => {
        try {
            await updateUser(editUser.id, editFormData);
            setEditUser(null);
            setSuccessMessage('Пользователь успешно обновлен');
        } catch (error) {
            console.error('Failed to update user:', error);
        }
    };

    const handleDeleteConfirm = async () => {
        if (deleteConfirm) {
            try {
                await deleteUser(deleteConfirm.id);
                setDeleteConfirm(null);
                setSuccessMessage('Пользователь успешно удален');
            } catch (error) {
                console.error('Failed to delete user:', error);
            }
        }
    };

    const handleAddUser = async () => {
        try {
            await createUser(newUserData);
            setShowAddDialog(false);
            setNewUserData({
                name: '',
                email: '',
                password: '',
                role: 'company',
                bin_company: '',
                description: ''
            });
            setSuccessMessage('Пользователь успешно добавлен');
            fetchUsers({
                page: page + 1,
                per_page: rowsPerPage,
                search,
                role: role === 'all' ? '' : role
            });
        } catch (error) {
            console.error('Failed to create user:', error);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const renderActionButtons = (user) => {
        if (!isAdmin) return null;

        return (
            <>
                <Tooltip title="Редактировать">
                    <IconButton onClick={() => handleEditClick(user)}>
                        <EditIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Удалить">
                    <IconButton onClick={() => setDeleteConfirm(user)}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </>
        );
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Управление пользователями
            </Typography>

            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                <TextField
                    size="small"
                    label="Поиск"
                    variant="outlined"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    InputProps={{
                        endAdornment: <SearchIcon color="action" />
                    }}
                />

                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Роль</InputLabel>
                    <Select
                        value={role}
                        label="Роль"
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <MenuItem value="all">Все</MenuItem>
                        <MenuItem value="moderator">Модератор</MenuItem>
                        <MenuItem value="company">Компания</MenuItem>
                    </Select>
                </FormControl>

                {isAdmin && (
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => setShowAddDialog(true)}
                    >
                        Добавить пользователя
                    </Button>
                )}
            </Stack>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {successMessage && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {successMessage}
                </Alert>
            )}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Имя</TableCell>
                            <TableCell>Эл. почта</TableCell>
                            <TableCell>Роль</TableCell>
                            <TableCell>БИН</TableCell>
                            <TableCell>Дата создания</TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>{user.bin_company || '-'}</TableCell>
                                    <TableCell>
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        {renderActionButtons(user)}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={meta.total || 0}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>

            {/* Edit Dialog */}
            <Dialog open={!!editUser} onClose={() => setEditUser(null)}>
                <DialogTitle>Редактировать пользователя</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ pt: 2 }}>
                        <TextField
                            label="Имя"
                            value={editFormData.name}
                            onChange={(e) => setEditFormData(prev => ({
                                ...prev,
                                name: e.target.value
                            }))}
                        />
                        <TextField
                            label="Эл. почта"
                            value={editFormData.email}
                            onChange={(e) => setEditFormData(prev => ({
                                ...prev,
                                email: e.target.value
                            }))}
                        />
                        <FormControl>
                            <InputLabel>Роль</InputLabel>
                            <Select
                                value={editFormData.role}
                                label="Роль"
                                onChange={(e) => setEditFormData(prev => ({
                                    ...prev,
                                    role: e.target.value
                                }))}
                            >
                                <MenuItem value="moderator">Модератор</MenuItem>
                                <MenuItem value="company">Компания</MenuItem>
                                <MenuItem value="user">Пользователь</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            label="БИН"
                            value={editFormData.bin_company}
                            onChange={(e) => setEditFormData(prev => ({
                                ...prev,
                                bin_company: e.target.value
                            }))}
                        />
                        <TextField
                            label="Описание"
                            multiline
                            rows={4}
                            value={editFormData.description}
                            onChange={(e) => setEditFormData(prev => ({
                                ...prev,
                                description: e.target.value
                            }))}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditUser(null)}>Отмена</Button>
                    <Button onClick={handleEditSave} variant="contained">
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
                <DialogTitle>Подтверждение удаления</DialogTitle>
                <DialogContent>
                    Вы уверены, что хотите удалить пользователя {deleteConfirm?.name}?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirm(null)}>Отмена</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        Удалить
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Add User Dialog */}
            <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Добавить нового пользователя</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ pt: 2 }}>
                        <TextField
                            fullWidth
                            label="Имя"
                            value={newUserData.name}
                            onChange={(e) => setNewUserData(prev => ({
                                ...prev,
                                name: e.target.value
                            }))}
                        />
                        <TextField
                            fullWidth
                            label="Электронная почта"
                            type="email"
                            value={newUserData.email}
                            onChange={(e) => setNewUserData(prev => ({
                                ...prev,
                                email: e.target.value
                            }))}
                        />
                        <TextField
                            fullWidth
                            label="Пароль"
                            type={showPassword ? 'text' : 'password'}
                            value={newUserData.password}
                            onChange={(e) => setNewUserData(prev => ({
                                ...prev,
                                password: e.target.value
                            }))}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={togglePasswordVisibility}>
                                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                        <FormControl fullWidth>
                            <InputLabel>Роль</InputLabel>
                            <Select
                                value={newUserData.role}
                                label="Роль"
                                onChange={(e) => setNewUserData(prev => ({
                                    ...prev,
                                    role: e.target.value
                                }))}
                            >
                                <MenuItem value="admin">Администратор</MenuItem>
                                <MenuItem value="moderator">Модератор</MenuItem>
                                <MenuItem value="company">Компания</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            label="БИН компании"
                            value={newUserData.bin_company}
                            onChange={(e) => setNewUserData(prev => ({
                                ...prev,
                                bin_company: e.target.value
                            }))}
                        />
                        <TextField
                            fullWidth
                            label="Описание"
                            multiline
                            rows={4}
                            value={newUserData.description}
                            onChange={(e) => setNewUserData(prev => ({
                                ...prev,
                                description: e.target.value
                            }))}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowAddDialog(false)}>Отмена</Button>
                    <Button onClick={handleAddUser} variant="contained" color="primary">
                        Добавить
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UsersPage;
