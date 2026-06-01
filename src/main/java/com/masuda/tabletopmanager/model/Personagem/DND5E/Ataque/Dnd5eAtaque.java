package com.masuda.tabletopmanager.model.Personagem.DND5E.Ataque;

import java.util.Map;


public class Dnd5eAtaque {
    private Dnd5eAtaqueId id;
    private Dnd5eAtaqueNome nome;
    private Dnd5eAtaqueBonus bonus;
    private Dnd5eAtaqueDano danoDado;
    private Dnd5eAtaqueDanoTipo danoTipo;    

    public Dnd5eAtaque() {
    }

    public Dnd5eAtaque(Dnd5eAtaqueBonus bonus, Dnd5eAtaqueDano danoDado, Dnd5eAtaqueDanoTipo danoTipo, Dnd5eAtaqueId id, Dnd5eAtaqueNome nome) {
        this.bonus = bonus;
        this.danoDado = danoDado;
        this.danoTipo = danoTipo;
        this.id = id;
        this.nome = nome;
    }

    public Dnd5eAtaque(Dnd5eAtaqueBonus bonus, Dnd5eAtaqueDano danoDado, Dnd5eAtaqueDanoTipo danoTipo, Dnd5eAtaqueNome nome) {
        this.bonus = bonus;
        this.danoDado = danoDado;
        this.danoTipo = danoTipo;
        this.nome = nome;
    }

    public Dnd5eAtaqueId getId() {
        return id;
    }

    public void setId(Dnd5eAtaqueId id) {
        this.id = id;
    }

    public Dnd5eAtaqueNome getNome() {
        return nome;
    }

    public void setNome(Dnd5eAtaqueNome nome) {
        this.nome = nome;
    }

    public Dnd5eAtaqueBonus getBonus() {
        return bonus;
    }

    public void setBonus(Dnd5eAtaqueBonus bonus) {
        this.bonus = bonus;
    }

    public Dnd5eAtaqueDano getDanoDado() {
        return danoDado;
    }

    public void setDanoDado(Dnd5eAtaqueDano danoDado) {
        this.danoDado = danoDado;
    }

    public Dnd5eAtaqueDanoTipo getDanoTipo() {
        return danoTipo;
    }

    public void setDanoTipo(Dnd5eAtaqueDanoTipo danoTipo) {
        this.danoTipo = danoTipo;
    }

    public static Dnd5eAtaque converterRegistros(Map<String, Object> registros) {
        Dnd5eAtaqueId id = new Dnd5eAtaqueId((int) registros.get("id"));
        Dnd5eAtaqueNome nome = new Dnd5eAtaqueNome((String) registros.get("nome"));
        Dnd5eAtaqueBonus bonus = new Dnd5eAtaqueBonus((int) registros.get("bonus"));
        Dnd5eAtaqueDano danoDado = Dnd5eAtaqueDano.valueOf((String) registros.get("danoDado"));
        Dnd5eAtaqueDanoTipo danoTipo = Dnd5eAtaqueDanoTipo.valueOf((String) registros.get("danoTipo"));
        return new Dnd5eAtaque(bonus, danoDado, danoTipo, id, nome);
    }
}
