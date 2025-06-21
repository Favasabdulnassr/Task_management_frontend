import React, { useEffect, useState } from 'react';
import { User, Target, LayoutDashboard, Search, Bell, Menu, X, LogOut } from 'lucide-react';
import Dashboard from './Dashboard';
import ProfilePage from './ProfilePage';
import TaskManagement from './TaskManagement';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../Redux/Reducers/LoginReducer';
import { useNavigate } from 'react-router-dom';

const TaskApp = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector((state) => state.login);



   useEffect(() => {
      if (isAuthenticated === true) {
        navigate('/taskApp')
      } else {
        navigate('/')
      }
    }, [isAuthenticated])
  

  const handleLogout = () => {
    // Handle logout logic here
    dispatch(logout())
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'Tasks', label: 'Tasks', icon: Target },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-white rounded-lg shadow-lg border border-gray-200"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">TaskManager</h2>
            <p className="text-sm text-gray-600">Organize your life</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setCurrentPage(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                        currentPage === item.id
                          ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-700 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">John Doe</p>
                <p className="text-xs text-gray-600">john.doe@example.com</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 text-left rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900 ml-12 lg:ml-0">
                {navigationItems.find(item => item.id === currentPage)?.label}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="min-h-screen">
          {currentPage === 'dashboard' && <Dashboard />}
          {currentPage === 'profile' && <ProfilePage />}
          {currentPage === 'Tasks' && <TaskManagement />}
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-gray bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default TaskApp;