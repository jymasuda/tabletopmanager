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

        boolean forca = Boolean.TRUE.equals(registros.get("forcasave"));
        boolean destreza = Boolean.TRUE.equals(registros.get("destrezasave"));
        boolean constituicao = Boolean.TRUE.equals(registros.get("constituicaosave"));
        boolean inteligencia = Boolean.TRUE.equals(registros.get("inteligenciasave"));
        boolean sabedoria = Boolean.TRUE.equals(registros.get("sabedoriasave"));
        boolean carisma = Boolean.TRUE.equals(registros.get("carismasave"));

        return new DndSaves(forca, destreza, constituicao, inteligencia, sabedoria, carisma);
    }
}
