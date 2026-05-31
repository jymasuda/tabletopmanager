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

    public void inserirFichaDnd5e(Dnd5eSheet ficha) {
        dDAO.inserirFichaDnd5e(ficha);
    }

    public void atualizarHP(int idPersonagem, int novoHP, int novoTempHP) {
        dDAO.atualizarHP(idPersonagem, novoHP, novoTempHP);
    }
    
    public void atualizarAtributos(int idPersonagem, DndAtributos novosAtributos) {
        dDAO.atualizarAtributos(idPersonagem, novosAtributos);
    }

    public void deletarFichaDnd5e(int idPersonagem) {
        dDAO.deletarFichaDnd5e(idPersonagem);
    }
}
