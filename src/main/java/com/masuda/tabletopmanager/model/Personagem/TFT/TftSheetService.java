package com.masuda.tabletopmanager.model.Personagem.TFT;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TftSheetService {
    @Autowired
    TftSheetDAO tDAO;

    public Integer inserirFichaTft(int idUsuario, String nome) {
        return tDAO.inserirFichaTft(idUsuario, nome);
    }
}
