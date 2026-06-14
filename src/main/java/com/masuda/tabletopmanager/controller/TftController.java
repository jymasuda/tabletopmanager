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
import org.springframework.web.bind.annotation.ResponseBody;

import com.masuda.tabletopmanager.model.Personagem.TFT.TftAttributes;
import com.masuda.tabletopmanager.model.Personagem.TFT.TftCombat;
import com.masuda.tabletopmanager.model.Personagem.TFT.TftSheet;
import com.masuda.tabletopmanager.model.Personagem.TFT.TftSheetService;

import jakarta.servlet.http.HttpSession;

/**
 * All TFT sheet endpoints. Wire this class into Spring by dropping it alongside
 * MainController — it's annotated @Controller so it's picked up automatically
 * by @SpringBootApplication.
 *
 * GET /personagem/{id}/tft → renders fragment tft-sheet :: sheet POST
 * /personagem/{id}/tft/identidade → name + sin POST
 * /personagem/{id}/tft/recursos → HP / SP / sin points POST
 * /personagem/{id}/tft/atributos → 9 attributes POST
 * /personagem/{id}/tft/skills → all skills + specialties POST
 * /personagem/{id}/tft/resistencias → 7 resistance values POST
 * /personagem/{id}/tft/features → bulk update existing feature text POST
 * /personagem/{id}/tft/feature/novo → create feature → returns {id} POST
 * /personagem/{id}/tft/feature/{fid}/deletar → delete feature POST
 * /personagem/{id}/tft/ataque/novo → create attack → returns {id} POST
 * /personagem/{id}/tft/ataque/{aid}/deletar → delete attack
 */
@Controller
public class TftController {

    @Autowired
    ApplicationContext context;

    private TftSheetService svc() {
        return context.getBean(TftSheetService.class);
    }

    private Integer userId(HttpSession session) {
        return (Integer) session.getAttribute("usuarioId");
    }

    @GetMapping("/personagem/{id}/tft")
    public String visualizarFichaTft(@PathVariable int id,
            HttpSession session,
            Model model) {
        if (userId(session) == null) {
            return "redirect:/";
        }

        TftSheetService ts = svc();
        TftSheet ficha = ts.obterFichaTft(id);

        if (ficha.getuId().idUsuario() != userId(session)) {
            return "redirect:/dashboard";
        }

        model.addAttribute("ficha", ficha);
        model.addAttribute("hp", ficha.getHp());
        model.addAttribute("sp", ficha.getSp());
        model.addAttribute("sinPoints", ficha.getSinPoints());
        model.addAttribute("attributes", ficha.getAttributes());
        model.addAttribute("combat", ficha.getCombatAttributes());

        return "fragments/tft-sheet :: sheet";
    }

    @PostMapping("/personagem/{id}/tft/identidade")
    @ResponseBody
    public ResponseEntity<Map<String, String>> atualizarIdentidade(
            @PathVariable int id,
            @RequestBody Map<String, String> body,
            HttpSession session) {

        if (userId(session) == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Não autenticado."));
        }

        svc().atualizarIdentidade(id, body.get("nome"), body.get("sin"));
        return ResponseEntity.ok(Map.of("message", "Identidade atualizada."));
    }

    @PostMapping("/personagem/{id}/tft/recursos")
    @ResponseBody
    public ResponseEntity<Map<String, String>> atualizarRecursos(
            @PathVariable int id,
            @RequestBody Map<String, Integer> body,
            HttpSession session) {

        if (userId(session) == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Não autenticado."));
        }

        svc().atualizarRecursos(id,
                orZero(body, "hpAtual"), orZero(body, "hpMax"), orZero(body, "hpPale"),
                orZero(body, "spAtual"), orZero(body, "spMax"), orZero(body, "spPale"),
                orZero(body, "sinPoints"));

        return ResponseEntity.ok(Map.of("message", "Recursos atualizados."));
    }

    @PostMapping("/personagem/{id}/tft/atributos")
    @ResponseBody
    public ResponseEntity<Map<String, String>> atualizarAtributos(
            @PathVariable int id,
            @RequestBody Map<String, Integer> body,
            HttpSession session) {

        if (userId(session) == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Não autenticado."));
        }

        TftAttributes attrs = new TftAttributes(
                orZero(body, "physique"),
                orZero(body, "endurance"),
                orZero(body, "understanding"),
                orZero(body, "calmness"),
                orZero(body, "intuition"),
                orZero(body, "presence"),
                orZero(body, "conviction"),
                orZero(body, "reflex"),
                orZero(body, "focus"));

        svc().atualizarAtributos(id, attrs);
        return ResponseEntity.ok(Map.of("message", "Atributos atualizados."));
    }

    @PostMapping("/personagem/{id}/tft/skills")
    @ResponseBody
    public ResponseEntity<Map<String, String>> atualizarSkills(
            @PathVariable int id,
            @RequestBody Map<String, Object> body,
            HttpSession session) {

        if (userId(session) == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Não autenticado."));
        }

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> skills = (List<Map<String, Object>>) body.get("skills");
        if (skills != null) {
            svc().atualizarSkills(id, skills);
        }

        return ResponseEntity.ok(Map.of("message", "Skills atualizadas."));
    }

    @PostMapping("/personagem/{id}/tft/resistencias")
    @ResponseBody
    public ResponseEntity<Map<String, String>> atualizarResistencias(
            @PathVariable int id,
            @RequestBody Map<String, Integer> body,
            HttpSession session) {

        if (userId(session) == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Não autenticado."));
        }

        TftCombat combat = new TftCombat(
                orZero(body, "blunt"),
                orZero(body, "piercing"),
                orZero(body, "slashing"),
                orZero(body, "red"),
                orZero(body, "white"),
                orZero(body, "black"),
                orZero(body, "pale"));

        svc().atualizarResistencias(id, combat);
        return ResponseEntity.ok(Map.of("message", "Resistências atualizadas."));
    }

    @PostMapping("/personagem/{id}/tft/features")
    @ResponseBody
    public ResponseEntity<Map<String, String>> atualizarFeatures(
            @PathVariable int id,
            @RequestBody Map<String, Object> body,
            HttpSession session) {

        if (userId(session) == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Não autenticado."));
        }

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> features = (List<Map<String, Object>>) body.get("features");
        if (features != null) {
            svc().atualizarFeatures(id, features);
        }

        return ResponseEntity.ok(Map.of("message", "Features atualizadas."));
    }

    @PostMapping("/personagem/{id}/tft/feature/novo")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> inserirFeature(
            @PathVariable int id,
            @RequestBody Map<String, String> body,
            HttpSession session) {

        if (userId(session) == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Não autenticado."));
        }

        Integer newId = svc().inserirFeature(id,
                body.get("source"),
                body.get("nome"),
                body.get("descricao"));

        return ResponseEntity.ok(Map.of("id", newId, "message", "Feature criada."));
    }

    @PostMapping("/personagem/{id}/tft/feature/{fid}/deletar")
    @ResponseBody
    public ResponseEntity<Map<String, String>> deletarFeature(
            @PathVariable int id,
            @PathVariable int fid,
            HttpSession session) {

        if (userId(session) == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Não autenticado."));
        }

        svc().deletarFeature(fid, id);
        return ResponseEntity.ok(Map.of("message", "Feature removida."));
    }

    @PostMapping("/personagem/{id}/tft/ataque/novo")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> inserirAtaque(
            @PathVariable int id,
            @RequestBody Map<String, Object> body,
            HttpSession session) {

        if (userId(session) == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Não autenticado."));
        }

        Integer newId = svc().inserirAtaque(id, body);
        return ResponseEntity.ok(Map.of("id", newId, "message", "Ataque criado."));
    }

    @PostMapping("/personagem/{id}/tft/ataque/{aid}/deletar")
    @ResponseBody
    public ResponseEntity<Map<String, String>> deletarAtaque(
            @PathVariable int id,
            @PathVariable int aid,
            HttpSession session) {

        if (userId(session) == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Não autenticado."));
        }

        svc().deletarAtaque(aid, id);
        return ResponseEntity.ok(Map.of("message", "Ataque removido."));
    }

    private static int orZero(Map<String, Integer> map, String key) {
        return map.getOrDefault(key, 0);
    }
}
