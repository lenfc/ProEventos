using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ProEventos.Domain;

namespace ProEventos.Aplication.Contratos
{
    public interface IEventoService
    {
        Task<Evento> AddEventos( Evento model );
        Task<Evento> UpdateEventos( int eventoId, Evento model );
        Task<bool> DeleteEvento( int eventoId );
        Task<Evento[]> GetAllEventosAsync(bool includePalestrantes = false);
        Task<Evento[]> GetAllEventosByTemaAsync(string tema, bool includePalestrantes = false);
        Task<Evento> GetEventoByIdAsync(int EventoId, bool includePalestrantes = false);
    }
}