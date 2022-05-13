using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ProEventos.Aplication.Dtos;
using ProEventos.Domain;
using ProEventos.Persistence.Models;

namespace ProEventos.Aplication.Contratos
{
    public interface IEventoService
    {
        Task<EventoDto> AddEventos( EventoDto model );
        Task<EventoDto> UpdateEventos( int eventoId, EventoDto model );
        Task<bool> DeleteEvento( int eventoId );
        Task<PageList<EventoDto>> GetAllEventosAsync(PageParams pageParams, bool includePalestrantes = false);
        Task<EventoDto> GetEventoByIdAsync(int EventoId, bool includePalestrantes = false);
    }
}