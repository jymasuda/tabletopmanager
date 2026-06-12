package com.masuda.tabletopmanager.model.Personagem.TFT;

import java.util.List;
import java.util.Map;

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

    // ── Create ────────────────────────────────────────────

    public Integer inserirFichaTft(int idUsuario, String nome) {
        String sql = """
            INSERT INTO personagem (id_usuario, nome, sistema, avatar_url)
            VALUES (?, ?, 'TFT', ?)
            RETURNING id
            """;
        int id = jdbc.queryForObject(sql, Integer.class, idUsuario, nome, null);

        jdbc.update("""
            INSERT INTO tft_sheets (id_personagem,
                sin, sin_points,
                max_hp, current_hp, pale_hp,
                max_sp, current_sp, pale_sp,
                physique, endurance, understanding, calmness,
                intuition, presence, conviction, reflex, focus,
                blunt_resistance, piercing_resistance, slashing_resistance,
                red_resistance, white_resistance, black_resistance, pale_resistance)
            VALUES (?,
                'PRIDE', 0,
                10, 10, 0,
                10, 10, 0,
                1, 1, 1, 1,
                1, 1, 1, 1, 1,
                0, 0, 0,
                0, 0, 0, 0)
            """, id);

        for (TftSkillName skill : TftSkillName.values()) {
            jdbc.update("""
                INSERT INTO tft_skill (id_personagem, skill, points)
                VALUES (?, ?::tft_skill_name, 0)
                """, id, skill.name());
        }

        return id;
    }


    public TftSheet obterFichaTft(int idPersonagem) {
        String sql = """
            SELECT p.id, p.id_usuario, p.nome, p.sistema, p.avatar_url, p.data_criacao,
                   t.sin, t.sin_points,
                   t.max_hp, t.current_hp, t.pale_hp,
                   t.max_sp, t.current_sp, t.pale_sp,
                   t.physique, t.endurance, t.understanding, t.calmness,
                   t.intuition, t.presence, t.conviction, t.reflex, t.focus,
                   t.blunt_resistance, t.piercing_resistance, t.slashing_resistance,
                   t.red_resistance, t.white_resistance, t.black_resistance, t.pale_resistance
            FROM personagem p
            JOIN tft_sheets t ON t.id_personagem = p.id
            WHERE p.id = ?
            """;
        return TftSheet.converterRegistros(jdbc.queryForMap(sql, idPersonagem));
    }

    public List<Map<String, Object>> obterSkills(int idPersonagem) {
        String sql = """
            SELECT s.id, s.skill, s.points,
                   (SELECT string_agg(sp.nome, ', ')
                    FROM tft_skill_specialty sp
                    WHERE sp.id_skill = s.id) AS specialty
            FROM tft_skill s
            WHERE s.id_personagem = ?
            ORDER BY s.skill
            """;
        return jdbc.queryForList(sql, idPersonagem);
    }

    public List<Map<String, Object>> obterFeatures(int idPersonagem) {
        String sql = """
            SELECT id, source, nome, descricao
            FROM tft_feature
            WHERE id_personagem = ?
            ORDER BY source, nome
            """;
        return jdbc.queryForList(sql, idPersonagem);
    }

    public List<Map<String, Object>> obterAtaques(int idPersonagem) {
        String sql = """
            SELECT id, nome, damage_type, damage_form,
                   dicepool_mode, attribute, skill_primary, skill_secondary,
                   threat, attack_weight, attack_description
            FROM tft_attack
            WHERE id_personagem = ?
            ORDER BY id
            """;
        return jdbc.queryForList(sql, idPersonagem);
    }

    // ── Update: Identity ──────────────────────────────────

    public void atualizarIdentidade(int idPersonagem, String nome, String sin) {
        jdbc.update("""
            UPDATE personagem SET nome = ? WHERE id = ?
            """, nome, idPersonagem);

        if (sin != null && !sin.isBlank()) {
            jdbc.update("""
                UPDATE tft_sheets SET sin = ?::varchar WHERE id_personagem = ?
                """, sin, idPersonagem);
        }
    }


    public void atualizarRecursos(int idPersonagem,
                                  int hpAtual, int hpMax, int hpPale,
                                  int spAtual, int spMax, int spPale,
                                  int sinPoints) {
        jdbc.update("""
            UPDATE tft_sheets SET
                current_hp = ?, max_hp = ?, pale_hp = ?,
                current_sp = ?, max_sp = ?, pale_sp = ?,
                sin_points = ?
            WHERE id_personagem = ?
            """, hpAtual, hpMax, hpPale,
                 spAtual, spMax, spPale,
                 sinPoints, idPersonagem);
    }

    public void atualizarAtributos(int idPersonagem, TftAttributes attrs) {
        jdbc.update("""
            UPDATE tft_sheets SET
                physique = ?, endurance = ?,
                understanding = ?, calmness = ?,
                intuition = ?, presence = ?, conviction = ?,
                reflex = ?, focus = ?
            WHERE id_personagem = ?
            """,
            attrs.physique(), attrs.endurance(),
            attrs.understanding(), attrs.calmness(),
            attrs.intuition(), attrs.presence(), attrs.conviction(),
            attrs.reflex(), attrs.focus(),
            idPersonagem);
    }

    public void atualizarSkills(int idPersonagem, List<Map<String, Object>> skills) {
        for (Map<String, Object> sk : skills) {
            String skillName = (String) sk.get("skill");
            int points       = sk.get("points") != null ? ((Number) sk.get("points")).intValue() : 0;
            String specialty = (String) sk.get("specialty");

            jdbc.update("""
                INSERT INTO tft_skill (id_personagem, skill, points)
                VALUES (?, ?::tft_skill_name, ?)
                ON CONFLICT (id_personagem, skill)
                DO UPDATE SET points = EXCLUDED.points
                """, idPersonagem, skillName, points);

            Integer skillId = jdbc.queryForObject("""
                SELECT id FROM tft_skill WHERE id_personagem = ? AND skill = ?::tft_skill_name
                """, Integer.class, idPersonagem, skillName);

            jdbc.update("DELETE FROM tft_skill_specialty WHERE id_skill = ?", skillId);

            if (specialty != null) {
                for (String spec : specialty.split(",")) {
                    String trimmed = spec.trim();
                    if (!trimmed.isEmpty()) {
                        jdbc.update("""
                            INSERT INTO tft_skill_specialty (id_skill, nome) VALUES (?, ?)
                            """, skillId, trimmed);
                    }
                }
            }
        }
    }

    public void atualizarResistencias(int idPersonagem, TftCombat combat) {
        jdbc.update("""
            UPDATE tft_sheets SET
                blunt_resistance    = ?,
                piercing_resistance = ?,
                slashing_resistance = ?,
                red_resistance      = ?,
                white_resistance    = ?,
                black_resistance    = ?,
                pale_resistance     = ?
            WHERE id_personagem = ?
            """,
            combat.bluntResistance(), combat.piercingResistance(), combat.slashingResistance(),
            combat.redResistance(), combat.whiteResistance(), combat.blackResistance(),
            combat.paleResistance(),
            idPersonagem);
    }

    public void atualizarFeatures(int idPersonagem, List<Map<String, Object>> features) {
        for (Map<String, Object> feat : features) {
            int    id    = ((Number) feat.get("id")).intValue();
            String nome  = (String) feat.get("nome");
            String desc  = (String) feat.get("descricao");
            jdbc.update("""
                UPDATE tft_feature SET nome = ?, descricao = ?
                WHERE id = ? AND id_personagem = ?
                """, nome, desc, id, idPersonagem);
        }
    }

    public Integer inserirFeature(int idPersonagem, String source, String nome, String descricao) {
        return jdbc.queryForObject("""
            INSERT INTO tft_feature (id_personagem, source, nome, descricao)
            VALUES (?, ?::tft_feature_source, ?, ?)
            RETURNING id
            """, Integer.class, idPersonagem, source, nome, descricao);
    }

    public void deletarFeature(int id, int idPersonagem) {
        jdbc.update("DELETE FROM tft_feature WHERE id = ? AND id_personagem = ?", id, idPersonagem);
    }

    public Integer inserirAtaque(int idPersonagem, Map<String, Object> body) {
        return jdbc.queryForObject("""
            INSERT INTO tft_attack (
                id_personagem, nome,
                damage_type, damage_form,
                dicepool_mode, attribute, skill_primary, skill_secondary,
                threat, attack_weight, attack_description)
            VALUES (?, ?,
                ?::tft_dmg_type, ?::tft_dmg_form,
                ?::tft_dicepool_mode, ?::tft_attribute_name, ?::tft_skill_name, ?::tft_skill_name,
                ?, ?, ?)
            RETURNING id
            """, Integer.class,
            idPersonagem,
            body.get("nome"),
            body.get("damage_type"),
            body.get("damage_form"),
            body.get("dicepool_mode"),
            body.get("attribute"),
            body.get("skill_primary"),
            body.get("skill_secondary"),
            body.get("threat"),
            body.get("attack_weight"),
            body.get("attack_description"));
    }

    public void deletarAtaque(int id, int idPersonagem) {
        jdbc.update("DELETE FROM tft_attack WHERE id = ? AND id_personagem = ?", id, idPersonagem);
    }

    public void deletarFichaTft(int idPersonagem) {
        jdbc.update("DELETE FROM personagem WHERE id = ?", idPersonagem);
    }
}