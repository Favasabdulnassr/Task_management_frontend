import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Calendar, 
  Target, 
  Save, 
  X, 
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Tag,
  Clock,
  XCircle,
  PlayCircle,
  ChevronDown
} from 'lucide-react';
import axiosInstance from '../../services/interceptor';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(null);
  const { user } = useSelector((state) => state.login);
  

  const [formData, setFormData] = useState({
    user:user?.id,
    title: '',
    description: '',
    priority: 'medium',
    category: 'work',
    status: 'pending' // Added status to form data
  });

  // Updated categories to match Django model choices exactly
  const categories = [
    { value: 'work', label: 'Work' },
    { value: 'personal', label: 'Personal' },
    { value: 'study', label: 'Study' },
    { value: 'health', label: 'Health' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'other', label: 'Other' }
  ];
  
  const priorities = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
  ];

  // Status options with icons and colors
  const statusOptions = [
    { 
      value: 'pending', 
      label: 'Pending', 
      icon: Clock, 
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 hover:bg-yellow-100'
    },
    { 
      value: 'in_progress', 
      label: 'In Progress', 
      icon: PlayCircle, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100'
    },
    { 
      value: 'completed', 
      label: 'Completed', 
      icon: CheckCircle, 
      color: 'text-green-600',
      bgColor: 'bg-green-50 hover:bg-green-100'
    },
    { 
      value: 'cancelled', 
      label: 'Cancelled', 
      icon: XCircle, 
      color: 'text-red-600',
      bgColor: 'bg-red-50 hover:bg-red-100'
    }
  ];

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (searchTerm) params.append('search', searchTerm);
      if (filterStatus !== 'all') params.append('status', filterStatus);
      if (filterPriority !== 'all') params.append('priority', filterPriority);
      if (selectedDate) params.append('scheduled_date', selectedDate);

      const response = await axiosInstance.get(`/api/tasks/?${params.toString()}`);
      console.log(tasks,'aaaaaaaaaaaaaaaaaaaaaa')
      setTasks(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load tasks on component mount and when filters change
  useEffect(() => {
    fetchTasks();
  }, [searchTerm, filterStatus, filterPriority, selectedDate]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showStatusDropdown && !event.target.closest('.status-dropdown')) {
        setShowStatusDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showStatusDropdown]);

  const resetForm = () => {
    setFormData({
      user:user?.id,
      title: '',
      description: '',
      scheduled_date: '',
      priority: 'medium',
      category: 'work',
      status: 'pending'
    });
  };

  const openCreateModal = () => {
    resetForm();
    setEditingTask(null);
    setShowModal(true);
  };

  const openEditModal = (task) => {
    setFormData({
      user:user.id,
      title: task.title,
      description: task.description || '',
      scheduled_date: task.scheduled_date,
      priority: task.priority,
      category: task.category,
      status: task.status || 'pending'
    });
    setEditingTask(task);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.scheduled_date) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      
      if (editingTask) {
        // Update existing task
        await axiosInstance.put(`/api/tasks/Update/${editingTask.id}/`, formData);
        toast.success('Task successfully updated');
      } else {
        // Create new task
        console.log('userrrrrrrrrrrrrrrid',user);
        
        await axiosInstance.post('/api/tasks/', formData);
        toast.success('Task successfully created');
      }

      setShowModal(false);
      resetForm();
      setEditingTask(null);
      fetchTasks(); // Refresh task list
    } catch (error) {
      console.error('Error saving task:', error);
      toast.error('Error saving Task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await axiosInstance.delete(`/api/tasks/Update/${taskId}/`);
      setShowDeleteConfirm(null);
      fetchTasks(); // Refresh task list
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Error deleting task. Please try again.');
    }
  };

  // Updated function to handle all status changes
  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await axiosInstance.patch(`/api/tasks/Update/${taskId}/`, { status: newStatus });
      setShowStatusDropdown(null);
      fetchTasks(); // Refresh task list
      toast.success('Task status updated successfully');
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Error updating task status. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getPriorityColor = (priority, status) => {
    if (status === 'completed') {
      return 'bg-green-100 text-green-800 border-green-200';
    }
    if (status === 'cancelled') {
      return 'bg-red-100 text-red-800 border-red-200';
    }
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'urgent': return <AlertCircle className="w-4 h-4" />;
      case 'high': return <AlertCircle className="w-4 h-4" />;
      case 'medium': return <Target className="w-4 h-4" />;
      case 'low': return <Target className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const getStatusInfo = (status) => {
    return statusOptions.find(option => option.value === status) || statusOptions[0];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  // Helper function to get category label
  const getCategoryLabel = (categoryValue) => {
    const category = categories.find(cat => cat.value === categoryValue);
    return category ? category.label : categoryValue;
  };

  // Helper function to get priority label
  const getPriorityLabel = (priorityValue) => {
    const priority = priorities.find(pri => pri.value === priorityValue);
    return priority ? priority.label : priorityValue;
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
          <p className="text-gray-600">Create, edit, and manage your tasks</p>
        </div>
        
        <button
          onClick={openCreateModal}
          className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create New Task
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="relative">
            <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
            >
              <option value="all">All Priorities</option>
              {priorities.map(priority => (
                <option key={priority.value} value={priority.value}>
                  {priority.label} Priority
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Tasks ({tasks.length})
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {tasks.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No tasks found matching your criteria.</p>
            </div>
          ) : (
            tasks.map(task => {
              const statusInfo = getStatusInfo(task.status);
              const IconComponent = statusInfo.icon;
              
              return (
                <div key={task.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center mb-2">
                        {/* Status Dropdown */}
                        <div className="relative status-dropdown mr-3">
                          <button
                            onClick={() => setShowStatusDropdown(showStatusDropdown === task.id ? null : task.id)}
                            className={`flex items-center px-3 py-1 rounded-lg border-2 transition-colors ${statusInfo.bgColor} ${statusInfo.color} border-current`}
                          >
                            <IconComponent className="w-4 h-4 mr-1" />
                            <span className="text-sm font-medium">{statusInfo.label}</span>
                            <ChevronDown className="w-3 h-3 ml-1" />
                          </button>
                          
                          {showStatusDropdown === task.id && (
                            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[150px]">
                              {statusOptions.map(option => {
                                const OptionIcon = option.icon;
                                return (
                                  <button
                                    key={option.value}
                                    onClick={() => updateTaskStatus(task.id, option.value)}
                                    className={`w-full flex items-center px-3 py-2 text-left transition-colors ${
                                      task.status === option.value 
                                        ? `${option.bgColor} ${option.color}` 
                                        : 'hover:bg-gray-50 text-gray-700'
                                    }`}
                                  >
                                    <OptionIcon className="w-4 h-4 mr-2" />
                                    <span className="text-sm">{option.label}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                        
                        <h3 className={`text-lg font-semibold ${
                          task.status === 'completed' 
                            ? 'line-through text-gray-500' 
                            : task.status === 'cancelled'
                            ? 'line-through text-red-500'
                            : 'text-gray-900'
                        }`}>
                          {task.title}
                        </h3>

                        {isOverdue(task.scheduled_date) && !['completed', 'cancelled'].includes(task.status) && (
                          <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                            Overdue
                          </span>
                        )}
                      </div>

                      <p className="text-gray-600 mb-3">{task.description}</p>

                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <div className={`flex items-center px-3 py-1 rounded-full border ${getPriorityColor(task.priority, task.status)}`}>
                          {getPriorityIcon(task.priority)}
                          <span className="ml-1">{getPriorityLabel(task.priority)}</span>
                        </div>

                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{formatDate(task.scheduled_date)}</span>
                        </div>

                        <div className="flex items-center text-gray-600">
                          <Tag className="w-4 h-4 mr-1" />
                          <span>{getCategoryLabel(task.category)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => openEditModal(task)}
                        className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Task"
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>
                      
                      <button
                        onClick={() => setShowDeleteConfirm(task.id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Task"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingTask ? 'Edit Task' : 'Create New Task'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Enter task title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-vertical"
                  placeholder="Enter task description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date *
                </label>
                <input
                  type="date"
                  name="scheduled_date"
                  value={formData.scheduled_date}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
                  >
                    {priorities.map(priority => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
                  >
                    {statusOptions.map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {submitting ? 'Saving...' : (editingTask ? 'Update Task' : 'Create Task')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Task</h3>
                  <p className="text-gray-600">This action cannot be undone.</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete "{tasks.find(t => t.id === showDeleteConfirm)?.title}"?
              </p>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManagement;