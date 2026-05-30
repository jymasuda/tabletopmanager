package com.masuda.tabletopmanager.model.Personagem.TFT;

public record TftAttributes(int physique, int endurance, int understanding, int calmness, int intuition, int presence, int conviction, int reflex, int focus) {
    public int getFortitude(){
        return Math.max(physique, endurance) + 1;
    }

    public int getInsight() {
        return Math.max(understanding, calmness) + 1;
    }

    public int getTemperance() {
        return Math.max(Math.max(intuition, presence), conviction) + 1;
    }

    public int getJustice(){
        return Math.max(reflex, focus) + 1;
    }
}
