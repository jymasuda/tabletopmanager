package com.masuda.tabletopmanager.model.Personagem.DND5E;

public record DndCombate(int classeArmadura, int iniciativa, int velocidade, int bonusProficiencia) {
    public int bonusAtaque(int modificadorAtributo) {
        return modificadorAtributo + bonusProficiencia;
    }
}
