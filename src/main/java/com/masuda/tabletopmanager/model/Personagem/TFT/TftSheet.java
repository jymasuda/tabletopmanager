package com.masuda.tabletopmanager.model.Personagem.TFT;

import java.sql.Timestamp;
import java.util.Map;

import com.masuda.tabletopmanager.model.Personagem.Personagem;
import com.masuda.tabletopmanager.model.Personagem.PersonagemDataCriacao;
import com.masuda.tabletopmanager.model.Personagem.PersonagemID;
import com.masuda.tabletopmanager.model.Personagem.PersonagemNome;
import com.masuda.tabletopmanager.model.Personagem.PersonagemUID;
import com.masuda.tabletopmanager.model.Personagem.Sistema;

public class TftSheet extends Personagem {

    private TftSin sin;
    private TftHP hp;
    private TftSP sp;
    private TftSinPoints sinPoints;
    private TftAttributes attributes;
    private TftCombat combatAttributes;

    public TftSheet() {
    }

    public TftSheet(TftAttributes attributes, TftCombat combatAttributes, TftHP hp, TftSin sin, TftSP sp, TftSinPoints sinPoints) {
        this.attributes = attributes;
        this.combatAttributes = combatAttributes;
        this.hp = hp;
        this.sin = sin;
        this.sp = sp;
        this.sinPoints = sinPoints;
    }

    public TftSheet(TftAttributes attributes, TftCombat combatAttributes, TftHP hp, TftSin sin, TftSP sp, TftSinPoints sinPoints, String avatarURL, PersonagemDataCriacao dataCriacao, PersonagemID id, PersonagemUID uId, PersonagemNome nome, Sistema sistema) {
        super(avatarURL, dataCriacao, id, uId, nome, sistema);
        this.attributes = attributes;
        this.combatAttributes = combatAttributes;
        this.hp = hp;
        this.sin = sin;
        this.sp = sp;
        this.sinPoints = sinPoints;
    }

    public TftSheet(TftAttributes attributes, TftCombat combatAttributes, TftHP hp, TftSin sin, TftSP sp, TftSinPoints sinPoints, String avatarURL, PersonagemDataCriacao dataCriacao, PersonagemUID uId, PersonagemNome nome, Sistema sistema) {
        super(avatarURL, dataCriacao, uId, nome, sistema);
        this.attributes = attributes;
        this.combatAttributes = combatAttributes;
        this.hp = hp;
        this.sin = sin;
        this.sp = sp;
        this.sinPoints = sinPoints;
    }

    public TftSin getSin() {
        return sin;
    }

    public void setSin(TftSin sin) {
        this.sin = sin;
    }

    public TftHP getHp() {
        return hp;
    }

    public void setHp(TftHP hp) {
        this.hp = hp;
    }

    public TftSP getSp() {
        return sp;
    }

    public void setSp(TftSP sp) {
        this.sp = sp;
    }

    public TftSinPoints getSinPoints() {
        return sinPoints;
    }

    public void setSinPoints(TftSinPoints sinPoints) {
        this.sinPoints = sinPoints;
    }

    public TftAttributes getAttributes() {
        return attributes;
    }

    public void setAttributes(TftAttributes attributes) {
        this.attributes = attributes;
    }

    public TftCombat getCombatAttributes() {
        return combatAttributes;
    }

    public void setCombatAttributes(TftCombat combatAttributes) {
        this.combatAttributes = combatAttributes;
    }

    public static TftSheet converterRegistros(Map<String, Object> registros) {
        PersonagemID id = new PersonagemID((Integer) registros.get("id"));
        PersonagemUID uId = new PersonagemUID((Integer) registros.get("id_usuario"));
        PersonagemNome nome = new PersonagemNome((String) registros.get("nome"));
        String avatarURL = (String) registros.get("avatar_url");
        PersonagemDataCriacao dataCriacao = new PersonagemDataCriacao(
                ((Timestamp) registros.get("data_criacao")).toLocalDateTime()
        );
        TftSin sin = TftSin.valueOf((String) registros.get("sin"));
        TftHP hp = TftHP.converterRegistros(registros);
        TftSP sp = TftSP.converterRegistros(registros);
        TftAttributes attributes = TftAttributes.converterRegistros(registros);
        TftCombat combatAttributes = TftCombat.converterRegistros(registros);
        TftSinPoints sinPoints = TftSinPoints.converterRegistros(registros);
        return new TftSheet(attributes, combatAttributes, hp, sin, sp, sinPoints, avatarURL, dataCriacao, id, uId, nome, Sistema.TFT);
    }

}
