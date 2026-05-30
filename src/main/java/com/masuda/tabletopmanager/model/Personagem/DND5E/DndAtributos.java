package com.masuda.tabletopmanager.model.Personagem.DND5E;


public record DndAtributos(int forca, int destreza, int constituicao, int inteligencia, int sabedoria, int carisma) {
    public int getModificador(int atributo) {
        return (atributo - 10) / 2;
    }
}
