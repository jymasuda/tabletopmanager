package com.masuda.tabletopmanager.model.Personagem.DND5E;

import java.util.Map;

public record DndCombate(int classeArmadura, int iniciativa, int velocidade) {
    

    public static DndCombate converterRegistros(Map<String, Object> registros) {
    if (registros == null) return null;

    Integer classeArmadura = registros.get("classe_armadura") != null ? (int) registros.get("classe_armadura") : null;
    Integer iniciativa = registros.get("iniciativa") != null ? (int) registros.get("iniciativa") : null;
    Integer velocidade = registros.get("velocidade") != null ? (int) registros.get("velocidade") : null;

    return new DndCombate(classeArmadura, iniciativa, velocidade);
    }
}
