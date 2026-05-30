package com.masuda.tabletopmanager.model.Personagem;

public class Personagem {
    private PersonagemID id;
    private PersonagemNome nome;
    private Sistema sistema;
    private String avatarURL;
    private PersonagemDataCriacao dataCriacao;

    public Personagem() {
    }

    public Personagem(String avatarURL, PersonagemDataCriacao dataCriacao, PersonagemNome nome, Sistema sistema) {
        this.avatarURL = avatarURL;
        this.dataCriacao = dataCriacao;
        this.nome = nome;
        this.sistema = sistema;
    }

    public Personagem(String avatarURL, PersonagemDataCriacao dataCriacao, PersonagemID id, PersonagemNome nome, Sistema sistema) {
        this.avatarURL = avatarURL;
        this.dataCriacao = dataCriacao;
        this.id = id;
        this.nome = nome;
        this.sistema = sistema;
    }

    public PersonagemID getId() {
        return id;
    }

    public void setId(PersonagemID id) {
        this.id = id;
    }

    public PersonagemNome getNome() {
        return nome;
    }

    public void setNome(PersonagemNome nome) {
        this.nome = nome;
    }

    public Sistema getSistema() {
        return sistema;
    }

    public void setSistema(Sistema sistema) {
        this.sistema = sistema;
    }

    public String getAvatarURL() {
        return avatarURL;
    }

    public void setAvatarURL(String avatarURL) {
        this.avatarURL = avatarURL;
    }

    public PersonagemDataCriacao getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(PersonagemDataCriacao dataCriacao) {
        this.dataCriacao = dataCriacao;
    }


}
