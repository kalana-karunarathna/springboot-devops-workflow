import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { cancelBooking, createBooking, getUserBookings, updateBooking } from '../../api/bookings';
import { useAuth } from '../../context/AuthContext';
import './bookings.css';

const initialForm = {
  resourceId: '',
  resourceName: '',
  capacity: '',
  requestedBy: '',
  purpose: '',
  startDateTime: '',
  endDateTime: ''
};

const statusOrder = ['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'];
const resourceTypes = ['Lecture Hall', 'Lab', 'Meeting Room', 'Equipment'];

function toDatetimeLocal(value) {
  if (!value) return '';
  const date = new Date(value);
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

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

export default function BookingsPage() {
  const { user } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [search, setSearch] = useState('');
  const [errorBanner, setErrorBanner] = useState('');
  const [successBanner, setSuccessBanner] = useState('');

  useEffect(() => {
    if (!user?.email) {
      setBookings([]);
      setLoading(false);
      return;
    }

    loadBookings(user.email);
  }, [user?.email]);

  useEffect(() => {
    if (!user?.email) {
      return undefined;
    }

    const refreshBookings = () => {
      loadBookings(user.email);
    };

    const intervalId = window.setInterval(refreshBookings, 5000);
    window.addEventListener('focus', refreshBookings);
    document.addEventListener('visibilitychange', refreshBookings);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('focus', refreshBookings);
      document.removeEventListener('visibilitychange', refreshBookings);
    };
  }, [user?.email]);

  useEffect(() => {
    if (!user?.email) return;

    setForm((current) => ({
      ...current,
      requestedBy: current.requestedBy || user.email
    }));
  }, [user?.email]);

  async function loadBookings(userEmail = user?.email) {
    if (!userEmail) {
      setBookings([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data } = await getUserBookings(userEmail.trim().toLowerCase());
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

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
  }

  function handleFormChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      capacity: form.capacity === '' ? null : Number(form.capacity),
      requestedBy: (user?.email || form.requestedBy).trim().toLowerCase(),
      resourceId: form.resourceId.trim(),
      resourceName: form.resourceName.trim(),
      purpose: form.purpose.trim()
    };

    try {
      if (editingId) {
        await updateBooking(editingId, payload);
        toast.success('Booking updated successfully.');
        setSuccessBanner('Booking updated successfully.');
      } else {
        await createBooking(payload);
        toast.success('Booking requested successfully.');
        setSuccessBanner('Booking requested successfully.');
      }

      resetForm();
      await loadBookings(payload.requestedBy);
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to save booking.';
      setErrorBanner(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  async function handleCancel(id) {
    try {
      await cancelBooking(id);
      toast.success('Booking cancelled.');
      setSuccessBanner('Booking cancelled.');
      await loadBookings();
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to cancel booking.';
      setErrorBanner(message);
      toast.error(message);
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

  const counts = useMemo(() => {
    const total = bookings.length;
    const pending = bookings.filter((booking) => booking.status === 'PENDING').length;
    const approved = bookings.filter((booking) => booking.status === 'APPROVED').length;
    const rejected = bookings.filter((booking) => booking.status === 'REJECTED').length;

    return { total, pending, approved, rejected };
  }, [bookings]);

  return (
    <div className="bookings-page">
      <div className="bookings-shell">
        <section className="bookings-hero bookings-hero-simple">
          <div className="hero-panel hero-panel-simple">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              User booking page
            </div>
            <h1>Book a room or facility in a few quick steps.</h1>
            <p className="hero-copy">
              Choose a resource, set your time range, and submit your booking request.
            </p>
            <div className="hero-stats hero-stats-simple">
              <div className="stat-tile">
                <div className="stat-label">Total</div>
                <div className="stat-value">{counts.total}</div>
              </div>
              <div className="stat-tile">
                <div className="stat-label">Pending</div>
                <div className="stat-value">{counts.pending}</div>
              </div>
              <div className="stat-tile">
                <div className="stat-label">Approved</div>
                <div className="stat-value">{counts.approved}</div>
              </div>
            </div>
          </div>
        </section>

        {errorBanner ? <div className="banner error">{errorBanner}</div> : null}
        {successBanner ? <div className="banner success">{successBanner}</div> : null}

        <section className="toolbar">
          <div className="form-card form-card-wide">
            <div className="section-title">{editingId ? 'Update booking' : 'Create booking'}</div>
            <div className="section-subtitle">
              Step 1: choose a resource type. Step 2: pick the start and end time. Step 3: submit as the logged-in user.
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid-form">
                <div className="field">
                  <label htmlFor="resourceId">Type</label>
                  <select id="resourceId" name="resourceId" value={form.resourceId} onChange={handleFormChange} required>
                    <option value="">All Types</option>
                    {resourceTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="resourceName">Resource name</label>
                  <input id="resourceName" name="resourceName" value={form.resourceName} onChange={handleFormChange} placeholder="Computer Lab 101" />
                </div>
                <div className="field">
                  <label htmlFor="capacity">Capacity</label>
                  <input
                    id="capacity"
                    name="capacity"
                    type="number"
                    min="1"
                    value={form.capacity}
                    onChange={handleFormChange}
                    placeholder="40"
                  />
                </div>
                <div className="field">
                  <label htmlFor="requestedBy">Requested by</label>
                  <input
                    id="requestedBy"
                    name="requestedBy"
                    value={form.requestedBy}
                    onChange={handleFormChange}
                    placeholder="student@example.com"
                    readOnly
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="purpose">Purpose</label>
                  <input id="purpose" name="purpose" value={form.purpose} onChange={handleFormChange} placeholder="Project meeting" required />
                </div>
                <div className="field">
                  <label htmlFor="startDateTime">Start date/time</label>
                  <input id="startDateTime" type="datetime-local" name="startDateTime" value={form.startDateTime} onChange={handleFormChange} required />
                </div>
                <div className="field">
                  <label htmlFor="endDateTime">End date/time</label>
                  <input id="endDateTime" type="datetime-local" name="endDateTime" value={form.endDateTime} onChange={handleFormChange} required />
                </div>
                <div className="field full">
                  <div className="form-help">
                    Need the room for 3 hours? Pick an end time that is exactly 3 hours after the start time.
                  </div>
                </div>
              </div>
              <div className="form-actions">
                <button className="btn btn-primary" type="submit" disabled={saving}>
                  {saving ? 'Saving...' : editingId ? 'Save changes' : 'Submit booking'}
                </button>
                <button className="btn btn-secondary" type="button" onClick={resetForm}>
                  Reset
                </button>
              </div>
            </form>
          </div>
        </section>

        <section className="table-card">
          <div className="controls">
            <div className="search">
              <input
                type="search"
                placeholder="Search bookings..."
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

          <div className="section-title">Bookings</div>
          <div className="section-subtitle">
            View only your own requests and edit or cancel the ones that are still pending.
          </div>

          {!user?.email ? (
            <div className="empty-state">Sign in to view your bookings.</div>
          ) : loading ? (
            <div className="empty-state">Loading bookings...</div>
          ) : filteredBookings.length === 0 ? (
            <div className="empty-state">
              No bookings match the current filter. Try clearing the search or choosing a different status.
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
                        <strong>Type:</strong> {booking.resourceId}
                        <br />
                        <strong>Capacity:</strong> {booking.capacity ?? 'N/A'}
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
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => {
                              setEditingId(booking.id);
                              setForm({
                                resourceId: booking.resourceId || '',
                                resourceName: booking.resourceName || '',
                                capacity: booking.capacity ?? '',
                                requestedBy: booking.requestedBy || '',
                                purpose: booking.purpose || '',
                                startDateTime: toDatetimeLocal(booking.startDateTime),
                                endDateTime: toDatetimeLocal(booking.endDateTime)
                              });
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                          >
                            Edit
                          </button>
                          <button type="button" className="btn btn-danger" onClick={() => handleCancel(booking.id)}>
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button type="button" className="btn btn-secondary" onClick={() => setEditingId(null)}>
                          View only
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
