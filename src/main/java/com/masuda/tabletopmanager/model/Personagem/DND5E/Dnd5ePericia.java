package com.masuda.tabletopmanager.model.Personagem.DND5E;

import java.util.Map;

public record Dnd5ePericia(int id, String pericia, boolean proficiente, boolean expert) {
    public int calcularModificador(int modificadorAtributo, int bonusProficiencia) {
        if (expert) return modificadorAtributo + bonusProficiencia * 2;
        if (proficiente) return modificadorAtributo + bonusProficiencia;
        return modificadorAtributo;
}

    public static Dnd5ePericia converterRegistros(Map<String, Object> registros) {
        return new Dnd5ePericia(
            (int) registros.get("id"),
            (String) registros.get("pericia"),
            (boolean) registros.get("proficiente"),
            (boolean) registros.get("expert")
        );
    }
}
