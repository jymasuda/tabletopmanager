package com.masuda.tabletopmanager.model.Personagem.DND5E.Item;

import java.util.Map;

public class Dnd5eItem {
    private Dnd5eItemId id;
    private Dnd5eItemNome nome;
    private Dnd5eItemPeso peso;
    private Dnd5eItemQuantidade quantidade;
    private Dnd5eItemDescricao descricao;
    private Boolean equipado;

    public Dnd5eItem() {}

    public Dnd5eItem(Dnd5eItemDescricao descricao, Boolean equipado, Dnd5eItemId id, Dnd5eItemNome nome, Dnd5eItemPeso peso, Dnd5eItemQuantidade quantidade) {
        this.descricao = descricao;
        this.equipado = equipado;
        this.id = id;
        this.nome = nome;
        this.peso = peso;
        this.quantidade = quantidade;
    }

    public Dnd5eItem(Dnd5eItemDescricao descricao, Boolean equipado, Dnd5eItemNome nome, Dnd5eItemPeso peso, Dnd5eItemQuantidade quantidade) {
        this.descricao = descricao;
        this.equipado = equipado;
        this.nome = nome;
        this.peso = peso;
        this.quantidade = quantidade;
    }

    public Dnd5eItemId getId() {
        return id;
    }

    public void setId(Dnd5eItemId id) {
        this.id = id;
    }

    public Dnd5eItemNome getNome() {
        return nome;
    }

    public void setNome(Dnd5eItemNome nome) {
        this.nome = nome;
    }

    public Dnd5eItemPeso getPeso() {
        return peso;
    }

    public void setPeso(Dnd5eItemPeso peso) {
        this.peso = peso;
    }

    public Dnd5eItemQuantidade getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Dnd5eItemQuantidade quantidade) {
        this.quantidade = quantidade;
    }

    public Dnd5eItemDescricao getDescricao() {
        return descricao;
    }

    public void setDescricao(Dnd5eItemDescricao descricao) {
        this.descricao = descricao;
    }

    public Boolean isEquipado() {
        return equipado;
    }

    public void setEquipado(Boolean equipado) {
        this.equipado = equipado;
    }

    public static Dnd5eItem converterRegistros(Map<String, Object> registros){
        Dnd5eItemId id = new Dnd5eItemId((Integer) registros.get("id"));
        Dnd5eItemNome nome = new Dnd5eItemNome((String) registros.get("nome"));
        Dnd5eItemPeso peso = new Dnd5eItemPeso((Double) registros.get("peso"));
        Dnd5eItemQuantidade quantidade = new Dnd5eItemQuantidade((Integer) registros.get("quantidade"));
        Dnd5eItemDescricao descricao = new Dnd5eItemDescricao((String) registros.get("descricao"));
        Boolean equipado = (Boolean) registros.get("equipado");
        return new Dnd5eItem(descricao, equipado, id, nome, peso, quantidade);    
    }

}
