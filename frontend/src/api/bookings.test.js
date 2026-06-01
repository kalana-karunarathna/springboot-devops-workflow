import { beforeEach, describe, expect, it, vi } from 'vitest';
import api from './axios';
import {
  approveBooking,
  cancelBooking,
  createBooking,
  deleteBooking,
  getBookings,
  getUserBookings,
  rejectBooking,
  updateBooking
} from './bookings';

vi.mock('./axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn()
  }
}));

describe('bookings API helpers', () => {
  beforeEach(() => {
    vi.spyOn(Date, 'now').mockReturnValue(1713444000000);
  });

  it('fetches all bookings with a cache-busting timestamp', () => {
    getBookings();

    expect(api.get).toHaveBeenCalledWith('/bookings', {
      params: { _t: 1713444000000 }
    });
  });

  it('fetches user bookings with an encoded email path segment', () => {
    getUserBookings('student+lab@example.com');

    expect(api.get).toHaveBeenCalledWith('/bookings/user/student%2Blab%40example.com', {
      params: { _t: 1713444000000 }
    });
  });

  it('sends create and update payloads to the booking endpoints', () => {
    const payload = { resourceId: 'LAB-101', purpose: 'Project meeting' };

    createBooking(payload);
    updateBooking('b1', payload);

    expect(api.post).toHaveBeenCalledWith('/bookings', payload);
    expect(api.put).toHaveBeenCalledWith('/bookings/b1', payload);
  });

  it('sends booking decisions and deletes through the expected endpoints', () => {
    approveBooking('b1', 'Admin User');
    rejectBooking('b1', 'Unavailable');
    cancelBooking('b1');
    deleteBooking('b1');

    expect(api.patch).toHaveBeenCalledWith('/bookings/b1/approve', null, {
      params: { approvedBy: 'Admin User' }
    });
    expect(api.patch).toHaveBeenCalledWith('/bookings/b1/reject', { reason: 'Unavailable' });
    expect(api.patch).toHaveBeenCalledWith('/bookings/b1/cancel');
    expect(api.delete).toHaveBeenCalledWith('/bookings/b1');
  });
});
