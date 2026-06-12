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

import com.masuda.tabletopmanager.model.Personagem.DND5E.Classe.Dnd5eClasse;
import com.masuda.tabletopmanager.model.Personagem.DND5E.Dnd5eAuxilio;
import com.masuda.tabletopmanager.model.Personagem.DND5E.Dnd5ePericia;
import com.masuda.tabletopmanager.model.Personagem.DND5E.Dnd5eSheet;
import com.masuda.tabletopmanager.model.Personagem.DND5E.Dnd5eSheetService;
import com.masuda.tabletopmanager.model.Personagem.DND5E.DndAtributos;
import com.masuda.tabletopmanager.model.Personagem.DND5E.DndCombate;
import com.masuda.tabletopmanager.model.Personagem.DND5E.DndSaves;
import com.masuda.tabletopmanager.model.Personagem.DND5E.DndVida;
import com.masuda.tabletopmanager.model.Personagem.PersonagemService;

import jakarta.servlet.http.HttpSession;

@Controller
public class DndController {
    @Autowired
        ApplicationContext context;


    @GetMapping("/personagem/{id}/dnd/")
        public String visualizarPersonagem(@PathVariable int id, HttpSession session, Model model) {
            Integer usuarioId = (Integer) session.getAttribute("usuarioId");
            if (usuarioId == null) {
                return "redirect:/";
            }
            Dnd5eSheetService ds = context.getBean(Dnd5eSheetService.class);
            if (ds.obterFichaDnd5e(id).getuId().idUsuario() != usuarioId) {
                return "redirect:/dashboard";
            }

            Dnd5eSheet ficha = ds.obterFichaDnd5e(id);

            List<Dnd5ePericia> pericias = ds.obterPericias(id);

            Map<String, String> profMap = pericias.stream()
                    .collect(java.util.stream.Collectors.toMap(
                            p -> p.pericia(),
                            p -> p.expert() ? "expertise" : "proficient"
                    ));

            List<Dnd5eClasse> classes = ds.obterClasses(id);

            Dnd5eClasse classePrimaria = classes.stream()
                    .filter(Dnd5eClasse::isPrimaria)
                    .findFirst()
                    .orElse(classes.isEmpty() ? null : classes.get(0));
            int nivelTotal = classes.stream()
                    .mapToInt(c -> c.getLevel().levelClasse())
                    .sum();
            if (nivelTotal == 0) {
                nivelTotal = 1;
            }

            DndAtributos attr = ficha.getAtributos();
            model.addAttribute("atFor", attr != null ? attr.forca() : 10);
            model.addAttribute("atDes", attr != null ? attr.destreza() : 10);
            model.addAttribute("atCon", attr != null ? attr.constituicao() : 10);
            model.addAttribute("atInt", attr != null ? attr.inteligencia() : 10);
            model.addAttribute("atSab", attr != null ? attr.sabedoria() : 10);
            model.addAttribute("atCar", attr != null ? attr.carisma() : 10);

            DndCombate combate = ficha.getCombate();
            model.addAttribute("combateCA", combate != null ? combate.classeArmadura() : 10);
            model.addAttribute("combateVelocidade", combate != null ? combate.velocidade() : 30);

            DndVida vida = ficha.getVida();
            model.addAttribute("vidaAtual", vida != null ? vida.vidaAtual() : 0);
            model.addAttribute("vidaMax", vida != null ? vida.vidaMax() : 0);
            model.addAttribute("vidaTemporaria", vida != null ? vida.vidaTemporaria() : 0);

            DndSaves saves = ficha.getSaves();
            model.addAttribute("saveFor", saves != null && saves.forca());
            model.addAttribute("saveDes", saves != null && saves.destreza());
            model.addAttribute("saveCon", saves != null && saves.constituicao());
            model.addAttribute("saveInt", saves != null && saves.inteligencia());
            model.addAttribute("saveSab", saves != null && saves.sabedoria());
            model.addAttribute("saveCar", saves != null && saves.carisma());

            model.addAttribute("ficha", ficha);
            model.addAttribute("classePrimaria", classePrimaria);
            model.addAttribute("classes", classes);
            model.addAttribute("nivelTotal", nivelTotal);
            model.addAttribute("pericias", ds.obterPericias(id));
            model.addAttribute("profMap", profMap);
            model.addAttribute("ferramentas", ds.obterFerramentas(id));
            model.addAttribute("auxilio", ds.obterAuxilio(id).orElseGet(() ->
        new Dnd5eAuxilio(null, null, null, null, null, null, null, null,
                        null, null, null, null, null, null)
    ));

            return "fragments/dnd-sheet :: sheet";
        }

        @PostMapping("/personagem/{id}/dnd/identidade")
        @ResponseBody
        public ResponseEntity<Map<String, String>> atualizarIdentidade(@PathVariable int id, @RequestBody Map<String, Object> body, HttpSession session) {
            System.out.println(body);
            Integer usuarioId = (Integer) session.getAttribute("usuarioId");
            if (usuarioId == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Não autenticado."));
            }

            String nome = (String) body.get("nome");
            String raca = (String) body.get("raca");
            String antecedente = (String) body.get("antecedente");
            int experiencia = body.get("xp") != null ? (int) body.get("xp") : 0;

            String sentidos = joinLista(body, "sensesList");
            String resistencias = joinLista(body, "resistancesList");
            String imunidades = joinLista(body, "immunitiesList");
            String armaduras = joinLista(body, "armorList");
            String armas = joinLista(body, "weaponsList");
            String idiomas = joinLista(body, "languagesList");

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

        @PostMapping("/personagem/{id}/dnd/atributos")
        @ResponseBody
        public ResponseEntity<Map<String, String>> atualizarAtributosPersonagem(@PathVariable int id, @RequestBody Map<String, Integer> body, HttpSession session) {
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

        @PostMapping("/personagem/{id}/dnd/pericias")
        @ResponseBody
        public ResponseEntity<Map<String, String>> atualizarPericias(
                @PathVariable int id,
                @RequestBody Map<String, Object> body,
                HttpSession session) {

            Integer usuarioId = (Integer) session.getAttribute("usuarioId");
            if (usuarioId == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Não autenticado."));
            }

            List<Map<String, Object>> pericias = (List<Map<String, Object>>) body.get("pericias");
            List<Map<String, Object>> ferramentas = (List<Map<String, Object>>) body.get("ferramentas");

            Dnd5eSheetService ds = context.getBean(Dnd5eSheetService.class);
            ds.atualizarPericias(id, pericias);
            ds.atualizarFerramentas(id, ferramentas);

            return ResponseEntity.ok(Map.of("message", "Perícias atualizadas."));
        }

        @PostMapping("/personagem/{id}/dnd/classes")
        @ResponseBody
        public ResponseEntity<Map<String, String>> atualizarClassePersonagem(@PathVariable int id, @RequestBody Map<String, Object> body, HttpSession session) {
            Integer usuarioId = (Integer) session.getAttribute("usuarioId");
            if (usuarioId == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Não autenticado."));
            }
            List<Map<String, Object>> classes = (List<Map<String, Object>>) body.get("classes");
            Dnd5eSheetService ds = context.getBean(Dnd5eSheetService.class);
            ds.atualizarCLasse(id, classes);

            return ResponseEntity.ok(Map.of("message", "Classes atualizadas."));
        }

        @PostMapping("/personagem/{id}/dnd/combate")
        @ResponseBody
        public ResponseEntity<Map<String, String>> atualizarCombatePersonagem(@PathVariable int id, @RequestBody Map<String, Integer> body, HttpSession session) {
            Integer usuarioId = (Integer) session.getAttribute("usuarioId");
            if (usuarioId == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Não autenticado."));
            }

            DndCombate combate = new DndCombate(body.get("classeArmadura"), body.get("iniciativa"), body.get("velocidade"));
            Dnd5eSheetService ds = context.getBean(Dnd5eSheetService.class);
            ds.atualizarCombate(id, combate);

            return ResponseEntity.ok(Map.of("message", "Atributos de combate atualizados."));
        }

        @PostMapping("/personagem/{id}/dnd/vida")
        @ResponseBody
        public ResponseEntity<Map<String, String>> atualizarVidaPersonagem(@PathVariable int id, @RequestBody Map<String, Integer> body, HttpSession session) {
            Integer usuarioId = (Integer) session.getAttribute("usuarioId");
            if (usuarioId == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Não autenticado."));
            }
            DndVida vida = new DndVida(body.get("vidaMax"), body.get("vidaAtual"), body.get("vidaTemporaria"));
            Dnd5eSheetService ds = context.getBean(Dnd5eSheetService.class);
            ds.atualizarVida(id, vida);

            return ResponseEntity.ok(Map.of("message", "Vida atualizada."));
        }

        @PostMapping("/personagem/{id}/dnd/saves")
        @ResponseBody
        public ResponseEntity<Map<String, String>> atualizarSavesPersonagem(@PathVariable int id, @RequestBody Map<String, Boolean> body, HttpSession session) {
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

}
