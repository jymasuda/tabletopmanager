package com.masuda.tabletopmanager.model.Personagem.DND5E.Feitico;

import java.util.Map;

public record Dnd5eFeiticoSlot(int slotLevel, int total, int usado) {
    public int disponiveis() {
        return total - usado;
    }

    public boolean esgotado() {
        return usado >= total;
    }

    public static Dnd5eFeiticoSlot converterRegistros(Map<String, Object> registros) {
        return new Dnd5eFeiticoSlot(
            (int) registros.get("slot_level"),
            (int) registros.get("total"),
            (int) registros.get("usado")
        );
    }
}
