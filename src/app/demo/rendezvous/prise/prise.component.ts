import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, OnInit  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { AuthService } from 'src/app/services/auth.service';
import { RendezvousService } from 'src/app/services/client/rendezvous.service';

import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-prise',
  templateUrl: './prise.component.html',
  styleUrls: ['./prise.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule, FullCalendarModule]
})
export default class PriseComponent implements OnInit {
  @ViewChild('testModal', { static: false }) testModal!: ElementRef;
  rendezVous = {
    clientId: this.authService.getUserInfo().id,
    vehiculeId: '',
    servicesIds: [],
    dateSelectionnee: '',
    heureSelectionnee: ''
  };

  vehicules: any[] = [];
  services: any[] = [];
  datesIndisponibles = new Map();
  message = '';

  calendarOptions: any;

  constructor(
    private rendezVousService: RendezvousService,
    private authService: AuthService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.chargerVehicules();
    this.chargerServices();
    this.chargerDatesIndisponibles();

    this.calendarOptions = {
      initialView: 'dayGridMonth', //dayGridMonth
      plugins: [dayGridPlugin, interactionPlugin,timeGridPlugin],
      dateClick: this.handleDateClick.bind(this),
      events: [], // Les événements seront chargés après
      validRange: {
        start: new Date().toISOString().split('T')[0] // Empêcher la sélection de dates passées
      },
      selectAllow: (selectInfo) => {
        const dateStr = selectInfo.startStr.split('T')[0];
        return !this.datesIndisponibles.has(dateStr); // Désactiver les jours où il y a une indisponibilité
      },
      eventDidMount: (info) => {
        console.log("Événement rendu :", info.event);
        if (info.el && info.event.extendedProps.description) {
          info.el.setAttribute('title', info.event.extendedProps.description);
        }
      }

    };
  }

  chargerVehicules() {
    this.rendezVousService.getVehicules(this.rendezVous.clientId).subscribe({
      next: (response) => {
        this.vehicules = response.data;
      },
      error: (err) => console.error('Erreur lors du chargement des véhicules:', err)
    });
  }

  chargerServices() {
    this.rendezVousService.getServices().subscribe({
      next: (response) => {
        this.services = response.data;
      },
      error: (err) => console.error('Erreur lors du chargement des services:', err)
    });
  }

  chargerDatesIndisponibles() {
    this.datesIndisponibles = new Map();

    this.rendezVousService.getDisabledDates().subscribe({
      next: (response) => {
        if (response && Array.isArray(response.data)) {
          // const events = [ // Liste d'événements par défaut
          //   { title: 'Événement 1', date: '2025-04-01' },
          //   { title: 'Événement 2', date: '2025-04-02' },
          //   { title: 'Événement 3', date: '2025-04-05' },
          //   { title: 'Réunion', date: '2025-04-10' },
          //   { title: 'Conférence', date: '2025-04-15' }
          // ]
          const events = response.data.map(d => {
            const dateDebut = d.dateDebut.split('T')[0]; // YYYY-MM-DD
            const heureDebut = d.dateDebut.split('T')[1].substring(0, 5); // HH:mm
            const heureFin = d.dateFin.split('T')[1].substring(0, 5); // HH:mm

            // Ajouter un événement pour chaque créneau indisponible
            return {
              title: `Indisponible ${heureDebut} - ${heureFin}`,
              start: `${dateDebut}T${heureDebut}:00`, // Format ISO 8601
              end: `${dateDebut}T${heureFin}:00`,
              description: `Indisponibilité du créneau ${heureDebut} - ${heureFin} le ${dateDebut}`, // Description de l'événement
              color: 'red', // Couleur des créneaux bloqués
            };
          });

          console.log('Événements chargés :', events); // Vérifier les événements

          // Ajouter les événements à FullCalendar
          this.calendarOptions.events = events;
          this.calendarOptions = { ...this.calendarOptions };
        } else {
          console.error("Format inattendu:", response);
        }
      },
      error: (err) => console.error('Erreur lors du chargement des dates:', err)
    });
  }


  estHeureDisponible(dateSelectionnee: string, heureSelectionnee: string): boolean {
    const listeHoraires = this.datesIndisponibles.get(dateSelectionnee) || [];

    return !listeHoraires.some(({ heureDebut, heureFin }) =>
      heureSelectionnee >= heureDebut && heureSelectionnee < heureFin
    );
  }

  onDateChange() {
    if (!this.rendezVous.dateSelectionnee || !this.rendezVous.heureSelectionnee) return;

    const dateStr = this.rendezVous.dateSelectionnee;
    const heureSelectionnee = this.rendezVous.heureSelectionnee;

    if (this.datesIndisponibles.has(dateStr)) {
      if (!this.estHeureDisponible(dateStr, heureSelectionnee)) {
        this.message = "Ce créneau horaire est déjà pris. Veuillez en choisir un autre.";
        this.rendezVous.heureSelectionnee = '';
        return;
      }
    }

    this.message = '';
  }

  validerRendezVous() {
    if (!this.rendezVous.vehiculeId || this.rendezVous.servicesIds.length === 0 || !this.rendezVous.dateSelectionnee || !this.rendezVous.heureSelectionnee) {
      this.message = "Veuillez remplir tous les champs.";
      return;
    }

    console.log(this.rendezVous);
    // Envoi au backend
    // this.rendezVousService.createRendezvous(this.rendezVous).subscribe({
    //   next: (response) => {
    //     this.message = "Rendez-vous validé avec succès !";
    //   },
    //   error: (err) => {
    //     console.error('Erreur:', err);
    //     this.message = "Une erreur est survenue lors de la validation.";
    //   }
    // });
  }

  handleDateClick(arg: { dateStr: string; }) {
    this.rendezVous.dateSelectionnee = arg.dateStr;
    this.message = '';
    const modalElement = document.getElementById('calendarModal');
    if (modalElement) {
      (modalElement as any).classList.remove('show');
      (modalElement as any).style.display = 'none';
    }
  }

  ouvrirModal(modal: any) {
    const modalRef = this.modalService.open(modal, {
      centered: true,          /* Centrer le modal */
      size: 'lg',              /* Taille par défaut large */
      windowClass: 'custom-modal-size' /* Applique la classe personnalisée */
    });
  }

}
