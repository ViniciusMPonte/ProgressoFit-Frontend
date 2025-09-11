import {ApiService} from "../src/service/ApiService.js";

let toggleState = false;

// Funcionalidade do toggle
const toggleButton = document.getElementById('toggleButton');
const toggleLabel = document.getElementById('toggleLabel');

toggleButton.addEventListener('click', function () {
    toggleState = !toggleState;

    if (toggleState) {
        toggleButton.classList.add('active');
        toggleLabel.textContent = 'Ativado (1)';
    } else {
        toggleButton.classList.remove('active');
        toggleLabel.textContent = 'Desativado (0)';
    }
});

document.getElementById('dataForm').addEventListener('submit', async function (e) {
    e.preventDefault();


    const numero = toggleState ? 1 : 0;
    const data = document.getElementById('dataField').value;

    const postUrl = '/api/statistics/date/' + data;

    const statusDiv = document.getElementById('status');
    const submitButton = e.target.querySelector('button[type="submit"]');


    // Preparar dados para envio
    const formData = {
        count: numero
    };

    console.log('Enviando dados:', formData);

    // Desabilitar botão durante envio
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';

    try {

        const api = new ApiService()
        const result = await api.request(postUrl, {
            method: 'PUT',
            body: JSON.stringify(formData)
        });


        if (result.success) {
            showStatus('Dados enviados com sucesso!', 'success');
            document.getElementById('dataField').value = '';
            // Reset do toggle
            toggleState = false;
            toggleButton.classList.remove('active');
            toggleLabel.textContent = 'Desativado (0)';
        } else {
            showStatus(`Erro no envio: ${response.status} - ${response.statusText}`, 'error');
        }

    } catch (error) {
        showStatus(`Erro de conexão: ${error.message}`, 'error');
    }

    // Reabilitar botão
    submitButton.disabled = false;
    submitButton.textContent = 'Enviar Dados';
});

function showStatus(message, type) {
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    statusDiv.style.display = 'block';

    // Ocultar mensagem após 5 segundos
    setTimeout(() => {
        statusDiv.style.display = 'none';
    }, 5000);
}