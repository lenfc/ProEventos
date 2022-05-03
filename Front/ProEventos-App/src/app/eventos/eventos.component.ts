import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from '../models/Evento';
import { EventoService } from '../services/evento.service';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit {

  public eventos: Evento[] = [];
  widthImg = 150;
  marginImg = 2;
  showImg = true;
  private _filter: string = '';
  public eventosFiltrados: Evento[] = [];

  modalRef?: BsModalRef;

  constructor(private eventoService: EventoService,
              private modalService: BsModalService,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.getEventos();
    this.spinner.show();

    setTimeout(() => {
      this.spinner.hide();
    }, 5000);
  }

  public getEventos(): void {
    this.eventoService.getEventos().subscribe(
      (eventos: Evento[]) => {
        this.eventos = eventos;
        this.eventosFiltrados = this.eventos;
      },
      error => console.log(error)
    )
  }

  public get filter() {
    return this._filter;
  }

  public set filter(value: string) {
    this._filter = value;
    this.eventosFiltrados = this.filter ? this.filtrarEventos(this.filter) : this.eventos;
  }

  filtrarEventos(filterBy: string) : Evento[]{
    filterBy = filterBy.toLowerCase();
    return this.eventos.filter( (evento: { tema: string; local: string; }) => evento.tema.toLowerCase().indexOf(filterBy) !== -1 ||
    evento.local.toLocaleLowerCase().indexOf(filterBy) !== -1)
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }
 
  confirm(): void {
    this.modalRef?.hide();
    this.toastr.success('E evento foi deletado com sucesso', 'Deletado!');
  }
 
  decline(): void {
    this.modalRef?.hide();
  }

}
