using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ProEventos.Domain;

namespace ProEventos.Aplication.Contratos
{
    public interface IPalestranteService
    {
        Task<Palestrante> AddPalestrantes( Palestrante model );
        Task<Palestrante> UpdatePalestrantes( int eventoId, Palestrante model );
        Task<bool> DeletePalestrante( int eventoId );
        Task<Palestrante[]> GetAllPalestrantesByNomeAsync(string nome, bool includePalestrantes = false);
        Task<Palestrante[]> GetAllPalestrantesAsync(bool includePalestrantes = false);
        Task<Palestrante> GetPalestranteByIdAsync(int palestranteId, bool includePalestrantes = false);
    }
}