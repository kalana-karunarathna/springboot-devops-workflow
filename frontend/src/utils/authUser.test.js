import { describe, expect, it } from 'vitest';
import { getUserDisplayName, getUserFirstName, getUserInitial, getUserRoleLabel } from './authUser';

describe('authUser utilities', () => {
  it('uses the trimmed name as the display name when available', () => {
    expect(getUserDisplayName({ name: '  Kalana Silva  ', email: 'kalana@example.com' })).toBe('Kalana Silva');
  });

  it('falls back to the email and default values when profile fields are missing', () => {
    expect(getUserDisplayName({ email: ' user@example.com ' })).toBe('user@example.com');
    expect(getUserFirstName(null)).toBe('User');
    expect(getUserInitial(null)).toBe('U');
    expect(getUserRoleLabel({})).toBe('Member');
  });

  it('formats the first name, initial, and role label from user data', () => {
    const user = { name: 'Admin User', role: 'facility manager' };

    expect(getUserFirstName(user)).toBe('Admin');
    expect(getUserInitial(user)).toBe('A');
    expect(getUserRoleLabel(user)).toBe('Facility Manager');
  });
});
