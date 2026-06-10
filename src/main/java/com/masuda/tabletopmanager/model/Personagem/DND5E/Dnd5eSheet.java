package com.masuda.tabletopmanager.model.Personagem.DND5E;

import java.sql.Timestamp;
import java.util.Map;

import com.masuda.tabletopmanager.model.Personagem.Personagem;
import com.masuda.tabletopmanager.model.Personagem.PersonagemDataCriacao;
import com.masuda.tabletopmanager.model.Personagem.PersonagemID;
import com.masuda.tabletopmanager.model.Personagem.PersonagemNome;
import com.masuda.tabletopmanager.model.Personagem.PersonagemUID;
import com.masuda.tabletopmanager.model.Personagem.Sistema;

public class Dnd5eSheet extends Personagem {

    private DndRaca raca;
    private DndAntecedente antecedente;
    private DndAtributos atributos;
    private DndSaves saves;
    private DndVida vida;
    private DndCombate combate;

    public Dnd5eSheet() {
    }

    public Dnd5eSheet(DndAntecedente antecedente, DndAtributos atributos, DndCombate combate, DndRaca raca, DndVida vida, DndSaves saves, String avatarURL, PersonagemDataCriacao dataCriacao, PersonagemID id, PersonagemUID uId, PersonagemNome nome, Sistema sistema) {
        super(avatarURL, dataCriacao, id, uId, nome, sistema);
        this.antecedente = antecedente;
        this.atributos = atributos;
        this.combate = combate;
        this.raca = raca;
        this.vida = vida;
        this.saves = saves;
    }

    public Dnd5eSheet(DndAntecedente antecedente, DndAtributos atributos, DndCombate combate, DndRaca raca, DndVida vida, DndSaves saves, String avatarURL, PersonagemDataCriacao dataCriacao, PersonagemUID uId, PersonagemNome nome, Sistema sistema) {
        super(avatarURL, dataCriacao, uId, nome, sistema);
        this.antecedente = antecedente;
        this.atributos = atributos;
        this.combate = combate;
        this.raca = raca;
        this.vida = vida;
        this.saves = saves;
    }

    public DndRaca getRaca() {
        return raca;
    }

    public void setRaca(DndRaca raca) {
        this.raca = raca;
    }

    public DndAntecedente getAntecedente() {
        return antecedente;
    }

    public void setAntecedente(DndAntecedente antecedente) {
        this.antecedente = antecedente;
    }

    public DndAtributos getAtributos() {
        return atributos;
    }

    public void setAtributos(DndAtributos atributos) {
        this.atributos = atributos;
    }

    public DndVida getVida() {
        return vida;
    }

    public void setVida(DndVida vida) {
        this.vida = vida;
    }

    public DndCombate getCombate() {
        return combate;
    }

    public void setCombate(DndCombate combate) {
        this.combate = combate;
    }

    public static Dnd5eSheet converterRegistros(Map<String, Object> registros) {
        System.out.println("Registros recebidos para conversão: " + registros); // Log para verificar os dados recebidos
        PersonagemID id = new PersonagemID((int) registros.get("id"));
        PersonagemUID uId = new PersonagemUID((int) registros.get("id_usuario"));
        PersonagemNome nome = new PersonagemNome((String) registros.get("nome"));
        String avatarURL = (String) registros.get("avatar_url");
        PersonagemDataCriacao dataCriacao = new PersonagemDataCriacao(
                ((Timestamp) registros.get("data_criacao")).toLocalDateTime()
        );

        String racaStr = (String) registros.get("id_raca");
        DndRaca raca = racaStr != null ? DndRaca.valueOf(racaStr) : null;

        String antecedenteStr = (String) registros.get("antecedente");
        DndAntecedente antecedente = antecedenteStr != null ? DndAntecedente.valueOf(antecedenteStr) : null;

        boolean temAtributos = registros.get("forca") != null;
        DndAtributos atributos = temAtributos ? DndAtributos.converterRegistros(registros) : null;

        boolean temVida = registros.get("hp_max") != null;
        DndVida vida = temVida ? DndVida.converterRegistros(registros) : null;

        boolean temCombate = registros.get("classe_armadura") != null;
        DndCombate combate = temCombate ? DndCombate.converterRegistros(registros) : null;

        boolean temSaves = registros.get("forcaSave") != null;
        DndSaves saves = temSaves ? DndSaves.converterRegistros(registros) : null;

        return new Dnd5eSheet(antecedente, atributos, combate, raca, vida, saves, avatarURL, dataCriacao, id, uId, nome, Sistema.DND5E);
    }

    public DndSaves getSaves() {
        return saves;
    }

    public void setSaves(DndSaves saves) {
        this.saves = saves;
    }
}
