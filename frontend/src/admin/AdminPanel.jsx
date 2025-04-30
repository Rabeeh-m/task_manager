import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TaskManagement from './TaskManagement';
import UserManagement from './UserManagement';

const AdminPanel = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          navigate('/login');
          return;
        }
        const response = await axios.get('http://localhost:8000/api/profile/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
        if (!['admin', 'superadmin'].includes(response.data.role)) {
          navigate('/');
        }
      } catch (err) {
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-white pt-16">
      <div className="container mx-auto p-4">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-black">
          {user.role === 'superadmin' ? 'SuperAdmin Panel' : 'Admin Panel'}
        </h2>
        {user.role === 'superadmin' && <UserManagement />}
        <TaskManagement userRole={user.role} userId={user.id} />
      </div>
    </div>
  );
};

export default AdminPanel;