document.addEventListener('DOMContentLoaded', () => {
    console.log('script.js carregado e DOMContentLoaded disparado.');

    // Seletores de elementos
    const tabs = document.querySelectorAll('header nav button');
    const contents = document.querySelectorAll('main section');
    const allModals = document.querySelectorAll('dialog');

    console.log('Número de abas encontradas:', tabs.length);
    console.log('Número de seções de conteúdo encontradas:', contents.length);

    
    
    const mensalidadeModal = document.getElementById('mensalidade-modal');
    const salaoFestaModal = document.getElementById('salao-festa-modal');
    const taxaElevadorModal = document.getElementById('taxa-elevador-modal');
    const taxaAguaModal = document.getElementById('taxa-agua-modal');
    const reciclagemModal = document.getElementById('reciclagem-modal');
    const outrosModal = document.getElementById('outros-modal');

    

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

    

    allModals.forEach(modal => {
        const closeButton = modal.querySelector('.close-button');
        if (closeButton && closeButton.id !== 'close-salario-modal') {
            closeButton.addEventListener('click', () => modal.close());
        }
    });

    const closeSalarioModalButton = document.getElementById('close-salario-modal');
    if (closeSalarioModalButton) {
        closeSalarioModalButton.addEventListener('click', () => {
            allModals.forEach(modal => modal.close());
        });
    }

    

    

    

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

    const addMensalidadeButton = document.getElementById('add-mensalidade-button');
    if (addMensalidadeButton) {
        addMensalidadeButton.addEventListener('click', () => {
            const addMensalidadeModal = document.getElementById('addMensalidadeModal');
            addMensalidadeModal.showModal();
        });
    }

    

    

    const addContaReceberButton = document.getElementById('add-conta-receber-button');
    const addContaReceberModal = document.getElementById('add-conta-receber-modal');

    if (addContaReceberButton) {
        addContaReceberButton.addEventListener('click', () => {
            addContaReceberModal.showModal();
        });
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

    // Função para formatar valores monetários
    function formatCurrency(input) {
        let value = input.value.replace(/\D/g, ''); // Remove tudo que não é dígito
        if (value.length === 0) {
            input.value = '';
            return;
        }
        value = (parseInt(value) / 100).toFixed(2); // Converte para float e formata com 2 casas decimais
        value = value.replace('.', ','); // Troca ponto por vírgula
        value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.'); // Adiciona pontos nos milhares
        input.value = 'R$ ' + value;
    }

    // Lógica para o input de valor da conta a receber
    const addContaReceberValorInput = document.getElementById('add-conta-receber-valor');
    if (addContaReceberValorInput) {
        addContaReceberValorInput.addEventListener('input', () => {
            formatCurrency(addContaReceberValorInput);
        });
    }

    // Lógica para o formulário de adicionar conta a receber
    const addContaReceberForm = document.getElementById('add-conta-receber-form');
    if (addContaReceberForm) {
        addContaReceberForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Previne o envio padrão do formulário

            const apto = document.getElementById('add-conta-receber-apto').value;
            const categoria = document.getElementById('add-conta-receber-categoria').value;
            const competencia = document.getElementById('add-conta-receber-competencia').value;
            const valorFormatado = document.getElementById('add-conta-receber-valor').value;

            // Remover "R$" e pontos, e trocar vírgula por ponto para converter para número
            const valorNumerico = parseFloat(valorFormatado.replace('R$ ', '').replace('.', '').replace(',', '.'));

            console.log('Nova Conta a Receber:', {
                apto,
                categoria,
                competencia,
                valor: valorNumerico
            });

            // Fechar o modal e resetar o formulário
            addContaReceberModal.close();
            addContaReceberForm.reset();
        });
    }
});
