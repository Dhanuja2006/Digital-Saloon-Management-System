import React, { useState, useEffect } from 'react';
import { adminController } from '../controllers/adminController';
import { Ban, CheckCircle } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const data = await adminController.getUsers();
      setUsers(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (id, currentBlockedStatus) => {
    try {
      await adminController.updateUserStatus(id, !currentBlockedStatus);
      fetchUsers();
    } catch (err) {
      alert("Failed to update user");
    }
  };

  const handleApprove = async (id) => {
    const adminCode = prompt("Please enter Admin Code to confirm approval:");
    if (!adminCode) return;
    
    try {
      await adminController.approveSalonOwner(id, adminCode);
      alert("Salon owner approved successfully!");
      fetchUsers();
    } catch (err) {
      alert(err.message || "Failed to approve salon owner");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="mb-4">User Management</h2>
      <div className="glass-card">
        <table className="w-full text-left" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: 'var(--glass-border)' }}>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Status</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} style={{ borderBottom: 'var(--glass-border)' }}>
                <td className="p-2">{u.fullName}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.role}</td>
                <td className="p-2">
                  <span style={{ 
                    color: u.isBlocked ? 'var(--error)' : (u.status === 'Pending' ? 'var(--warning, #f1c40f)' : 'var(--success)'), 
                    fontWeight: 'bold',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: u.status === 'Pending' ? 'rgba(241, 196, 15, 0.1)' : 'transparent'
                  }}>
                    {u.isBlocked ? 'Blocked' : u.status}
                  </span>
                </td>
                <td className="p-2 flex gap-2">
                  <button onClick={() => handleToggleStatus(u._id, u.isBlocked)} className="btn btn-secondary flex items-center gap-1" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                    {u.isBlocked ? <><CheckCircle size={14}/> Unblock</> : <><Ban size={14}/> Block</>}
                  </button>
                  {u.role === 'Salon Owner' && u.status === 'Pending' && (
                    <button 
                      onClick={() => handleApprove(u._id)} 
                      className="btn btn-primary flex items-center gap-1" 
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: 'var(--success)' }}
                    >
                      <CheckCircle size={14}/> Approve
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AdminUsers;
