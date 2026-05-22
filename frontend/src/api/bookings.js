import api from './axios';

export function getBookings() {
  return api.get('/bookings', {
    params: { _t: Date.now() }
  });
}

export function getUserBookings(email) {
  return api.get(`/bookings/user/${encodeURIComponent(email)}`, {
    params: { _t: Date.now() }
  });
}

export function createBooking(payload) {
  return api.post('/bookings', payload);
}

export function updateBooking(id, payload) {
  return api.put(`/bookings/${id}`, payload);
}

export function cancelBooking(id) {
  return api.patch(`/bookings/${id}/cancel`);
}

export function approveBooking(id, approvedBy) {
  return api.patch(`/bookings/${id}/approve`, null, {
    params: { approvedBy }
  });
}

export function rejectBooking(id, reason) {
  return api.patch(`/bookings/${id}/reject`, { reason });
}

export function deleteBooking(id) {
  return api.delete(`/bookings/${id}`);
}
