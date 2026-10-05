// Which roles may open each area of the panel. Mirrors the role middleware in
// backend/routes/api.php — keep the two in sync, or users see screens whose
// API calls are refused (403).
export const ACCESS = {
  dashboard: ['admin', 'manager'], // GET /admin/stats
  orders: ['admin', 'manager'], // all orders + PATCH /admin/orders/{id}/status
  products: ['admin', 'manager', 'accountant', 'distributor', 'agent'],
  categories: ['admin', 'manager'], // category create/update/delete
  commissions: ['admin', 'accountant', 'distributor', 'agent'], // all (staff) or own (vendors)
  withdrawals: ['admin', 'accountant', 'distributor', 'agent'],
  users: ['admin', 'manager'], // GET /admin/users
  portal: ['distributor', 'agent'],
};

export const can = (role, area) => Boolean(role && ACCESS[area]?.includes(role));

export const isPortalRole = (role) => can(role, 'portal');

/** Where a role lands after sign-in (the first area it can actually use). */
export const homePath = (role) => {
  if (can(role, 'dashboard') || isPortalRole(role)) return '/';
  if (can(role, 'commissions')) return '/commissions';
  return '/products';
};
