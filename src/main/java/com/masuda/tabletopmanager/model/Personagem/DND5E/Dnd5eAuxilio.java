// Dnd5eAuxilio.java — substituir o record atual
package com.masuda.tabletopmanager.model.Personagem.DND5E;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;

public record Dnd5eAuxilio(
        String backstory, String personalidade,
        String ideais, String lacos, String falhas,
        String aparencia, String aliados, String anotacoes,
        String sentidos, String resistencias, String imunidades,
        String armaduras, String armas, String idiomas
        ) {

    public List<String> sentidosList() {
        return splitCsv(sentidos);
    }

    public List<String> resistenciasList() {
        return splitCsv(resistencias);
    }

    public List<String> imunidadesList() {
        return splitCsv(imunidades);
    }

    public List<String> armadurasList() {
        return splitCsv(armaduras);
    }

    public List<String> armasList() {
        return splitCsv(armas);
    }

    public List<String> idiomasList() {
        return splitCsv(idiomas);
    }

    private static List<String> splitCsv(String val) {
        if (val == null || val.isBlank()) {
            return Collections.emptyList();
        }
        return Arrays.stream(val.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();
    }

    public static Dnd5eAuxilio converterRegistros(Map<String, Object> registros) {
        return new Dnd5eAuxilio(
                (String) registros.get("backstory"),
                (String) registros.get("personalidade"),
                (String) registros.get("ideais"),
                (String) registros.get("lacos"),
                (String) registros.get("falhas"),
                (String) registros.get("aparencia"),
                (String) registros.get("aliados"),
                (String) registros.get("anotacoes"),
                (String) registros.get("sentidos"),
                (String) registros.get("resistencias"),
                (String) registros.get("imunidades"),
                (String) registros.get("armaduras"),
                (String) registros.get("armas"),
                (String) registros.get("idiomas")
        );
    }
}
