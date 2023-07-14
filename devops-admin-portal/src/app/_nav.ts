import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    title: true,
    name: 'System Admin'
  },
  {
    name: 'Org Management',
    url: '/admin/organization',
    icon: 'icon-people'
  },
  {
    name: 'Team Management',
    url: '/admin/team',
    icon: 'icon-people'
  },
  {
    name: 'User Management',
    url: '/admin/user',
    icon: 'icon-user'
  },
  {
    name: 'Project Management',
    url: '/admin/project',
    icon: 'icon-rocket'
  },
  {
    name: 'Client Management',
    url: '/admin/client',
    icon: 'icon-screen-desktop'
  },
  {
    name: 'My Profile',
    url: '/admin/profile',
    icon: 'icon-info'
  },
  {
    name: 'About',
    url: '/admin/about',
    icon: 'icon-info'
  },

];
