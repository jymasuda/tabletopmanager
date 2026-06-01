package com.masuda.tabletopmanager.model.Personagem.DND5E.Classe;

import java.util.Map;

public class Dnd5eClasse {
    private Dnd5eClasseId id;
    private Dnd5eClasseNome classe;
    private Dnd5eClasseLevel level;
    private Boolean primaria;

    public Dnd5eClasse() {
    }

    public Dnd5eClasse(Dnd5eClasseNome classe, Dnd5eClasseId id, Dnd5eClasseLevel level, Boolean primaria) {
        this.classe = classe;
        this.id = id;
        this.level = level;
        this.primaria = primaria;
    }

    public Dnd5eClasseId getId() {
        return id;
    }

    public void setId(Dnd5eClasseId id) {
        this.id = id;
    }

    public Dnd5eClasseNome getClasse() {
        return classe;
    }

    public void setClasse(Dnd5eClasseNome classe) {
        this.classe = classe;
    }

    public Dnd5eClasseLevel getLevel() {
        return level;
    }

    public void setLevel(Dnd5eClasseLevel level) {
        this.level = level;
    }

    public Boolean isPrimaria() {
        return primaria;
    }

    public void setPrimaria(Boolean primaria) {
        this.primaria = primaria;
    }

    public static Dnd5eClasse converterRegistros(Map<String, Object> registros){
        Dnd5eClasseId id = new Dnd5eClasseId((Integer) registros.get("id"));
        Dnd5eClasseNome classe = Dnd5eClasseNome.valueOf((String) registros.get("classe"));
        Dnd5eClasseLevel level = new Dnd5eClasseLevel((Integer) registros.get("level"));
        Boolean primaria = (Boolean) registros.get("primaria");
        return new Dnd5eClasse(classe, id, level, primaria);    
    }
}
