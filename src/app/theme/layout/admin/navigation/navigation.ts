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
        id: 'dashboard',
        title: 'Dashboard',
        type: 'item',
        classes: 'nav-item',
        url: '/dashboard',
        icon: 'ti ti-dashboard',
        role: ['manager']
      },
    ]
  },{
    id: 'utilisateurs',
    title: 'Utilisateurs',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'profiluser',
        title: 'Utilisateurs',
        type: 'item',
        classes: 'nav-item',
        url: '/profil',
        icon: 'ti ti-user',
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
        icon: 'ti ti-calendar',
        role: ['client']
      },
      {
        id: 'rendez-vous-liste',
        title: 'Liste',
        type: 'item',
        classes: 'nav-item',
        url: '/rendez-vous/liste',
        icon: 'ti ti-list',
        role: ['client']
      }
    ]
  },

  {
    id: 'vehicule',
    title: 'Vehicule',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'ajout-vehicule',
        title: 'Ajout',
        type: 'item',
        classes: 'nav-item',
        url: '/vehicule/ajout',
        icon: 'ti ti-car',
        role: ['client']
      },
      {
        id: 'vehicule-liste',
        title: 'Liste',
        type: 'item',
        classes: 'nav-item',
        url: '/vehicule/liste',
        icon: 'ti ti-list',
        role: ['client']
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
        icon: 'ti ti-clipboard',
        role: ['client']
      },
      {
        id: 'devis-historique',
        title: 'Historique',
        type: 'item',
        classes: 'nav-item',
        url: '/devis/historique',
        icon: 'ti ti-receipt',
        role: ['client']
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
        icon: 'ti ti-receipt',
        role: ['client']
      }
    ]
  },
  {
    id: 'commentaire',
    title: 'Avis',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'commentaire',
        title: 'Commentaire',
        type: 'item',
        classes: 'nav-item',
        url: '/commentaires',
        icon: 'ti ti-star',
        role: ['client']
      }
    ]
  },
  {
    id: 'tache',
    title: 'Tache',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'liste-tache',
        title: 'Liste des taches',
        type: 'item',
        classes: 'nav-item',
        url: '/taches',
        icon: 'ti ti-receipt',
        role: ['mecanicien','manager']
      }
    ]
  },
  // {
  //   id: 'facture',
  //   title: 'Facture',
  //   type: 'group',
  //   icon: 'icon-navigation',
  //   children: [
  //     {
  //       id: 'facture-liste',
  //       title: 'Liste',
  //       type: 'item',
  //       classes: 'nav-item',
  //       url: '/facture/liste',
  //       icon: 'ti ti-typography',
  //       role: ['client','mecanicien']
  //     }
  //   ]
  // },

];
