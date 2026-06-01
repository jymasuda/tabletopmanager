package com.masuda.tabletopmanager.model.Personagem.DND5E.Feitico;

import java.util.Map;


public class Dnd5eFeitico {
    private Dnd5eFeiticoId id;
    private Dnd5eFeiticoNome nome;
    private Dnd5eFeiticoLevel level;
    private Dnd5eFeiticoEscola escola;
    private Boolean preparado;
    private Dnd5eFeiticoDescricao descricao;

    public Dnd5eFeitico() {
    }

    public Dnd5eFeitico(Dnd5eFeiticoDescricao descricao, Dnd5eFeiticoEscola escola, Dnd5eFeiticoId id, Dnd5eFeiticoLevel level, Dnd5eFeiticoNome nome, Boolean preparado) {
        this.descricao = descricao;
        this.escola = escola;
        this.id = id;
        this.level = level;
        this.nome = nome;
        this.preparado = preparado;
    }

    public Dnd5eFeitico(Dnd5eFeiticoDescricao descricao, Dnd5eFeiticoEscola escola, Dnd5eFeiticoLevel level, Dnd5eFeiticoNome nome, Boolean preparado) {
        this.descricao = descricao;
        this.escola = escola;
        this.level = level;
        this.nome = nome;
        this.preparado = preparado;
    }

    public Dnd5eFeiticoId getId() {
        return id;
    }

    public void setId(Dnd5eFeiticoId id) {
        this.id = id;
    }

    public Dnd5eFeiticoNome getNome() {
        return nome;
    }

    public void setNome(Dnd5eFeiticoNome nome) {
        this.nome = nome;
    }

    public Dnd5eFeiticoLevel getLevel() {
        return level;
    }

    public void setLevel(Dnd5eFeiticoLevel level) {
        this.level = level;
    }

    public Dnd5eFeiticoEscola getEscola() {
        return escola;
    }

    public void setEscola(Dnd5eFeiticoEscola escola) {
        this.escola = escola;
    }

    public Boolean isPreparado() {
        return preparado;
    }

    public void setPreparado(Boolean preparado) {
        this.preparado = preparado;
    }

    public Dnd5eFeiticoDescricao getDescricao() {
        return descricao;
    }

    public void setDescricao(Dnd5eFeiticoDescricao descricao) {
        this.descricao = descricao;
    }

    public boolean isCantrip() { return level.levelFeitico() == 0; }

    public static Dnd5eFeitico converterRegistros(Map<String, Object> registros){
        Dnd5eFeiticoId id = new Dnd5eFeiticoId((Integer) registros.get("id"));
        Dnd5eFeiticoNome nome = new Dnd5eFeiticoNome((String) registros.get("nome"));
        Dnd5eFeiticoLevel level = new Dnd5eFeiticoLevel((Integer) registros.get("level"));
        Dnd5eFeiticoEscola escola = Dnd5eFeiticoEscola.valueOf((String) registros.get("escola"));
        Boolean preparado = (Boolean) registros.get("preparado");
        Dnd5eFeiticoDescricao descricao = new Dnd5eFeiticoDescricao((String) registros.get("descricao"));
        return new Dnd5eFeitico(descricao, escola, id, level, nome, preparado);    
    }
}
