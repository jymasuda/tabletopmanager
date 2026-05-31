package com.masuda.tabletopmanager.model.Personagem.TFT;

import java.util.Map;

public record TftSP(int currentSP, int maxSP, int paleSP) {
    public Boolean isPanicked() {
        return currentSP <= 0;
    }

    public Boolean isStrained() {
        return currentSP < maxSP/2;
    }
    public int getPaleSP() {
        return maxSP - paleSP;
    }   

    public static TftSP converterRegistros(Map<String, Object> registros) {
    return new TftSP(
        (int) registros.get("max_sp"),
        (int) registros.get("current_sp"),
        (int) registros.get("pale_sp")
    );
    }
}
