import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { approveBooking, deleteBooking, getBookings, rejectBooking } from '../../api/bookings';
import { useAuth } from '../../context/AuthContext';
import './bookings.css';

const statusOrder = ['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'];

function formatBookingTime(value) {
  if (!value) return 'N/A';
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value));
}

function statusClass(status) {
  return String(status || '').toLowerCase();
}

export default function BookingAdminPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvedBy, setApprovedBy] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [search, setSearch] = useState('');
  const [errorBanner, setErrorBanner] = useState('');
  const [successBanner, setSuccessBanner] = useState('');

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    if (!user) return;
    setApprovedBy(user.name || user.email || '');
  }, [user]);

  async function loadBookings() {
    try {
      setLoading(true);
      const { data } = await getBookings();
      setBookings(data?.data ?? []);
      setErrorBanner('');
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to load bookings.';
      setErrorBanner(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesStatus = selectedStatus === 'ALL' || booking.status === selectedStatus;
      const query = search.trim().toLowerCase();
      const haystack = [
        booking.id,
        booking.resourceId,
        booking.resourceName,
        booking.requestedBy,
        booking.purpose,
        booking.status
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return matchesStatus && (!query || haystack.includes(query));
    });
  }, [bookings, selectedStatus, search]);

  async function handleApprove(id) {
    if (!approvedBy.trim()) {
      const message = 'Please enter approved by before approving.';
      setErrorBanner(message);
      toast.error(message);
      return;
    }

    try {
      await approveBooking(id, approvedBy.trim());
      toast.success('Booking approved.');
      setSuccessBanner('Booking approved.');
      await loadBookings();
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to approve booking.';
      setErrorBanner(message);
      toast.error(message);
    }
  }

  async function handleReject(id) {
    try {
      await rejectBooking(id, rejectionReason.trim());
      toast.success('Booking rejected.');
      setSuccessBanner('Booking rejected.');
      await loadBookings();
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to reject booking.';
      setErrorBanner(message);
      toast.error(message);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm('Delete this booking permanently?');
    if (!confirmed) {
      return;
    }

    try {
      await deleteBooking(id);
      toast.success('Booking deleted.');
      setSuccessBanner('Booking deleted.');
      await loadBookings();
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to delete booking.';
      setErrorBanner(message);
      toast.error(message);
    }
  }

  return (
    <div className="bookings-page">
      <div className="bookings-shell">
        <section className="bookings-hero bookings-hero-simple">
          <div className="hero-panel hero-panel-simple">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              Admin booking page
            </div>
            <h1>Approve or reject pending bookings quickly.</h1>
            <p className="hero-copy">
              Use this page when a booking needs a decision. Pending requests can be approved or rejected here.
            </p>
          </div>
        </section>

        {errorBanner ? <div className="banner error">{errorBanner}</div> : null}
        {successBanner ? <div className="banner success">{successBanner}</div> : null}

        <section className="toolbar">
          <div className="form-card form-card-wide">
            <div className="section-title">Decision inputs</div>
            <div className="section-subtitle">
              Enter the approver name once, then reuse it for booking decisions.
            </div>

            <div className="grid-form">
              <div className="field full">
                <label htmlFor="approvedBy">Approved by</label>
                <input
                  id="approvedBy"
                  value={approvedBy}
                  onChange={(event) => setApprovedBy(event.target.value)}
                  placeholder="admin1"
                />
              </div>
              <div className="field full">
                <label htmlFor="rejectionReason">Rejection reason</label>
                <textarea
                  id="rejectionReason"
                  value={rejectionReason}
                  onChange={(event) => setRejectionReason(event.target.value)}
                  placeholder="Reason for rejection..."
                />
              </div>
              <div className="field full">
                <div className="form-help">
                  Keep rejection reasons short and clear so the requester understands what to fix.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="table-card">
          <div className="controls">
            <div className="search">
              <input
                type="search"
                placeholder="Search by resource, user, purpose, or booking id"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div className="filter-chips">
              {statusOrder.map((status) => (
                <button
                  key={status}
                  type="button"
                  className={`chip ${selectedStatus === status ? 'active' : ''}`}
                  onClick={() => setSelectedStatus(status)}
                >
                  {status === 'ALL' ? 'All' : status}
                </button>
              ))}
            </div>
          </div>

          <div className="section-title">All bookings</div>
          <div className="section-subtitle">
            Review bookings, then approve or reject the ones that are still pending.
          </div>

          {loading ? (
            <div className="empty-state">Loading bookings...</div>
          ) : filteredBookings.length === 0 ? (
            <div className="empty-state">
              No bookings match the current filter. Try a different search term or status.
            </div>
          ) : (
            <div className="booking-grid">
              {filteredBookings.map((booking) => {
                const editable = booking.status === 'PENDING';

                return (
                  <article className="booking-card" key={booking.id}>
                    <div className="booking-main">
                      <div className="booking-head">
                        <div>
                          <div className="booking-title">{booking.resourceName || booking.resourceId}</div>
                          <div className="booking-meta">Booking ID: {booking.id}</div>
                        </div>
                        <span className={`status ${statusClass(booking.status)}`}>
                          <span className="status-dot" />
                          {booking.status}
                        </span>
                      </div>

                      <div className="booking-meta">
                        <strong>Resource:</strong> {booking.resourceId}
                        <br />
                        <strong>Requested by:</strong> {booking.requestedBy}
                        <br />
                        <strong>Purpose:</strong> {booking.purpose}
                        <br />
                        <strong>Time:</strong> {formatBookingTime(booking.startDateTime)} to {formatBookingTime(booking.endDateTime)}
                        {booking.approvedBy ? (
                          <>
                            <br />
                            <strong>Approved by:</strong> {booking.approvedBy}
                          </>
                        ) : null}
                        {booking.rejectionReason ? (
                          <>
                            <br />
                            <strong>Rejection reason:</strong> {booking.rejectionReason}
                          </>
                        ) : null}
                      </div>
                    </div>

                    <div className="booking-actions">
                      {editable ? (
                        <>
                          <button type="button" className="btn btn-primary" onClick={() => handleApprove(booking.id)}>
                            Approve
                          </button>
                          <button type="button" className="btn btn-secondary" onClick={() => handleReject(booking.id)}>
                            Reject
                          </button>
                          <button type="button" className="btn btn-secondary" onClick={() => handleDelete(booking.id)}>
                            Delete
                          </button>
                        </>
                      ) : (
                        <button type="button" className="btn btn-secondary" onClick={() => handleDelete(booking.id)}>
                          Delete
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
