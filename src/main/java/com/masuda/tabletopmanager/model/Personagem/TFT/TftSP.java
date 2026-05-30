package com.masuda.tabletopmanager.model.Personagem.TFT;

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
}
