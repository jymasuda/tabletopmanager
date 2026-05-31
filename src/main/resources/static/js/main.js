document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar');
    const contentPane = document.querySelector('.content-pane');
    const sidebarMiddle = document.querySelector('.sidebar-middle');
    const characterCards = Array.from(document.querySelectorAll('.character-card:not(.add-character-card)'));
    const addCharacterCard = document.querySelector('.add-character-card');
    const newCharacterNameInput = document.querySelector('.new-character-name');
    const newCharacterSystemSelect = document.querySelector('.new-character-system');
    const saveNewCharacterButton = document.querySelector('.save-new-character');
    const cancelNewCharacterButton = document.querySelector('.cancel-new-character');
    const tabButtons = document.querySelectorAll('.tab');
    const navItems = document.querySelectorAll('.nav-item');
    const menuFab = document.querySelector('.menu-fab');

    // Estado da aplicação
    let selectedCharacter = null;
    let currentCategory = 'Todos';
    let sidebarHidden = false;

    function toggleSidebar() {
        sidebarHidden = !sidebarHidden;
        if (sidebarHidden) {
            sidebar.classList.add('hidden');
            contentPane.classList.add('full-width');
            if (menuFab) {
                menuFab.classList.remove('hidden');
            }
        } else {
            sidebar.classList.remove('hidden');
            contentPane.classList.remove('full-width');
            if (menuFab) {
                menuFab.classList.add('hidden');
            }
        }
    }

    function renderCharacterDetail(card) {
        const name = card.querySelector('h2').textContent;
        const subtitle = card.querySelector('.subtitle').textContent;
        const avatar = card.querySelector('.avatar').src || 'https://placehold.net/avatar.svg';
        const system = card.dataset.category || 'Todos';
        let systemContent = `
            <p>Detalhes do personagem aqui. Esta é uma visualização básica.</p>
            <p>Pode incluir atributos, habilidades, inventário, etc.</p>
        `;

        if (system === 'DND5E') {
            systemContent = `
            <div class="sheet" data-editing="false">

            <!-- ── Edit Toggle ──────────────────────────────── -->
            <button class="sheet-edit-toggle" id="sheetEditToggle" type="button" aria-label="Modo de edição">
                <span class="material-symbols-outlined edit-icon">edit</span>
            </button>

            <!-- ══════════════════════════════════════════════
                HEADER: Name / Class / Level / XP / Actions
                ══════════════════════════════════════════════ -->
            <header class="sheet-header">

                <div class="sheet-identity">
                <div>
                    <span class="sheet-name display-val">${name}</span>
                    <input class="edit-inp sheet-name-inp" type="text" value="Hobbs" placeholder="Nome">
                </div>
                <div class="sheet-subline">
                    <span class="display-val">Clérigo</span>
                    <input class="edit-inp subline-class" type="text" value="Clérigo" placeholder="Classe">
                    <span class="display-val">15</span>
                    <input class="edit-inp subline-level" type="number" value="15" min="1" max="20">
                </div>
                </div>

                <div class="sheet-header-right">
                <div class="rest-actions">
                    <button class="rest-btn" type="button" title="Descanso Curto">
                    <span class="material-symbols-outlined">bedtime</span>
                    <span class="rest-lbl">Curto</span>
                    </button>
                    <button class="rest-btn" type="button" title="Descanso Longo">
                    <span class="material-symbols-outlined">dark_mode</span>
                    <span class="rest-lbl">Longo</span>
                    </button>
                    <button class="rest-btn rest-levelup" type="button" title="Subir de Nível">
                    <span class="material-symbols-outlined">grade</span>
                    <span class="rest-lbl">Nível</span>
                    </button>
                </div>

                <div class="level-orb">
                    <span class="display-val">15</span>
                    <input class="edit-inp level-inp" type="number" value="15" min="1" max="20">
                </div>

                <div class="xp-block">
                    <div class="xp-track">
                    <div class="xp-fill" style="--pct: 93.8%"></div>
                    </div>
                    <div class="xp-label">
                    <span class="display-val">183.000</span>
                    <input class="edit-inp xp-inp" type="number" value="183000">
                    <span>/ 195.000</span>
                    </div>
                </div>
                </div>

            </header>

            <!-- ══════════════════════════════════════════════
                ABILITY SCORES: Shield-shaped badges
                ══════════════════════════════════════════════ -->
            <div class="ability-row">

                <div class="ability-badge">
                <span class="ab-name">FOR</span>
                <span class="ab-mod display-val">+1</span>
                <input class="edit-inp ab-mod-inp" type="text" value="+1">
                <span class="ab-score display-val">13</span>
                <input class="edit-inp ab-score-inp" type="number" value="13">
                </div>

                <div class="ability-badge">
                <span class="ab-name">DES</span>
                <span class="ab-mod display-val">+1</span>
                <input class="edit-inp ab-mod-inp" type="text" value="+1">
                <span class="ab-score display-val">12</span>
                <input class="edit-inp ab-score-inp" type="number" value="12">
                </div>

                <div class="ability-badge">
                <span class="ab-name">CON</span>
                <span class="ab-mod display-val">+5</span>
                <input class="edit-inp ab-mod-inp" type="text" value="+5">
                <span class="ab-score display-val">20</span>
                <input class="edit-inp ab-score-inp" type="number" value="20">
                </div>

                <div class="ability-badge">
                <span class="ab-name">INT</span>
                <span class="ab-mod display-val">+1</span>
                <input class="edit-inp ab-mod-inp" type="text" value="+1">
                <span class="ab-score display-val">13</span>
                <input class="edit-inp ab-score-inp" type="number" value="13">
                </div>

                <div class="ability-badge">
                <span class="ab-name">SAB</span>
                <span class="ab-mod display-val">+5</span>
                <input class="edit-inp ab-mod-inp" type="text" value="+5">
                <span class="ab-score display-val">20</span>
                <input class="edit-inp ab-score-inp" type="number" value="20">
                </div>

                <div class="ability-badge">
                <span class="ab-name">CAR</span>
                <span class="ab-mod display-val">+1</span>
                <input class="edit-inp ab-mod-inp" type="text" value="+1">
                <span class="ab-score display-val">13</span>
                <input class="edit-inp ab-score-inp" type="number" value="13">
                </div>

            </div>

            <!-- ══════════════════════════════════════════════
                SHEET BODY: 4-column grid
                [Left Portrait] [Skills] [Traits] [Tabs]
                ══════════════════════════════════════════════ -->
            <div class="sheet-body">

                <!-- ── LEFT COLUMN ────────────────────────────── -->
                <aside class="col-left">

                <!-- Portrait -->
                <div class="portrait-wrap">
                    <div class="portrait-frame">
                    <img class="portrait-img" src="${avatar}" alt="Retrato do personagem">
                    </div>
                </div>

                <!-- Exhaustion pips (6 levels) -->
                <div class="exhaustion-track">
                    <span class="ex-label">Exaustão</span>
                    <div class="ex-pips">
                    <span class="ex-pip"></span>
                    <span class="ex-pip"></span>
                    <span class="ex-pip"></span>
                    <span class="ex-pip"></span>
                    <span class="ex-pip"></span>
                    <span class="ex-pip"></span>
                    </div>
                </div>

                <!-- Initiative | AC | Proficiency -->
                <div class="combat-stats-row">
                    <div class="stat-chip">
                    <span class="stat-chip-val display-val">+1</span>
                    <input class="edit-inp stat-inp" type="text" value="+1">
                    <span class="stat-chip-lbl">Iniciativa</span>
                    </div>

                    <div class="ac-badge">
                    <span class="ac-val display-val">18</span>
                    <input class="edit-inp ac-inp" type="number" value="18">
                    <span class="ac-lbl">CA</span>
                    </div>

                    <div class="stat-chip">
                    <span class="stat-chip-val display-val">+5</span>
                    <input class="edit-inp stat-inp" type="text" value="+5">
                    <span class="stat-chip-lbl">Proficiência</span>
                    </div>
                </div>

                <!-- Walk speed -->
                <div class="speed-row">
                    <span class="speed-val display-val">30</span>
                    <input class="edit-inp speed-inp" type="number" value="30">
                    <span class="speed-lbl">ft. Caminhada</span>
                </div>

                <!-- Hit Points -->
                <div class="resource-block">
                    <span class="resource-label">Pontos de Vida</span>
                    <div class="hp-bar-wrap">
                    <div class="hp-bar-fill" style="--pct: 57.5%"></div>
                    <span class="hp-text">
                        <span class="display-val">88</span>
                        <input class="edit-inp hp-curr-inp" type="number" value="88">
                        /
                        <span class="display-val">153</span>
                        <input class="edit-inp hp-max-inp" type="number" value="153">
                    </span>
                    </div>
                    <div class="tmp-row">
                    <span class="tmp-lbl">TMP</span>
                    <div class="tmp-track">
                        <div class="tmp-fill" style="--pct: 0%"></div>
                    </div>
                    <span class="tmp-val display-val">—</span>
                    <input class="edit-inp tmp-inp" type="number" value="0" placeholder="0">
                    </div>
                </div>

                <!-- Hit Dice -->
                <div class="resource-block">
                    <div class="hd-bar-wrap">
                    <div class="hd-bar-fill" style="--pct: 100%"></div>
                    <span class="hd-text">
                        <span class="display-val">15</span>
                        <input class="edit-inp hd-curr-inp" type="number" value="15">
                        / 15 (d8)
                    </span>
                    </div>
                    <span class="resource-label">Dado de Vida</span>
                </div>

                <!-- Death Saves trigger -->
                <button class="death-saves-row" type="button" title="Testes contra a Morte">
                    <span class="material-symbols-outlined">skull</span>
                    <span class="death-saves-lbl">Testes Contra a Morte</span>
                </button>

                </aside>

                <!-- ── MIDDLE COLUMN: Skills ───────────────────── -->
                <section class="col-mid">

                <div class="panel-box">
                    <h3 class="panel-title">⚔ Perícias</h3>
                    <div class="skill-list">

                    <div class="skill-row">
                        <span class="prof-dot"></span>
                        <span class="skill-attr">DES</span>
                        <span class="skill-name">Acrobacia</span>
                        <span class="skill-mod">+1</span>
                        <span class="skill-passive">11</span>
                    </div>

                    <div class="skill-row">
                        <span class="prof-dot"></span>
                        <span class="skill-attr">SAB</span>
                        <span class="skill-name">Adestrar Animais</span>
                        <span class="skill-mod">+5</span>
                        <span class="skill-passive">15</span>
                    </div>

                    <div class="skill-row">
                        <span class="prof-dot"></span>
                        <span class="skill-attr">INT</span>
                        <span class="skill-name">Arcanismo</span>
                        <span class="skill-mod">+1</span>
                        <span class="skill-passive">11</span>
                    </div>

                    <div class="skill-row">
                        <span class="prof-dot"></span>
                        <span class="skill-attr">FOR</span>
                        <span class="skill-name">Atletismo</span>
                        <span class="skill-mod">+1</span>
                        <span class="skill-passive">11</span>
                    </div>

                    <div class="skill-row proficient">
                        <span class="prof-dot proficient"></span>
                        <span class="skill-attr">CAR</span>
                        <span class="skill-name">Enganação</span>
                        <span class="skill-mod">+6</span>
                        <span class="skill-passive">16</span>
                    </div>

                    <div class="skill-row proficient">
                        <span class="prof-dot proficient"></span>
                        <span class="skill-attr">INT</span>
                        <span class="skill-name">História</span>
                        <span class="skill-mod">+6</span>
                        <span class="skill-passive">16</span>
                    </div>

                    <div class="skill-row proficient">
                        <span class="prof-dot proficient"></span>
                        <span class="skill-attr">SAB</span>
                        <span class="skill-name">Intuição</span>
                        <span class="skill-mod">+10</span>
                        <span class="skill-passive">20</span>
                    </div>

                    <div class="skill-row">
                        <span class="prof-dot"></span>
                        <span class="skill-attr">CAR</span>
                        <span class="skill-name">Intimidação</span>
                        <span class="skill-mod">+1</span>
                        <span class="skill-passive">11</span>
                    </div>

                    <div class="skill-row">
                        <span class="prof-dot"></span>
                        <span class="skill-attr">INT</span>
                        <span class="skill-name">Investigação</span>
                        <span class="skill-mod">+1</span>
                        <span class="skill-passive">11</span>
                    </div>

                    <div class="skill-row proficient">
                        <span class="prof-dot proficient"></span>
                        <span class="skill-attr">SAB</span>
                        <span class="skill-name">Medicina</span>
                        <span class="skill-mod">+10</span>
                        <span class="skill-passive">20</span>
                    </div>

                    <div class="skill-row">
                        <span class="prof-dot"></span>
                        <span class="skill-attr">INT</span>
                        <span class="skill-name">Natureza</span>
                        <span class="skill-mod">+1</span>
                        <span class="skill-passive">11</span>
                    </div>

                    <div class="skill-row expertise">
                        <span class="prof-dot expertise"></span>
                        <span class="skill-attr">SAB</span>
                        <span class="skill-name">Percepção</span>
                        <span class="skill-mod">+15</span>
                        <span class="skill-passive">25</span>
                    </div>

                    <div class="skill-row">
                        <span class="prof-dot"></span>
                        <span class="skill-attr">CAR</span>
                        <span class="skill-name">Atuação</span>
                        <span class="skill-mod">+1</span>
                        <span class="skill-passive">11</span>
                    </div>

                    <div class="skill-row proficient">
                        <span class="prof-dot proficient"></span>
                        <span class="skill-attr">CAR</span>
                        <span class="skill-name">Persuasão</span>
                        <span class="skill-mod">+6</span>
                        <span class="skill-passive">16</span>
                    </div>

                    <div class="skill-row proficient">
                        <span class="prof-dot proficient"></span>
                        <span class="skill-attr">INT</span>
                        <span class="skill-name">Religião</span>
                        <span class="skill-mod">+6</span>
                        <span class="skill-passive">16</span>
                    </div>

                    <div class="skill-row">
                        <span class="prof-dot"></span>
                        <span class="skill-attr">DES</span>
                        <span class="skill-name">Prestidigitação</span>
                        <span class="skill-mod">+1</span>
                        <span class="skill-passive">11</span>
                    </div>

                    <div class="skill-row">
                        <span class="prof-dot"></span>
                        <span class="skill-attr">DES</span>
                        <span class="skill-name">Furtividade</span>
                        <span class="skill-mod">+1</span>
                        <span class="skill-passive">11</span>
                    </div>

                    <div class="skill-row">
                        <span class="prof-dot"></span>
                        <span class="skill-attr">SAB</span>
                        <span class="skill-name">Sobrevivência</span>
                        <span class="skill-mod">+5</span>
                        <span class="skill-passive">15</span>
                    </div>

                    </div>
                </div>

                <!-- Tools -->
                <div class="panel-box">
                    <h3 class="panel-title">🔧 Ferramentas</h3>
                    <div class="skill-list">
                    <div class="skill-row proficient">
                        <span class="prof-dot proficient"></span>
                        <span class="skill-attr">INT</span>
                        <span class="skill-name">Ferramentas de Ladrão</span>
                        <span class="skill-mod">+6</span>
                        <span class="skill-passive"></span>
                    </div>
                    </div>
                </div>

                </section>

                <!-- ── RIGHT COLUMN: Traits ────────────────────── -->
                <section class="col-right">

                <!-- Saving Throws -->
                <div class="panel-box">
                    <h3 class="panel-title">🛡 Testes de Resistência</h3>
                    <div class="saves-grid">
                    <div class="save-row">
                        <span class="prof-dot"></span>
                        <span class="save-attr">FOR</span>
                        <span class="save-mod">+1</span>
                    </div>
                    <div class="save-row">
                        <span class="prof-dot"></span>
                        <span class="save-attr">DES</span>
                        <span class="save-mod">+1</span>
                    </div>
                    <div class="save-row">
                        <span class="prof-dot"></span>
                        <span class="save-attr">CON</span>
                        <span class="save-mod">+5</span>
                    </div>
                    <div class="save-row">
                        <span class="prof-dot"></span>
                        <span class="save-attr">INT</span>
                        <span class="save-mod">+1</span>
                    </div>
                    <div class="save-row proficient">
                        <span class="prof-dot proficient"></span>
                        <span class="save-attr">SAB</span>
                        <span class="save-mod">+10</span>
                    </div>
                    <div class="save-row proficient">
                        <span class="prof-dot proficient"></span>
                        <span class="save-attr">CAR</span>
                        <span class="save-mod">+6</span>
                    </div>
                    </div>
                </div>

                <!-- Race / Type / Background chips -->
                <div class="trait-chips">
                    <div class="trait-chip">
                    <div class="trait-icon-wrap">👤</div>
                    <div class="trait-chip-info">
                        <span class="trait-chip-name">Humanoide</span>
                        <span class="trait-chip-sub">Elfo</span>
                    </div>
                    </div>
                    <div class="trait-chip">
                    <div class="trait-icon-wrap">🍃</div>
                    <div class="trait-chip-info">
                        <span class="trait-chip-name">Meio-Elfo</span>
                        <span class="trait-chip-sub">Médio</span>
                    </div>
                    </div>
                    <div class="trait-chip">
                    <div class="trait-icon-wrap">⚜️</div>
                    <div class="trait-chip-info">
                        <span class="trait-chip-name">Acólito</span>
                        <span class="trait-chip-sub">Antecedente</span>
                    </div>
                    </div>
                </div>

                <!-- Senses -->
                <div class="traits-section">
                    <h4 class="traits-title">👁 Sentidos</h4>
                    <div class="pill-group">
                    <span class="pill">Visão no Escuro | 60 ft.</span>
                    </div>
                </div>

                <!-- Resistances -->
                <div class="traits-section">
                    <h4 class="traits-title">🔥 Resistências</h4>
                    <div class="pill-group">
                    <span class="pill pill-green">Fogo</span>
                    <span class="pill pill-green">Veneno</span>
                    </div>
                </div>

                <!-- Immunities -->
                <div class="traits-section">
                    <h4 class="traits-title">🛡 Imunidades</h4>
                    <div class="pill-group">
                    <span class="pill pill-green">Doença</span>
                    </div>
                </div>

                <!-- Armor -->
                <div class="traits-section">
                    <h4 class="traits-title">🪖 Armadura</h4>
                    <div class="pill-group">
                    <span class="pill">Leve</span>
                    <span class="pill">Média</span>
                    <span class="pill">Escudos</span>
                    </div>
                </div>

                <!-- Weapons -->
                <div class="traits-section">
                    <h4 class="traits-title">⚔ Armas</h4>
                    <div class="pill-group">
                    <span class="pill">Simples</span>
                    </div>
                </div>

                <!-- Languages -->
                <div class="traits-section">
                    <h4 class="traits-title">🗣 Idiomas</h4>
                    <div class="pill-group">
                    <span class="pill">Comum</span>
                    <span class="pill">Élfico</span>
                    <span class="pill">Gnômico</span>
                    <span class="pill">Dracônico</span>
                    <span class="pill">Submundo</span>
                    </div>
                </div>

                </section>

                <!-- ── SIDE TAB NAVIGATION ─────────────────────── -->
                <nav class="sheet-tabs" aria-label="Seções da ficha">
                <button class="sheet-tab active" type="button" title="Visão Geral">
                    <span class="material-symbols-outlined">person</span>
                </button>
                <button class="sheet-tab" type="button" title="Inventário">
                    <span class="material-symbols-outlined">backpack</span>
                </button>
                <button class="sheet-tab" type="button" title="Características">
                    <span class="material-symbols-outlined">auto_stories</span>
                </button>
                <button class="sheet-tab" type="button" title="Magias">
                    <span class="material-symbols-outlined">electric_bolt</span>
                </button>
                <button class="sheet-tab" type="button" title="Lore">
                    <span class="material-symbols-outlined">menu_book</span>
                </button>
                </nav>

            </div><!-- /sheet-body -->

            </div><!-- /sheet -->
            `;
        } else if (system === 'TFT') {
            systemContent = `
                <p>Visualização de The Fifth Trumpet.</p>
                <ul>
                  ${name}
                </ul>
            `;
        }

        contentPane.innerHTML = `
            <div class="character-detail">
                <div class="detail-content">
                    ${systemContent}
                </div>
            </div>
        `;

        if (system === 'DND5E') initDndSheet();
    }


    function createCharacterCard(name, category) {
        const card = document.createElement('article');
        card.className = 'character-card';
        card.dataset.category = category;
        let subtitle = '';
        if (category === 'DND5E') {
            subtitle = 'Sem classe';
        } else if (category === 'TFT') {
            subtitle = ' ';
        }

        card.innerHTML = `
            <img class="avatar" src="https://placehold.net/avatar.svg" alt="Avatar">
            <div class="character-info">
                <div class="name-row">
                    <h2>${name}</h2>
                    <button class="card-action" type="button" aria-label="Opções"><span class="material-symbols-outlined">more_vert</span></button>
                </div>
                <p class="subtitle">${subtitle}</p>
            </div>
        `;

        card.addEventListener('click', () => {
            selectCharacter(card);
        });

        characterCards.unshift(card);

        const firstRealCard = sidebarMiddle.querySelector('.character-card:not(.add-character-card)');
        if (firstRealCard) {
            sidebarMiddle.insertBefore(card, firstRealCard);
        } else {
            sidebarMiddle.append(card);
        }

        return card;
    }

    function showAddCharacterForm() {
        if (!addCharacterCard) return;
        addCharacterCard.classList.remove('hidden');
        if (newCharacterNameInput) {
            newCharacterNameInput.value = '';
            newCharacterNameInput.focus();
        }
        if (newCharacterSystemSelect) {
            newCharacterSystemSelect.value = 'DND5E';
        }
    }

    function hideAddCharacterForm() {
        if (!addCharacterCard) return;
        addCharacterCard.classList.add('hidden');
    }

    function filterCardsByCategory(category) {
        currentCategory = category;
        sidebarMiddle.querySelectorAll('.character-card:not(.add-character-card)').forEach(card => {
            const cardCategory = card.dataset.category || 'Todos';
            if (category === 'Todos' || cardCategory === category) {
                card.style.display = 'grid';
            } else {
                card.style.display = 'none';
            }
        });

        // Atualizar botão ativo
        tabButtons.forEach(btn => {
            btn.classList.toggle('selected', btn.textContent === category);
        });
    }

    function updateCategoryTabs() {
        const categoriesWithCards = new Set();
        sidebarMiddle.querySelectorAll('.character-card:not(.add-character-card)').forEach(card => {
            categoriesWithCards.add(card.dataset.category || 'Todos');
        });

        tabButtons.forEach(button => {
            const category = button.textContent;
            if (category === 'Todos') {
                button.style.display = '';
            } else {
                button.style.display = categoriesWithCards.has(category) ? '' : 'none';
            }
        });
    }


    function selectCharacter(card) {
        // Remover seleção anterior
        sidebarMiddle.querySelectorAll('.character-card:not(.add-character-card)').forEach(c => c.classList.remove('selected'));
        selectedCharacter = card;
        card.classList.add('selected');

        // Atualizar content-pane com detalhes do personagem usando o sistema do card
        renderCharacterDetail(card);
    }

    async function logout() {
        await fetch('/logout', { method: 'POST' });
        window.location.href = '/';
    }

    // Event listeners para tabs de categoria
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterCardsByCategory(button.textContent);
        });
    });

    // Event listeners para cards de personagem
    characterCards.forEach(card => {
        card.addEventListener('click', () => {
            selectCharacter(card);
        });
    });

    // Event listeners para navegação inferior
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const label = item.getAttribute('aria-label');
            if (label === 'Logout') {
                logout();
            } else if (label === 'Menu') {
                toggleSidebar();
            }
        });
    });

    // Event listener para botão de adicionar personagem
    const fabButton = document.querySelector('.fab');
    if (fabButton) {
        fabButton.addEventListener('click', () => {
            showAddCharacterForm();
        });
    }

if (saveNewCharacterButton) {
    saveNewCharacterButton.addEventListener('click', async () => {
        const name = newCharacterNameInput?.value.trim();
        const category = newCharacterSystemSelect?.value || 'DND5E';

        if (!name) {
            newCharacterNameInput?.focus();
            return;
        }

        try {
            const response = await fetch('/personagem/novo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ nome: name, sistema: category })
            });

            if (response.ok) {
                hideAddCharacterForm();
                const newCard = createCharacterCard(name, category);
                updateCategoryTabs();
                selectCharacter(newCard);
            } else {
                // exibit erro dps
            }
        } catch (err) {
            console.error('Erro ao criar personagem:', err);
        }
    });
}
    if (cancelNewCharacterButton) {
        cancelNewCharacterButton.addEventListener('click', () => {
            hideAddCharacterForm();
        });
    }

    if (menuFab) {
        menuFab.addEventListener('click', () => {
            if (sidebarHidden) {
                toggleSidebar();
            }
        });
    }

    // Inicializar categorias visíveis
    updateCategoryTabs();

    
});