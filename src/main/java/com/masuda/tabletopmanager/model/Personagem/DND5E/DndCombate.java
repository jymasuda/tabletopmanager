package com.masuda.tabletopmanager.model.Personagem.DND5E;

import java.util.Map;

public record DndCombate(int classeArmadura, int iniciativa, int velocidade, int bonusProficiencia) {
    public int bonusAtaque(int modificadorAtributo) {
        return modificadorAtributo + bonusProficiencia;
    }

    public static DndCombate converterRegistros(Map<String, Object> registros) {
    return new DndCombate(
        (int) registros.get("classe_armadura"),
        (int) registros.get("iniciativa"),
        (int) registros.get("velocidade"),
        (int) registros.get("bonus_proficiencia")
    );
}
}
