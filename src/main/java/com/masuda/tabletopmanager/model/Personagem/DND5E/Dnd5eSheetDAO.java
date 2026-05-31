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

        public void inserirFichaDnd5e(Dnd5eSheet ficha) {
            String sql = """
            INSERT INTO personagem (id_usuario, nome, sistema, avatar_url)
            VALUES (?, ?, 'DND5E', ?)
            RETURNING id
            """;

            Object[] objPersonagem = new Object[3];
            objPersonagem[0] = ficha.getId().idPersonagem();
            objPersonagem[1] = ficha.getNome().nomePersonagem();
            objPersonagem[2] = ficha.getAvatarURL();

            int id = jdbc.queryForObject(sql, Integer.class, objPersonagem);

            sql = """
            INSERT INTO dnd5e_sheets
                (id_personagem, id_raca, antecedente,
                 forca, destreza, constituicao, inteligencia, sabedoria, carisma,
                 hp_max, hp_atual, hp_temp,
                 classe_armadura, bonus_proficiencia)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;

            Object[] objSheet = new Object[14];
            objSheet[0] = id;
            objSheet[1] = ficha.getRaca().name();
            objSheet[2] = ficha.getAntecedente().name();
            objSheet[3] = ficha.getAtributos().forca();
            objSheet[4] = ficha.getAtributos().destreza();
            objSheet[5] = ficha.getAtributos().constituicao();
            objSheet[6] = ficha.getAtributos().inteligencia();
            objSheet[7] = ficha.getAtributos().sabedoria();
            objSheet[8] = ficha.getAtributos().carisma();
            objSheet[9] = ficha.getVida().vidaMax();
            objSheet[10] = ficha.getVida().vidaAtual();
            objSheet[11] = ficha.getVida().vidaTemporaria();
            objSheet[12] = ficha.getCombate().classeArmadura();
            objSheet[13] = ficha.getCombate().bonusProficiencia();

            jdbc.update(sql, objSheet);
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
