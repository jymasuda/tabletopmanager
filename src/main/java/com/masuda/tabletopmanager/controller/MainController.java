package com.masuda.tabletopmanager.controller;


import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.masuda.tabletopmanager.model.Usuario.Usuario;
import com.masuda.tabletopmanager.model.Usuario.UsuarioEmail;
import com.masuda.tabletopmanager.model.Usuario.UsuarioNome;
import com.masuda.tabletopmanager.model.Usuario.UsuarioSenha;
import com.masuda.tabletopmanager.model.Usuario.UsuarioService;


@Controller
public class MainController {

    @Autowired
    ApplicationContext context;
    
    @GetMapping("/")
    public String index(){
        return "index";
    }

    @PostMapping("/login")
    @ResponseBody
    public ResponseEntity<Map<String, String>> login(@RequestParam String email, @RequestParam String senha) {
        UsuarioService us = context.getBean(UsuarioService.class);
        Usuario user = us.autenticarUsuario(email, senha);

        if (user != null) {
            return ResponseEntity.ok(Map.of("message", "Login realizado com sucesso."));
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Credenciais inválidas."));
        }
    }

    @GetMapping("/cadastro")
    public String cadastro(Model model){
        model.addAttribute("user", new Usuario());
        return "cadastro";
    }
    
    @PostMapping("/cadastro")
    @ResponseBody
    public ResponseEntity<Map<String, String>> cadastroPost(@RequestParam String username,@RequestParam String email,@RequestParam String senha) {  

        Usuario user = new Usuario();
        user.setNome(new UsuarioNome(username));
        user.setEmail(new UsuarioEmail(email));
        user.setSenha(new UsuarioSenha(senha));

        UsuarioService us = context.getBean(UsuarioService.class);
        us.inserirUsuario(user);

        return ResponseEntity.ok(Map.of("message", "Cadastro realizado com sucesso."));
    }

    @GetMapping("/dashboard")
    public String dashboard(){
        return "dashboard";
    }
}
