import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';

import { EventoService } from 'src/app/services/evento.service';
import { Evento } from 'src/app/models/Evento';
import { Lote } from 'src/app/models/Lote';
import { LoteService } from 'src/app/services/lote.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss']
})
export class EventoDetalheComponent implements OnInit {

  form!: FormGroup;
  evento = {} as Evento;
  estadoSalvar: string  = 'post';
  eventoId!: number;

  modalRef!: BsModalRef;
  loteAtual = {id: 0, nome: '', indice:0};

  get modoEditar(): boolean {
    return this.estadoSalvar === 'put';
  }

  get f(){
    return this.form.controls;
  }

  get lotes(): FormArray{
    return this.form.get('lotes') as FormArray;
  }

  get bsConfig(){
    return {
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY hh:mm a',
      containerClass: 'theme-default',
      showWeekNumbers: false
    };
  }

  constructor(private fb: FormBuilder,
                      private localeService: BsLocaleService,
                      private activatedRouter: ActivatedRoute, 
                      private eventoService: EventoService, 
                      private spinner: NgxSpinnerService, 
                      private toaster: ToastrService,
                      private loteService: LoteService,
                      private modalService: BsModalService,
                      private router: Router,
                      ) {
    this.localeService.use('pt-br');
   }

  ngOnInit(): void {
    this.carregarEvento();
    this.validation();
  }

  public validation() {
    this.form = this.fb.group({
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      imagemURL: ['', Validators.required],
      lotes: this.fb.array([])
    });
  }

  adicionarLote() {
    this.lotes.push(this.criarLote({id: 0} as Lote))
    console.log(this.lotes);
  }

  criarLote(lote: Lote): FormGroup{
    return this.fb.group({
      id: [lote.id, Validators.required],
      nome: [lote.nome, Validators.required],
      quantidade: [lote.quantidade, Validators.required],
      preco: [lote.preco, Validators.required],
      dataInicio: [lote.dataInicio],
      dataFim: [lote.dataFim],
    })
  }

  resetForm() {
    this.form.reset();
  }

  public carregarEvento() {
    this.eventoId = Number(this.activatedRouter.snapshot.paramMap.get('id'));

    if(this.eventoId !== null || this.eventoId === 0) {
      this.spinner.show();
      this.estadoSalvar = 'put';
      this.eventoService.getEventoById(this.eventoId).subscribe(
        (evento: Evento) => {
            this.evento = {... evento};
            this.form.patchValue(this.evento);
            this.carregarLotes();
        }, (error: any) => {
          this.spinner.hide();
          this.toaster.error('Erro ao tentar carregar o Evento.', 'Erro!');
          console.error(error);
        },() => {
          this.spinner.hide();
        }
      );
    }
  }

  public salvarEvento() {
    this.spinner.show();

    const param = this.estadoSalvar + 'Evento';

    if(this.form.valid) {
      if(this.estadoSalvar === 'post'){
        this.evento = {... this.form.value} 
        this.eventoService['postEvento'](this.evento).subscribe(
          (eventoRetorno: Evento) => {
            this.toaster.success('Evento salvo com sucesso.', 'Sucesso!');
            this.router.navigate([`eventos/detalhe/${eventoRetorno.id}`]);
          },
          (error: any) => {
            this.toaster.error('Erro ao salvar o evento.', 'Erro!');
          }
        ).add(() => this.spinner.hide())
      } else {
        this.evento = {id: this.evento.id, ... this.form.value}
        this.eventoService['putEvento'](this.evento).subscribe(
          () => {
            this.toaster.success('Evento salvo com sucesso.', 'Sucesso!');
          },
          (error: any) => {
            this.toaster.error('Erro ao salvar o evento.', 'Erro!');
          }
        ).add(() => this.spinner.hide())
      }
    }
  }

  public salvarLotes() {
    this.spinner.show();
    if (this.form.controls['lotes'].valid) {
      this.loteService.saveLote(this.eventoId, this.form.value.lotes).subscribe(
        () => {
          this.toaster.success('Lotes salvos com Sucesso!', 'Sucesso!');
          // this.lotes.reset();
        }, (error) => {
          this.toaster.error('Erro ao tentar salvar Lotes!', 'Erro!');
          console.error(error);
        }
      ).add(() => this.spinner.hide());
    }
  }

  public carregarLotes() {
    this.loteService.getLotesByEventoId(this.eventoId).subscribe(
      (lotesRetorno: Lote[]) => {
        lotesRetorno.forEach(lote => {
          this.lotes.push(this.criarLote(lote));
        })
      }, (error) => {
        this.toaster.error('Erro ao tentar carregar Lotes!', 'Erro!');
        console.error(error);
      }
    ).add(() => this.spinner.hide());
  }

  public removerLote(template: TemplateRef<any>, indice: number) {
    this.loteAtual.id = this.lotes.get(indice + '.id')?.value;
    this.loteAtual.nome = this.lotes.get(indice + '.nome')?.value;
    this.loteAtual.indice = indice;

    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  confirmDeleteLote() {
    this.modalRef.hide();
    this.spinner.show();

    this.loteService.deleteLote(this.eventoId, this.loteAtual.id).subscribe(
      () => {
        this.toaster.success('Lote deletado com sucesso.', 'Sucesso!');
        this.lotes.removeAt(this.loteAtual.indice);
      }, (error) => {
        this.toaster.error('Erro ao tentar deletar Lote!', 'Erro!');
        console.error(error);
      }
    ).add(() => this.spinner.hide());
  }

  declineDeleteLote() {
    this.modalRef.hide();
  }

  mudarValorData(value: Date, indice: number, campo: string) {
    this.lotes.value[indice][campo] = value;
  }

  retornaTituloLote(nome: string) {
    return (nome === null || nome === '') ? 'Nome do lote': nome;
  }
}
