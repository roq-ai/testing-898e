const mapping: Record<string, string> = {
  'customer-complaints': 'customer_complaint',
  'delivery-partners': 'delivery_partner',
  'delivery-requests': 'delivery_request',
  'menu-items': 'menu_item',
  'operating-hours': 'operating_hour',
  restaurants: 'restaurant',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
