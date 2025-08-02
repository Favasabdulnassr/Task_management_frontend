import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import axiosInstance from '../../services/interceptor';

const Dashboard = () => {
  

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [tasks,setTasks] = useState([])


  useEffect(()=>{
    const fetchTasks = async () => {
      try {
        const response = await axiosInstance.get(`/api/my-tasks/`)
        console.log(response.data);
        
        setTasks(response.data)
        scheduled_date

      } catch (error) {
        console.error('error fetching tasks',error)
        
      }

    }
    fetchTasks()
  },[])

 

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getTasksForDate = (date) => {
    const dateStr =  date.toLocaleDateString('en-CA'); // returns YYYY-MM-DD in local time
    return tasks.filter(task => task.scheduled_date === dateStr);
  };

  const navigateMonth = (direction) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const handleShowMoreTasks = (date, dayTasks) => {
    setSelectedDate(date);
    setShowTaskModal(true);
  };

  const closeTaskModal = () => {
    setShowTaskModal(false);
    setSelectedDate(null);
  };

  const getPriorityColor = (priority, status) => {
    if (status === 'completed') {
      return 'bg-green-100 text-green-800 border border-green-200';
    }
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const TaskModal = () => {
    if (!showTaskModal || !selectedDate) return null;

    const selectedDateTasks = getTasksForDate(selectedDate);
    const formattedDate = selectedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-96 flex flex-col">
          <div className="p-4 border-b flex items-center justify-between bg-gray-50 rounded-t-lg">
            <h3 className="text-lg font-semibold text-gray-900">
              Tasks for {formattedDate}
            </h3>
            <button
              onClick={closeTaskModal}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-4 flex-1 overflow-y-auto">
            {selectedDateTasks.length === 0 ? (
              <p className="text-gray-500 text-center">No tasks for this date</p>
            ) : (
              <div className="space-y-3">
                {selectedDateTasks.map(task => (
                  <div
                    key={task.id}
                    className={`p-3 rounded-lg border ${getPriorityColor(task.priority, task.status)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-medium text-sm mb-1 ${task.status === 'completed' ? 'line-through' : ''}`}>
                          {task.title}
                        </h4>
                        <p className="text-xs text-gray-600 mb-2">{task.description}</p>
                        <div className="flex items-center space-x-2 text-xs">
                          <span className="bg-white bg-opacity-70 px-2 py-1 rounded">
                            {task.category}
                          </span>
                          <span className="bg-white bg-opacity-70 px-2 py-1 rounded">
                            {task.priority} priority
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-2">
                        <span className={`${task.status === 'completed' ? 'text-green-600' : 'text-gray-400'} text-sm`}>
                          {task.status === 'completed' ? '✅' : '⭕'}
                        </span>
                      </div>
                    </div>
                   
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-16 sm:h-20 md:h-28 border border-gray-200 bg-gray-50"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayTasks = getTasksForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();

      days.push(
        <div
          key={day}
          className={`h-16 sm:h-20 md:h-28 p-1 sm:p-2 border border-gray-200 ${
            isToday ? 'bg-blue-50 border-blue-300' : 'bg-white'
          }`}
        >
          <div className={`text-xs sm:text-sm font-bold mb-1 ${isToday ? 'text-blue-700' : 'text-gray-900'}`}>
            {day}
          </div>
          <div className="space-y-1">
            {dayTasks.slice(0, 2).map(task => (
              <div
                key={task.id}
                className={`text-xs p-1 rounded-sm flex items-center justify-between ${getPriorityColor(task.priority, task.status)}`}
              >
                <span className={`truncate font-medium text-xs ${task.status === 'completed' ? 'line-through' : ''}`}>
                  {task.title.length > 8 ? `${task.title.substring(0, 8)}...` : task.title}
                </span>
                <span className={`${task.status === 'completed' ? 'text-green-600' : 'text-gray-400'} text-xs ml-1`}>
                  {task.status === 'completed' ? '✅' : '⭕'}
                </span>
              </div>
            ))}
            {dayTasks.length > 2 && (
              <button
                onClick={() => handleShowMoreTasks(date, dayTasks)}
                className="text-xs text-blue-600 hover:text-blue-800 text-center w-full py-1 hover:bg-blue-50 rounded transition-colors cursor-pointer"
              >
                +{dayTasks.length - 2} more
              </button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-between p-3 sm:p-4 border-b bg-gray-50 rounded-t-lg">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            <span className="hidden sm:inline">Calendar View - </span>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
        
        <div className="p-2 sm:p-4">
          <div className="grid grid-cols-7 gap-0 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
              <div key={day} className="p-2 sm:p-3 text-center text-xs sm:text-sm font-bold text-gray-700 bg-gray-100 border border-gray-300">
                <span className="hidden sm:inline">{day}</span>
                <span className="sm:hidden">{day.charAt(0)}</span>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-0 border border-gray-300 rounded overflow-hidden">
            {days}
          </div>
        </div>
      </div>
    );
  };


  return (
    <div className="bg-gray-50 min-h-screen">
     

      <div className="px-4 sm:px-6">
        {/* Mobile-first layout: Stack on small screens, side-by-side on large */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
         

          {/* Calendar View */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            {renderCalendar()}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 sm:mt-6 bg-white rounded-lg shadow-lg p-3 sm:p-4">
          <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">Legend:</h4>
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-green-600">✅</span>
              <span>Completed</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">⭕</span>
              <span>Pending</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-100 border border-red-200 rounded-sm flex-shrink-0"></div>
              <span>High Priority</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-100 border border-yellow-200 rounded-sm flex-shrink-0"></div>
              <span>Medium Priority</span>
            </div>
            <div className="flex items-center space-x-2 col-span-2 sm:col-span-1">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-100 border border-blue-200 rounded-sm flex-shrink-0"></div>
              <span>Low Priority</span>
            </div>
          </div>
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal />
    </div>
  );
};

export default Dashboard;