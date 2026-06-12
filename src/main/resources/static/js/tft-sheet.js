// ═══════════════════════════════════════════════════════════
//  tft-sheet.js  —  Logic for the TFT character sheet
//  Called from main.js as: if (system === 'TFT') initTftSheet();
// ═══════════════════════════════════════════════════════════

/* Sin type → max sin-points and accent color */
const SIN_META = {
    PRIDE:    { max: 45, color: '#2887cf' },
    GLOOM:    { max: 45, color: '#56b4c9' },
    LUST:     { max: 45, color: '#f0a33f' },
    ENVY:     { max: 45, color: '#9c69b2' },
    GLUTTONY: { max: 45, color: '#b3d42f' },
    WRATH:    { max: 45, color: '#da4c33' },
    SLOTH:    { max: 45, color: '#fcd700' },
};

function initTftSheet() {
    const sheet = document.querySelector('.lobcorp');
    const toggle = document.getElementById('tftEditToggle');
    if (!sheet || !toggle) return;

    const personagemId = sheet.dataset.personagemId;

    // ── Dirty tracking ────────────────────────────────────
    const dirty = {
        identidade: false,
        recursos:   false,
        atributos:  false,
        skills:     false,
        resistances: false,
        features:   false,
    };
    function markDirty(k) { dirty[k] = true; }
    function resetDirty() { Object.keys(dirty).forEach(k => dirty[k] = false); }
    function isEditing() { return sheet.dataset.editing === 'true'; }

    // ══════════════════════════════════════════════════════
    //  SIN COLOR + PIP RENDERING
    // ══════════════════════════════════════════════════════

    function applySinStyle(sinName) {
        const meta = SIN_META[sinName] || SIN_META['PRIDE'];
        sheet.style.setProperty('--lc-sin-color', meta.color);

        // Show only the relevant number of pips
        const track = document.getElementById('sinPipTrack');
        if (!track) return;
        track.querySelectorAll('.sin-pip').forEach((pip, i) => {
            pip.style.display = i < meta.max ? '' : 'none';
        });
    }

    function getSinFromSheet() {
        const sel = sheet.querySelector('.tft-sin-select');
        if (sel && sel.value) return sel.value;
        return sheet.dataset.sin || 'PRIDE';
    }

    // Pip click — toggle active up to the clicked index
    document.getElementById('sinPipTrack')?.querySelectorAll('.sin-pip').forEach(pip => {
        pip.addEventListener('click', () => {
            const idx = parseInt(pip.dataset.index);
            const track = document.getElementById('sinPipTrack');
            track.querySelectorAll('.sin-pip').forEach(p => {
                const i = parseInt(p.dataset.index);
                p.classList.toggle('active', i <= idx);
            });
            markDirty('recursos');
        });
    });

    // ── Sin select change ─────────────────────────────────
    sheet.querySelector('.tft-sin-select')?.addEventListener('change', e => {
        applySinStyle(e.target.value);
        markDirty('identidade');
        // update display label
        const lbl = sheet.querySelector('.sin-color-label');
        if (lbl) {
            lbl.textContent = e.target.value;
            lbl.className = 'sin-color-label ' + e.target.value;
        }
    });

    // ══════════════════════════════════════════════════════
    //  RESOURCE CONTROLS (HP / SP ± buttons)
    // ══════════════════════════════════════════════════════

    function getResVal(cls) {
        return parseInt(sheet.querySelector(cls)?.value) || 0;
    }
    function setResVal(cls, val) {
        const inp = sheet.querySelector(cls);
        if (inp) inp.value = Math.max(0, val);
    }

    function updatePips(pipContainerClass, curr, max) {
        const pips = sheet.querySelectorAll(`${pipContainerClass} .resource-counter-step:not(.pale)`);
        pips.forEach((pip, i) => {
            pip.classList.toggle('empty', i >= curr);
        });
    }

    sheet.querySelectorAll('.resource-control').forEach(btn => {
        btn.addEventListener('click', () => {
            const resource = btn.dataset.resource;   // 'hp' or 'sp'
            const action   = btn.dataset.resourceAction; // 'plus' or 'minus'
            const currCls  = resource === 'hp' ? '.tft-hp-curr' : '.tft-sp-curr';
            const maxCls   = resource === 'hp' ? '.tft-hp-max'  : '.tft-sp-max';
            const pipsCls  = resource === 'hp' ? '.health'      : '.sanity';

            let curr = getResVal(currCls);
            const max = getResVal(maxCls);
            curr = action === 'plus' ? Math.min(max, curr + 1) : Math.max(0, curr - 1);
            setResVal(currCls, curr);
            updatePips(pipsCls, curr, max);
            markDirty('recursos');
        });
    });

    // Sync editable resource inputs → pips
    ['.tft-hp-curr', '.tft-hp-max', '.tft-hp-pale',
     '.tft-sp-curr', '.tft-sp-max', '.tft-sp-pale'].forEach(cls => {
        sheet.querySelector(cls)?.addEventListener('input', () => {
            markDirty('recursos');
            const isHp = cls.startsWith('.tft-hp');
            const curr = getResVal(isHp ? '.tft-hp-curr' : '.tft-sp-curr');
            const max  = getResVal(isHp ? '.tft-hp-max'  : '.tft-sp-max');
            updatePips(isHp ? '.health' : '.sanity', curr, max);
        });
    });

    // ══════════════════════════════════════════════════════
    //  ATTRIBUTE DOTS — click to set value (edit mode)
    // ══════════════════════════════════════════════════════

    sheet.querySelectorAll('.attr-dot').forEach(dot => {
        dot.addEventListener('click', () => {
            if (!isEditing()) return;
            const row   = dot.closest('.attr-row');
            const dots  = Array.from(row.querySelectorAll('.attr-dot'));
            const idx   = dots.indexOf(dot) + 1;          // 1-based
            const inp   = row.querySelector('.tft-attr-inp');
            const current = parseInt(inp?.value) || 0;
            const newVal  = current === idx ? idx - 1 : idx; // click same → decrement

            if (inp) inp.value = newVal;
            dots.forEach((d, i) => d.classList.toggle('filled', i < newVal));
            markDirty('atributos');
            recalcGroupRatings();
        });
    });

    sheet.querySelectorAll('.tft-attr-inp').forEach(inp => {
        inp.addEventListener('input', () => {
            markDirty('atributos');
            const row  = inp.closest('.attr-row');
            const dots = Array.from(row.querySelectorAll('.attr-dot'));
            const val  = Math.min(5, Math.max(0, parseInt(inp.value) || 0));
            dots.forEach((d, i) => d.classList.toggle('filled', i < val));
            recalcGroupRatings();
        });
    });

    function recalcGroupRatings() {
        sheet.querySelectorAll('.attr-group').forEach(group => {
            const vals = Array.from(group.querySelectorAll('.tft-attr-inp'))
                              .map(i => parseInt(i.value) || 0);
            const max  = vals.length ? Math.max(...vals) : 0;
            const label = group.dataset.group;
            const prefix = label === 'physical' ? 'Fort.' :
                           label === 'mental'   ? 'Ins.'  :
                           label === 'social'   ? 'Temp.' : 'Just.';
            const ratingEl = group.querySelector('.attr-group-rating');
            if (ratingEl) ratingEl.textContent = `${prefix} ${max + 1}`;
        });
    }

    // ══════════════════════════════════════════════════════
    //  SKILL DOTS — click to set value (edit mode)
    // ══════════════════════════════════════════════════════

    sheet.querySelectorAll('.skill-row').forEach(row => {
        const dots  = Array.from(row.querySelectorAll('.skill-dot'));
        const inp   = row.querySelector('.tft-skill-pts');

        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                if (!isEditing()) return;
                const idx     = dots.indexOf(dot) + 1;
                const current = parseInt(inp?.value) || 0;
                const newVal  = current === idx ? idx - 1 : idx;
                if (inp) inp.value = newVal;
                dots.forEach((d, i) => d.classList.toggle('filled', i < newVal));
                markDirty('skills');
            });
        });

        inp?.addEventListener('input', () => {
            markDirty('skills');
            const val = Math.min(5, Math.max(0, parseInt(inp.value) || 0));
            dots.forEach((d, i) => d.classList.toggle('filled', i < val));
        });
    });

    sheet.querySelectorAll('.skill-spec-input').forEach(inp => {
        inp.addEventListener('input', () => markDirty('skills'));
    });

    // ══════════════════════════════════════════════════════
    //  RESISTANCE INPUTS
    // ══════════════════════════════════════════════════════

    sheet.querySelectorAll('.tft-resist-inp').forEach(inp => {
        inp.addEventListener('input', () => markDirty('resistances'));
    });

    // ══════════════════════════════════════════════════════
    //  FEATURES — inline edit + delete + add
    // ══════════════════════════════════════════════════════

    function bindFeatureDeleteButtons() {
        sheet.querySelectorAll('.tft-feat-delete').forEach(btn => {
            btn.addEventListener('click', async () => {
                const featId = btn.dataset.featureId;
                if (!featId) return;
                await post(`/personagem/${personagemId}/tft/feature/${featId}/deletar`, {});
                btn.closest('.rp-entry')?.remove();
            });
        });
    }
    bindFeatureDeleteButtons();

    sheet.querySelectorAll('.rp-name-inp, .rp-desc-textarea').forEach(inp => {
        inp.addEventListener('input', () => markDirty('features'));
    });

    // Add feature form
    const featAddBtn   = sheet.querySelector('.tft-feat-add-btn');
    const featAddForm  = sheet.querySelector('.tft-feat-add-form');

    document.querySelector('#tftAddAttackBtn')?.addEventListener('click', () => {
        const form = sheet.querySelector('.tft-atk-add-form');
        if (form) form.classList.toggle('open');
    });

    featAddBtn?.addEventListener('click', async () => {
        const source = sheet.querySelector('.tft-feat-source-select')?.value;
        const nome   = sheet.querySelector('.tft-feat-name-inp')?.value?.trim();
        const desc   = sheet.querySelector('.tft-feat-desc-inp')?.value?.trim();
        if (!source || !nome) return;

        const res = await post(`/personagem/${personagemId}/tft/feature/novo`, { source, nome, descricao: desc });
        if (res?.id) {
            appendFeatureCard(res.id, source, nome, desc);
            sheet.querySelector('.tft-feat-name-inp').value = '';
            sheet.querySelector('.tft-feat-desc-inp').value = '';
        }
    });

    function appendFeatureCard(id, source, nome, descricao) {
        const list = document.getElementById('tftFeatureList');
        const emptyMsg = list?.querySelector('[style*="opacity"]');
        if (emptyMsg) emptyMsg.remove();

        const card = document.createElement('div');
        card.className = 'rp-entry notched';
        card.dataset.featureId = id;
        card.innerHTML = `
            <div class="rp-entry-header">
                <span class="rp-type">${source}</span>
                <span class="rp-name display-val">${nome}</span>
                <input class="edit-inp rp-name-inp" type="text" value="${nome}" placeholder="Nome" />
            </div>
            <div class="rp-body">
                <div class="rp-desc display-val">${descricao || ''}</div>
                <textarea class="edit-inp rp-desc-textarea" placeholder="Descrição…">${descricao || ''}</textarea>
            </div>
            <div class="edit-inp" style="text-align:right;">
                <button class="tft-feat-delete" type="button"
                    data-feature-id="${id}"
                    style="background:none;border:none;color:rgba(163,160,117,0.5);cursor:pointer;font-size:11px;">
                    <i class="fas fa-trash"></i> remover
                </button>
            </div>
        `;
        list?.appendChild(card);

        card.querySelector('.rp-name-inp')?.addEventListener('input', () => markDirty('features'));
        card.querySelector('.rp-desc-textarea')?.addEventListener('input', () => markDirty('features'));
        card.querySelector('.tft-feat-delete')?.addEventListener('click', async () => {
            await post(`/personagem/${personagemId}/tft/feature/${id}/deletar`, {});
            card.remove();
        });
    }

    // ══════════════════════════════════════════════════════
    //  ATTACKS — delete (add handled in add-attack form)
    // ══════════════════════════════════════════════════════

    function bindAttackDeleteButtons() {
        sheet.querySelectorAll('.tft-atk-delete').forEach(btn => {
            btn.addEventListener('click', async () => {
                const atkId = btn.dataset.attackId;
                if (!atkId) return;
                await post(`/personagem/${personagemId}/tft/ataque/${atkId}/deletar`, {});
                btn.closest('.combat-skill')?.remove();
            });
        });
    }
    bindAttackDeleteButtons();

    // Add attack submission
    sheet.querySelector('.tft-atk-submit')?.addEventListener('click', async () => {
        const form = sheet.querySelector('.tft-atk-add-form');
        const body = {
            nome:           form.querySelector('[name="atk-nome"]')?.value?.trim(),
            dicepool_mode:  form.querySelector('[name="atk-mode"]')?.value,
            attribute:      form.querySelector('[name="atk-attr"]')?.value || null,
            skill_primary:  form.querySelector('[name="atk-skill1"]')?.value,
            skill_secondary:form.querySelector('[name="atk-skill2"]')?.value || null,
            damage_type:    form.querySelector('[name="atk-dmgtype"]')?.value || null,
            damage_form:    form.querySelector('[name="atk-dmgform"]')?.value || null,
            threat:         parseInt(form.querySelector('[name="atk-threat"]')?.value) || null,
            attack_weight:  parseInt(form.querySelector('[name="atk-weight"]')?.value) || null,
            attack_description: form.querySelector('[name="atk-desc"]')?.value?.trim() || null,
        };
        if (!body.nome || !body.skill_primary) return;

        const res = await post(`/personagem/${personagemId}/tft/ataque/novo`, body);
        if (res?.id) {
            appendAttackCard(res.id, body);
            form.classList.remove('open');
        }
    });

    function appendAttackCard(id, atk) {
        const grid = document.getElementById('tftAttackList');
        const empty = grid?.querySelector('.combat-skills-empty');
        if (empty) empty.remove();

        const card = document.createElement('div');
        card.className = 'combat-skill';
        card.dataset.attackId = id;

        const diceLabel = atk.dicepool_mode === 'ATTRIBUTE_AND_SKILL'
            ? `${atk.attribute} + ${atk.skill_primary}`
            : `${atk.skill_primary} + ${atk.skill_secondary}`;

        card.innerHTML = `
            <div class="combat-skill-header">
                <span class="skill-index">${diceLabel}</span>
                <span class="skill-title display-val">${atk.nome}</span>
                <input class="edit-inp atk-name-inp" type="text" value="${atk.nome}" placeholder="Nome do ataque" />
            </div>
            <div class="atk-damage-row">
                <span class="atk-badge dmg-type-${atk.damage_type || 'none'}">${atk.damage_type || '—'}</span>
                <span class="atk-badge atk-form">${atk.damage_form || '—'}</span>
                ${atk.threat != null ? `<span class="atk-threat display-val">Threat ${atk.threat}</span>` : ''}
            </div>
            ${atk.attack_description ? `<div class="combat-skill-summary">${atk.attack_description}</div>` : ''}
            <div class="combat-skill-controls edit-inp" style="display:none;">
                <button class="tft-atk-delete" type="button" data-attack-id="${id}"
                    style="background:none;border:none;color:rgba(163,160,117,0.5);cursor:pointer;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        grid?.appendChild(card);
        card.querySelector('.tft-atk-delete')?.addEventListener('click', async () => {
            await post(`/personagem/${personagemId}/tft/ataque/${id}/deletar`, {});
            card.remove();
        });
    }

    // ══════════════════════════════════════════════════════
    //  EDIT TOGGLE
    // ══════════════════════════════════════════════════════

    toggle.addEventListener('click', async () => {
        const editing = isEditing();
        if (editing) {
            await saveChanges();
            updateDisplayValues();
            sheet.dataset.editing = 'false';
            toggle.querySelector('.edit-icon').textContent = 'edit';
            resetDirty();
        } else {
            sheet.dataset.editing = 'true';
            toggle.querySelector('.edit-icon').textContent = 'edit_off';
        }
    });

    function updateDisplayValues() {
        // Name
        const nameVal = sheet.querySelector('.tft-name-inp')?.value;
        const nameDisp = sheet.querySelector('.charname.display-val');
        if (nameDisp && nameVal) nameDisp.textContent = nameVal;

        // Sin label
        const sinSel = sheet.querySelector('.tft-sin-select');
        const sinLbl = sheet.querySelector('.sin-color-label');
        if (sinSel && sinLbl) {
            sinLbl.textContent = sinSel.value;
            sinLbl.className = 'sin-color-label ' + sinSel.value;
        }

        // Resistance display values
        sheet.querySelectorAll('.resist-row').forEach(row => {
            const inp  = row.querySelector('.tft-resist-inp');
            const disp = row.querySelector('.display-val');
            if (inp && disp) disp.textContent = inp.value || '0';
        });

        // Feature names + descriptions
        sheet.querySelectorAll('.rp-entry').forEach(entry => {
            const nameInp  = entry.querySelector('.rp-name-inp');
            const nameDisp = entry.querySelector('.rp-name');
            if (nameInp && nameDisp) nameDisp.textContent = nameInp.value;

            const descInp  = entry.querySelector('.rp-desc-textarea');
            const descDisp = entry.querySelector('.rp-desc');
            if (descInp && descDisp) descDisp.textContent = descInp.value;
        });

        // Attack names
        sheet.querySelectorAll('.combat-skill').forEach(card => {
            const nameInp  = card.querySelector('.atk-name-inp');
            const nameDisp = card.querySelector('.skill-title.display-val');
            if (nameInp && nameDisp) nameDisp.textContent = nameInp.value;
        });

        // Skill specialties
        sheet.querySelectorAll('.skill-row').forEach(row => {
            const inp  = row.querySelector('.skill-spec-input');
            const disp = row.querySelector('.skill-spec-text');
            if (inp && disp) disp.textContent = inp.value;
        });
    }

    // ══════════════════════════════════════════════════════
    //  GRANULARIZED SAVE
    // ══════════════════════════════════════════════════════

    async function saveChanges() {
        const saves = [];
        if (dirty.identidade)  saves.push(saveIdentidade());
        if (dirty.recursos)    saves.push(saveRecursos());
        if (dirty.atributos)   saves.push(saveAtributos());
        if (dirty.skills)      saves.push(saveSkills());
        if (dirty.resistances) saves.push(saveResistances());
        if (dirty.features)    saves.push(saveFeatures());
        await Promise.all(saves);
    }

    async function saveIdentidade() {
        const nome = sheet.querySelector('.tft-name-inp')?.value?.trim();
        const sin  = sheet.querySelector('.tft-sin-select')?.value;
        await post(`/personagem/${personagemId}/tft/identidade`, { nome, sin });
    }

    async function saveRecursos() {
        const sinPips = Array.from(document.querySelectorAll('#sinPipTrack .sin-pip.active'));
        await post(`/personagem/${personagemId}/tft/recursos`, {
            hpAtual:  getResVal('.tft-hp-curr'),
            hpMax:    getResVal('.tft-hp-max'),
            hpPale:   getResVal('.tft-hp-pale'),
            spAtual:  getResVal('.tft-sp-curr'),
            spMax:    getResVal('.tft-sp-max'),
            spPale:   getResVal('.tft-sp-pale'),
            sinPoints: sinPips.length,
        });
    }

    async function saveAtributos() {
        const attrs = {};
        sheet.querySelectorAll('.tft-attr-inp').forEach(inp => {
            attrs[inp.dataset.attr] = parseInt(inp.value) || 0;
        });
        await post(`/personagem/${personagemId}/tft/atributos`, attrs);
    }

    async function saveSkills() {
        const skills = [];
        sheet.querySelectorAll('.skill-row').forEach(row => {
            const skill     = row.dataset.skill;
            const points    = parseInt(row.querySelector('.tft-skill-pts')?.value) || 0;
            const specialty = row.querySelector('.skill-spec-input')?.value?.trim() || null;
            if (skill) skills.push({ skill, points, specialty });
        });
        await post(`/personagem/${personagemId}/tft/skills`, { skills });
    }

    async function saveResistances() {
        const resistances = {};
        sheet.querySelectorAll('.tft-resist-inp').forEach(inp => {
            resistances[inp.dataset.resist] = parseInt(inp.value) || 0;
        });
        await post(`/personagem/${personagemId}/tft/resistencias`, resistances);
    }

    async function saveFeatures() {
        const features = [];
        sheet.querySelectorAll('.rp-entry').forEach(entry => {
            const id   = entry.dataset.featureId;
            const nome = entry.querySelector('.rp-name-inp')?.value?.trim();
            const desc = entry.querySelector('.rp-desc-textarea')?.value?.trim();
            if (id && nome) features.push({ id: parseInt(id), nome, descricao: desc });
        });
        await post(`/personagem/${personagemId}/tft/features`, { features });
    }

    // ── Helper POST (returns parsed JSON or null) ─────────
    async function post(url, body) {
        try {
            const res = await fetch(url, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify(body),
            });
            if (!res.ok) { console.error(`POST ${url} →`, res.status); return null; }
            return res.json().catch(() => null);
        } catch (err) {
            console.error(`Fetch ${url}:`, err);
            return null;
        }
    }

    // ── Init ──────────────────────────────────────────────
    applySinStyle(getSinFromSheet());
}
