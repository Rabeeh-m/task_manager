
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskManagement = ({ userRole, userId }) => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assigned_to: '',
    due_date: '',
  });
  const [error, setError] = useState('');
  const [reportModal, setReportModal] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get('http://localhost:8000/api/tasks/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(response.data);
      } catch (err) {
        setError('Failed to fetch tasks');
      }
    };

    const fetchUsers = async () => {
      if (userRole === 'admin' || userRole === 'superadmin') {
        try {
          const token = localStorage.getItem('access_token');
          const response = await axios.get('http://localhost:8000/api/users/', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUsers(response.data);
        } catch (err) {
          setError('Failed to fetch users');
        }
      }
    };

    fetchTasks();
    fetchUsers();
  }, [userRole]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      await axios.post('http://localhost:8000/api/tasks/', newTask, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewTask({ title: '', description: '', assigned_to: '', due_date: '' });
      const response = await axios.get('http://localhost:8000/api/tasks/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
    } catch (err) {
      setError('Failed to create task');
    }
  };

  const handleUpdateTask = async (taskId, updatedData) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.put(`http://localhost:8000/api/tasks/${taskId}/`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const response = await axios.get('http://localhost:8000/api/tasks/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const handleViewReport = async (taskId) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`http://localhost:8000/api/tasks/${taskId}/report/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReportModal(response.data);
    } catch (err) {
      setError('Failed to fetch report');
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-8 md:px-12">
      <div className="max-w-6xl mx-auto border-2 border-gray-400 p-5 rounded-2xl">
        <header className="mb-10 text-center ">
          <h1 className="text-4xl font-extrabold text-gray-900 pt-5">Task Management Portal</h1>
          <p className="text-gray-600 mt-2">Manage, assign, and track tasks efficiently.</p>
        </header>

        {error && <p className="text-red-500 text-center mb-6">{error}</p>}

        {(userRole === 'admin' || userRole === 'superadmin') && (
          <section className="mb-12 bg-white rounded-xl shadow p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Create a New Task</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleCreateTask}>
              <input
                type="text"
                placeholder="Title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
              <input
                type="datetime-local"
                value={newTask.due_date}
                onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
              <textarea
                placeholder="Description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="col-span-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                rows={3}
                required
              />
              <select
                value={newTask.assigned_to}
                onChange={(e) => setNewTask({ ...newTask, assigned_to: e.target.value })}
                className="col-span-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              >
                <option value="">Assign to User</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </select>
              <div className="col-span-full text-right">
                <button
                  type="submit"
                  className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
                >
                  Create Task
                </button>
              </div>
            </form>
          </section>
        )}

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">All Tasks</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-xl shadow p-5 flex flex-col justify-between space-y-4"
              >
                <div>
                  <h3 className="text-xl font-bold text-black">{task.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Due: {new Date(task.due_date).toLocaleString()}
                  </p>
                  <p className={`mt-2 font-medium capitalize ${task.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                    Status: {task.status.replace('_', ' ')}
                  </p>
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  {(userRole === 'admin' || userRole === 'superadmin' || task.assigned_to === userId) && (
                    <select
                      defaultValue={task.status}
                      onChange={(e) => {
                        const status = e.target.value;
                        let updateData = { status };
                        if (status === 'completed') {
                          const report = prompt('Enter completion report:');
                          const hours = prompt('Enter worked hours:');
                          if (report && hours) {
                            updateData = {
                              status,
                              completion_report: report,
                              worked_hours: parseInt(hours),
                            };
                          } else {
                            return;
                          }
                        }
                        handleUpdateTask(task.id, updateData);
                      }}
                      className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                    </select>
                  )}

                  {(userRole === 'admin' || userRole === 'superadmin') &&
                    task.status === 'completed' && (
                      <button
                        onClick={() => handleViewReport(task.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      >
                        View Report
                      </button>
                    )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {reportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-6 relative animate-fade-in">
              <button
                onClick={() => setReportModal(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-black text-2xl"
              >
                &times;
              </button>
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                Task Completion Report
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                <div>
                  <p className="font-semibold">Title</p>
                  <p>{reportModal.title}</p>
                </div>
                <div>
                  <p className="font-semibold">Status</p>
                  <p className="capitalize">{reportModal.status.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="font-semibold">Due Date</p>
                  <p>{new Date(reportModal.due_date).toLocaleString()}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="font-semibold">Description</p>
                  <p>{reportModal.description}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="font-semibold">Completion Report</p>
                  <p>{reportModal.completion_report}</p>
                </div>
                <div>
                  <p className="font-semibold">Worked Hours</p>
                  <p>{reportModal.worked_hours} hrs</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setReportModal(null)}
                  className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskManagement;
