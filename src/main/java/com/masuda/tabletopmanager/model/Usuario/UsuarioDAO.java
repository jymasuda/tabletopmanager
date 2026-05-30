package com.masuda.tabletopmanager.model.Usuario;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import jakarta.annotation.PostConstruct;

@Repository
public class UsuarioDAO {
    @Autowired
    DataSource dataSource;

    JdbcTemplate jdbc;

    @PostConstruct
    private void initialize() {
        jdbc = new JdbcTemplate(dataSource);
    }

    public void inserirUsuario(Usuario usuario) {
        String sql = "INSERT INTO usuario (username, email, senha) VALUES (?, ?, ?)";
        Object[] obj = new Object[3];
        obj[0] = (String) usuario.getNome().nomeUsuario();
        obj[1] = (String) usuario.getEmail().emailUsuario();
        obj[2] = (String) usuario.getSenha().senhaUsuario();
        
        jdbc.update(sql, obj);
    }

    public void atualizarUsuario(int id, Usuario novo) {
        String sql = "UPDATE usuario SET username = ?, email = ?, senha = ? WHERE id = ?";
        Object[] obj = new Object[4];
        obj[0] = (String) novo.getNome().nomeUsuario();
        obj[1] = (String) novo.getEmail().emailUsuario();
        obj[2] = (String) novo.getSenha().senhaUsuario();
        obj[3] = id;
        
        jdbc.update(sql, obj);
    }

    public Usuario obterUsuario(int id) {
        String sql = "SELECT * FROM usuario WHERE id = ?";

        return Usuario.converterRegistros(jdbc.queryForMap(sql, id));
    }

    public void deletarUsuario(int id) {
        String sql = "DELETE FROM usuario WHERE id = ?";
        jdbc.update(sql, id);
    }

    public Usuario autenticarUsuario(String email, String senha) {
        String sql = "SELECT * FROM usuario WHERE email = ? AND senha = ?";
        Object[] obj = new Object[2];
        obj[0] = email;
        obj[1] = senha;

        return Usuario.converterRegistros(jdbc.queryForMap(sql, obj));
    }
}
