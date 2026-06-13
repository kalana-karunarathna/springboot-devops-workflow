import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import BookingAdminPage from './admin';
import { approveBooking, getBookings, rejectBooking } from '../../api/bookings';

vi.mock('react-hot-toast', () => ({
  default: {
    error: vi.fn(),
    success: vi.fn()
  }
}));

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: {
      name: 'Admin User',
      email: 'admin@example.com'
    }
  })
}));

vi.mock('../../api/bookings', () => ({
  approveBooking: vi.fn(),
  deleteBooking: vi.fn(),
  getBookings: vi.fn(),
  rejectBooking: vi.fn()
}));

const pendingBooking = {
  id: 'b1',
  resourceId: 'LAB-101',
  resourceName: 'Computer Lab 101',
  requestedBy: 'student@example.com',
  purpose: 'Project meeting',
  startDateTime: '2026-04-18T10:00:00',
  endDateTime: '2026-04-18T11:00:00',
  status: 'PENDING'
};

describe('BookingAdminPage integration', () => {
  beforeEach(() => {
    getBookings.mockResolvedValue({
      data: {
        data: [pendingBooking]
      }
    });
  });

  it('loads and renders bookings from the API', async () => {
    render(<BookingAdminPage />);

    expect(screen.getByText('Loading bookings...')).toBeInTheDocument();
    expect(await screen.findByText('Computer Lab 101')).toBeInTheDocument();
    expect(screen.getByText(/student@example.com/)).toBeInTheDocument();
    expect(screen.getAllByText('PENDING').length).toBeGreaterThan(0);
  });

  it('approves a pending booking using the logged-in admin name', async () => {
    approveBooking.mockResolvedValue({});
    const user = userEvent.setup();

    render(<BookingAdminPage />);

    await screen.findByText('Computer Lab 101');
    await user.click(screen.getByRole('button', { name: 'Approve' }));

    await waitFor(() => {
      expect(approveBooking).toHaveBeenCalledWith('b1', 'Admin User');
    });
    expect(await screen.findByText('Booking approved.')).toBeInTheDocument();
    expect(getBookings).toHaveBeenCalledTimes(2);
  });

  it('rejects a pending booking with the entered rejection reason', async () => {
    rejectBooking.mockResolvedValue({});
    const user = userEvent.setup();

    render(<BookingAdminPage />);

    await screen.findByText('Computer Lab 101');
    await user.type(screen.getByLabelText('Rejection reason'), 'Maintenance window');
    await user.click(screen.getByRole('button', { name: 'Reject' }));

    await waitFor(() => {
      expect(rejectBooking).toHaveBeenCalledWith('b1', 'Maintenance window');
    });
    expect(await screen.findByText('Booking rejected.')).toBeInTheDocument();
    expect(getBookings).toHaveBeenCalledTimes(2);
  });
});
