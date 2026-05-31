package com.masuda.tabletopmanager.model.Personagem;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.masuda.tabletopmanager.model.Personagem.Resumo.DndPersonagemResumo;
import com.masuda.tabletopmanager.model.Personagem.Resumo.PersonagemResumo;
import com.masuda.tabletopmanager.model.Personagem.Resumo.TftPersonagemResumo;

import jakarta.annotation.PostConstruct;

@Repository
public class PersonagemDAO {
    @Autowired
    DataSource dataSource;

    JdbcTemplate jdbc;

    @PostConstruct
    private void initialize() {
        jdbc = new JdbcTemplate(dataSource);
    }

    public List<PersonagemResumo> obterResumosPersonagemUsuario(int idUsuario) {
        List<PersonagemResumo> resumos = new ArrayList<>();
        resumos.addAll(obterResumosDnd(idUsuario));
        resumos.addAll(obterResumosTft(idUsuario));
        return resumos;
}
// + longo do q tft por causa do multiclassing
// query do bd retorna 1+ linhas por personagem pra resumo
    private List<DndPersonagemResumo> obterResumosDnd(int idUsuario) {
        String sql = """
            SELECT p.id, p.nome, p.sistema, p.avatar_url,
                c.classe, SUM(c.level) as level
            FROM personagem p
            JOIN dnd5e_sheets d ON d.id_personagem = p.id
            JOIN dnd5e_classe c ON c.id_personagem = p.id
            WHERE p.id_usuario = ? AND p.sistema = 'DND5E'
            GROUP BY p.id, p.nome, p.sistema, p.avatar_url, c.classe
        """;

        List<Map<String, Object>> listaRegistros = jdbc.queryForList(sql, idUsuario);
        Map<Long, DndPersonagemResumo> personagens = new LinkedHashMap<>();
        for (Map<String, Object> registro : listaRegistros) {
        Long id = (Long) registro.get("id");

        if (personagens.containsKey(id)) {
            personagens.get(id).adicionarClasse(
                registro.get("classe") + " " + registro.get("level")
            );
        } else {
            personagens.put(id, DndPersonagemResumo.converterRegistros(registro));
            }
        }

        return new ArrayList<>(personagens.values());
    }

// Esse é normar.
    private List<TftPersonagemResumo> obterResumosTft(int idUsuario) {
        String sql = """
            SELECT p.id, p.nome, p.sistema, p.avatar_url,
                t.sin
            FROM personagem p
            JOIN tft_sheets t ON t.id_personagem = p.id
            WHERE p.id_usuario = ? AND p.sistema = 'TFT'
        """;

        List<Map<String, Object>> listaRegistros = jdbc.queryForList(sql, idUsuario);
        ArrayList<TftPersonagemResumo> personagens = new ArrayList<>();

        for (Map<String, Object> registro : listaRegistros) {
            personagens.add(TftPersonagemResumo.converterRegistros(registro));
        }
        return personagens;
    }
}
