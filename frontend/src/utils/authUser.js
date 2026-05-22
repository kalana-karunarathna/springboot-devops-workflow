export function getUserDisplayName(user) {
  if (!user) return '';
  return user.name?.trim() || user.email?.trim() || 'User';
}

export function getUserFirstName(user) {
  const displayName = getUserDisplayName(user);
  return displayName.split(/\s+/)[0] || 'User';
}

export function getUserInitial(user) {
  const displayName = getUserDisplayName(user);
  return displayName.charAt(0).toUpperCase() || 'U';
}

export function getUserRoleLabel(user) {
  const role = user?.role?.trim();
  if (!role) return 'Member';
  return role.toLowerCase().replace(/(^|\s)\S/g, (match) => match.toUpperCase());
}
