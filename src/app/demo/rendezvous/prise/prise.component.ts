import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
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
  @ViewChild('calendarModal', { static: false }) calendarModal!: ElementRef;
  rendezVous = {
    clientId: '',
    vehiculeId: '',
    servicesIds: [],
    dateSelectionnee: '',
    heureSelectionnee: ''
  };

  vehicules: any[] = [];
  services: any[] = [];
  datesIndisponibles = new Map();
  message = '';
  selectedServices: any[] = [];
  calendarOptions: any;

  constructor(
    private rendezVousService: RendezvousService,
    private authService: AuthService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.rendezVous.clientId = this.authService.getUserInfo()?.id || '';
    this.chargerVehicules();
    this.chargerServices();
    this.chargerDatesIndisponibles();

    this.calendarOptions = {
      initialView: 'dayGridMonth',
      plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
      dateClick: this.handleDateClick.bind(this),
      events: [],
      validRange: {
        start: new Date().toISOString().split('T')[0]
      },
      selectAllow: (selectInfo) => {
        const dateStr = selectInfo.startStr.split('T')[0];
        return !this.datesIndisponibles.has(dateStr);
      },
      eventDidMount: (info) => {
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
        this.selectedServices = this.services.map(service => ({ _id: service._id, selected: false, nom: service.nom }));
        // console.log(this.services);

      },
      error: (err) => console.error('Erreur lors du chargement des services:', err)
    });
  }

  // debut service
  selectionServiceOuvert = false;
tempSelectedServices: any[] = [];

ouvrirSelectionService() {
  this.selectionServiceOuvert = true;

  // Copier l'état actuel pour annulation possible
  this.tempSelectedServices = this.selectedServices.map(service => ({
    ...service,
    selected: service.selected
  }));
}

fermerSelectionService(annuler = false) {
  if (annuler) {
    // Remettre l'état initial
    this.selectedServices = this.tempSelectedServices.map(service => ({
      ...service
    }));
  }
  this.selectionServiceOuvert = false;
}

validerSelectionService() {
  this.rendezVous.servicesIds = this.selectedServices
    .filter(service => service.selected)
    .map(service => service._id);

  this.selectionServiceOuvert = false;
}

getServiceNameById(serviceId: string): string {
  const service = this.selectedServices.find(s => s._id === serviceId);
  return service ? service.nom : '';
}
  // fin service

  chargerDatesIndisponibles() {
    this.datesIndisponibles = new Map();
    this.rendezVousService.getDisabledDates().subscribe({
      next: (response) => {
        const events = response.data.map(d => {
          const dateDebut = d.dateDebut.split('T')[0];
          const heureDebut = d.dateDebut.split('T')[1].substring(0, 5);
          const heureFin = d.dateFin.split('T')[1].substring(0, 5);

          // Stocke les horaires indisponibles par date
        if (!this.datesIndisponibles.has(dateDebut)) {
          this.datesIndisponibles.set(dateDebut, []);
        }
        this.datesIndisponibles.get(dateDebut)?.push({ heureDebut, heureFin });

          return {
            title: `Indisponible ${heureDebut} - ${heureFin}`,
            start: `${dateDebut}T${heureDebut}:00`,
            end: `${dateDebut}T${heureFin}:00`,
            description: `Indisponibilité du créneau ${heureDebut} - ${heureFin} le ${dateDebut}`,
            color: 'red',
          };
        });
        console.log(events);
        this.calendarOptions = {
          ...this.calendarOptions,
          events
        };
      },
      error: (err) => console.error('Erreur lors du chargement des dates:', err.error.message)
    });
  }

  estHeureDisponible(dateSelectionnee: string, heureSelectionnee: string): boolean {
    // Si la date n'est pas présente dans les dates indisponibles, c'est tout de suite disponible
    if (!this.datesIndisponibles.has(dateSelectionnee)) {
      return true;
    }

    const horairesIndisponibles = this.datesIndisponibles.get(dateSelectionnee);

    // Vérifier si l'heure sélectionnée est dans l'intervalle d'indisponibilité
    return !horairesIndisponibles.some(({ heureDebut, heureFin }) =>
      heureSelectionnee >= heureDebut && heureSelectionnee < heureFin
    );
  }

  onDateChange() {
    if (!this.rendezVous.dateSelectionnee || !this.rendezVous.heureSelectionnee) return;
    const dateStr = this.rendezVous.dateSelectionnee;
    const heureSelectionnee = this.rendezVous.heureSelectionnee;
    console.log(this.datesIndisponibles.has(dateStr));

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
    if (!this.rendezVous.vehiculeId || !this.rendezVous.servicesIds.length || !this.rendezVous.dateSelectionnee || !this.rendezVous.heureSelectionnee) {
      this.message = "Veuillez remplir tous les champs.";
      return;
    }
    const dateHeure = this.formatDateEtHeure(this.rendezVous.dateSelectionnee, this.rendezVous.heureSelectionnee)


    const rdv = {
      clientId: this.rendezVous.clientId,
      vehiculeId: this.rendezVous.vehiculeId,
      servicesIds: this.rendezVous.servicesIds,
      dateSelectionnee: dateHeure,
    }

    // console.log(rdv);


    this.rendezVousService.createRendezvous(rdv).subscribe({
      next: () => {
        this.message = "Rendez-vous validé avec succès !";
      },
      error: (err) => {
        console.error("Erreur lors de la validation du rendez-vous:", err);
        this.message = err.error.message;
      }
    });
  }

  handleDateClick(arg: { dateStr: string; }) {
    this.rendezVous.dateSelectionnee = arg.dateStr;
    this.message = '';
    this.modalService.dismissAll();
  }

  ouvrirModal(modal: any) {
    const modalRef = this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      windowClass: 'custom-modal-size'
    });
  }
  onDateClick(event) {
    const selectedDate = event.dateStr; // Date sélectionnée dans le calendrier
    this.rendezVous.dateSelectionnee = selectedDate; // Met à jour la date dans le modèle
  }

  // formatDateEtHeure(date: string, heure: string): string {
  //   const dateParts = date.split('-'); // Sépare la date en année, mois, jour
  //   const timeParts = heure.split(':'); // Sépare l'heure en heures, minutes

  //   // Crée une nouvelle date en combinant la date et l'heure
  //   const combinedDate = new Date(
  //     parseInt(dateParts[0]), // Année
  //     parseInt(dateParts[1]) - 1, // Mois (0-11 en JavaScript)
  //     parseInt(dateParts[2]), // Jour
  //     parseInt(timeParts[0]), // Heure
  //     parseInt(timeParts[1]), // Minute
  //     0, // Seconde (on met 0 par défaut)
  //     0 // Milliseconde (on met 0 par défaut)
  //   );

  //   // Retourne la date formatée en ISO : "YYYY-MM-DDTHH:mm:ss"
  //   return combinedDate.toISOString().split('.')[0]; // Exclut les fractions de seconde
  // }

  formatDateEtHeure(date: string, heure: string): string {
    return `${date}T${heure}:00`
}



}
