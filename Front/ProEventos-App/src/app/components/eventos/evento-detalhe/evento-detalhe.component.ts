import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';

import { EventoService } from 'src/app/services/evento.service';
import { Evento } from 'src/app/models/Evento';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss']
})
export class EventoDetalheComponent implements OnInit {

  form!: FormGroup;
  evento = {} as Evento;
  estadoSalvar: string  = 'post';

  get f(){
    return this.form.controls;
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
                      private router: ActivatedRoute, 
                      private eventoService: EventoService, 
                      private spinner: NgxSpinnerService, 
                      private toaster: ToastrService, 
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
    });
  }

  resetForm() {
    this.form.reset();
  }

  public carregarEvento() {
    const eventoIdParam = this.router.snapshot.paramMap.get('id');
    if(eventoIdParam !== null) {
      this.spinner.show();
      this.estadoSalvar = 'put';
      this.eventoService.getEventoById(+eventoIdParam).subscribe(
        (evento: Evento) => {
            this.evento = {... evento};
            this.form.patchValue(this.evento);
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

  public salvarAlteracao() {
    this.spinner.show();

    const param = this.estadoSalvar + 'Evento';

    if(this.form.valid) {
      if(this.estadoSalvar === 'post'){
        this.evento = {... this.form.value} 
        this.eventoService['postEvento'](this.evento).subscribe(
          () => {
            this.toaster.success('Evento salvo com sucesso.', 'Sucesso!');
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
}
