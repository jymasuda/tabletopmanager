package com.masuda.tabletopmanager.model.Personagem.TFT;

public record TftHP(int currentHP, int maxHP, int paleHP) {
    public Boolean isDead() {
        return currentHP <= 0;
    }

    public Boolean isInjured() {
        return currentHP < maxHP/2;
    }
    public int getPaleHP() {
        return maxHP - paleHP;
    }   
}
