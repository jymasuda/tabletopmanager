package com.masuda.tabletopmanager.model.Personagem.DND5E;

import java.util.Map;

public record DndVida(int vidaMax, int vidaAtual, int vidaTemporaria) {
    public boolean isInconsciente() {
        return vidaAtual <= 0;
    }
    public boolean isMorto() {
        return vidaAtual <= -vidaMax;
    }
    public int getVidaTotal() {
        return vidaAtual + vidaTemporaria;
    }

    public static DndVida converterRegistros(Map<String, Object> registros) {
    return new DndVida(
        (int) registros.get("hp_max"),
        (int) registros.get("hp_atual"),
        (int) registros.get("hp_temp")
    );
}
}
