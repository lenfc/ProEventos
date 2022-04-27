using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ProEventos.API.Models;

namespace ProEventos.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventoController : ControllerBase
    {

        public IEnumerable<Evento> _evento = new Evento[] {
            new Evento() {
                EventoId = 1,
                Local = "Belo Horizonte",
                DataEvento = DateTime.Now.AddDays(2).ToString("dd/MM/yyyy"),
                Tema = "Angular",
                QtdPessoas = 250,
                Lote = "1° Lote",
                ImagemURL = "Imagem.png"
            },
            new Evento() {
                EventoId = 2,
                Local = "São Paulo",
                DataEvento = DateTime.Now.AddDays(4).ToString("dd/MM/yyyy"),
                Tema = ".NET",
                QtdPessoas = 100,
                Lote = "3° Lote",
                ImagemURL = "Imagem2.png"
            }
        };
        public EventoController()
        {

        }

        [HttpGet]
        public IEnumerable<Evento> Get()
        {
            return _evento;
        }

        [HttpGet("{id}")]
        public IEnumerable<Evento> GetById(int id)
        {
            return _evento.Where( Evento => Evento.EventoId == id );
        }

        [HttpPost]
        public string Post()
        {
            return "value Post";
        }

        [HttpPut("{id}")]
        public string Put(int id)
        {
            return $"value Put id = {id}";
        }

        [HttpDelete("{id}")]
        public string Delete(int id)
        {
            return $"value Delete id = {id}";
        }
    }
}
