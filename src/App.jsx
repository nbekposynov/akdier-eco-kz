import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ModeratorDashboard from './pages/Moderator/ModeratorDashboard';
import CompanyDashboard from './pages/Company/CompanyDashboard';
import DataGrid from './components/DataGrid/DataGridComponent';
import Sidebar from './components/Sidebar/Sidebar';
import WasteRecordForm from './pages/Admin/WasteRecordForm';
import WasteCategoryPage from './pages/Admin/WasteCategoryPage';
import FinalWasteTypePage from './pages/Admin/FinalWasteTypePage';
import WastePage from './pages/Admin/WastePage';
import WasteRecordPage from './pages/Admin/WasteRecordPage';
import FinalProcessingReportPage from './pages/Admin/FinalProcessingReportPage';
import UsersPage from './pages/Admin/UsersPage';
import AddCompanyPage from './pages/Moderator/AddCompanyPage';
import AddReportPage from './pages/Moderator/AddReportPage';

const App = () => {
    const [role, setRole] = useState(() => localStorage.getItem('user_role'));
    const [token, setToken] = useState(() => localStorage.getItem('token'));

    useEffect(() => {
        if (role) {
            localStorage.setItem('user_role', role);
        }
        if (token) {
            localStorage.setItem('token', token);
        }
    }, [role, token]);

    const handleLogout = () => {
        setRole(null);
        setToken(null);
        localStorage.removeItem('user_role');
        localStorage.removeItem('token');
    };

    const renderRoutes = () => {
        switch (role) {
            case 'admin':
                return (
                    <>
                        <Route path="/dashboard" element={<AdminDashboard />} />
                        <Route path="/add-report" element={<WasteRecordForm />} />
                        <Route path="/waste-categories" element={<div><WasteCategoryPage /></div>} />
                        <Route path="/final-waste-types" element={<FinalWasteTypePage />} />
                        <Route path="/waste-add" element={<WastePage />} />
                        <Route path='/waste-record-edit' element={<WasteRecordPage />} />
                        <Route path="/final-processing-reports" element={<FinalProcessingReportPage />} />
                        <Route path="/users" element={<UsersPage />} />
                    </>
                );
            case 'moderator':
                return (
                    <>
                        <Route path="/dashboard" element={<ModeratorDashboard />} />
                        <Route path="/add-company" element={<AddCompanyPage />} />
                        <Route path="/add-report" element={<AddReportPage />} />
                    </>
                );
            case 'company':
                return (
                    <>
                        <Route path="/dashboard" element={<CompanyDashboard />} />
                        <Route path="/reports" element={<DataGrid />} />
                    </>
                );
            default:
                return <Route path="*" element={<Navigate to="/" />} />;
        }
    };

    return (
        <Router>
            <div style={{ display: 'flex' }}>
                {token && role ? (
                    <>
                        <Sidebar role={role} handleLogout={handleLogout} />
                        <div style={{ marginLeft: 10, flex: 1, padding: 20 }}>
                            <Routes>{renderRoutes()}</Routes>
                        </div>
                    </>
                ) : (
                    <Routes>
                        <Route path="/" element={<LoginPage setRole={setRole} setToken={setToken} />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                )}
            </div>
        </Router>
    );

};

export default App;