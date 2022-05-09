using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ProEventos.Aplication.Dtos;
using ProEventos.Domain;

namespace ProEventos.Aplication.Contratos
{
    public interface IEventoService
    {
        Task<EventoDto> AddEventos( EventoDto model );
        Task<EventoDto> UpdateEventos( int eventoId, EventoDto model );
        Task<bool> DeleteEvento( int eventoId );
        Task<EventoDto[]> GetAllEventosAsync(bool includePalestrantes = false);
        Task<EventoDto[]> GetAllEventosByTemaAsync(string tema, bool includePalestrantes = false);
        Task<EventoDto> GetEventoByIdAsync(int EventoId, bool includePalestrantes = false);
    }
}