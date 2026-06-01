package com.masuda.tabletopmanager.model.Personagem.DND5E;

import java.util.Map;

public record Dnd5eAuxilio(    String backstory, String personalidade,
                         String ideais, String lacos, String falhas,
                         String aparencia, String aliados, String anotacoes) {
    public static Dnd5eAuxilio converterRegistros(Map<String, Object> registros) {
        return new Dnd5eAuxilio(
            (String) registros.get("backstory"),
            (String) registros.get("personalidade"),
            (String) registros.get("ideais"),
            (String) registros.get("lacos"),
            (String) registros.get("falhas"),
            (String) registros.get("aparencia"),
            (String) registros.get("aliados"),
            (String) registros.get("anotacoes")
        );
    }
}
