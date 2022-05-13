using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ProEventos.Persistence.Contexto;
using ProEventos.Aplication.Contratos;
using Microsoft.AspNetCore.Http;
using ProEventos.Aplication.Dtos;
using ProEventos.Persistence.Models;
using ProEventos.API.Extensions;

namespace ProEventos.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventosController : ControllerBase
    {
        private readonly ProEventosContext _context;
        private readonly IEventoService _eventoService;

        public EventosController(IEventoService eventoService)
        {
            _eventoService = eventoService;
        }

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery]PageParams pageParams)
        {
            try {
                var eventos = await _eventoService.GetAllEventosAsync(pageParams, true);
                if(eventos == null) return NoContent();

                Response.AddPagination( eventos.CurrentPage, eventos.PageSize, eventos.TotalCount, eventos.TotalPages );

                return Ok(eventos);
            }
            catch(Exception ex) {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar recuperar eventos. Erro: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try {
                var evento = await _eventoService.GetEventoByIdAsync(id, true);
                if(evento == null) return NoContent();

                return Ok(evento);
            }
            catch(Exception ex) {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar recuperar evento. Erro: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post(EventoDto model)
        {
            try {
                var evento = await _eventoService.AddEventos(model);
                if(evento == null) return NoContent();

                return Ok(evento);
            }
            catch(Exception ex) {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar adicionar evento. Erro: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, EventoDto model)
        {
            try {
                var evento = await _eventoService.UpdateEventos(id, model);
                if(evento == null) return NoContent();

                return Ok(evento);
            }
            catch(Exception ex) {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar atualizar evento. Erro: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try {
                if(await _eventoService.DeleteEvento(id)) return Ok(new {message = "Deletado"});
                else return BadRequest("Evento não deeltado.");
            }
            catch(Exception ex) {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar deletar evento. Erro: {ex.Message}");
            }
        }
    }
}
