import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit {

  public eventos: any;
  widthImg = 150;
  marginImg = 2;
  showImg = true;
  private _filter: string = '';
  public eventosFiltrados: any;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getEventos();
  }

  public getEventos(): void {
    this.http.get('https://localhost:5001/api/eventos').subscribe(
      response => {
        this.eventos = response;
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

  filtrarEventos(filterBy: string) {
    filterBy = filterBy.toLowerCase();
    return this.eventos.filter( (evento: { tema: string; local: string; }) => evento.tema.toLowerCase().indexOf(filterBy) !== -1 ||
    evento.local.toLocaleLowerCase().indexOf(filterBy) !== -1)
  }

}
