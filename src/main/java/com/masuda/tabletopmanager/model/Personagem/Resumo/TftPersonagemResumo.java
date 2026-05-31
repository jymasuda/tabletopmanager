package com.masuda.tabletopmanager.model.Personagem.Resumo;

import java.util.Map;

public record TftPersonagemResumo(
    long id,
    String nome,
    String sistema,
    String avatarUrl,
    String sin
) implements PersonagemResumo {
    public static TftPersonagemResumo converterRegistros(Map<String, Object> registros) {
    long id = (Long) registros.get("id");
    String nome = (String) registros.get("nome");
    String sistema = (String) registros.get("sistema");
    String avatarUrl = (String) registros.get("avatar_url");
    String sin = (String) registros.get("sin");

    return new TftPersonagemResumo(id, nome, sistema, avatarUrl, sin);
}
}
