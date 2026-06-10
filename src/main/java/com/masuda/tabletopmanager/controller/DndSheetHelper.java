package com.masuda.tabletopmanager.controller;

import java.util.List;

import com.masuda.tabletopmanager.model.Personagem.DND5E.Classe.Dnd5eClasse;


public final class DndSheetHelper {

    private DndSheetHelper() {
    }

    public static final List<String[]> SKILL_LIST = List.of(
            new String[]{"Acrobacia", "destreza"},
            new String[]{"Adestrar Animais", "sabedoria"},
            new String[]{"Arcanismo", "inteligencia"},
            new String[]{"Atletismo", "forca"},
            new String[]{"Atuação", "carisma"},
            new String[]{"Enganação", "carisma"},
            new String[]{"Furtividade", "destreza"},
            new String[]{"História", "inteligencia"},
            new String[]{"Intimidação", "carisma"},
            new String[]{"Intuição", "sabedoria"},
            new String[]{"Investigação", "inteligencia"},
            new String[]{"Medicina", "sabedoria"},
            new String[]{"Natureza", "inteligencia"},
            new String[]{"Percepção", "sabedoria"},
            new String[]{"Persuasão", "carisma"},
            new String[]{"Prestidigitação", "destreza"},
            new String[]{"Religião", "inteligencia"},
            new String[]{"Sobrevivência", "sabedoria"}
    );

    public static final List<String[]> SAVE_LIST = List.of(
            new String[]{"forca", "FOR"},
            new String[]{"destreza", "DES"},
            new String[]{"constituicao", "CON"},
            new String[]{"inteligencia", "INT"},
            new String[]{"sabedoria", "SAB"},
            new String[]{"carisma", "CAR"}
    );

    public static int hitDieForClass(String classeNome) {
        return switch (classeNome) {
            case "BARBARO" ->
                12;
            case "GUERREIRO", "PALADINO", "PATRULHEIRO" ->
                10;
            case "BARDO", "CLÉRIGO", "DRUIDA", "MONGE", "LADINO", "BRUXO" ->
                8;
            case "FEITICEIRO", "MAGO" ->
                6;
            default ->
                8;
        };
    }

    public static String attrLabel(String attr) {
        return switch (attr) {
            case "forca" ->
                "FOR";
            case "destreza" ->
                "DES";
            case "constituicao" ->
                "CON";
            case "inteligencia" ->
                "INT";
            case "sabedoria" ->
                "SAB";
            case "carisma" ->
                "CAR";
            default ->
                attr.toUpperCase().substring(0, 3);
        };
    }

    public static int nivelTotal(List<Dnd5eClasse> classes) {
    if (classes == null || classes.isEmpty()) return 1;
    return classes.stream()
        .mapToInt(c -> c.getLevel().levelClasse())
        .sum();
    }
}
