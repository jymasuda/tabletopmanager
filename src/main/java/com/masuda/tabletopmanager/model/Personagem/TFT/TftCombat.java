package com.masuda.tabletopmanager.model.Personagem.TFT;

import java.util.Map;

public record TftCombat(int bluntResistance, int piercingResistance, int slashingResistance,
                        int redResistance, int whiteResistance, int blackResistance, int paleResistance) {

    public static TftCombat converterRegistros(Map<String, Object> registros) {
        return new TftCombat(
            (int) registros.get("blunt_resistance"),
            (int) registros.get("piercing_resistance"),
            (int) registros.get("slashing_resistance"),
            (int) registros.get("red_resistance"),
            (int) registros.get("white_resistance"),
            (int) registros.get("black_resistance"),
            (int) registros.get("pale_resistance")
        );
    }

}
