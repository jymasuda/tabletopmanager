package com.masuda.tabletopmanager.model.Personagem.DND5E;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class Dnd5eSheetService {

    @Autowired
    Dnd5eSheetDAO dDAO;

    public Dnd5eSheet obterFichaDnd5e(int idPersonagem) {
        return dDAO.obterFichaDnd5e(idPersonagem);
    }

    public Integer inserirFichaDnd5e(int idUsuario, String nome) {
        return dDAO.inserirFichaDnd5e(idUsuario, nome);
    }

    public void atualizarIdentidade(int idPersonagem, String raca, String antecedente, int experiencia) {
        dDAO.atualizarIdentidade(idPersonagem, raca, antecedente, experiencia);
    }

    public void atualizarAuxilio(int idPersonagem, String sentidos, String resistencias,
                                String imunidades, String armaduras, String armas, String idiomas) {
        dDAO.atualizarAuxilio(idPersonagem, sentidos, resistencias, imunidades, armaduras, armas, idiomas);
    }
    
    public void atualizarVida(int idPersonagem, DndVida novoHP) {
        dDAO.atualizarVida(idPersonagem, novoHP);
    }
    
    public void atualizarAtributos(int idPersonagem, DndAtributos novosAtributos) {
        dDAO.atualizarAtributos(idPersonagem, novosAtributos);
    }

    public void atualizarSaves(int idPersonagem, DndSaves novosSaves) {
        dDAO.atualizarSaves(idPersonagem, novosSaves);
    }

    public void atualizarCombate(int idPersonagem, DndCombate combate){
        dDAO.atualizarCombate(idPersonagem, combate);
    }

    public void deletarFichaDnd5e(int idPersonagem) {
        dDAO.deletarFichaDnd5e(idPersonagem);
    }
}
