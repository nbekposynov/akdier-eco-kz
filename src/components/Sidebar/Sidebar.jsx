import { Drawer, List, ListItem, ListItemText, IconButton, Box, Avatar, Typography, Collapse } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PostAddIcon from '@mui/icons-material/PostAdd';
import SettingsIcon from '@mui/icons-material/Settings';
import BarChartIcon from '@mui/icons-material/BarChart';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import RecyclingIcon from '@mui/icons-material/Recycling';
import { useState } from 'react';
import logo from '../../assets/logo.png';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
const Sidebar = ({ role, handleLogout }) => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(true);
    const [openSubmenus, setOpenSubmenus] = useState({}); // Храним состояние для каждого подменю

    const handleSubmenuToggle = (menuName) => {
        setOpenSubmenus((prev) => ({
            ...prev,
            [menuName]: !prev[menuName], // Переключаем конкретное подменю
        }));
    };

    const menuItems = {
        admin: [
            { text: 'Отчеты', path: '/dashboard', icon: <DashboardIcon /> },
            { text: 'Добавление отчета', path: '/add-report', icon: <PostAddIcon /> },
            {
                text: 'Отходы',
                icon: <RecyclingIcon />,
                children: [
                    { text: 'Добавление категории', path: '/waste-categories' },
                    { text: 'Добавления типа таб.5', path: '/final-waste-types' },
                    { text: 'Добавления отхода', path: '/waste-add' },
                    { text: 'Редактирование записей отходов', path: '/waste-record-edit' }
                ],
            },
            {
                text: 'Отчет 5',
                icon: <AssessmentIcon />,
                children: [
                    { text: 'Отчеты', path: '/final-processing-reports' },
                ],
            },

            {
                text: 'Пользователи',
                path: '/users',
                icon: <SupervisedUserCircleIcon />,
            },


        ],
        moderator:
            [
                { text: 'Панель управления', icon: <DashboardIcon />, path: '/dashboard' },
                { text: 'Добавить компанию', icon: <SupervisedUserCircleIcon />, path: '/add-company' },
                { text: 'Добавить запись', icon: <PostAddIcon />, path: '/add-report' },
                { text: 'Записи отходов', icon: <RecyclingIcon />, path: '/waste-record-edit' },
                { text: 'Отчет по финальной обработке', icon: <AssessmentIcon />, path: '/final-processing-reports' },
            ],
        company:
            [
                { text: 'Панель управления', icon: <DashboardIcon />, path: '/dashboard' },
            ]
    };

    if (!role) return null;

    return (
        <Box sx={{ display: 'flex' }}>
            <Drawer
                variant="permanent"
                anchor="left"
                open={open}
                sx={{
                    width: open ? 240 : 60,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: open ? 240 : 60,
                        transition: 'width 0.3s',
                        overflowX: 'hidden',
                        backgroundColor: '#1a1f35',
                        color: '#ffffff',
                    },
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', padding: 2 }}>
                    <Avatar
                        src={logo}
                        alt="Logo"
                        style={{
                            marginBottom: open ? 16 : 0,
                            width: open ? 70 : 40,
                            height: open ? 70 : 40,
                            transition: 'all 0.3s',
                        }}
                    />
                    <IconButton onClick={() => setOpen(!open)} sx={{ color: '#ffffff' }}>
                        <MenuIcon />
                    </IconButton>
                </Box>
                <List>
                    {(menuItems[role] || []).map((item, index) => (
                        <>
                            {!item.children ? (
                                <ListItem
                                    button
                                    key={index}
                                    onClick={() => navigate(item.path)}
                                    sx={{ display: 'flex', justifyContent: open ? 'flex-start' : 'center', color: '#ffffff' }}
                                >
                                    {item.icon}
                                    {open && <ListItemText primary={item.text} sx={{ marginLeft: 2 }} />}
                                </ListItem>
                            ) : (
                                <>
                                    <ListItem
                                        button
                                        key={index}
                                        onClick={() => handleSubmenuToggle(item.text)} // Передаем название подменю
                                        sx={{ display: 'flex', justifyContent: open ? 'flex-start' : 'center', color: '#ffffff' }}
                                    >
                                        {item.icon}
                                        {open && <ListItemText primary={item.text} sx={{ marginLeft: 2 }} />}
                                        {open && (openSubmenus[item.text] ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
                                    </ListItem>
                                    {open && (
                                        <Collapse in={openSubmenus[item.text]} timeout="auto" unmountOnExit>
                                            <List component="div" disablePadding>
                                                {item.children.map((child, childIndex) => (
                                                    <ListItem
                                                        button
                                                        key={childIndex}
                                                        onClick={() => open && navigate(child.path)}
                                                        sx={{
                                                            pl: 4,
                                                            color: '#ffffff',
                                                            pointerEvents: open ? 'auto' : 'none',
                                                        }}
                                                    >
                                                        <ListItemText primary={child.text} />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </Collapse>
                                    )}
                                </>
                            )}
                        </>
                    ))}
                </List>
                <Box
                    sx={{
                        marginTop: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: open ? 'flex-start' : 'center',
                        padding: 2,
                    }}
                >
                    <IconButton onClick={handleLogout} sx={{ color: '#ffffff', marginRight: open ? 1 : 0 }}>
                        <LogoutIcon />
                    </IconButton>
                    {open && (
                        <Typography variant="body1" sx={{ color: '#ffffff' }}>
                            Выход
                        </Typography>
                    )}
                </Box>
            </Drawer>
        </Box>
    );
};

export default Sidebar;
