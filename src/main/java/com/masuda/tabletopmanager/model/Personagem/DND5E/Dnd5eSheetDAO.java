package com.masuda.tabletopmanager.model.Personagem.DND5E;

import java.util.List;
import java.util.Map;

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
                    d.id_raca, d.antecedente,
                    d.forca, d.destreza, d.constituicao, d.inteligencia, d.sabedoria, d.carisma,
                    d.hp_max, d.hp_atual, d.hp_temp,
                    d.classe_armadura, d.iniciativa, d.velocidade
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

    public void atualizarIdentidade(int idPersonagem, String raca, String antecedente, int experiencia) {
        String sql = """
            UPDATE dnd5e_sheets
            SET id_raca = ?, antecedente = ?, experiencia = ?
            WHERE id_personagem = ?
        """;
        jdbc.update(sql, raca, antecedente, experiencia, idPersonagem);
    }

    public void atualizarAuxilio(int idPersonagem, String sentidos, String resistencias,
                                String imunidades, String armaduras, String armas, String idiomas) {
        String sql = """
            INSERT INTO dnd5e_auxilio (id_personagem, sentidos, resistencias, imunidades, armaduras, armas, idiomas)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """;
        jdbc.update(sql, idPersonagem, sentidos, resistencias, imunidades, armaduras, armas, idiomas);
    }
    public void atualizarAntecedente(int idPersonagem, String antecedente) {
        String sql = """
            UPDATE dnd5e_sheets SET antecedente = ? WHERE id_personagem = ?
        """;
        jdbc.update(sql, antecedente, idPersonagem);
    }

    public void atualizarInspiracao(int idPersonagem, boolean inspiracao) {
        String sql = """
            UPDATE dnd5e_sheets SET inspiracao = ? WHERE id_personagem = ?
        """;
        jdbc.update(sql, inspiracao, idPersonagem);
    }

    public void atualizarVida(int idPersonagem, DndVida vida) {
    String sql = """
        UPDATE dnd5e_sheets SET hp_atual = ?, hp_max = ?, hp_temp = ? WHERE id_personagem = ?
    """;
    jdbc.update(sql, vida.vidaAtual(), vida.vidaMax(), vida.vidaTemporaria(), idPersonagem);
    }
    
    public void atualizarAtributos(int idPersonagem, DndAtributos atributos) {
        String sql = """
            UPDATE dnd5e_sheets SET
                forca = ?, destreza = ?, constituicao = ?, inteligencia = ?, sabedoria = ?, carisma = ?
            WHERE id_personagem = ?
        """;
        jdbc.update(sql,
            atributos.forca(), atributos.destreza(), atributos.constituicao(),
            atributos.inteligencia(), atributos.sabedoria(), atributos.carisma(),
            idPersonagem
        );
    }

    public void atualizarPericias(int idPersonagem, List<Map<String, Object>> pericias) {
        jdbc.update("DELETE FROM dnd5e_pericia WHERE id_personagem = ?", idPersonagem);
 
        if (pericias == null || pericias.isEmpty()) return;
 
        String sql = """
            INSERT INTO dnd5e_pericia (id_personagem, pericia, proficiente, expert)
            VALUES (?, ?::dnd5e_nome_pericia, ?, ?)
        """;
 
        for (Map<String, Object> p : pericias) {
            String nome       = (String) p.get("nome");
            boolean proficiente = Boolean.TRUE.equals(p.get("proficiente"));
            boolean expert      = Boolean.TRUE.equals(p.get("expert"));
 
            if (!proficiente && !expert) continue;
 
            jdbc.update(sql, idPersonagem, nome, proficiente, expert);
        }
    }

    public void atualizarFerramentas(int idPersonagem, List<Map<String, Object>> ferramentas) {
        jdbc.update("DELETE FROM dnd5e_ferramenta WHERE id_personagem = ?", idPersonagem);
 
        if (ferramentas == null || ferramentas.isEmpty()) return;
 
        String sql = """
            INSERT INTO dnd5e_ferramenta (id_personagem, nome, proficiente, expert)
            VALUES (?, ?, ?, ?)
        """;
 
        for (Map<String, Object> f : ferramentas) {
            String nome         = (String) f.get("nome");
            boolean proficiente = Boolean.TRUE.equals(f.get("proficiente"));
            boolean expert      = Boolean.TRUE.equals(f.get("expert"));
 
            if (nome == null || nome.isBlank()) continue;
 
            jdbc.update(sql, idPersonagem, nome, proficiente, expert);
        }
    }

    public void atualizarSaves(int idPersonagem, DndSaves saves) {
        String sql = """
            UPDATE dnd5e_sheets SET
                forcaSave = ?, destrezaSave = ?, constituicaoSave = ?,
                inteligenciaSave = ?, sabedoriaSave = ?, carismaSave = ?
            WHERE id_personagem = ?
        """;
        jdbc.update(sql,
            saves.isProficienteForca(), saves.isProficienteDestreza(), saves.isProficienteConstituicao(),
            saves.isProficienteInteligencia(), saves.isProficienteSabedoria(), saves.isProficienteCarisma(),
            idPersonagem
        );
    }

    public void atualizarCombate(int idPersonagem, DndCombate combate) {
        String sql = """
            UPDATE dnd5e_sheets SET
                classe_armadura = ?, iniciativa = ?, velocidade = ?
            WHERE id_personagem = ?
        """;
        jdbc.update(sql, combate.classeArmadura(), combate.iniciativa(), combate.velocidade(), idPersonagem);
    }


    public void deletarFichaDnd5e(int idPersonagem) {
        jdbc.update("DELETE FROM personagem WHERE id = ?", idPersonagem);
    }

}
