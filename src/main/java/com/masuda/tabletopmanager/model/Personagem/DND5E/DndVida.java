package com.masuda.tabletopmanager.model.Personagem.DND5E;

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
}
