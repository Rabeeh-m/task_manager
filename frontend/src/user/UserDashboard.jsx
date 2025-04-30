import { PascalCase } from 'react';
import axios from 'axios';

const UserDashboard = ({ user }) => {
  const [tasks, setTasks] = useState([]);
  const [completionReport, setCompletionReport] = useState('');
  const [workedHours, setWorkedHours] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/tasks/');
      setTasks(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateTask = async (id, updates) => {
    try {
      const response = await axios.put(`http://localhost:8000/api/tasks/${id}/`, updates);
      setTasks(tasks.map(task => (task.id === id ? response.data : task)));
      setCompletionReport('');
      setWorkedHours('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto p-4 pt-20 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-black mb-6">User Dashboard</h1>
      <h2 className="text-2xl font-semibold text-black mb-4">Your Tasks</h2>
      <ul className="space-y-2">
        {tasks.map(task => (
          <li key={task.id} className="border p-4 rounded">
            <h3 className="text-xl font-semibold text-black">{task.title}</h3>
            <p className="text-black">{task.description}</p>
            <p className="text-black">Status: {task.status}</p>
            <p className="text-black">Due: {new Date(task.due_date).toLocaleString()}</p>
            <select
              onChange={e => {
                const status = e.target.value;
                if (status === 'completed') {
                  if (!completionReport || !workedHours) {
                    alert('Please provide a completion report and worked hours.');
                    return;
                  }
                  updateTask(task.id, { status, completion_report: completionReport, worked_hours: parseFloat(workedHours) });
                } else {
                  updateTask(task.id, { status });
                }
              }}
              value={task.status}
              className="p-2 border rounded text-black mt-2"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            {task.status !== 'completed' && (
              <div className="mt-2">
                <textarea
                  placeholder="Completion Report"
                  value={completionReport}
                  onChange={e => setCompletionReport(e.target.value)}
                  className="p-2 border rounded text-black w-full"
                  disabled={task.status === 'completed'}
                />
                <input
                  type="number"
                  placeholder="Worked Hours"
                  value={workedHours}
                  onChange={e => setWorkedHours(e.target.value)}
                  className="p-2 border rounded text-black w-full mt-2"
                  step="0.1"
                  disabled={task.status === 'completed'}
                />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserDashboard;