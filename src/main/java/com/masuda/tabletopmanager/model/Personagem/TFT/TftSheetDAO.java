package com.masuda.tabletopmanager.model.Personagem.TFT;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import jakarta.annotation.PostConstruct;

@Repository
public class TftSheetDAO {

    @Autowired
    DataSource dataSource;

    JdbcTemplate jdbc;

    @PostConstruct
    private void initialize() {
        jdbc = new JdbcTemplate(dataSource);
    }

    public Integer inserirFichaTft(int idUsuario, String nome) {
        String sql = """
            INSERT INTO personagem (id_usuario, nome, sistema, avatar_url)
            VALUES (?, ?, 'TFT', ?)
            RETURNING id
            """;

        Object[] objPersonagem = new Object[3];
        objPersonagem[0] = idUsuario;
        objPersonagem[1] = nome;
        objPersonagem[2] = null;

        int id = jdbc.queryForObject(sql, Integer.class, objPersonagem);

        sql = """
                INSERT INTO tft_sheets (id_personagem)
                VALUES (?)
            """;
        jdbc.update(sql, id);

        return id;
    }

}
