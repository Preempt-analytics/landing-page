// Registry for the /product/ dashboard shell (ProductPreview.astro). Single
// source of truth for the sidebar's 9 items and how each panel renders —
// mirrors site.ts's role as a plain-constants contract, not markup. A panel's
// `mode` is the one field that decides its content: 'image' (a labelled
// concept screenshot), 'html' (real markup, e.g. live metrics), or 'soon'
// (still in development). Flipping a panel between modes later is a one-line
// edit here plus a template branch in ProductPreview.astro — never a shell
// rewrite. Order matches design/mockups/dashboard-mockup.png exactly.
export type PanelMode = 'image' | 'html' | 'soon';

export interface DashboardPanel {
  id: string;
  label: string;
  mode: PanelMode;
}

export const DASHBOARD_PANELS: DashboardPanel[] = [
  { id: 'overview', label: 'Overview', mode: 'image' },
  { id: 'live-machines', label: 'Live Machines', mode: 'html' },
  { id: 'alerts', label: 'Alerts', mode: 'image' },
  { id: 'predictions', label: 'Predictions', mode: 'image' },
  { id: 'maintenance-queue', label: 'Maintenance Queue', mode: 'soon' },
  { id: 'work-orders', label: 'Work Orders', mode: 'soon' },
  { id: 'model-health', label: 'Model Health', mode: 'html' },
  { id: 'reports', label: 'Reports', mode: 'soon' },
  { id: 'settings', label: 'Settings', mode: 'html' },
];
