package com.masuda.tabletopmanager.model.Personagem.TFT;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TftSheetService {

    @Autowired
    TftSheetDAO tDAO;

    public Integer inserirFichaTft(int idUsuario, String nome) {
        return tDAO.inserirFichaTft(idUsuario, nome);
    }

    public TftSheet obterFichaTft(int idPersonagem) {
        return tDAO.obterFichaTft(idPersonagem);
    }

    public List<Map<String, Object>> obterSkills(int idPersonagem) {
        return tDAO.obterSkills(idPersonagem);
    }

    public List<Map<String, Object>> obterFeatures(int idPersonagem) {
        return tDAO.obterFeatures(idPersonagem);
    }

    public List<Map<String, Object>> obterAtaques(int idPersonagem) {
        return tDAO.obterAtaques(idPersonagem);
    }

    public void atualizarIdentidade(int idPersonagem, String nome, String sin) {
        tDAO.atualizarIdentidade(idPersonagem, nome, sin);
    }

    public void atualizarRecursos(int idPersonagem,
            int hpAtual, int hpMax, int hpPale,
            int spAtual, int spMax, int spPale,
            int sinPoints) {
        tDAO.atualizarRecursos(idPersonagem,
                hpAtual, hpMax, hpPale,
                spAtual, spMax, spPale,
                sinPoints);
    }

    public void atualizarAtributos(int idPersonagem, TftAttributes attrs) {
        tDAO.atualizarAtributos(idPersonagem, attrs);
    }

    public void atualizarSkills(int idPersonagem, List<Map<String, Object>> skills) {
        tDAO.atualizarSkills(idPersonagem, skills);
    }

    public void atualizarResistencias(int idPersonagem, TftCombat combat) {
        tDAO.atualizarResistencias(idPersonagem, combat);
    }

    public void atualizarFeatures(int idPersonagem, List<Map<String, Object>> features) {
        tDAO.atualizarFeatures(idPersonagem, features);
    }

    public Integer inserirFeature(int idPersonagem, String source, String nome, String descricao) {
        return tDAO.inserirFeature(idPersonagem, source, nome, descricao);
    }

    public void deletarFeature(int id, int idPersonagem) {
        tDAO.deletarFeature(id, idPersonagem);
    }

    public Integer inserirAtaque(int idPersonagem, Map<String, Object> body) {
        return tDAO.inserirAtaque(idPersonagem, body);
    }

    public void deletarAtaque(int id, int idPersonagem) {
        tDAO.deletarAtaque(id, idPersonagem);
    }

    public void deletarFichaTft(int idPersonagem) {
        tDAO.deletarFichaTft(idPersonagem);
    }
}
