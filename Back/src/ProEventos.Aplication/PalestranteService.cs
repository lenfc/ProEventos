using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ProEventos.Aplication.Contratos;
using ProEventos.Domain;
using ProEventos.Persistence.Contratos;

namespace ProEventos.Aplication
{
    public class PalestranteService : IPalestranteService
    {
        private readonly IPalestrantePersist _palestrantePersist;
        private readonly IGeralPersist _geralPersist;

        public PalestranteService(IGeralPersist geralPersist, IPalestrantePersist palestrantePersist)
        {
            _palestrantePersist = palestrantePersist;
            _geralPersist = geralPersist;
        }
        public async Task<Palestrante> AddPalestrantes(Palestrante model)
        {
            try
            {
               _geralPersist.Add<Palestrante>(model);
               if(await _geralPersist.SaveChangesAsync()){
                   return await _palestrantePersist.GetPalestranteByIdAsync(model.Id, false);
               }
               return null;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<Palestrante> UpdatePalestrantes(int palestranteId, Palestrante model)
        {
            try
            {
                var evento = await _palestrantePersist.GetPalestranteByIdAsync(palestranteId, false);
                if(evento == null) return null;
                
                model.Id = palestranteId;
                _geralPersist.Update(model);
                if(await _geralPersist.SaveChangesAsync()){
                   return await _palestrantePersist.GetPalestranteByIdAsync(model.Id, false);
                }
                return null;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> DeletePalestrante(int palestranteId)
        {
            try
            {
                var palestrante = await _palestrantePersist.GetPalestranteByIdAsync(palestranteId, false);
                if(palestrante == null) throw new Exception("Palestrante para delete não encontrado.");

                _geralPersist.Delete<Palestrante>(palestrante);
                return await _geralPersist.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<Palestrante[]> GetAllPalestrantesAsync(bool includePalestrantes = false)
        {
            try
            {
                var palestrantes = await _palestrantePersist.GetAllPalestrantesAsync(includePalestrantes);
                if(palestrantes == null) return null;

                return palestrantes;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<Palestrante[]> GetAllPalestrantesByNomeAsync(string nome, bool includePalestrantes = false)
        {
            try
            {
                var palestrantes = await _palestrantePersist.GetAllPalestrantesByNomeAsync(nome, includePalestrantes);
                if(palestrantes == null) return null;

                return palestrantes;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<Palestrante> GetPalestranteByIdAsync(int palestranteId, bool includePalestrantes = false)
        {
            try
            {
                var palestrantes = await _palestrantePersist.GetPalestranteByIdAsync(palestranteId, includePalestrantes);
                if(palestrantes == null) return null;

                return palestrantes;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

    }
}