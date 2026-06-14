// ═══════════════════════════════════════════════════════════
//  tft-sheet.js  —  Logic for the TFT character sheet
// ═══════════════════════════════════════════════════════════

const SIN_META = {
    PRIDE: { max: 45, color: '#2887cf' },
    GLOOM: { max: 45, color: '#56b4c9' },
    LUST: { max: 45, color: '#f0a33f' },
    ENVY: { max: 45, color: '#9c69b2' },
    GLUTTONY: { max: 45, color: '#b3d42f' },
    WRATH: { max: 45, color: '#da4c33' },
    SLOTH: { max: 45, color: '#fcd700' },
};

// Map resistance numeric value → display label
const RESIST_LABELS = {
    1: 'Fatal',
    2: 'Weak',
    3: 'Normal',
    4: 'Resistant',
    5: 'Endured',
    6: 'Immune',
};

function initTftSheet() {
    const sheet = document.querySelector('.lobcorp');
    const toggle = document.getElementById('tftEditToggle');
    if (!sheet || !toggle) return;

    const personagemId = sheet.dataset.personagemId;

    // ── Dirty tracking ────────────────────────────────────
    const dirty = {
        identidade: false,
        recursos: false,
        atributos: false,
        skills: false,
        resistances: false,
        features: false,
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

    // Sin pip clicks
    document.getElementById('sinPipTrack')?.querySelectorAll('.sin-pip').forEach(pip => {
        pip.addEventListener('click', () => {
            const idx = parseInt(pip.dataset.index);
            const track = document.getElementById('sinPipTrack');
            track.querySelectorAll('.sin-pip').forEach(p => {
                p.classList.toggle('active', parseInt(p.dataset.index) <= idx);
            });
            markDirty('recursos');
            setTimeout(async () => {
                const sinPips = Array.from(document.querySelectorAll('#sinPipTrack .sin-pip.active'));
                await post(`/personagem/${personagemId}/tft/recursos`, {
                    hpAtual: resState.hp.curr,
                    hpMax: resState.hp.max,
                    hpPale: resState.hp.pale,
                    spAtual: resState.sp.curr,
                    spMax: resState.sp.max,
                    spPale: resState.sp.pale,
                    sinPoints: sinPips.length,
                });
            }, 0);
        });
    });

    sheet.querySelector('.tft-sin-select')?.addEventListener('change', e => {
        applySinStyle(e.target.value);
        markDirty('identidade');
        const lbl = sheet.querySelector('.sin-color-label');
        if (lbl) {
            lbl.textContent = e.target.value;
            lbl.className = 'sin-color-label display-val ' + e.target.value;
        }
    });

    // ══════════════════════════════════════════════════════
    //  RESOURCE BOX SYSTEM (HP / SP)
    // ══════════════════════════════════════════════════════

    // State object for each resource: { max, curr, pale }
    // max and pale are always even (each box = 2 HP)
    // curr tracks actual HP points (0 to max)
    const resState = { hp: { max: 0, curr: 0, pale: 0 }, sp: { max: 0, curr: 0, pale: 0 } };

    // Derive box states array from (max, curr, pale)
    // Returns array of 'empty'|'slash'|'x'|'pale', length = max/2
    // Box state model (linear fill, left to right):
    //   activeBoxes = (max - pale) / 2 ; activeMax = activeBoxes * 2
    //   d = damage taken = activeMax - curr  (0 <= d <= activeMax)
    //   Phase 1 (d <= activeBoxes): first d boxes (left→right) are 'slash', rest 'empty'
    //   Phase 2 (d > activeBoxes): all boxes 'slash' as base, plus first (d - activeBoxes)
    //                               boxes (left→right) upgrade to 'x'
    //   Rightmost `pale` boxes (pale/2 of them) are always 'pale', non-interactive.
    function buildBoxStates(max, curr, pale) {
        const totalBoxes = Math.max(1, Math.floor(max / 2));
        const paleBoxes = Math.floor(pale / 2);
        const activeBoxes = Math.max(1, totalBoxes - paleBoxes);
        const activeMax = activeBoxes * 2;
        const d = Math.max(0, Math.min(activeMax, activeMax - curr));
        const states = [];

        for (let i = 0; i < totalBoxes; i++) {
            if (i >= activeBoxes) {
                states.push('pale');
                continue;
            }
            const isSlash = d > i;
            const isX = d > activeBoxes + i;
            if (isX) states.push('x');
            else if (isSlash) states.push('slash');
            else states.push('empty');
        }

        return states;
    }

    // Render boxes into a track element
    function renderBoxes(trackEl, resource) {
        const { max, curr, pale } = resState[resource];
        const states = buildBoxStates(max, curr, pale);
        trackEl.innerHTML = '';

        states.forEach((state, i) => {
            const box = document.createElement('span');
            box.className = 'res-box';
            box.dataset.state = state;
            box.dataset.index = i;

            const label = state === 'slash' ? '/' : state === 'x' ? 'X' : '';
            box.textContent = label;

            if (state !== 'pale') {
                box.addEventListener('click', () => onBoxClick(resource, i));
            }
            // contextmenu (right-click) must work on pale boxes too, so they can be restored
            box.addEventListener('contextmenu', e => { e.preventDefault(); onBoxRightClick(resource, i); });

            trackEl.appendChild(box);
        });
    }

    // Determine which box index is the "damage target" (leftmost clickable for damage)
    // Returns { type: 'damage'|'heal', index } or null
    function getActiveTargets(resource) {
        const { max, curr, pale } = resState[resource];
        const activeMax = max - pale;
        const halfActive = activeMax / 2;
        // injured = all boxes are '/', meaning curr <= halfActive
        const injured = curr <= halfActive;
        const states = buildBoxStates(max, curr, pale);

        let damageIdx = null;
        let healIdx = null;

        if (!injured) {
            // Pre-injury: leftmost 'empty' active box takes damage (empty → slash)
            for (let i = 0; i < states.length; i++) {
                if (states[i] === 'empty') { damageIdx = i; break; }
            }
        } else {
            // Injured: leftmost 'slash' active box takes damage (slash → x)
            for (let i = 0; i < states.length; i++) {
                if (states[i] === 'slash') { damageIdx = i; break; }
            }
        }

        // Healing: rightmost 'x' first, then rightmost '/'
        for (let i = states.length - 1; i >= 0; i--) {
            if (states[i] === 'pale') continue;
            if (states[i] === 'x') { healIdx = i; break; }
        }
        if (healIdx === null) {
            for (let i = states.length - 1; i >= 0; i--) {
                if (states[i] === 'pale') continue;
                if (states[i] === 'slash') { healIdx = i; break; }
            }
        }

        return { damageIdx, healIdx };
    }

    function onBoxClick(resource, clickedIdx) {
        const s = resState[resource];
        const { damageIdx, healIdx } = getActiveTargets(resource);
        const states = buildBoxStates(s.max, s.curr, s.pale);
        const clickedState = states[clickedIdx];

        // If clicked box is the damage target → take damage (-1 HP)
        if (clickedIdx === damageIdx) {
            s.curr = Math.max(0, s.curr - 1);
            markDirty('recursos');
            rerenderBoxes(resource);
            return;
        }

        // If clicked box is the heal target → heal
        if (clickedIdx === healIdx) {
            if (clickedState === 'x') {
                s.curr = Math.min(s.max - s.pale, s.curr + 1);  // x → /
            } else if (clickedState === 'slash') {
                s.curr = Math.min(s.max - s.pale, s.curr + 1);  // / → empty
            }
            markDirty('recursos');
            rerenderBoxes(resource);
            return;
        }
        // Clicking non-active box does nothing
    }

    function onBoxRightClick(resource, clickedIdx) {
        if (!isEditing()) return;
        const s = resState[resource];
        const states = buildBoxStates(s.max, s.curr, s.pale);
        const clickedState = states[clickedIdx];

        // Right-click on pale box → remove pale (leftmost pale becomes active again)
        if (clickedState === 'pale') {
            if (s.pale < 2) return;
            const newActiveMax = (s.max - (s.pale - 2));
            s.pale -= 2;
            // Restored box comes back as 'empty' (full) — add 2 HP, capped at new max
            s.curr = Math.min(newActiveMax, s.curr + 2);
            markDirty('recursos');
            rerenderBoxes(resource);
            return;
        }

        // Right-click on active box → make rightmost active box pale
        const maxPaleBoxes = Math.floor(s.max / 2) - 1; // min 1 active box
        if (Math.floor(s.pale / 2) >= maxPaleBoxes) return;

        // Rightmost active box is always the correct pale target
        // (priority empty > slash > x is automatically satisfied by box ordering)
        let targetIdx = -1;
        for (let i = states.length - 1; i >= 0; i--) {
            if (states[i] !== 'pale') { targetIdx = i; break; }
        }
        if (targetIdx === -1) return;

        const targetState = states[targetIdx];
        s.pale += 2;

        // Remove the HP that was "remaining" in the box being paled
        // empty = 2 HP remaining, slash = 1, x = 0
        if (targetState === 'empty') {
            s.curr = Math.max(0, s.curr - 2);
        } else if (targetState === 'slash') {
            s.curr = Math.max(0, s.curr - 1);
        }
        // x: curr unchanged (0 remaining to lose)

        markDirty('recursos');
        rerenderBoxes(resource);
    }

    // Add/remove max boxes (edit mode +/- buttons)
    function onMaxChange(resource, action) {
        const s = resState[resource];
        if (action === 'plus') {
            if (s.max / 2 >= 20) return;  // max 20 boxes
            s.max += 2;
            s.curr += 2;  // new box starts full
        } else {
            if ((s.max - s.pale) / 2 <= 1) return;  // min 1 active box
            // Remove rightmost non-pale box
            const states = buildBoxStates(s.max, s.curr, s.pale);
            // Find rightmost active box state
            let removeState = 'empty';
            for (let i = states.length - 1; i >= 0; i--) {
                if (states[i] !== 'pale') { removeState = states[i]; break; }
            }
            // Adjust curr based on what was in that box
            if (removeState === 'empty') {
                s.curr = Math.max(0, s.curr - 2); // removing full box costs 2 HP
            } else if (removeState === 'slash') {
                s.curr = Math.max(0, s.curr - 1); // half-filled costs 1 HP
            }
            // x box: curr stays (damage already taken)
            s.max -= 2;
            if (s.curr > s.max - s.pale) s.curr = s.max - s.pale;
        }
        markDirty('recursos');
        rerenderBoxes(resource);
    }

    function rerenderBoxes(resource) {
        const trackSel = resource === 'hp' ? '.hp-boxes' : '.sp-boxes';
        const track = sheet.querySelector(trackSel);
        if (track) renderBoxes(track, resource);
        // Auto-save on every HP/SP change (deferred to avoid forward reference)
        setTimeout(() => saveRecursos(), 0);
    }

    // Init from data attributes on the track element
    function initResBoxes(resource) {
        const trackSel = resource === 'hp' ? '.hp-boxes' : '.sp-boxes';
        const track = sheet.querySelector(trackSel);
        if (!track) return;

        resState[resource].max = parseInt(track.dataset.max) || 10;
        resState[resource].curr = parseInt(track.dataset.curr) || 10;
        resState[resource].pale = parseInt(track.dataset.pale) || 0;

        renderBoxes(track, resource);
    }

    // +/- button listeners
    sheet.querySelectorAll('.resource-control').forEach(btn => {
        btn.addEventListener('click', () => {
            onMaxChange(btn.dataset.resource, btn.dataset.resourceAction);
        });
    });

    // ══════════════════════════════════════════════════════
    //  RESISTANCE DROPDOWNS
    // ══════════════════════════════════════════════════════

    // Init select values from data-value attribute
    sheet.querySelectorAll('.tft-resist-sel').forEach(sel => {
        const val = sel.dataset.value;
        if (val) sel.value = val;

        sel.addEventListener('change', () => {
            markDirty('resistances');
            // Update display label immediately
            const row = sel.closest('.ft-row');
            const label = row?.querySelector('.ft-res-label');
            if (label) label.textContent = RESIST_LABELS[sel.value] || 'Normal';
        });
    });

    // ══════════════════════════════════════════════════════
    //  ATTRIBUTE DOTS
    // ══════════════════════════════════════════════════════

    sheet.querySelectorAll('.attr-dot').forEach(dot => {
        dot.addEventListener('click', () => {
            if (!isEditing()) return;
            const row = dot.closest('.attr-row');
            const dots = Array.from(row.querySelectorAll('.attr-dot'));
            const idx = dots.indexOf(dot) + 1;
            const inp = row.querySelector('.tft-attr-inp');
            const cur = parseInt(inp?.value) || 0;
            const newVal = cur === idx ? idx - 1 : idx;

            if (inp) inp.value = newVal;
            dots.forEach((d, i) => d.classList.toggle('filled', i < newVal));
            markDirty('atributos');
            recalcGroupRatings();
        });
    });

    sheet.querySelectorAll('.tft-attr-inp').forEach(inp => {
        inp.addEventListener('input', () => {
            markDirty('atributos');
            const row = inp.closest('.attr-row');
            const dots = Array.from(row.querySelectorAll('.attr-dot'));
            const val = Math.min(5, Math.max(0, parseInt(inp.value) || 0));
            dots.forEach((d, i) => d.classList.toggle('filled', i < val));
            recalcGroupRatings();
        });
    });

    function toRoman(n) {
        if (n >= 6) return 'EX';
        const map = ['', 'I', 'II', 'III', 'IV', 'V'];
        return map[n] || '—';
    }

    function recalcGroupRatings() {
        sheet.querySelectorAll('.attr-group').forEach(group => {
            const vals = Array.from(group.querySelectorAll('.tft-attr-inp'))
                .map(i => parseInt(i.value) || 0);
            const max = vals.length ? Math.max(...vals) : 0;
            const rating = max + 1;
            const ratingEl = group.querySelector('.attr-group-rating');
            if (ratingEl) {
                ratingEl.textContent = toRoman(rating);
                ratingEl.dataset.rating = rating;
            }
        });
    }

    // ══════════════════════════════════════════════════════
    //  SKILL DOTS
    // ══════════════════════════════════════════════════════

    sheet.querySelectorAll('.skill-row').forEach(row => {
        const dots = Array.from(row.querySelectorAll('.skill-dot'));
        const inp = row.querySelector('.tft-skill-pts');

        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                if (!isEditing()) return;
                const idx = dots.indexOf(dot) + 1;
                const cur = parseInt(inp?.value) || 0;
                const newVal = cur === idx ? idx - 1 : idx;
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

    // ── Specialty edit toggle ─────────────────────────────
    // The ✎ button appears in edit mode, clicking it shows/hides the input

    sheet.querySelectorAll('.skill-spec-toggle').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            const row = btn.closest('.skill-row');
            const inp = row.querySelector('.skill-spec-input');
            const text = row.querySelector('.skill-spec-text');
            if (!inp) return;

            const isOpen = inp.classList.contains('open');
            if (isOpen) {
                inp.classList.remove('open');
                inp.style.display = 'none';
                if (text) {
                    text.textContent = inp.value;
                    text.style.display = '';
                }
            } else {
                inp.classList.add('open');
                inp.style.display = 'block';
                if (text) text.style.display = 'none';
                inp.focus();
            }
        });
    });

    sheet.querySelectorAll('.skill-spec-input').forEach(inp => {
        inp.addEventListener('input', () => markDirty('skills'));
    });

    // ══════════════════════════════════════════════════════
    //  FEATURE ENTRIES
    // ══════════════════════════════════════════════════════

    // Collapse toggle
    function bindCollapseButtons(context) {
        context.querySelectorAll('.rp-entry-header').forEach(header => {
            header.addEventListener('click', e => {
                // Don't collapse when clicking input/button inside header
                if (e.target.closest('input, button.tft-feat-delete')) return;
                const entry = header.closest('.rp-entry');
                if (!entry) return;
                const collapsed = entry.dataset.collapsed === 'true';
                entry.dataset.collapsed = (!collapsed).toString();
            });
        });
    }
    bindCollapseButtons(sheet);

    // Delete buttons
    function bindFeatureDeleteButtons(context) {
        context.querySelectorAll('.tft-feat-delete').forEach(btn => {
            btn.addEventListener('click', async e => {
                e.stopPropagation();
                const featId = btn.dataset.featureId;
                if (!featId) return;
                await post(`/personagem/${personagemId}/tft/feature/${featId}/deletar`, {});
                btn.closest('.rp-entry')?.remove();
                if (sheet.querySelectorAll('.rp-entry').length === 0) {
                    const list = document.getElementById('tftFeatureList');
                    if (list && !list.querySelector('.rp-empty-msg')) {
                        const msg = document.createElement('div');
                        msg.className = 'rp-empty-msg';
                        msg.textContent = 'Nenhuma feature cadastrada.';
                        list.appendChild(msg);
                    }
                }
            });
        });
    }
    bindFeatureDeleteButtons(sheet);

    sheet.querySelectorAll('.rp-name-inp, .rp-desc-textarea').forEach(inp => {
        inp.addEventListener('input', () => markDirty('features'));
    });

    // Add entry — toggle form visibility
    const rpAddTrigger = sheet.querySelector('.rp-add-trigger');
    const rpAddSection = sheet.querySelector('.rp-add-section');
    rpAddTrigger?.addEventListener('click', () => {
        const visible = rpAddSection?.style.display !== 'none' && rpAddSection?.style.display !== '';
        if (rpAddSection) rpAddSection.style.display = visible ? 'none' : 'flex';
        // Close the other overlay if it's open
        if (!visible && atkAddForm) atkAddForm.style.display = 'none';
    });

    sheet.querySelector('.tft-feat-cancel')?.addEventListener('click', () => {
        if (rpAddSection) rpAddSection.style.display = 'none';
    });

    sheet.querySelector('.tft-feat-add-btn')?.addEventListener('click', async () => {
        const source = sheet.querySelector('.tft-feat-source-select')?.value;
        const nome = sheet.querySelector('.tft-feat-name-inp')?.value?.trim();
        const desc = sheet.querySelector('.tft-feat-desc-inp')?.value?.trim();
        if (!source || !nome) return;

        const res = await post(`/personagem/${personagemId}/tft/feature/novo`, { source, nome, descricao: desc });
        if (res?.id) {
            appendFeatureCard(res.id, source, nome, desc);
            sheet.querySelector('.tft-feat-name-inp').value = '';
            sheet.querySelector('.tft-feat-desc-inp').value = '';
            if (rpAddSection) rpAddSection.style.display = 'none';
        }
    });

    function appendFeatureCard(id, source, nome, descricao) {
        const list = document.getElementById('tftFeatureList');
        list?.querySelector('.rp-empty-msg')?.remove();

        const card = document.createElement('div');
        card.className = 'rp-entry notched';
        card.dataset.featureId = id;
        card.dataset.collapsed = 'false';
        card.innerHTML = `
            <div class="rp-entry-header">
                <span class="rp-dot"></span>
                <span class="rp-type">${source}</span>
                <span class="rp-name display-val">${nome}</span>
                <input class="edit-inp rp-name-inp" type="text" value="${nome}" placeholder="Nome" />
                <div class="rp-header-actions">
                    <button class="rp-collapse-btn icon-btn" type="button" title="Recolher">▼</button>
                    <button class="edit-inp tft-feat-delete icon-btn" type="button"
                            data-feature-id="${id}" title="Excluir">×</button>
                </div>
            </div>
            <div class="rp-body">
                <div class="rp-desc display-val">${descricao || ''}</div>
                <textarea class="edit-inp rp-desc-textarea" placeholder="Descrição…">${descricao || ''}</textarea>
            </div>
        `;
        list?.appendChild(card);

        card.querySelector('.rp-name-inp')?.addEventListener('input', () => markDirty('features'));
        card.querySelector('.rp-desc-textarea')?.addEventListener('input', () => markDirty('features'));
        bindCollapseButtons(card);
        bindFeatureDeleteButtons(card);
    }

    // ══════════════════════════════════════════════════════
    //  ATTACK CARDS
    // ══════════════════════════════════════════════════════

    // Add skill card click — opens form
    const addSkillCard = document.getElementById('tftAddSkillCard');
    const atkAddForm = document.getElementById('tftAtkAddForm');

    addSkillCard?.addEventListener('click', () => {
        if (!isEditing()) return;
        if (atkAddForm) {
            const isVisible = atkAddForm.style.display !== 'none' && atkAddForm.style.display !== '';
            atkAddForm.style.display = isVisible ? 'none' : 'flex';
            // Close the other overlay if it's open
            if (!isVisible && rpAddSection) rpAddSection.style.display = 'none';
        }
    });

    // Dicepool mode toggle: show/hide attr vs skill2 field
    const atkModeSelect = document.getElementById('atkModeSelect');
    function updateAtkModeFields() {
        const mode = atkModeSelect?.value;
        sheet.querySelectorAll('.atk-attr-field').forEach(el => {
            el.style.display = mode === 'ATTRIBUTE_AND_SKILL' ? '' : 'none';
        });
        sheet.querySelectorAll('.atk-skill2-field').forEach(el => {
            el.style.display = mode === 'SKILL_AND_SKILL' ? '' : 'none';
        });
    }
    atkModeSelect?.addEventListener('change', updateAtkModeFields);
    updateAtkModeFields();

    // Cancel add form
    sheet.querySelector('.tft-atk-cancel')?.addEventListener('click', () => {
        if (atkAddForm) atkAddForm.style.display = 'none';
    });

    // Submit new attack
    sheet.querySelector('.tft-atk-submit')?.addEventListener('click', async () => {
        const form = atkAddForm;
        if (!form) return;
        const body = {
            nome: form.querySelector('[name="atk-nome"]')?.value?.trim(),
            skill_type: form.querySelector('[name="atk-type"]')?.value || 'ATTACK',
            dicepool_mode: form.querySelector('[name="atk-mode"]')?.value,
            attribute: form.querySelector('[name="atk-attr"]')?.value || null,
            skill_primary: form.querySelector('[name="atk-skill1"]')?.value,
            skill_secondary: form.querySelector('[name="atk-skill2"]')?.value || null,
            damage_type: form.querySelector('[name="atk-dmgtype"]')?.value || null,
            damage_form: form.querySelector('[name="atk-dmgform"]')?.value || null,
            threat: parseInt(form.querySelector('[name="atk-threat"]')?.value) || null,
            attack_weight: parseInt(form.querySelector('[name="atk-weight"]')?.value) || null,
            attack_description: form.querySelector('[name="atk-desc"]')?.value?.trim() || null,
        };
        if (!body.nome || !body.skill_primary) return;

        const res = await post(`/personagem/${personagemId}/tft/ataque/novo`, body);
        if (res?.id) {
            appendAttackCard(res.id, body);
            form.style.display = 'none';
            // Reset form fields
            form.querySelectorAll('input[type="text"], input[type="number"], textarea').forEach(i => i.value = '');
        }
    });

    // Delete attack buttons
    function bindAttackDeleteButtons(context) {
        context.querySelectorAll('.tft-atk-delete').forEach(btn => {
            btn.addEventListener('click', async () => {
                const atkId = btn.dataset.attackId;
                if (!atkId) return;
                await post(`/personagem/${personagemId}/tft/ataque/${atkId}/deletar`, {});
                btn.closest('.combat-skill')?.remove();
            });
        });
    }
    bindAttackDeleteButtons(sheet);

    // Attack type select live update
    sheet.querySelectorAll('.atk-type-select').forEach(sel => {
        sel.addEventListener('change', () => {
            const card = sel.closest('.combat-skill');
            const label = card?.querySelector('.skill-type-label');
            if (label) {
                label.textContent = sel.value === 'DEFENSE' ? 'Defense'
                    : sel.value === 'CORROSION' ? 'Corrosion Skill'
                        : 'Attack';
            }
            markDirty('features'); // reuse features dirty flag for attack type; handled in save
        });
    });

    function appendAttackCard(id, atk) {
        const grid = document.getElementById('tftAttackList');
        const addCard = document.getElementById('tftAddSkillCard');

        const card = document.createElement('div');
        card.className = 'combat-skill';
        card.dataset.attackId = id;

        const typeLabel = atk.skill_type === 'DEFENSE' ? 'Defense'
            : atk.skill_type === 'CORROSION' ? 'Corrosion Skill'
                : 'Attack';
        const diceLabel = atk.dicepool_mode === 'ATTRIBUTE_AND_SKILL'
            ? `${atk.attribute} + ${atk.skill_primary}`
            : `${atk.skill_primary} + ${atk.skill_secondary}`;

        card.innerHTML = `
            <div class="skill-img-wrap">
                <img class="skill-img" src="https://placehold.net/120x80" alt="Skill art" />
            </div>
            <div class="combat-skill-meta">
                <span class="skill-type-label display-val">${typeLabel}</span>
                <select class="edit-inp atk-type-select" data-field="skill_type">
                    <option value="ATTACK"    ${atk.skill_type === 'ATTACK' ? 'selected' : ''}>Attack</option>
                    <option value="DEFENSE"   ${atk.skill_type === 'DEFENSE' ? 'selected' : ''}>Defense</option>
                    <option value="CORROSION" ${atk.skill_type === 'CORROSION' ? 'selected' : ''}>Corrosion Skill</option>
                </select>
            </div>
            <div class="combat-skill-header">
                <span class="skill-index">${diceLabel}</span>
                <div class="skill-name-row">
                    <span class="skill-title display-val">${atk.nome}</span>
                    <input class="edit-inp atk-name-inp" type="text" value="${atk.nome}" placeholder="Nome do ataque" />
                    <div class="skill-action-icons edit-inp" style="display:none;">
                        <button class="tft-atk-delete icon-btn" type="button"
                                data-attack-id="${id}" title="Excluir">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="atk-damage-summary">
                ${atk.damage_form ? `<span class="dmg-token dmg-form">${atk.damage_form}</span>` : ''}
                ${atk.damage_type ? `<span class="dmg-token dmg-type-${atk.damage_type}">${atk.damage_type}</span>` : ''}
                ${atk.threat ? `<span class="dmg-token dmg-meta">THREAT ${atk.threat}</span>` : ''}
                ${atk.attack_weight ? `<span class="dmg-token dmg-meta">ATTACK WEIGHT ${atk.attack_weight}</span>` : ''}
            </div>
            ${atk.attack_description ? `<div class="combat-skill-desc">${atk.attack_description}</div>` : ''}
        `;

        // Insert before the add-skill placeholder
        if (addCard) {
            grid.insertBefore(card, addCard);
        } else {
            grid.appendChild(card);
        }

        bindAttackDeleteButtons(card);
        card.querySelector('.atk-type-select')?.addEventListener('change', function () {
            const label = card.querySelector('.skill-type-label');
            if (label) {
                label.textContent = this.value === 'DEFENSE' ? 'Defense'
                    : this.value === 'CORROSION' ? 'Corrosion Skill'
                        : 'Attack';
            }
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
            // Close any open specialty inputs
            sheet.querySelectorAll('.skill-spec-input.open').forEach(inp => {
                inp.classList.remove('open');
                inp.style.display = 'none';
                const text = inp.closest('.skill-specialty-wrap')?.querySelector('.skill-spec-text');
                if (text) text.style.display = '';
            });
            // Hide add form if open
            if (atkAddForm) atkAddForm.style.display = 'none';
            if (rpAddSection) rpAddSection.style.display = 'none';
        } else {
            sheet.dataset.editing = 'true';
            toggle.querySelector('.edit-icon').textContent = 'edit_off';
            // Initialize resistance select values from display labels
            sheet.querySelectorAll('.tft-resist-sel').forEach(sel => {
                if (sel.dataset.value) sel.value = sel.dataset.value;
            });
        }
    });

    function updateDisplayValues() {
        // Name
        const nameVal = sheet.querySelector('.tft-name-inp')?.value;
        const nameDisp = sheet.querySelector('.charname.display-val');
        if (nameDisp && nameVal) nameDisp.textContent = nameVal;

        // Sin
        const sinSel = sheet.querySelector('.tft-sin-select');
        const sinLbl = sheet.querySelector('.sin-color-label');
        if (sinSel && sinLbl) {
            sinLbl.textContent = sinSel.value;
            sinLbl.className = 'sin-color-label display-val ' + sinSel.value;
        }

        // Resistance labels
        sheet.querySelectorAll('.tft-resist-sel').forEach(sel => {
            const row = sel.closest('.ft-row');
            const label = row?.querySelector('.ft-res-label');
            if (label) label.textContent = RESIST_LABELS[parseInt(sel.value)] || 'Normal';
            sel.dataset.value = sel.value;
        });

        // Feature names + descriptions
        sheet.querySelectorAll('.rp-entry').forEach(entry => {
            const nameInp = entry.querySelector('.rp-name-inp');
            const nameDisp = entry.querySelector('.rp-name');
            if (nameInp && nameDisp) nameDisp.textContent = nameInp.value;

            const descInp = entry.querySelector('.rp-desc-textarea');
            const descDisp = entry.querySelector('.rp-desc');
            if (descInp && descDisp) descDisp.textContent = descInp.value;
        });

        // Attack names and type labels
        sheet.querySelectorAll('.combat-skill').forEach(card => {
            const nameInp = card.querySelector('.atk-name-inp');
            const nameDisp = card.querySelector('.skill-title.display-val');
            if (nameInp && nameDisp) nameDisp.textContent = nameInp.value;

            const typeSel = card.querySelector('.atk-type-select');
            const typeDisp = card.querySelector('.skill-type-label');
            if (typeSel && typeDisp) {
                typeDisp.textContent = typeSel.value === 'DEFENSE' ? 'Defense'
                    : typeSel.value === 'CORROSION' ? 'Corrosion Skill'
                        : 'Attack';
            }
        });

        // Skill specialties
        sheet.querySelectorAll('.skill-row').forEach(row => {
            const inp = row.querySelector('.skill-spec-input');
            const text = row.querySelector('.skill-spec-text');
            if (inp && text) text.textContent = inp.value;
        });
    }

    // ══════════════════════════════════════════════════════
    //  GRANULARIZED SAVE
    // ══════════════════════════════════════════════════════

    async function saveChanges() {
        const saves = [];
        if (dirty.identidade) saves.push(saveIdentidade());
        if (dirty.recursos) saves.push(saveRecursos());
        if (dirty.atributos) saves.push(saveAtributos());
        if (dirty.skills) saves.push(saveSkills());
        if (dirty.resistances) saves.push(saveResistances());
        if (dirty.features) saves.push(saveFeatures());
        await Promise.all(saves);
    }

    async function saveIdentidade() {
        const nome = sheet.querySelector('.tft-name-inp')?.value?.trim();
        const sin = sheet.querySelector('.tft-sin-select')?.value;
        await post(`/personagem/${personagemId}/tft/identidade`, { nome, sin });
    }

    async function saveRecursos() {
        const sinPips = Array.from(document.querySelectorAll('#sinPipTrack .sin-pip.active'));
        await post(`/personagem/${personagemId}/tft/recursos`, {
            hpAtual: resState.hp.curr,
            hpMax: resState.hp.max,
            hpPale: resState.hp.pale,
            spAtual: resState.sp.curr,
            spMax: resState.sp.max,
            spPale: resState.sp.pale,
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
            const skill = row.dataset.skill;
            const points = parseInt(row.querySelector('.tft-skill-pts')?.value) || 0;
            const specialty = row.querySelector('.skill-spec-input')?.value?.trim() || null;
            if (skill) skills.push({ skill, points, specialty });
        });
        await post(`/personagem/${personagemId}/tft/skills`, { skills });
    }

    async function saveResistances() {
        const resistances = {};
        sheet.querySelectorAll('.tft-resist-sel').forEach(sel => {
            resistances[sel.dataset.resist] = parseInt(sel.value) || 3;
        });
        await post(`/personagem/${personagemId}/tft/resistencias`, resistances);
    }

    async function saveFeatures() {
        const features = [];
        sheet.querySelectorAll('.rp-entry').forEach(entry => {
            const id = entry.dataset.featureId;
            const nome = entry.querySelector('.rp-name-inp')?.value?.trim();
            const desc = entry.querySelector('.rp-desc-textarea')?.value?.trim();
            if (id && nome) features.push({ id: parseInt(id), nome, descricao: desc });
        });
        await post(`/personagem/${personagemId}/tft/features`, { features });
    }

    // ── Helper POST ───────────────────────────────────────
    async function post(url, body) {
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            if (!res.ok) { console.error(`POST ${url} →`, res.status); return null; }
            return res.json().catch(() => null);
        } catch (err) {
            console.error(`Fetch ${url}:`, err);
            return null;
        }
    }

    // ── Init ─────────────────────────────────────────────
    applySinStyle(getSinFromSheet());
    initResBoxes('hp');
    initResBoxes('sp');

    const sinContainer = sheet.querySelector('.sin-points-container');
    const savedSinPoints = parseInt(sinContainer?.dataset.sinPoints || '0');
    if (savedSinPoints > 0) {
        document.getElementById('sinPipTrack')?.querySelectorAll('.sin-pip').forEach(p => {
            p.classList.toggle('active', parseInt(p.dataset.index) <= savedSinPoints);
        });
    }
    
    // Apply Roman numerals to ratings from server-rendered data-rating
    sheet.querySelectorAll('.attr-group-rating').forEach(el => {
        const n = parseInt(el.dataset.rating);
        if (!isNaN(n)) el.textContent = toRoman(n);
    });

    // Init resistance select values
    sheet.querySelectorAll('.tft-resist-sel').forEach(sel => {
        if (sel.dataset.value) sel.value = sel.dataset.value;
    });
}