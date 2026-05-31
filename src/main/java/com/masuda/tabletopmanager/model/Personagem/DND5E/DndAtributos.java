package com.masuda.tabletopmanager.model.Personagem.DND5E;

import java.util.Map;


public record DndAtributos(int forca, int destreza, int constituicao, int inteligencia, int sabedoria, int carisma) {
    public int getModificador(int atributo) {
        return (atributo - 10) / 2;
    }

    public static DndAtributos converterRegistros(Map<String, Object> registros) {
    return new DndAtributos(
        (int) registros.get("forca"),
        (int) registros.get("destreza"),
        (int) registros.get("constituicao"),
        (int) registros.get("inteligencia"),
        (int) registros.get("sabedoria"),
        (int) registros.get("carisma")
    );
}
}
