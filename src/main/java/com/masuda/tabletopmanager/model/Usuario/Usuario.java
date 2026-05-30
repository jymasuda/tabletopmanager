package com.masuda.tabletopmanager.model.Usuario;

import java.util.Map;

public class Usuario {
    private UsuarioID id;
    private UsuarioNome nome;
    private UsuarioEmail email;
    private UsuarioSenha senha;

    public Usuario() {
    }

    public Usuario(UsuarioNome nome, UsuarioEmail email, UsuarioSenha senha) {
        this.nome = nome;
        this.email = email;
        this.senha = senha;
    }

    public Usuario(UsuarioID id, UsuarioNome nome, UsuarioEmail email, UsuarioSenha senha) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
    }

    public UsuarioID getId() {
        return id;
    }

    public void setId(UsuarioID id) {
        this.id = id;
    }

    public UsuarioNome getNome() {
        return nome;
    }

    public void setNome(UsuarioNome nome) {
        this.nome = nome;
    }

    public UsuarioEmail getEmail() {
        return email;
    }

    public void setEmail(UsuarioEmail email) {
        this.email = email;
    }

    public UsuarioSenha getSenha() {
        return senha;
    }

    public void setSenha(UsuarioSenha senha) {
        this.senha = senha;
    }

    public static Usuario converterRegistros(Map<String,Object> registros) {
        int id = (int) registros.get("id");
        String nome = (String) registros.get("nome");
        String email = (String) registros.get("email");
        String senha = (String) registros.get("senha");
        return new Usuario(new UsuarioID(id), new UsuarioNome(nome), new UsuarioEmail(email), new UsuarioSenha(senha));
    }
}
