package com.masuda.tabletopmanager.model.Personagem.DND5E;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import jakarta.annotation.PostConstruct;

@Repository
public class Dnd5eSheetDAO {
    @Autowired
        DataSource dataSource;

        JdbcTemplate jdbc;

        @PostConstruct
        private void initialize() {
            jdbc = new JdbcTemplate(dataSource);
        }

        public Dnd5eSheet obterFichaDnd5e(int idPersonagem) {
            String sql = """
            SELECT p.id, p.id_usuario, p.nome, p.sistema, p.avatar_url, p.data_criacao,
                   d.raca, d.antecedente,
                   d.forca, d.destreza, d.constituicao, d.inteligencia, d.sabedoria, d.carisma,
                   d.hp_max, d.hp_atual, d.hp_temp,
                   d.classe_armadura, d.bonus_proficiencia
            FROM personagem p
            JOIN dnd5e_sheets d ON d.id_personagem = p.id
            WHERE p.id = ?
        """;
            
            return Dnd5eSheet.converterRegistros(jdbc.queryForMap(sql, idPersonagem));
        }

        public Integer inserirFichaDnd5e(int idUsuario, String nome) {
            String sql = """
            INSERT INTO personagem (id_usuario, nome, sistema, avatar_url)
            VALUES (?, ?, 'DND5E', ?)
            RETURNING id
            """;

            Object[] objPersonagem = new Object[3];
            objPersonagem[0] = idUsuario;
            objPersonagem[1] = nome;
            objPersonagem[2] = null;

            int id = jdbc.queryForObject(sql, Integer.class, objPersonagem);

            sql = """
                INSERT INTO dnd5e_sheets (id_personagem)
                VALUES (?)
            """;
            jdbc.update(sql, id);

            return id;
        }

        public void atualizarHP(int idPersonagem, int novoHP, int novoTempHP) {
        String sql = """
            UPDATE dnd5e_sheets SET current_hp = ?, temp_hp = ? WHERE id_personagem = ?
        """;
        jdbc.update(sql, novoHP, novoTempHP, idPersonagem);
    }
    
    public void atualizarAtributos(int idPersonagem, DndAtributos atributos) {
        String sql = """
            UPDATE dnd5e_sheets SET
                str = ?, dex = ?, con = ?, int_ = ?, wis = ?, cha = ?
            WHERE id_personagem = ?
        """;
        jdbc.update(sql,
            atributos.forca(), atributos.destreza(), atributos.constituicao(),
            atributos.inteligencia(), atributos.sabedoria(), atributos.carisma(),
            idPersonagem
        );
    }

    public void deletarFichaDnd5e(int idPersonagem) {
        jdbc.update("DELETE FROM personagem WHERE id = ?", idPersonagem);
    }

}
