package com.masuda.tabletopmanager.model.Personagem.TFT;

import java.util.Map;

public record TftHP(int currentHP, int maxHP, int paleHP) {

    public Boolean isDead() {
        return currentHP <= 0;
    }

    public Boolean isInjured() {
        return currentHP < maxHP / 2;
    }

    public int getPaleHP() {
        return maxHP - paleHP;
    }

    public static TftHP converterRegistros(Map<String, Object> registros) {
        return new TftHP(
                (int) registros.get("current_hp"),
                (int) registros.get("max_hp"),
                (int) registros.get("pale_hp")
        );
    }
}
