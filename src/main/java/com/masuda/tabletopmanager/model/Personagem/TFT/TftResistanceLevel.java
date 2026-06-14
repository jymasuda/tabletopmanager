package com.masuda.tabletopmanager.model.Personagem.TFT;

public enum TftResistanceLevel {
    FATAL(1, "Fatal"),
    WEAK(2, "Weak"),
    NORMAL(3, "Normal"),
    RESISTANT(4, "Resistant"),
    ENDURED(5, "Endured"),
    IMMUNE(6, "Immune");

    private final int value;
    private final String label;

    TftResistanceLevel(int value, String label) {
        this.value = value;
        this.label = label;
    }

    public int value() { return value; }
    public String label() { return label; }

    public static TftResistanceLevel fromValue(int value) {
        for (TftResistanceLevel level : values()) {
            if (level.value == value) return level;
        }
        return NORMAL;
    }
}
