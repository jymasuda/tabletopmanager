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

    async function renderCharacterDetail(card) {
        const id = card.dataset.id;
        const system = card.dataset.category;

        try {
            switch(system) {
                case 'DND5E':
                    url = `/personagem/${id}/dnd`;
                    break;
                case 'TFT':
                    url = `/personagem/${id}/tft`;
                    break;
                default:
                    console.error("Sistema inválido");
                    break;
            }

            const res = await fetch(url);

            if (!res.ok) {
                console.error('Erro ao carregar ficha:', res.status);
                return;
            }

            const html = await res.text();
            contentPane.innerHTML = `<div class="character-detail"><div class="detail-content">${html}</div></div>`;

            if (system === 'DND5E') initDndSheet();
            if (system === 'TFT') initTftSheet();
        } catch (err) {
            console.error('Erro ao carregar ficha:', err);
        }
    }


    function createCharacterCard(name, category, id) {
        const card = document.createElement('article');
        card.className = 'character-card';
        card.dataset.category = category;
        card.dataset.id = id;
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
                    <div class="card-menu hidden">
                        <button class="card-menu-item delete-character" type="button">Excluir</button>
                    </div>
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

    async function selectCharacter(card) {
        sidebarMiddle.querySelectorAll('.character-card:not(.add-character-card)')
            .forEach(c => c.classList.remove('selected'));
        selectedCharacter = card;
        card.classList.add('selected');
        await renderCharacterDetail(card);
    }

    function closeAllMenus() {
        sidebarMiddle.querySelectorAll('.card-menu:not(.hidden)').forEach(menu => {
            menu.classList.add('hidden');
        });
    }

    function toggleCardMenu(card) {
        const menu = card.querySelector('.card-menu');
        if (!menu) return;
        const isOpen = !menu.classList.contains('hidden');
        closeAllMenus();
        menu.classList.toggle('hidden', isOpen);
    }

    async function handleDeleteCharacter(card) {
        const id = card.dataset.id;
        const name = card.querySelector('h2')?.textContent || 'personagem';

        if (!confirm(`Excluir "${name}"? Esta ação não pode ser desfeita.`)) {
            closeAllMenus();
            return;
        }

        try {
            const response = await fetch(`/personagem/${id}/deletar`, { method: 'POST' });
            if (response.ok) {
                if (selectedCharacter === card) {
                    selectedCharacter = null;
                    contentPane.innerHTML = `
                        <div class="hero-panel">
                            <h1>Seus personagens</h1>
                            <p>Gerencie rapidamente suas fichas de RPG com a navegação lateral.</p>
                        </div>`;
                }
                const idx = characterCards.indexOf(card);
                if (idx !== -1) characterCards.splice(idx, 1);
                card.remove();
                updateCategoryTabs();
            } else {
                const data = await response.json().catch(() => ({}));
                alert(data.error || 'Erro ao excluir personagem.');
            }
        } catch (err) {
            console.error('Erro ao excluir personagem:', err);
            alert('Erro de conexão. Tente novamente.');
        }

        closeAllMenus();
    }

    async function logout() {
        await fetch('/logout', { method: 'POST' });
        window.location.href = '/';
    }

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterCardsByCategory(button.textContent);
        });
    });

    characterCards.forEach(card => {
        card.addEventListener('click', () => {
            selectCharacter(card);
        });
    });

    sidebarMiddle.addEventListener('click', event => {
        const actionButton = event.target.closest('.card-action');
        if (actionButton) {
            event.stopPropagation();
            const card = actionButton.closest('.character-card');
            if (card) {
                toggleCardMenu(card);
            }
            return;
        }

        const deleteButton = event.target.closest('.delete-character');
        if (deleteButton) {
            event.stopPropagation();
            const card = deleteButton.closest('.character-card');
            if (card) {
                handleDeleteCharacter(card);
            }
            return;
        }
    });

    document.addEventListener('click', event => {
        if (!event.target.closest('.character-card')) {
            closeAllMenus();
        }
    });

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
                    const data = await response.json();
                    hideAddCharacterForm();
                    const newCard = createCharacterCard(name, category, data.id);
                    updateCategoryTabs();
                    await selectCharacter(newCard);
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

    updateCategoryTabs();


});