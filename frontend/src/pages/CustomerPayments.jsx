import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { paymentController } from '../controllers/paymentController';
import { governanceController } from '../controllers/governanceController';
import { CreditCard, History, AlertCircle, CheckCircle2, XCircle, Download, ShieldAlert } from 'lucide-react';

const CustomerPayments = () => {
  const { user } = useContext(AuthContext);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refundReason, setRefundReason] = useState('');
  const [activeRefundId, setActiveRefundId] = useState(null);
  const [disputeData, setDisputeData] = useState({ bookingId: '', type: 'Payment Issue', description: '' });
  const [activeDisputeId, setActiveDisputeId] = useState(null);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await paymentController.getMyPayments(user._id);
      setPayments(response.data || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) fetchPayments();
  }, [user]);

  const handleRefundRequest = async (paymentId) => {
    if (!refundReason) return alert("Please provide a reason for the refund");
    try {
      await paymentController.requestRefund(paymentId, refundReason);
      alert("Refund request submitted successfully");
      setActiveRefundId(null);
      setRefundReason('');
      fetchPayments();
    } catch (err) {
      alert(err.message || "Failed to submit refund request");
    }
  };

  const handleDisputeSubmit = async (e) => {
    e.preventDefault();
    try {
      await governanceController.createDispute(disputeData);
      alert("Dispute raised successfully. Admin will review it.");
      setActiveDisputeId(null);
      setDisputeData({ bookingId: '', type: 'Payment Issue', description: '' });
    } catch (err) {
      alert(err.message || "Failed to raise dispute");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Successful': return <CheckCircle2 size={18} color="var(--success)" />;
      case 'Failed': return <XCircle size={18} color="var(--error)" />;
      case 'Refunded': return <History size={18} color="var(--primary)" />;
      default: return <AlertCircle size={18} color="orange" />;
    }
  };

  return (
    <div className="container mt-4">
      <div className="flex items-center gap-3 mb-6">
        <CreditCard size={32} color="var(--accent)" />
        <h2 className="mb-0">Payment & Billing</h2>
      </div>

      {activeDisputeId && (
        <div className="glass-card mb-6 border-accent">
          <h3 className="mb-4 flex items-center gap-2"><ShieldAlert /> Raise a Dispute</h3>
          <form onSubmit={handleDisputeSubmit} className="flex flex-col gap-4">
            <div className="grid-2">
              <div>
                <label className="block mb-1">Issue Type</label>
                <select 
                  className="glass-input w-full"
                  value={disputeData.type}
                  onChange={e => setDisputeData({...disputeData, type: e.target.value})}
                >
                  <option value="Payment Issue">Payment Issue</option>
                  <option value="Service Quality">Service Quality</option>
                  <option value="Salon No-Show">Salon No-Show</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">Booking ID</label>
                <input 
                  type="text" 
                  className="glass-input w-full" 
                  value={disputeData.bookingId}
                  readOnly
                />
              </div>
            </div>
            <div>
              <label className="block mb-1">Describe the Issue</label>
              <textarea 
                className="glass-input w-full" 
                rows="3"
                placeholder="Explain what went wrong..."
                value={disputeData.description}
                onChange={e => setDisputeData({...disputeData, description: e.target.value})}
                required
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button type="button" className="btn btn-secondary" onClick={() => setActiveDisputeId(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Submit Dispute</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center p-10"><p>Loading transaction history...</p></div>
      ) : error ? (
        <div className="glass-card text-center p-10 border-error">
          <AlertCircle size={40} color="var(--error)" style={{margin: '0 auto 1rem'}} />
          <p>{error}</p>
          <button className="btn btn-primary mt-2" onClick={fetchPayments}>Try Again</button>
        </div>
      ) : payments.length === 0 ? (
        <div className="glass-card text-center p-10">
          <History size={40} color="var(--text-secondary)" style={{margin: '0 auto 1rem'}} />
          <p>No transactions found.</p>
        </div>
      ) : (
        <div className="glass-card overflow-x-auto">
          <table className="w-full text-left" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: 'var(--glass-border)' }}>
                <th className="p-3">Payment ID</th>
                <th className="p-3">Date</th>
                <th className="p-3">Salon</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(pay => (
                <React.Fragment key={pay._id}>
                  <tr style={{ borderBottom: 'rgba(255,255,255,0.05)' }}>
                    <td className="p-3 font-mono text-xs">{pay.paymentId}</td>
                    <td className="p-3 text-sm">{new Date(pay.createdAt).toLocaleDateString()}</td>
                    <td className="p-3 text-sm">{pay.metadata?.salonName || 'N/A'}</td>
                    <td className="p-3 font-bold">${pay.amount}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-1 text-xs">
                        {getStatusIcon(pay.status)}
                        <span>{pay.status}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        {pay.status === 'Successful' && (
                          <>
                            <button 
                              className="btn btn-secondary p-1" 
                              title="Download Receipt"
                              onClick={() => alert("Receipt generation logic would go here.")}
                            >
                              <Download size={16} />
                            </button>
                            <button 
                              className="btn p-1" 
                              style={{ color: 'var(--error)', borderColor: 'var(--error)' }}
                              onClick={() => {
                                setDisputeData({...disputeData, bookingId: pay.bookingId});
                                setActiveDisputeId(pay._id);
                              }}
                            >
                              Dispute
                            </button>
                          </>
                        )}
                        {pay.status === 'Successful' && pay.refundStatus === 'none' && (
                          <button 
                            className="btn btn-primary p-1"
                            onClick={() => setActiveRefundId(pay._id)}
                          >
                            Refund
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  {activeRefundId === pay._id && (
                    <tr>
                      <td colSpan="6" className="p-3 bg-glass-dark">
                        <div className="flex gap-2 items-end">
                          <div className="flex-1">
                            <label className="text-xs mb-1 block">Refund Reason</label>
                            <input 
                              type="text" 
                              className="glass-input w-full text-sm" 
                              placeholder="Why do you need a refund?"
                              value={refundReason}
                              onChange={e => setRefundReason(e.target.value)}
                            />
                          </div>
                          <button className="btn btn-primary" onClick={() => handleRefundRequest(pay.paymentId)}>Submit</button>
                          <button className="btn btn-secondary" onClick={() => setActiveRefundId(null)}>Cancel</button>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-8 glass-card border-accent bg-accent-transparent">
        <h4 className="flex items-center gap-2"><ShieldAlert size={20} /> Safety & Security</h4>
        <p className="text-sm opacity-80 mb-0">
          All transactions are encrypted. If you encounter issues with a salon or a payment, 
          use the <strong>Dispute</strong> button to alert our governance team. Refunds are subject to 
          salon policy and admin approval.
        </p>
      </div>
    </div>
  );
};

export default CustomerPayments;
