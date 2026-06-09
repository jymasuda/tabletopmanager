package com.masuda.tabletopmanager.controller;


import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.masuda.tabletopmanager.model.Personagem.DND5E.Dnd5eSheetService;
import com.masuda.tabletopmanager.model.Personagem.DND5E.DndAtributos;
import com.masuda.tabletopmanager.model.Personagem.DND5E.DndCombate;
import com.masuda.tabletopmanager.model.Personagem.DND5E.DndSaves;
import com.masuda.tabletopmanager.model.Personagem.DND5E.DndVida;
import com.masuda.tabletopmanager.model.Personagem.PersonagemService;
import com.masuda.tabletopmanager.model.Personagem.Resumo.PersonagemResumo;
import com.masuda.tabletopmanager.model.Personagem.TFT.TftSheetService;
import com.masuda.tabletopmanager.model.Usuario.Usuario;
import com.masuda.tabletopmanager.model.Usuario.UsuarioEmail;
import com.masuda.tabletopmanager.model.Usuario.UsuarioNome;
import com.masuda.tabletopmanager.model.Usuario.UsuarioSenha;
import com.masuda.tabletopmanager.model.Usuario.UsuarioService;

import jakarta.servlet.http.HttpSession;


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
    public ResponseEntity<Map<String, String>> login(@RequestParam String email, @RequestParam String senha, HttpSession session) {
        UsuarioService us = context.getBean(UsuarioService.class);
        Usuario user = us.autenticarUsuario(email, senha);

        if (user != null) {
            session.setAttribute("usuarioId", user.getId().userId());
            session.setAttribute("usuarioNome", user.getNome().nomeUsuario());
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
    public String dashboard(HttpSession session, Model model){
        Integer usuarioId = (Integer) session.getAttribute("usuarioId");
        if (usuarioId == null) {
            return "redirect:/";
        }
        PersonagemService ps = context.getBean(PersonagemService.class);
        model.addAttribute("usuarioNome", session.getAttribute("usuarioNome"));
        List<PersonagemResumo> lista = ps.obterResumosPersonagemUsuario(usuarioId);
        model.addAttribute("resumos", lista);
        return "dashboard";
    }

    @PostMapping("/personagem/novo")
    @ResponseBody
    public ResponseEntity<Map<String, String>> criarPersonagem(@RequestParam String nome, @RequestParam String sistema, HttpSession session) {
        Integer usuarioId = (Integer) session.getAttribute("usuarioId");
        if (usuarioId == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Usuário não autenticado."));
        }

        int novoId = 0;
        switch(sistema){
            case "DND5E" -> {
                Dnd5eSheetService ds = context.getBean(Dnd5eSheetService.class);
                novoId = ds.inserirFichaDnd5e(usuarioId, nome);
            }
            case "TFT" -> {
                TftSheetService ts = context.getBean(TftSheetService.class);
                novoId = ts.inserirFichaTft(usuarioId, nome);
            }
            default -> {
                return ResponseEntity.badRequest().body(Map.of("error", "Sistema de RPG inválido."));
            }
        }
        
        return ResponseEntity.ok(Map.of("message", "Personagem criado com sucesso.", "id", String.valueOf(novoId)));
    }

    @GetMapping("/personagem/{id}")
    public String visualizarPersonagem(@PathVariable int id, HttpSession session, Model model) {
        Integer usuarioId = (Integer) session.getAttribute("usuarioId");
        if (usuarioId == null) {
            return "redirect:/";
        }
        Dnd5eSheetService ds = context.getBean(Dnd5eSheetService.class);
        if(ds.obterFichaDnd5e(id).getuId().idUsuario() != usuarioId){
            return "redirect:/dashboard";
        }

        model.addAttribute("ficha", ds.obterFichaDnd5e(id));
        return "fragments/dnd-sheet :: sheet";
    }

    @PostMapping("/personagem/{id}/identidade")
    @ResponseBody
    public ResponseEntity<Map<String, String>> atualizarIdentidade(@PathVariable int id, @RequestBody Map<String, Object> body, HttpSession session) {
        System.out.println(body);
        Integer usuarioId = (Integer) session.getAttribute("usuarioId");
        if (usuarioId == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Não autenticado."));
        }

        String nome       = (String) body.get("nome");
        String raca       = (String) body.get("raca");
        String antecedente = (String) body.get("antecedente");
        int experiencia   = body.get("xp") != null ? (int) body.get("xp") : 0;

        String sentidos    = joinLista(body, "sensesList");
        String resistencias = joinLista(body, "resistancesList");
        String imunidades  = joinLista(body, "immunitiesList");
        String armaduras   = joinLista(body, "armorList");
        String armas       = joinLista(body, "weaponsList");
        String idiomas     = joinLista(body, "languagesList");

        PersonagemService ps = context.getBean(PersonagemService.class);
        ps.atualizarIdentidade(id, nome, null);

        Dnd5eSheetService ds = context.getBean(Dnd5eSheetService.class);
        ds.atualizarIdentidade(id, raca, antecedente, experiencia);
        ds.atualizarAuxilio(id, sentidos, resistencias, imunidades, armaduras, armas, idiomas);

        return ResponseEntity.ok(Map.of("message", "Identidade atualizada."));
    }

    private String joinLista(Map<String, Object> body, String key) {
        Object val = body.get(key);
        if (val instanceof java.util.List<?> lista) {
            return String.join(",", (java.util.List<String>) lista);
        }
        return "";
    }

    @PostMapping("/personagem/{id}/atributos")
    @ResponseBody
    public ResponseEntity<Map<String, String>> atualizarAtributosPersonagem(@PathVariable int id, @RequestBody Map<String, Integer> body, HttpSession session){
        Integer usuarioId = (Integer) session.getAttribute("usuarioId");
        if (usuarioId == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Não autenticado."));
        }

        DndAtributos atributos = new DndAtributos(
        body.get("forca"),
        body.get("destreza"),
        body.get("constituicao"),
        body.get("inteligencia"),
        body.get("sabedoria"),
        body.get("carisma"));

        Dnd5eSheetService ds = context.getBean(Dnd5eSheetService.class);
        ds.atualizarAtributos(id, atributos);

        return ResponseEntity.ok(Map.of("message", "Atributos atualizados."));
    }

    @PostMapping("/personagem/{id}/pericias")
    @ResponseBody
    public ResponseEntity<Map<String, String>> atualizarPericias(
            @PathVariable int id,
            @RequestBody Map<String, Object> body,
            HttpSession session) {

        Integer usuarioId = (Integer) session.getAttribute("usuarioId");
        if (usuarioId == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Não autenticado."));
        }

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> pericias    = (List<Map<String, Object>>) body.get("pericias");
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> ferramentas = (List<Map<String, Object>>) body.get("ferramentas");

        Dnd5eSheetService ds = context.getBean(Dnd5eSheetService.class);
        ds.atualizarPericias(id, pericias);
        ds.atualizarFerramentas(id, ferramentas);

        return ResponseEntity.ok(Map.of("message", "Perícias atualizadas."));
    }

    @PostMapping("/personagem/{id}/combate")
    @ResponseBody
    public ResponseEntity<Map<String, String>> atualizarCombatePersonagem(@PathVariable int id, @RequestBody Map<String, Integer> body, HttpSession session){
        Integer usuarioId = (Integer) session.getAttribute("usuarioId");
        if (usuarioId == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Não autenticado."));
        }

        DndCombate combate = new DndCombate(body.get("classeArmadura"), body.get("iniciativa"), body.get("velocidade"));
        Dnd5eSheetService ds = context.getBean(Dnd5eSheetService.class);
        ds.atualizarCombate(id, combate);

        return ResponseEntity.ok(Map.of("message", "Atributos de combate atualizados."));
    }

    @PostMapping("/personagem/{id}/vida")
    @ResponseBody
    public ResponseEntity<Map<String, String>> atualizarVidaPersonagem(@PathVariable int id, @RequestBody Map<String, Integer> body, HttpSession session){
        Integer usuarioId = (Integer) session.getAttribute("usuarioId");
        if (usuarioId == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Não autenticado."));
        }
        DndVida vida = new DndVida(body.get("vidaMax"), body.get("vidaAtual"), body.get("vidaTemporaria"));
        Dnd5eSheetService ds = context.getBean(Dnd5eSheetService.class);
        ds.atualizarVida(id, vida);

        return ResponseEntity.ok(Map.of("message", "Vida atualizada."));
    }

    @PostMapping("/personagem/{id}/saves")
    @ResponseBody
    public ResponseEntity<Map<String, String>> atualizarSavesPersonagem(@PathVariable int id, @RequestBody Map<String, Boolean> body, HttpSession session){
        Integer usuarioId = (Integer) session.getAttribute("usuarioId");
        if (usuarioId == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Não autenticado."));
        }
        DndSaves saves = new DndSaves(
            body.get("forca"),
            body.get("destreza"),
            body.get("constituicao"),
            body.get("inteligencia"),
            body.get("sabedoria"),
            body.get("carisma")
        );
        Dnd5eSheetService ds = context.getBean(Dnd5eSheetService.class);
        ds.atualizarSaves(id, saves);

        return ResponseEntity.ok(Map.of("message", "Testes de Resistência atualizados."));
    }

    @PostMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/";
    }
}
