package com.masuda.tabletopmanager.model.Personagem.TFT;

import java.util.Map;

public record TftSinPoints(int sinPoints) {

    public static TftSinPoints converterRegistros(Map<String, Object> registros) {
        return new TftSinPoints(
                (int) registros.get("sin_points")
        );
    }
}
