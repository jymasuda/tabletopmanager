package com.masuda.tabletopmanager.model.Personagem.DND5E;

import java.sql.Timestamp;
import java.util.Map;

import com.masuda.tabletopmanager.model.Personagem.Personagem;
import com.masuda.tabletopmanager.model.Personagem.PersonagemDataCriacao;
import com.masuda.tabletopmanager.model.Personagem.PersonagemID;
import com.masuda.tabletopmanager.model.Personagem.PersonagemNome;
import com.masuda.tabletopmanager.model.Personagem.Sistema;

public class Dnd5eSheet extends Personagem {
    private DndRaca raca;
    private DndAntecedente antecedente;
    private DndAtributos atributos; // Faz sentido isso ser assim ou o correto é fazer uma separada pra cada atributo?
    private DndVida vida; // Idem
    private DndCombate combate; // Idem

    public Dnd5eSheet() {
    }

    public Dnd5eSheet(DndAntecedente antecedente, DndAtributos atributos, DndCombate combate, DndRaca raca, DndVida vida, String avatarURL, PersonagemDataCriacao dataCriacao, PersonagemNome nome, Sistema sistema) {
        super(avatarURL, dataCriacao, nome, sistema);
        this.antecedente = antecedente;
        this.atributos = atributos;
        this.combate = combate;
        this.raca = raca;
        this.vida = vida;
    }

    public Dnd5eSheet(DndAntecedente antecedente, DndAtributos atributos, DndCombate combate, DndRaca raca, DndVida vida, String avatarURL, PersonagemDataCriacao dataCriacao, PersonagemID id, PersonagemNome nome, Sistema sistema) {
        super(avatarURL, dataCriacao, id, nome, sistema);
        this.antecedente = antecedente;
        this.atributos = atributos;
        this.combate = combate;
        this.raca = raca;
        this.vida = vida;
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
        PersonagemID id = new PersonagemID((int) registros.get("id"));
        PersonagemNome nome = new PersonagemNome((String) registros.get("nome"));
        String avatarURL = (String) registros.get("avatar_url");
        PersonagemDataCriacao dataCriacao = new PersonagemDataCriacao(
            ((Timestamp) registros.get("data_criacao")).toLocalDateTime()
        );
        DndRaca raca = DndRaca.valueOf((String) registros.get("id_raca"));
        DndAntecedente antecedente = DndAntecedente.valueOf((String) registros.get("antecedente"));
        DndAtributos atributos = DndAtributos.converterRegistros(registros);
        DndVida vida = DndVida.converterRegistros(registros);
        DndCombate combate = DndCombate.converterRegistros(registros);

        return new Dnd5eSheet(antecedente, atributos, combate, raca, vida, avatarURL, dataCriacao, id, nome, Sistema.DND5E);
}
}
