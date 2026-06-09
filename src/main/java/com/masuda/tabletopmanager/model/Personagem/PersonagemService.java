package com.masuda.tabletopmanager.model.Personagem;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.masuda.tabletopmanager.model.Personagem.Resumo.PersonagemResumo;

@Service
public class PersonagemService {
    @Autowired
    PersonagemDAO pDAO;

    public List<PersonagemResumo> obterResumosPersonagemUsuario(int idUsuario) {
        return pDAO.obterResumosPersonagemUsuario(idUsuario);
    }

    public void atualizarIdentidade(int idPersonagem, String nome, String avatarUrl) {
    pDAO.atualizarIdentidade(idPersonagem, nome, avatarUrl);
    }
}
