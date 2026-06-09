// ═══════════════════════════════════════════════════
//  sheet.js — Lógica da ficha DND5E
// ═══════════════════════════════════════════════════

function initDndSheet() {
    const sheet    = document.querySelector('.sheet');
    const toggle   = document.getElementById('sheetEditToggle');
    if (!sheet || !toggle) return;

    const personagemId = sheet.dataset.personagemId;

    // ── Mapeamento perícia → atributo ──────────────
    const SKILL_ATTR = {
        'Atletismo':        'forca',
        'Acrobacia':        'destreza',
        'Furtividade':      'destreza',
        'Prestidigitação':  'destreza',
        'Arcanismo':        'inteligencia',
        'História':         'inteligencia',
        'Investigação':     'inteligencia',
        'Natureza':         'inteligencia',
        'Religião':         'inteligencia',
        'Adestrar Animais': 'sabedoria',
        'Intuição':         'sabedoria',
        'Medicina':         'sabedoria',
        'Percepção':        'sabedoria',
        'Sobrevivência':    'sabedoria',
        'Atuação':          'carisma',
        'Enganação':        'carisma',
        'Intimidação':      'carisma',
        'Persuasão':        'carisma',
    };

    // ── Bônus de proficiência por nível ───────────
    function calcProfBonus(nivel) {
        if (nivel <= 4)  return 2;
        if (nivel <= 8)  return 3;
        if (nivel <= 12) return 4;
        if (nivel <= 16) return 5;
        return 6;
    }

    function calcMod(score) {
        return Math.floor((score - 10) / 2);
    }

    function formatMod(mod) {
        return mod >= 0 ? `+${mod}` : `${mod}`;
    }

    function getScores() {
        const scores = {};
        sheet.querySelectorAll('.ab-score-inp').forEach(inp => {
            scores[inp.dataset.attr] = parseInt(inp.value) || 10;
        });
        return scores;
    }

    function getNivel() {
        const inp = sheet.querySelector('.level-inp');
        return inp ? (parseInt(inp.value) || 1) : 1;
    }

    // ── Dirty tracking ────────────────────────────
    const dirty = {
        atributos:  false,
        combate:    false,
        vida:       false,
        pericias:   false,
        saves:      false,
        identidade: false,
    };

    function markDirty(section) { dirty[section] = true; }
    function resetDirty() { Object.keys(dirty).forEach(k => dirty[k] = false); }

    // ══════════════════════════════════════════════
    //  RECÁLCULO EM TEMPO REAL
    // ══════════════════════════════════════════════

    function recalcAll() {
        const scores    = getScores();
        const nivel     = getNivel();
        const profBonus = calcProfBonus(nivel);

        sheet.querySelectorAll('.ability-badge').forEach(badge => {
            const attr  = badge.dataset.attr;
            const score = scores[attr] ?? 10;
            const mod   = calcMod(score);
            const modEl = badge.querySelector('.ab-mod');
            if (modEl) modEl.textContent = formatMod(mod);
            const scoreEl = badge.querySelector('.ab-score');
            if (scoreEl) scoreEl.textContent = score;
        });

        const profEl = document.getElementById('profBonus');
        if (profEl) profEl.textContent = formatMod(profBonus);

        const iniciativaEl = sheet.querySelector('.combat-stats-row .stat-chip:first-child .stat-chip-val');
        if (iniciativaEl) iniciativaEl.textContent = formatMod(calcMod(scores['destreza'] ?? 10));

        recalcSkills(scores, profBonus);
        recalcSaves(scores, profBonus);
    }

    function recalcSkills(scores, profBonus) {
        sheet.querySelectorAll('.skill-row').forEach(row => {
            const skillName = row.dataset.skill;
            const attr      = row.dataset.attr || SKILL_ATTR[skillName];
            const prof      = row.dataset.prof || 'none';
            const score     = scores[attr] ?? 10;
            const base      = calcMod(score);

            let total = base;
            if (prof === 'proficient') total += profBonus;
            if (prof === 'expertise')  total += profBonus * 2;

            const modEl     = row.querySelector('.skill-mod');
            const passiveEl = row.querySelector('.skill-passive');
            if (modEl)     modEl.textContent    = formatMod(total);
            if (passiveEl) passiveEl.textContent = 10 + total;
        });
    }

    function recalcSaves(scores, profBonus) {
        sheet.querySelectorAll('.save-row').forEach(row => {
            const attr  = row.dataset.attr;
            const prof  = row.dataset.prof === 'true';
            const score = scores[attr] ?? 10;
            const total = calcMod(score) + (prof ? profBonus : 0);
            const modEl = row.querySelector('.save-mod');
            if (modEl) modEl.textContent = formatMod(total);
        });
    }

    // ══════════════════════════════════════════════
    //  LISTENERS DE INPUT
    // ══════════════════════════════════════════════

    sheet.querySelectorAll('.ab-score-inp').forEach(inp => {
        inp.addEventListener('input', () => { markDirty('atributos'); recalcAll(); });
    });

    const levelInp = sheet.querySelector('.level-inp');
    if (levelInp) {
        levelInp.addEventListener('input', () => {
            markDirty('identidade');
            recalcAll();
            const orbVal = sheet.querySelector('.level-orb .display-val');
            if (orbVal) orbVal.textContent = levelInp.value;
        });
    }

    sheet.querySelector('.ac-inp')?.addEventListener('input',    () => markDirty('combate'));
    sheet.querySelector('.speed-inp')?.addEventListener('input', () => markDirty('combate'));

    sheet.querySelector('.hp-curr-inp')?.addEventListener('input', () => { markDirty('vida'); updateHPBar(); });
    sheet.querySelector('.hp-max-inp')?.addEventListener('input',  () => { markDirty('vida'); updateHPBar(); });
    sheet.querySelector('.tmp-inp')?.addEventListener('input',     () => { markDirty('vida'); updateTmpBar(); });

    function updateHPBar() {
        const curr = parseInt(sheet.querySelector('.hp-curr-inp')?.value) || 0;
        const max  = parseInt(sheet.querySelector('.hp-max-inp')?.value)  || 1;
        const fill = sheet.querySelector('.hp-bar-fill');
        if (fill) fill.style.setProperty('--pct', `${Math.min(100, (curr / max) * 100)}%`);
    }

    function updateTmpBar() {
        const tmp  = parseInt(sheet.querySelector('.tmp-inp')?.value) || 0;
        const max  = parseInt(sheet.querySelector('.hp-max-inp')?.value) || 1;
        const fill = sheet.querySelector('.tmp-fill');
        if (fill) fill.style.setProperty('--pct', `${Math.min(100, (tmp / max) * 100)}%`);
    }

    sheet.querySelector('.sheet-name-inp')?.addEventListener('input', () => markDirty('identidade'));
    sheet.querySelectorAll('.trait-select').forEach(sel => {
        sel.addEventListener('change', () => markDirty('identidade'));
    });

    // ══════════════════════════════════════════════
    //  HELPER: ciclo de pip none → proficient → expertise → none
    //  Compartilhado entre perícias e ferramentas
    // ══════════════════════════════════════════════

    function attachProfCycle(row, dirtySection) {
        const dot = row.querySelector('.prof-dot');
        if (!dot) return;

        dot.style.cursor = 'pointer';
        dot.addEventListener('click', () => {
            if (!isEditing()) return;

            const current = row.dataset.prof || 'none';
            const next = current === 'none'       ? 'proficient'
                       : current === 'proficient' ? 'expertise'
                       : 'none';

            row.dataset.prof = next;
            dot.className = 'prof-dot' + (next !== 'none' ? ` ${next}` : '');
            row.classList.remove('proficient', 'expertise');
            if (next !== 'none') row.classList.add(next);

            markDirty(dirtySection);
            recalcAll();
        });
    }

    // ── Pips de perícias ──────────────────────────
    sheet.querySelectorAll('.skill-row:not(.tool-entry)').forEach(row => {
        attachProfCycle(row, 'pericias');
    });

    // ── Pips de saves ─────────────────────────────
    // Saves usam toggle binário (não têm "expertise"), então mantêm lógica própria
    sheet.querySelectorAll('.save-row').forEach(row => {
        const dot = row.querySelector('.prof-dot');
        if (!dot) return;
        dot.style.cursor = 'pointer';
        dot.addEventListener('click', () => {
            if (!isEditing()) return;
            const current = row.dataset.prof === 'true';
            row.dataset.prof = (!current).toString();
            dot.className = 'prof-dot' + (!current ? ' proficient' : '');
            row.classList.toggle('proficient', !current);
            markDirty('saves');
            recalcAll();
        });
    });

    // ══════════════════════════════════════════════
    //  PILLS (sentidos, resistências, etc.)
    // ══════════════════════════════════════════════

    function setupPillList(listId) {
        const list   = document.getElementById(listId);
        const addRow = sheet.querySelector(`.trait-add-row[data-list="${listId}"]`);
        if (!list || !addRow) return;

        const addInp = addRow.querySelector('.trait-add-inp');
        const addBtn = addRow.querySelector('.trait-add-btn');

        addBtn?.addEventListener('click', () => {
            const val = addInp?.value.trim();
            if (!val) return;
            addPill(list, val);
            if (addInp) addInp.value = '';
            markDirty('identidade');
        });

        addInp?.addEventListener('keydown', e => { if (e.key === 'Enter') addBtn?.click(); });
    }

    function addPill(list, text) {
        const empty = list.querySelector('.pill-empty');
        if (empty) empty.remove();

        const pill = document.createElement('span');
        pill.className = 'pill pill-removable';
        pill.innerHTML = `${text} <span class="pill-remove" style="cursor:pointer;margin-left:4px;opacity:0.7;">×</span>`;

        pill.querySelector('.pill-remove').addEventListener('click', () => {
            pill.remove();
            if (list.querySelectorAll('.pill').length === 0) {
                const empty = document.createElement('span');
                empty.className = 'pill-empty';
                empty.style.cssText = 'font-size:0.7rem; color: rgba(240,232,224,0.35);';
                empty.textContent = 'Nenhum';
                list.appendChild(empty);
            }
            markDirty('identidade');
        });

        list.appendChild(pill);
    }

    ['sensesList', 'resistancesList', 'immunitiesList', 'armorList', 'weaponsList', 'languagesList'].forEach(setupPillList);

    // ══════════════════════════════════════════════
    //  FERRAMENTAS
    //  Comportamento idêntico às perícias:
    //  pip clicável none → proficient → expertise → none
    //  Diferença: nome é customizado (não é enum)
    // ══════════════════════════════════════════════

    const toolList   = document.getElementById('toolList');
    const toolAddRow = sheet.querySelector('.tool-add-row');
    const toolAddInp = sheet.querySelector('.tool-add-inp');
    const toolAddBtn = sheet.querySelector('.tool-add-btn');

    toolAddBtn?.addEventListener('click', () => {
        const val = toolAddInp?.value.trim();
        if (!val) return;
        addTool(val);
        if (toolAddInp) toolAddInp.value = '';
        markDirty('pericias');
    });

    toolAddInp?.addEventListener('keydown', e => { if (e.key === 'Enter') toolAddBtn?.click(); });

    /**
     * Cria e insere uma linha de ferramenta na lista.
     * @param {string} name       - Nome da ferramenta
     * @param {string} profState  - Estado inicial: 'none' | 'proficient' | 'expertise'
     */
    function addTool(name, profState = 'none') {
        const empty = toolList?.querySelector('.tool-empty-msg');
        if (empty) empty.remove();

        const row = document.createElement('div');
        row.className = 'skill-row tool-entry';
        row.dataset.prof = profState;
        if (profState !== 'none') row.classList.add(profState);

        row.innerHTML = `
            <span class="prof-dot${profState !== 'none' ? ' ' + profState : ''}"></span>
            <span class="skill-attr">—</span>
            <span class="skill-name">${name}</span>
            <span class="skill-mod"></span>
            <button class="tool-remove" type="button"
                style="background:none;border:none;color:rgba(240,232,224,0.4);cursor:pointer;font-size:0.9rem;padding:0;">×</button>
        `;

        // Reutiliza o mesmo ciclo de pip das perícias
        attachProfCycle(row, 'pericias');

        row.querySelector('.tool-remove').addEventListener('click', () => {
            row.remove();
            if (toolList && toolList.querySelectorAll('.tool-entry').length === 0) {
                const msg = document.createElement('div');
                msg.className = 'tool-empty-msg';
                msg.style.cssText = 'padding:10px 12px;font-size:0.78rem;color:rgba(240,232,224,0.35);';
                msg.textContent = 'Nenhuma ferramenta';
                toolList.appendChild(msg);
            }
            markDirty('pericias');
        });

        toolList?.appendChild(row);
    }

    // ── Botões de descanso e level up ─────────────
    sheet.querySelector('.rest-btn[title="Descanso Curto"]')
         ?.addEventListener('click', () => post(`/personagem/${personagemId}/descansocurto`, {}));
    sheet.querySelector('.rest-btn[title="Descanso Longo"]')
         ?.addEventListener('click', () => post(`/personagem/${personagemId}/descansolongo`, {}));
    sheet.querySelector('.rest-btn[title="Subir de Nível"]')
         ?.addEventListener('click', () => post(`/personagem/${personagemId}/levelup`, {}));

    // ══════════════════════════════════════════════
    //  TOGGLE MODO DE EDIÇÃO
    // ══════════════════════════════════════════════

    function isEditing() { return sheet.dataset.editing === 'true'; }

    function showEditOnlyElements(show) {
        sheet.querySelectorAll('.trait-add-row').forEach(el => {
            el.style.display = show ? 'flex' : 'none';
        });
        if (toolAddRow) toolAddRow.style.display = show ? 'flex' : 'none';
    }

    toggle.addEventListener('click', async () => {
        const editing = isEditing();
        if (editing) {
            await saveChanges();
            updateDisplayValues();
            recalcAll();
            showEditOnlyElements(false);
            sheet.dataset.editing = 'false';
            toggle.querySelector('.edit-icon').textContent = 'edit';
            resetDirty();
        } else {
            sheet.dataset.editing = 'true';
            toggle.querySelector('.edit-icon').textContent = 'edit_off';
            showEditOnlyElements(true);
        }
    });

    function updateDisplayValues() {
        const scores = getScores();

        const nomeInp = sheet.querySelector('.sheet-name-inp');
        const nomeVal = sheet.querySelector('.sheet-name');
        if (nomeInp && nomeVal) nomeVal.textContent = nomeInp.value;

        const levelVal = sheet.querySelector('.level-orb .display-val');
        if (levelVal && levelInp) levelVal.textContent = levelInp.value;

        const acInp = sheet.querySelector('.ac-inp');
        const acVal = sheet.querySelector('.ac-val');
        if (acInp && acVal) acVal.textContent = acInp.value;

        const speedInp = sheet.querySelector('.speed-inp');
        const speedVal = sheet.querySelector('.speed-val');
        if (speedInp && speedVal) speedVal.textContent = speedInp.value;

        const hpCurrInp = sheet.querySelector('.hp-curr-inp');
        const hpMaxInp  = sheet.querySelector('.hp-max-inp');
        const tmpInp    = sheet.querySelector('.tmp-inp');
        sheet.querySelectorAll('.hp-text .display-val').forEach((el, i) => {
            if (i === 0 && hpCurrInp) el.textContent = hpCurrInp.value;
            if (i === 1 && hpMaxInp)  el.textContent = hpMaxInp.value;
        });
        const tmpVal = sheet.querySelector('.tmp-val');
        if (tmpVal && tmpInp) tmpVal.textContent = parseInt(tmpInp.value) > 0 ? tmpInp.value : '—';

        sheet.querySelectorAll('.trait-select').forEach(sel => {
            const display = sel.closest('.trait-chip-info')?.querySelector('.display-val');
            if (display) display.textContent = sel.value || '—';
        });

        sheet.querySelectorAll('.ability-badge').forEach(badge => {
            const scoreEl = badge.querySelector('.ab-score');
            if (scoreEl) scoreEl.textContent = scores[badge.dataset.attr] ?? 10;
        });
    }

    // ══════════════════════════════════════════════
    //  SAVE GRANULARIZADO
    // ══════════════════════════════════════════════

    async function saveChanges() {
        const saves = [];
        if (dirty.atributos)  saves.push(saveAtributos());
        if (dirty.combate)    saves.push(saveCombate());
        if (dirty.vida)       saves.push(saveVida());
        if (dirty.pericias)   saves.push(savePericias());
        if (dirty.saves)      saves.push(saveSaves());
        if (dirty.identidade) saves.push(saveIdentidade());
        await Promise.all(saves);
    }

    async function saveAtributos() {
        const scores = getScores();
        await post(`/personagem/${personagemId}/atributos`, {
            forca:         scores['forca']         ?? 10,
            destreza:      scores['destreza']      ?? 10,
            constituicao:  scores['constituicao']  ?? 10,
            inteligencia:  scores['inteligencia']  ?? 10,
            sabedoria:     scores['sabedoria']     ?? 10,
            carisma:       scores['carisma']       ?? 10,
        });
    }

    async function saveCombate() {
        await post(`/personagem/${personagemId}/combate`, {
            classeArmadura: parseInt(sheet.querySelector('.ac-inp')?.value)    || 10,
            iniciativa:     0,
            velocidade:     parseInt(sheet.querySelector('.speed-inp')?.value) || 30,
        });
    }

    async function saveVida() {
        await post(`/personagem/${personagemId}/vida`, {
            vidaAtual:      parseInt(sheet.querySelector('.hp-curr-inp')?.value) || 0,
            vidaMax:        parseInt(sheet.querySelector('.hp-max-inp')?.value)  || 0,
            vidaTemporaria: parseInt(sheet.querySelector('.tmp-inp')?.value)     || 0,
        });
    }

    async function savePericias() {
        // Perícias com nome fixo (enum no banco)
        const pericias = [];
        sheet.querySelectorAll('.skill-row:not(.tool-entry)').forEach(row => {
            const skill = row.dataset.skill;
            const prof  = row.dataset.prof || 'none';
            if (skill) {
                pericias.push({
                    nome:        skill,
                    proficiente: prof === 'proficient' || prof === 'expertise',
                    expert:      prof === 'expertise',
                });
            }
        });

        // Ferramentas com nome livre e mesmo estado de proficiência
        const ferramentas = [];
        sheet.querySelectorAll('.tool-entry').forEach(row => {
            const nome = row.querySelector('.skill-name')?.textContent?.trim();
            const prof = row.dataset.prof || 'none';
            if (nome) {
                ferramentas.push({
                    nome,
                    proficiente: prof === 'proficient' || prof === 'expertise',
                    expert:      prof === 'expertise',
                });
            }
        });

        await post(`/personagem/${personagemId}/pericias`, { pericias, ferramentas });
    }

    async function saveSaves() {
        const saves = {};
        sheet.querySelectorAll('.save-row').forEach(row => {
            if (row.dataset.attr) saves[row.dataset.attr] = row.dataset.prof === 'true';
        });
        await post(`/personagem/${personagemId}/saves`, saves);
    }

    async function saveIdentidade() {
        const nome        = sheet.querySelector('.sheet-name-inp')?.value?.trim();
        const nivel       = parseInt(sheet.querySelector('.level-inp')?.value) || 1;
        const xp          = parseInt(sheet.querySelector('.xp-inp')?.value)    || 0;
        const raca        = sheet.querySelector('.trait-select[data-field="raca"]')?.value        || null;
        const antecedente = sheet.querySelector('.trait-select[data-field="antecedente"]')?.value || null;

        const listas = {};
        ['sensesList', 'resistancesList', 'immunitiesList', 'armorList', 'weaponsList', 'languagesList'].forEach(listId => {
            const list = document.getElementById(listId);
            listas[listId] = list
                ? Array.from(list.querySelectorAll('.pill')).map(p => p.firstChild?.textContent?.trim()).filter(Boolean)
                : [];
        });

        await post(`/personagem/${personagemId}/identidade`, {
            nome, nivel, xp, raca, antecedente, ...listas
        });
    }

    // ── Helper POST ───────────────────────────────
    async function post(url, body) {
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            if (!res.ok) console.error(`Erro ao salvar ${url}:`, res.status);
        } catch (err) {
            console.error(`Falha na requisição ${url}:`, err);
        }
    }

    // ── Inicialização ─────────────────────────────
    recalcAll();
    showEditOnlyElements(false);
}