export interface AdminNotification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

/** Placeholder feed until a real notifications endpoint exists. */
export const MOCK_NOTIFICATIONS: AdminNotification[] = [
  {
    id: 'notif-1',
    title: 'New order received',
    description: '#ORD-1042 · 3 items · ₹486 — awaiting confirmation.',
    timestamp: '2 min ago',
    read: false,
  },
  {
    id: 'notif-2',
    title: 'Payment settled',
    description: '#PAY-8891 · UPI · ₹1,240 credited to kitchen wallet.',
    timestamp: '26 min ago',
    read: false,
  },
  {
    id: 'notif-3',
    title: 'Low stock alert',
    description: 'Paneer (400g left) — below tomorrow’s menu threshold.',
    timestamp: '1 hr ago',
    read: false,
  },
  {
    id: 'notif-4',
    title: 'Delivery completed',
    description: 'Rider Arjun delivered #ORD-1038 in 32 minutes.',
    timestamp: '3 hrs ago',
    read: true,
  },
];

export default MOCK_NOTIFICATIONS;
