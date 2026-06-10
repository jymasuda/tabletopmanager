package com.masuda.tabletopmanager.model.Personagem.DND5E;

import java.util.Map;

public record DndSaves(boolean forca, boolean destreza, boolean constituicao, boolean inteligencia, boolean sabedoria, boolean carisma) {

    public Boolean isProficienteForca() {
        return forca;
    }

    public Boolean isProficienteDestreza() {
        return destreza;
    }

    public Boolean isProficienteConstituicao() {
        return constituicao;
    }

    public Boolean isProficienteInteligencia() {
        return inteligencia;
    }

    public Boolean isProficienteSabedoria() {
        return sabedoria;
    }

    public Boolean isProficienteCarisma() {
        return carisma;
    }

    public static DndSaves converterRegistros(Map<String, Object> registros) {
        if (registros == null) {
            return null;
        }

        boolean forca = registros.get("forcaSave") != null ? (boolean) registros.get("forcaSave") : false;
        boolean destreza = registros.get("destrezaSave") != null ? (boolean) registros.get("destrezaSave") : false;
        boolean constituicao = registros.get("constituicaoSave") != null ? (boolean) registros.get("constituicaoSave") : false;
        boolean inteligencia = registros.get("inteligenciaSave") != null ? (boolean) registros.get("inteligenciaSave") : false;
        boolean sabedoria = registros.get("sabedoriaSave") != null ? (boolean) registros.get("sabedoriaSave") : false;
        boolean carisma = registros.get("carismaSave") != null ? (boolean) registros.get("carismaSave") : false;

        return new DndSaves(forca, destreza, constituicao, inteligencia, sabedoria, carisma);
    }
}
