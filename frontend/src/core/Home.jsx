
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [completionReport, setCompletionReport] = useState('');
  const [workedHours, setWorkedHours] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          navigate('/login');
          return;
        }
        const response = await axios.get('http://localhost:8000/api/tasks/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(response.data);
      } catch (err) {
        setError('Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [navigate]);

  const handleMarkCompleted = (task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const handleSubmitCompletion = async (e) => {
    e.preventDefault();
    if (!completionReport || !workedHours) {
      setError('Completion report and worked hours are required');
      return;
    }
    try {
      const token = localStorage.getItem('access_token');
      await axios.put(`http://localhost:8000/api/tasks/${selectedTask.id}/`, {
        status: 'completed',
        completion_report: completionReport,
        worked_hours: parseInt(workedHours),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const response = await axios.get('http://localhost:8000/api/tasks/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
      closeModal();
    } catch (err) {
      setError('Failed to mark task as completed');
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setCompletionReport('');
    setWorkedHours('');
    setSelectedTask(null);
    setError('');
  };

  if (loading) return <div className="text-center text-xl text-gray-700 mt-20">Loading tasks...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 py-16 px-4 pt-26">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-10">My Tasks</h2>
        {error && <p className="text-center text-red-600 mb-6">{error}</p>}
        {tasks.length === 0 ? (
          <p className="text-center text-gray-700 text-lg">No tasks assigned to you.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white border-2 border-gray-400 rounded-2xl shadow-md p-5 flex flex-col justify-between hover:shadow-xl transition-all"
              >
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{task.title}</h3>
                  <p className="text-gray-600 mb-3 line-clamp-3">{task.description}</p>
                  <p className="text-sm text-gray-500">
                    <strong>Due:</strong> {new Date(task.due_date).toLocaleString()}
                  </p>
                  <p className="text-sm mt-1 text-gray-500 capitalize">
                    <strong>Status:</strong>{' '}
                    <span className={`font-medium ${task.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {task.status}
                    </span>
                  </p>
                </div>
                {task.status !== 'completed' && (
                  <button
                    onClick={() => handleMarkCompleted(task)}
                    className="mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Mark as Completed
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completion Modal */}
      {modalOpen && (
        <div className="fixed inset-0  bg-opacity-40 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md relative animate-fade-in border-2">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">{selectedTask?.title}</h3>
            {error && <p className="text-red-600 mb-3">{error}</p>}
            <form onSubmit={handleSubmitCompletion}>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">Completion Report</label>
                <textarea
                  value={completionReport}
                  onChange={(e) => setCompletionReport(e.target.value)}
                  className="w-full h-24 p-2 border border-gray-300 rounded-lg resize-none text-black focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Describe what was done, challenges, etc."
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">Worked Hours</label>
                <input
                  type="number"
                  value={workedHours}
                  onChange={(e) => setWorkedHours(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter hours worked"
                  min="0"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
