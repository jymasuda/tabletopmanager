package com.masuda.tabletopmanager.model.Personagem.Resumo;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class DndPersonagemResumo implements PersonagemResumo {
    private final long id;
    private final String nome;
    private final String sistema;
    private final String avatarUrl;
    private final List<String> classes;

    public DndPersonagemResumo(long id, String nome, String sistema, String avatarUrl) {
        this.id = id;
        this.nome = nome;
        this.sistema = sistema;
        this.avatarUrl = avatarUrl;
        this.classes = new ArrayList<>();
    }

    @Override
    public long id() {
        return id;
    }

    @Override
    public String nome() {
        return nome;
    }

    @Override
    public String sistema() {
        return sistema;
    }

    @Override
    public String avatarUrl() {
        return avatarUrl;
    }

    public List<String> classes() {
        return classes;
    }

    public void adicionarClasse(String classe) {
        classes.add(classe);
    }
    
    public static DndPersonagemResumo converterRegistros(Map<String, Object> registros) {
    long id = (Long) registros.get("id");
    String nome = (String) registros.get("nome");
    String sistema = (String) registros.get("sistema");
    String avatarUrl = (String) registros.get("avatar_url");
    String classe = registros.get("class") + " " + registros.get("level");

    DndPersonagemResumo resumo = new DndPersonagemResumo(id, nome, sistema, avatarUrl);
    resumo.adicionarClasse(classe);
    return resumo;
}
}