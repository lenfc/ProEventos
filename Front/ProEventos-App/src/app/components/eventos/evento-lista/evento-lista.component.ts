import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, Subject } from 'rxjs';
import { Evento } from 'src/app/models/Evento';
import { PaginatedResult, Pagination } from 'src/app/models/Pagination';
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
  public eventoId = 0;

  termoBuscaChanged: Subject<string> = new Subject<string>();

  modalRef?: BsModalRef;

  public pagination = {} as Pagination;

  constructor(private eventoService: EventoService,
              private modalService: BsModalService,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService,
              private router: Router) { }

  ngOnInit(): void {
    this.pagination = {
      currentPage: 1,
      itemsPerPage: 3,
      totalItems: 1,
    } as Pagination;
    this.carregarEventos();
  }

  public carregarEventos(): void {
    this.spinner.show();
    this.eventoService.getEventos(this.pagination.currentPage, this.pagination.itemsPerPage).subscribe(
      (response: PaginatedResult<Evento[]>) => {
        this.eventos = response.result;
        this.pagination = response.pagination;
      },
      error => console.log(error)
    ).add(() => {this.spinner.hide()})
  }

  filtrarEventos(event: any){
    if( this.termoBuscaChanged.observers.length === 0 ) {
      this.termoBuscaChanged.pipe(debounceTime(1500)).subscribe(
        filtrarPor => {
          this.spinner.show();
          this.eventoService.getEventos(this.pagination.currentPage, 
                                        this.pagination.itemsPerPage,
                                        filtrarPor).subscribe(
                                          (response: PaginatedResult<Evento[]>) => {                    
                                            this.eventos = response.result;
                                            this.pagination = response.pagination;
                                          },
                                          error => console.log(error)
                                          ).add(() => {this.spinner.hide()})
        }
      )
    }
    this.termoBuscaChanged.next(event.value);

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

  public pageChanged(event: any){
    console.log('event')
    console.log(event)
    this.pagination.currentPage = event.page;
    this.carregarEventos();
  }
}
