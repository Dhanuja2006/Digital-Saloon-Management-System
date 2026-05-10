import React, { useState, useEffect } from 'react';
import { governanceController } from '../controllers/governanceController';
import { paymentController } from '../controllers/paymentController';
import { 
  ShieldCheck, 
  Users, 
  Store, 
  Scale, 
  FileText, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Ban,
  RefreshCw,
  Search
} from 'lucide-react';

const AdminGovernance = () => {
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]); // Dynamic data based on tab
  const [searchTerm, setSearchTerm] = useState('');
  const [reason, setReason] = useState('');

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await governanceController.getDashboardStats();
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTabContent = async () => {
    setLoading(true);
    try {
      let res;
      switch (activeTab) {
        case 'disputes': 
          res = await governanceController.getDisputes();
          setData(res.data || []);
          break;
        case 'audit':
          res = await governanceController.getAuditLogs();
          setData(res.data || []);
          break;
        case 'payments':
          res = await paymentController.getPaymentHistory();
          setData(res.data || []);
          break;
        default:
          setData([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'dashboard') fetchDashboard();
    else fetchTabContent();
  }, [activeTab]);

  const handleAction = async (action, id, payload = {}) => {
    if (!window.confirm(`Are you sure you want to perform this action?`)) return;
    try {
      setLoading(true);
      switch (action) {
        case 'approve_salon': await governanceController.approveSalon(id, reason || 'Manual Approval'); break;
        case 'suspend_salon': await governanceController.suspendSalon(id, reason || 'Policy Violation'); break;
        case 'resolve_dispute': await governanceController.resolveDispute(id, reason || 'Resolved by Admin'); break;
        case 'approve_refund': await governanceController.approveRefund(id); break;
      }
      alert("Action successful");
      setReason('');
      if (activeTab === 'dashboard') fetchDashboard();
      else fetchTabContent();
    } catch (err) {
      alert(err.message || "Action failed");
    } finally {
      setLoading(false);
    }
  };

  const renderDashboard = () => (
    <div className="animate-in">
      <div className="grid-3 mb-6">
        <div className="glass-card flex items-center gap-4 border-accent">
          <div className="p-3 bg-accent-transparent rounded-lg"><Users size={24} color="var(--accent)"/></div>
          <div><p className="text-sm opacity-70 mb-0">Total Customers</p><h2 className="mb-0">{stats?.users?.customers || 0}</h2></div>
        </div>
        <div className="glass-card flex items-center gap-4 border-success">
          <div className="p-3 bg-success-transparent rounded-lg"><Store size={24} color="var(--success)"/></div>
          <div><p className="text-sm opacity-70 mb-0">Active Salons</p><h2 className="mb-0">{stats?.salons?.total - stats?.salons?.pending || 0}</h2></div>
        </div>
        <div className="glass-card flex items-center gap-4 border-primary">
          <div className="p-3 bg-primary-transparent rounded-lg"><TrendingUp size={24} color="var(--primary)"/></div>
          <div><p className="text-sm opacity-70 mb-0">Platform Revenue</p><h2 className="mb-0">${stats?.revenue?.totalRevenue?.toFixed(2) || '0.00'}</h2></div>
        </div>
      </div>

      <div className="grid-2">
        <div className="glass-card">
          <h4 className="flex items-center gap-2 mb-4"><AlertTriangle color="orange" /> System Alerts</h4>
          <ul className="list-none p-0 flex flex-col gap-3">
            <li className="flex justify-between items-center p-3 bg-glass-dark rounded border-glass">
              <span>Pending Salon Approvals</span>
              <span className="badge badge-warning">{stats?.salons?.pending || 0}</span>
            </li>
            <li className="flex justify-between items-center p-3 bg-glass-dark rounded border-glass">
              <span>Open Disputes</span>
              <span className="badge badge-error">{stats?.disputes?.open || 0}</span>
            </li>
          </ul>
        </div>
        <div className="glass-card">
          <h4 className="flex items-center gap-2 mb-4"><Scale /> Quick Actions</h4>
          <p className="text-sm opacity-70">Perform high-level interventions across the platform.</p>
          <div className="flex flex-wrap gap-2">
            <button className="btn btn-secondary text-xs" onClick={() => setActiveTab('disputes')}>Resolve Disputes</button>
            <button className="btn btn-secondary text-xs" onClick={() => setActiveTab('audit')}>View Audit Logs</button>
            <button className="btn btn-secondary text-xs" onClick={() => setActiveTab('payments')}>Audit Payments</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTable = () => (
    <div className="animate-in">
      <div className="flex justify-between items-center mb-4">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" size={16} />
          <input 
            type="text" 
            className="glass-input w-full pl-10" 
            placeholder={`Search ${activeTab}...`} 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="glass-card overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-glass">
              {activeTab === 'disputes' && <><th>Type</th><th>From</th><th>Status</th><th>Date</th><th>Action</th></>}
              {activeTab === 'audit' && <><th>Admin</th><th>Action</th><th>Target</th><th>Reason</th><th>Date</th></>}
              {activeTab === 'payments' && <><th>Pay ID</th><th>Amount</th><th>Comm.</th><th>Status</th><th>Date</th></>}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan="5" className="text-center p-10 opacity-50">No records found.</td></tr>
            ) : data.map((item, idx) => (
              <tr key={idx} className="border-b border-glass-light hover:bg-glass-light">
                {activeTab === 'disputes' && (
                  <>
                    <td className="p-3 text-sm">{item.type}</td>
                    <td className="p-3 text-xs font-mono">{item.raisedBy?.fullName || item.raisedBy}</td>
                    <td className="p-3"><span className={`badge badge-${item.status === 'open' ? 'error' : 'success'}`}>{item.status}</span></td>
                    <td className="p-3 text-xs">{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td className="p-3">
                      {item.status === 'open' && (
                        <button className="btn btn-primary p-1 text-xs" onClick={() => handleAction('resolve_dispute', item._id)}>Resolve</button>
                      )}
                    </td>
                  </>
                )}
                {activeTab === 'audit' && (
                  <>
                    <td className="p-3 text-xs font-bold">{item.adminId?.fullName || 'System'}</td>
                    <td className="p-3 text-xs"><span className="text-accent">{item.action}</span></td>
                    <td className="p-3 text-xs">{item.targetType}: {item.targetId}</td>
                    <td className="p-3 text-sm italic">{item.reason}</td>
                    <td className="p-3 text-xs">{new Date(item.createdAt).toLocaleString()}</td>
                  </>
                )}
                {activeTab === 'payments' && (
                  <>
                    <td className="p-3 font-mono text-xs">{item.paymentId}</td>
                    <td className="p-3 font-bold">${item.amount}</td>
                    <td className="p-3 text-success">${item.commissionAmount}</td>
                    <td className="p-3 text-xs">{item.status}</td>
                    <td className="p-3 text-xs">{new Date(item.createdAt).toLocaleDateString()}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="container mt-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <ShieldCheck size={36} color="var(--accent)" />
          <div>
            <h2 className="mb-0">Governance Command Center</h2>
            <p className="text-sm opacity-70 mb-0">Immutable oversight & platform policy enforcement.</p>
          </div>
        </div>
        <div className="flex gap-1 bg-glass p-1 rounded-lg">
          {['dashboard', 'disputes', 'payments', 'audit'].map(tab => (
            <button 
              key={tab}
              className={`btn btn-sm ${activeTab === tab ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab(tab)}
              style={{ textTransform: 'capitalize' }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 gap-4">
          <RefreshCw className="animate-spin" size={40} color="var(--accent)" />
          <p className="animate-pulse">Accessing Secure Vault...</p>
        </div>
      ) : (
        activeTab === 'dashboard' ? renderDashboard() : renderTable()
      )}
    </div>
  );
};

export default AdminGovernance;
