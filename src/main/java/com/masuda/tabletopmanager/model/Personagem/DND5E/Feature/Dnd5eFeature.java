package com.masuda.tabletopmanager.model.Personagem.DND5E.Feature;

import java.util.Map;

public class Dnd5eFeature {
    private Dnd5eFeatureId id;
    private Dnd5eFeatureFonte fonte;
    private Dnd5eFeatureNome nome;
    private Dnd5eFeatureDescricao descricao;

    public Dnd5eFeature() {
    }

    public Dnd5eFeature(Dnd5eFeatureDescricao descricao, Dnd5eFeatureFonte fonte, Dnd5eFeatureId id, Dnd5eFeatureNome nome) {
        this.descricao = descricao;
        this.fonte = fonte;
        this.id = id;
        this.nome = nome;
    }

    public Dnd5eFeature(Dnd5eFeatureDescricao descricao, Dnd5eFeatureFonte fonte, Dnd5eFeatureNome nome) {
        this.descricao = descricao;
        this.fonte = fonte;
        this.nome = nome;
    }

    public Dnd5eFeatureId getId() {
        return id;
    }

    public void setId(Dnd5eFeatureId id) {
        this.id = id;
    }

    public Dnd5eFeatureFonte getFonte() {
        return fonte;
    }

    public void setFonte(Dnd5eFeatureFonte fonte) {
        this.fonte = fonte;
    }

    public Dnd5eFeatureNome getNome() {
        return nome;
    }

    public void setNome(Dnd5eFeatureNome nome) {
        this.nome = nome;
    }

    public Dnd5eFeatureDescricao getDescricao() {
        return descricao;
    }

    public void setDescricao(Dnd5eFeatureDescricao descricao) {
        this.descricao = descricao;
    }

    public static Dnd5eFeature converterRegistros(Map<String, Object> registros) {
        Dnd5eFeatureId id = new Dnd5eFeatureId((int) registros.get("id"));
        Dnd5eFeatureFonte fonte = Dnd5eFeatureFonte.valueOf((String) registros.get("fonte"));
        Dnd5eFeatureNome nome = new Dnd5eFeatureNome((String) registros.get("nome"));
        Dnd5eFeatureDescricao descricao = new Dnd5eFeatureDescricao((String) registros.get("descricao"));

        return new Dnd5eFeature(descricao, fonte, id, nome);
    }
}
