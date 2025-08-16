document.addEventListener('DOMContentLoaded', () => {
    // Seletores de elementos
    const tabs = document.querySelectorAll('header nav button');
    const contents = document.querySelectorAll('main section');
    const allModals = document.querySelectorAll('dialog');

    const entradaModal = document.getElementById('entrada-modal');
    const saidaModal = document.getElementById('saida-modal');
    const editResidentModal = document.getElementById('edit-resident-modal');
    const mensalidadeModal = document.getElementById('mensalidade-modal');
    const salaoFestaModal = document.getElementById('salao-festa-modal');
    const taxaElevadorModal = document.getElementById('taxa-elevador-modal');
    const taxaAguaModal = document.getElementById('taxa-agua-modal');
    const reciclagemModal = document.getElementById('reciclagem-modal');
    const outrosModal = document.getElementById('outros-modal');

    const addResidentButton = document.querySelector('#fluxo-de-caixa .add-resident-button');
    const addExpenseButton = document.querySelector('#fluxo-de-caixa .add-expense-button');

    const searchInput = document.querySelector('#moradores .search-bar input');
    const moradoresTbody = document.getElementById('moradores-tbody');
    const addNewResidentButton = document.querySelector('.add-new-resident-button');

    const modalAptoInput = document.getElementById('modal-apto-input');
    const modalTitleText = document.getElementById('modal-title-text');

    // --- LÓGICA DE NAVEGAÇÃO ---

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-target');
            contents.forEach(content => {
                content.hidden = content.id !== target;
            });
        });
    });

    // --- LÓGICA DOS MODAIS ---

    if (addResidentButton) {
        addResidentButton.addEventListener('click', () => entradaModal.showModal());
    }

    if (addExpenseButton) {
        addExpenseButton.addEventListener('click', () => saidaModal.showModal());
    }

    allModals.forEach(modal => {
        const closeButton = modal.querySelector('.close-button');
        if (closeButton) {
            closeButton.addEventListener('click', () => modal.close());
        }
    });

    const entradaCategoryButtons = document.querySelectorAll('#entrada-modal .category-buttons button');
    entradaCategoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            entradaModal.close();

            switch (category) {
                case 'Mensalidade':
                    setupApartmentFilter();
                    mensalidadeModal.showModal();
                    break;
                case 'Salão de festa':
                    salaoFestaModal.showModal();
                    break;
                case 'Taxa elevador':
                    taxaElevadorModal.showModal();
                    break;
                case 'Taxa água':
                    taxaAguaModal.showModal();
                    break;
                case 'Reciclagem':
                    reciclagemModal.showModal();
                    break;
                case 'Outros':
                    outrosModal.showModal();
                    break;
            }
        });
    });

    const backButtons = document.querySelectorAll('.back-button');
    backButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.closest('dialog').close();
            entradaModal.showModal();
        });
    });

    // --- LÓGICA DA SEÇÃO MORADORES ---

    if (searchInput) {
        searchInput.addEventListener('keyup', () => {
            const searchTerm = searchInput.value.toLowerCase();
            const tableRows = document.querySelectorAll('#moradores tbody tr');
            tableRows.forEach(row => {
                row.style.display = row.textContent.toLowerCase().includes(searchTerm) ? '' : 'none';
            });
        });
    }

    if (addNewResidentButton) {
        addNewResidentButton.addEventListener('click', () => {
            const residentModal = document.getElementById('residentModal');
            const modalTitle = document.getElementById('modal-title-text');
            const residentForm = document.getElementById('residentForm');
            const aptoInput = document.getElementById('modal-apto-input');

            modalTitle.textContent = 'Adicionar Morador';
            residentForm.reset();
            aptoInput.readOnly = false;
            aptoInput.value = '';
            residentModal.showModal();
        });
    }

    // Lógica para Saída (seleção de categoria e formulário)
    const saidaCategoryButtons = document.querySelectorAll('#saida-modal .category-buttons button');
    const saidaForm = document.getElementById('saida-form');
    const saidaCategoriaInput = document.getElementById('saida-categoria');
    const salarioModal = document.getElementById('salario-modal');

    saidaCategoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            saidaCategoriaInput.value = category;

            const modalTitle = salarioModal.querySelector('h2');
            if (modalTitle) {
                modalTitle.textContent = `Registrar Saída - ${category}`;
            }

            const outrosCategoriaWrapper = document.getElementById('outros-categoria-wrapper');
            if (category === 'Outros') {
                outrosCategoriaWrapper.hidden = false;
            } else {
                outrosCategoriaWrapper.hidden = true;
            }

            salarioModal.showModal();
        });
    });

    if (salarioModal) {
        

        const form = salarioModal.querySelector('form');
        if (form) {
            form.addEventListener('submit', (event) => {
                event.preventDefault();
                salarioModal.close();
                form.reset();
            });
        }
    }

    function setupApartmentFilter() {
        const searchInput = document.getElementById('mensalidade-apto-search');
        const optionsContainer = document.getElementById('mensalidade-apto-list');
        const allApartments = Array.from(document.querySelectorAll('#moradores tbody tr')).map(tr => tr.dataset.apto);

        searchInput.addEventListener('focus', () => {
            populateOptions(allApartments);
            optionsContainer.hidden = false;
        });

        searchInput.addEventListener('input', () => {
            const filter = searchInput.value.toLowerCase();
            const filteredApartments = allApartments.filter(apto => apto.toLowerCase().includes(filter));
            populateOptions(filteredApartments);
            optionsContainer.hidden = false;
        });

        function populateOptions(apartments) {
            optionsContainer.innerHTML = '';
            apartments.forEach(apto => {
                const option = document.createElement('div');
                option.textContent = apto;
                option.addEventListener('click', () => {
                    searchInput.value = apto;
                    optionsContainer.hidden = true;
                });
                optionsContainer.appendChild(option);
            });
        }

        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target)) {
                optionsContainer.hidden = true;
            }
        });

        const mensalidadeForm = document.getElementById('mensalidade-form');
        if (mensalidadeForm) {
            mensalidadeForm.addEventListener('submit', (event) => {
                event.preventDefault(); // Previne o envio padrão do formulário
                mensalidadeModal.close(); // Fecha o modal após o envio
                mensalidadeForm.reset(); // Limpa o formulário
            });
        }
    }
});
