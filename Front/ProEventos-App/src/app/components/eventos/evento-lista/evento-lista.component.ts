import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from 'src/app/models/Evento';
import { EventoService } from 'src/app/services/evento.service';

@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrls: ['./evento-lista.component.scss']
})
export class EventoListaComponent implements OnInit {

  public eventos: Evento[] = [];
  widthImg = 150;
  marginImg = 2;
  showImg = true;
  private _filter: string = '';
  public eventosFiltrados: Evento[] = [];
  public eventoId = 0;

  modalRef?: BsModalRef;

  constructor(private eventoService: EventoService,
              private modalService: BsModalService,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService,
              private router: Router) { }

  ngOnInit(): void {
    this.carregarEventos();
    this.spinner.show();

    setTimeout(() => {
      this.spinner.hide();
    }, 500);
  }

  public carregarEventos(): void {
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

  openModal(event: any, template: TemplateRef<any>, eventoId: number) {
    event.stopPropagation();
    this.eventoId = eventoId;
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }
 
  confirm(): void {
    this.modalRef?.hide();
    this.spinner.show();
    this.eventoService.deleteEvento(this.eventoId).subscribe(
      (result) => {
        this.toastr.success('E evento foi deletado com sucesso', 'Deletado!');
        this.spinner.hide();
        this.carregarEventos();
      },(error: any) => {
        this.toastr.error(`Erro ao tentar deletar o evento ${this.eventoId}.`, 'Erro!');
        this.spinner.hide();
      }, () => this.spinner.hide()
    )
  }
 
  decline(): void {
    this.modalRef?.hide();
  }

  detalheEvento(id: number) {
    this.router.navigate([`eventos/detalhe/${id}`]);
  }
}
