package com.masuda.tabletopmanager.model.Personagem;

import java.time.LocalDateTime;
import java.util.Map;

public class Personagem {
    private PersonagemID id;
    private PersonagemUID uId;
    private PersonagemNome nome;
    private Sistema sistema;
    private String avatarURL;
    private PersonagemDataCriacao dataCriacao;

    public Personagem() {
    }

    public Personagem(String avatarURL, PersonagemDataCriacao dataCriacao, PersonagemUID uId, PersonagemNome nome, Sistema sistema) {
        this.avatarURL = avatarURL;
        this.dataCriacao = dataCriacao;
        this.uId = uId;
        this.nome = nome;
        this.sistema = sistema;
    }

    public Personagem(String avatarURL, PersonagemDataCriacao dataCriacao, PersonagemID id, PersonagemUID uId, PersonagemNome nome, Sistema sistema) {
        this.avatarURL = avatarURL;
        this.dataCriacao = dataCriacao;
        this.id = id;
        this.uId = uId;
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

    public PersonagemUID getuId() {
        return uId;
    }

    public void setuId(PersonagemUID uId) {
        this.uId = uId;
    }
    
     public static Personagem converterRegistros(Map<String,Object> registros) {
        int id = (int) registros.get("id");
        int uId = (int) registros.get("id_usuario");
        String nome = (String) registros.get("nome");
        String sistemaStr = (String) registros.get("sistema");
        String avatarURL = (String) registros.get("avatarURL");
        LocalDateTime dataCriacaoStr = (LocalDateTime) registros.get("dataCriacao");
        return new Personagem(avatarURL, new PersonagemDataCriacao(dataCriacaoStr), new PersonagemID(id), new PersonagemUID(uId), new PersonagemNome(nome), Sistema.valueOf(sistemaStr));
    }

}
