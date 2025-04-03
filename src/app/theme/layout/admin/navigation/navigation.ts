export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: NavigationItem[];
  role?: string[];
  isMainParent?: boolean;
}

export const NavigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'default',
        title: 'Dashboard',
        type: 'item',
        classes: 'nav-item',
        url: '/dashboard',
        icon: 'ti ti-dashboard',
        role: ['manager']
      }
    ]
  },
  {
    id: 'rendezvous',
    title: 'Rendez Vous',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'rendez-vous-prise',
        title: 'Prise',
        type: 'item',
        classes: 'nav-item',
        url: '/rendez-vous/prise',
        icon: 'ti ti-typography',
        role: ['client','mecanicien']
      },
      {
        id: 'rendez-vous-liste',
        title: 'Liste',
        type: 'item',
        classes: 'nav-item',
        url: '/rendez-vous/liste',
        icon: 'ti ti-typography',
        role: ['client','mecanicien']
      }
    ]
  },
  {
    id: 'devis',
    title: 'Devis',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'devis-demande',
        title: 'Demande',
        type: 'item',
        classes: 'nav-item',
        url: '/devis/demande',
        icon: 'ti ti-typography',
        role: ['client','mecanicien']
      },
      {
        id: 'devis-historique',
        title: 'Historique',
        type: 'item',
        classes: 'nav-item',
        url: '/devis/historique',
        icon: 'ti ti-typography',
        role: ['client','mecanicien']
      }
    ]
  },
  {
    id: 'service',
    title: 'Service',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'service-historique',
        title: 'Historique',
        type: 'item',
        classes: 'nav-item',
        url: '/service/historique',
        icon: 'ti ti-typography',
        role: ['client','mecanicien']
      }
    ]
  },
  {
    id: 'facture',
    title: 'Facture',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'facture-liste',
        title: 'Liste',
        type: 'item',
        classes: 'nav-item',
        url: '/facture/liste',
        icon: 'ti ti-typography',
        role: ['client','mecanicien']
      }
    ]
  },

];
