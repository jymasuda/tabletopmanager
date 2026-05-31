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
                <p>Visualização de D&D 5e.</p>
                <ul>
                  ${name}
                </ul>
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
    }


    function createCharacterCard(name, category) {
        const card = document.createElement('article');
        card.className = 'character-card';
        card.dataset.category = category;
        card.innerHTML = `
            <img class="avatar" src="https://placehold.net/avatar.svg" alt="Avatar">
            <div class="character-info">
                <div class="name-row">
                    <h2>${name}</h2>
                    <button class="card-action" type="button" aria-label="Opções"><span class="material-symbols-outlined">more_vert</span></button>
                </div>
                <p class="subtitle">Sistema: ${category}</p>
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

    // Função para filtrar cards por categoria
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

    // Função para selecionar um personagem
    function selectCharacter(card) {
        // Remover seleção anterior
        sidebarMiddle.querySelectorAll('.character-card:not(.add-character-card)').forEach(c => c.classList.remove('selected'));
        selectedCharacter = card;
        card.classList.add('selected');

        // Atualizar content-pane com detalhes do personagem usando o sistema do card
        renderCharacterDetail(card);
    }

    // Função para logout
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
                // um showToast de erro aqui se quiser
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

    // Inicializar com primeiro card selecionado se existir
    if (characterCards.length > 0) {
        selectCharacter(characterCards[0]);
    }

    // Inicializar categorias visíveis
    updateCategoryTabs();

    
});