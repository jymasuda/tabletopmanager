package com.masuda.tabletopmanager.model.Usuario;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    @Autowired
    UsuarioDAO uDAO;

    public void inserirUsuario(Usuario u) {
        uDAO.inserirUsuario(u);
    }

    public void atualizarUsuario(int id, Usuario novo) {
        uDAO.atualizarUsuario(id, novo);
    }

    public Usuario obterUsuario(int id) {
        return uDAO.obterUsuario(id);
    }

    public void deletarUsuario(int id) {
        uDAO.deletarUsuario(id);
    }

    public Usuario autenticarUsuario(String email, String senha) {
        return uDAO.autenticarUsuario(email, senha);
    }
}

