package com.masuda.tabletopmanager.model.Personagem.DND5E;

import com.masuda.tabletopmanager.model.Personagem.Personagem;
import com.masuda.tabletopmanager.model.Personagem.PersonagemDataCriacao;
import com.masuda.tabletopmanager.model.Personagem.PersonagemID;
import com.masuda.tabletopmanager.model.Personagem.PersonagemNome;
import com.masuda.tabletopmanager.model.Personagem.Sistema;

public class Dnd5eSheet extends Personagem {
    private DndRaca raca;
    private DndClasse classe;
    private DndAntecedente antecedente;
    private DndAtributos atributos; // Faz sentido isso ser assim ou o correto é fazer uma separada pra cada atributo?
    private DndVida vida; // Idem
    private DndCombate combate; // Idem

    public Dnd5eSheet() {
    }

    

    public Dnd5eSheet(DndAntecedente antecedente, DndAtributos atributos, DndClasse classe, DndCombate combate, DndRaca raca, DndVida vida, String avatarURL, PersonagemDataCriacao dataCriacao, PersonagemNome nome, Sistema sistema) {
        super(avatarURL, dataCriacao, nome, sistema);
        this.antecedente = antecedente;
        this.atributos = atributos;
        this.classe = classe;
        this.combate = combate;
        this.raca = raca;
        this.vida = vida;
    }

    public Dnd5eSheet(DndAntecedente antecedente, DndAtributos atributos, DndClasse classe, DndCombate combate, DndRaca raca, DndVida vida, String avatarURL, PersonagemDataCriacao dataCriacao, PersonagemID id, PersonagemNome nome, Sistema sistema) {
        super(avatarURL, dataCriacao, id, nome, sistema);
        this.antecedente = antecedente;
        this.atributos = atributos;
        this.classe = classe;
        this.combate = combate;
        this.raca = raca;
        this.vida = vida;
    }


}
