DROP TABLE IF EXISTS tft_attack CASCADE;
DROP TABLE IF EXISTS tft_skill_specialty CASCADE;
DROP TABLE IF EXISTS tft_skill CASCADE;
DROP TABLE IF EXISTS tft_feature CASCADE;
DROP TABLE IF EXISTS tft_sheets CASCADE;
DROP TABLE IF EXISTS dnd5e_auxilio CASCADE;
DROP TABLE IF EXISTS dnd5e_ferramenta CASCADE;
DROP TABLE IF EXISTS dnd5e_feature CASCADE;
DROP TABLE IF EXISTS dnd5e_ataque CASCADE;
DROP TABLE IF EXISTS dnd5e_feitico_slots CASCADE;
DROP TABLE IF EXISTS dnd5e_feitico CASCADE;
DROP TABLE IF EXISTS dnd5e_item CASCADE;
DROP TABLE IF EXISTS dnd5e_pericia CASCADE;
DROP TABLE IF EXISTS dnd5e_classe CASCADE;
DROP TABLE IF EXISTS dnd5e_sheets CASCADE;
DROP TABLE IF EXISTS personagem CASCADE;

DROP TYPE IF EXISTS tft_attribute_name CASCADE;
DROP TYPE IF EXISTS tft_dicepool_mode CASCADE;
DROP TYPE IF EXISTS tft_damage_type CASCADE;
DROP TYPE IF EXISTS tft_dmg_type CASCADE;
DROP TYPE IF EXISTS tft_dmg_form CASCADE;
DROP TYPE IF EXISTS tft_skill_type CASCADE;
DROP TYPE IF EXISTS tft_feature_source CASCADE;
DROP TYPE IF EXISTS tft_skill_name CASCADE;
DROP TYPE IF EXISTS dnd5e_feature_fonte CASCADE;
DROP TYPE IF EXISTS dnd5e_nome_pericia CASCADE;
DROP TYPE IF EXISTS dnd5e_nome_classe CASCADE;
DROP TYPE IF EXISTS lista_sistema CASCADE;

CREATE TYPE lista_sistema AS ENUM (
   'DND5E', 'TFT'
);

CREATE TYPE dnd5e_nome_classe AS ENUM (
    'LADINO', 'PALADINO', 'GUERREIRO', 'MAGO', 'CLÉRIGO', 'BARDO', 'FEITICEIRO', 'DRUIDA', 'BRUXO', 'MONGE', 'BARBARO', 'ARQUEIRO'
);

CREATE TYPE dnd5e_nome_pericia AS ENUM (
    'Atletismo', 'Acrobacia', 'Furtividade', 'Prestidigitação', 'Arcanismo',
    'História', 'Investigação', 'Natureza', 'Religião', 'Adestrar Animais', 
    'Intuição', 'Medicina', 'Percepção', 'Sobrevivência', 'Atuação', 
    'Enganação', 'Intimidação', 'Persuasão'
);

CREATE TYPE dnd5e_feature_fonte AS ENUM ('RACE', 'CLASS', 'BACKGROUND', 'FEAT', 'OTHER');

CREATE TYPE tft_feature_source AS ENUM (
    'CORE_PASSIVE',
    'ARMOR_PASSIVE',
    'PASSIVE',
    'FLAW',
    'EGO_GIFT',
    'REPUTATION_FLAW',
    'REPUTATION_PASSIVE',
    'ALLY_PASSIVE',
    'ALLY_FLAW',
    'EGO_RESONANCE',
    'RESONANCE'
);

CREATE TYPE tft_dmg_form AS ENUM ('SLASH', 'PIERCE', 'BLUNT');
CREATE TYPE tft_dmg_type AS ENUM ('RED', 'WHITE', 'BLACK', 'PALE');
CREATE TYPE tft_skill_type AS ENUM ('ATTACK', 'DEFENSE', 'CORROSION');
CREATE TYPE tft_dicepool_mode AS ENUM (
    'ATTRIBUTE_AND_SKILL',
    'SKILL_AND_SKILL'
);

CREATE TYPE tft_attribute_name AS ENUM (
    'PHYSIQUE', 'ENDURANCE', 'UNDERSTANDING', 'CALMNESS',
    'INTUITION', 'PRESENCE', 'CONVICTION', 'REFLEX', 'FOCUS'
);

CREATE TYPE tft_skill_name AS ENUM (
    'ATHLETICS',
    'ANIMAL_KEN',
    'AWARENESS',
    'BRAWL',
    'BACKSTREETS_SOCIETY',
    'CITY_SECRETS',
    'CRAFT',
    'INSIGHT',
    'HIGH_SOCIETY',
    'DRIVE',
    'INTIMIDATION',
    'INVESTIGATION',
    'FIREARMS',
    'LEADERSHIP',
    'MEDICINE',
    'LARCENY',
    'PERFORMANCE',
    'TECHNOLOGY',
    'MEELE',
    'PERSUASION',
    'STEALTH',
    'SUBTERFUGE'
);
CREATE TABLE IF NOT EXISTS usuario (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    senha VARCHAR(255),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS personagem (
    id SERIAL PRIMARY KEY,
    id_usuario INTEGER REFERENCES usuario(id),
    nome VARCHAR(50),
    sistema lista_sistema NOT NULL,
    avatar_url VARCHAR(512),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================
-- DND5E
-- ========================

CREATE TABLE IF NOT EXISTS dnd5e_sheets (
  id_personagem SERIAL PRIMARY KEY REFERENCES personagem(id) ON DELETE CASCADE,
  id_raca VARCHAR(60),
  experiencia INT DEFAULT 0,
  antecedente VARCHAR(60),
  inspiracao BOOLEAN DEFAULT FALSE,
  forca INT, destreza INT, constituicao INT,
  inteligencia INT, sabedoria INT, carisma INT,
  forcaSave BOOLEAN, destrezaSave BOOLEAN, constituicaoSave BOOLEAN,
  inteligenciaSave BOOLEAN, sabedoriaSave BOOLEAN, carismaSave BOOLEAN,
  hp_max INT,
  hp_atual INT,
  hp_temp INT,
  classe_armadura INT,
  iniciativa INT,
  velocidade INT
);

CREATE TABLE IF NOT EXISTS dnd5e_classe (
  id SERIAL PRIMARY KEY,
  id_personagem INT REFERENCES dnd5e_sheets(id_personagem) ON DELETE CASCADE,
  classe dnd5e_nome_classe NOT NULL,
  level INT NOT NULL CHECK (level BETWEEN 1 AND 20),
  primaria BOOLEAN DEFAULT FALSE 
);

CREATE TABLE IF NOT EXISTS dnd5e_pericia (
  id SERIAL PRIMARY KEY,
  id_personagem INT REFERENCES dnd5e_sheets(id_personagem) ON DELETE CASCADE,
  pericia dnd5e_nome_pericia NOT NULL,
  proficiente BOOLEAN DEFAULT FALSE,
  expert BOOLEAN DEFAULT FALSE,
  CHECK (NOT expert OR proficiente) 
);

CREATE TABLE IF NOT EXISTS dnd5e_item (
  id SERIAL PRIMARY KEY,
  id_personagem INT REFERENCES dnd5e_sheets(id_personagem) ON DELETE CASCADE,
  nome VARCHAR(100),
  quantidade INT DEFAULT 1,
  peso DECIMAL(5,2),
  descricao TEXT,
  equipado BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS dnd5e_feitico (
  id SERIAL PRIMARY KEY,
  id_personagem INT REFERENCES dnd5e_sheets(id_personagem) ON DELETE CASCADE,
  nome VARCHAR(100),
  level INT,
  escola VARCHAR(30),
  preparado BOOLEAN DEFAULT FALSE,
  descricao TEXT
);

CREATE TABLE IF NOT EXISTS dnd5e_feitico_slots (
  id_personagem INT REFERENCES dnd5e_sheets(id_personagem) ON DELETE CASCADE,
  slot_level INT,
  total INT,
  usado INT DEFAULT 0,
  PRIMARY KEY (id_personagem, slot_level)
);

CREATE TABLE IF NOT EXISTS dnd5e_ataque (
  id SERIAL PRIMARY KEY,
  id_personagem INT REFERENCES dnd5e_sheets(id_personagem) ON DELETE CASCADE,
  nome VARCHAR(100),
  ataque_bonus INT,
  dano_dado VARCHAR(20),
  dano_tipo VARCHAR(30)
);


CREATE TABLE IF NOT EXISTS dnd5e_feature (
  id SERIAL PRIMARY KEY,
  id_personagem INT REFERENCES dnd5e_sheets(id_personagem) ON DELETE CASCADE,
  fonte dnd5e_feature_fonte NOT NULL,
  nome VARCHAR(100),
  descricao TEXT
);

CREATE TABLE IF NOT EXISTS dnd5e_auxilio (
    id_personagem INT PRIMARY KEY REFERENCES personagem(id) ON DELETE CASCADE,
    backstory TEXT,
    personalidade TEXT,
    ideais TEXT,
    lacos TEXT,
    falhas TEXT,
    aparencia TEXT,
    aliados TEXT,
    anotacoes TEXT,
    sentidos TEXT,
    resistencias TEXT,
    imunidades TEXT,
    armaduras TEXT,
    armas TEXT,
    idiomas TEXT
);

CREATE TABLE IF NOT EXISTS dnd5e_ferramenta (
  id SERIAL PRIMARY KEY,
  id_personagem INT REFERENCES dnd5e_sheets(id_personagem) ON DELETE CASCADE,
  nome VARCHAR(100) NOT NULL,
  proficiente BOOLEAN DEFAULT FALSE,
  expert BOOLEAN DEFAULT FALSE,
  CHECK (NOT expert OR proficiente) 

);

-- ========================
-- TFT
-- ========================

CREATE TABLE IF NOT EXISTS tft_sheets (
  id_personagem SERIAL PRIMARY KEY REFERENCES personagem(id) ON DELETE CASCADE,
  sin VARCHAR(20), sin_points INT,
  max_hp INT, current_hp INT, pale_hp INT,
  max_sp INT, current_sp INT, pale_sp INT,
  physique INT, endurance INT, 
  understanding INT, calmness INT, 
  intuition INT, presence INT, conviction INT,
  reflex INT, focus INT,
  blunt_resistance INT DEFAULT 3, piercing_resistance INT DEFAULT 3, slashing_resistance INT DEFAULT 3,
  red_resistance INT DEFAULT 3, white_resistance INT DEFAULT 3, black_resistance INT DEFAULT 3, pale_resistance INT DEFAULT 3
);

CREATE TABLE IF NOT EXISTS tft_skill (
    id           SERIAL PRIMARY KEY,
    id_personagem INT REFERENCES tft_sheets(id_personagem) ON DELETE CASCADE,
    skill         tft_skill_name NOT NULL,
    points        INT DEFAULT 0 CHECK (points BETWEEN 0 AND 5),
    CONSTRAINT uq_tft_skill_personagem_skill UNIQUE (id_personagem, skill)
);

CREATE TABLE IF NOT EXISTS tft_skill_specialty (
    id       SERIAL PRIMARY KEY,
    id_skill INT REFERENCES tft_skill(id) ON DELETE CASCADE,
    nome     VARCHAR(100) NOT NULL
);



CREATE TABLE IF NOT EXISTS tft_feature (
    id SERIAL PRIMARY KEY,
    id_personagem INT REFERENCES tft_sheets(id_personagem) ON DELETE CASCADE,
    source tft_feature_source NOT NULL,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    CHECK (source NOT IN ('CORE_PASSIVE', 'ARMOR_PASSIVE') OR (TRUE))
);

CREATE UNIQUE INDEX uq_tft_core_passive
    ON tft_feature (id_personagem)
    WHERE source = 'CORE_PASSIVE';

CREATE UNIQUE INDEX uq_tft_armor_passive
    ON tft_feature (id_personagem)
    WHERE source = 'ARMOR_PASSIVE';



CREATE TABLE IF NOT EXISTS tft_attack (
    id SERIAL PRIMARY KEY,
    id_personagem INT REFERENCES tft_sheets(id_personagem) ON DELETE CASCADE,
    nome VARCHAR(100) NOT NULL,
    skill_type tft_skill_type NOT NULL DEFAULT 'ATTACK',
    damage_type tft_dmg_type,
    damage_form tft_dmg_form,
    CHECK (damage_type IS NOT NULL OR damage_form IS NOT NULL),
    threat INT,
    attack_weight INT,
    attack_description TEXT,

    -- dados
    dicepool_mode tft_dicepool_mode NOT NULL,
    attribute tft_attribute_name,
    skill_primary tft_skill_name NOT NULL, 
    skill_secondary tft_skill_name,
    CHECK (
        (dicepool_mode = 'ATTRIBUTE_AND_SKILL' AND attribute IS NOT NULL AND skill_secondary IS NULL)
        OR
        (dicepool_mode = 'SKILL_AND_SKILL' AND skill_secondary IS NOT NULL AND attribute IS NULL)
    )
);