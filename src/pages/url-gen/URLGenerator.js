"use strict";
// URLGenerator.ts
document.addEventListener('DOMContentLoaded', () => {
    // Elementos do DOM
    const urlInput = document.getElementById('url-input');
    const urlOutput = document.getElementById('url-output');
    const shortenBtn = document.getElementById('shorten-btn');
    const encodeBtn = document.getElementById('encode-btn');
    const decodeBtn = document.getElementById('decode-btn');
    // Função para gerar um código curto único
    const generateShortCode = () => {
        const timestamp = Date.now().toString(36);
        const randomChars = Math.random().toString(36).substring(2, 6);
        return timestamp.substring(timestamp.length - 4) + randomChars;
    };
    // Verificar se há um código na URL atual para redirecionar
    const checkRedirect = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const shortCode = urlParams.get('q');
        if (shortCode) {
            const urlMappings = JSON.parse(localStorage.getItem('urlMappings') || '{}');
            const originalUrl = urlMappings[shortCode];
            if (originalUrl) {
                // Adicionar http:// se necessário
                const formattedUrl = originalUrl.startsWith('http')
                    ? originalUrl
                    : `http://${originalUrl}`;
                // Redirecionar para a URL original
                window.location.href = formattedUrl;
            }
        }
    };
    // Verificar redirecionamento ao carregar a página
    checkRedirect();
    // Função para encurtar a URL
    const shortenUrl = () => {
        const originalUrl = urlInput.value.trim();
        if (!originalUrl) {
            urlOutput.value = "Por favor, insira uma URL válida";
            return;
        }
        // Gerar código curto
        const shortCode = generateShortCode();
        // Salvar o mapeamento no localStorage
        const urlMappings = JSON.parse(localStorage.getItem('urlMappings') || '{}');
        urlMappings[shortCode] = originalUrl;
        localStorage.setItem('urlMappings', JSON.stringify(urlMappings));
        // Criar link curto que aponta para a mesma página com parâmetro de consulta
        const currentUrl = window.location.href.split('?')[0]; // Remover parâmetros existentes
        const shortUrl = `${currentUrl}?q=${shortCode}`;
        // Exibir o link curto
        urlOutput.value = shortUrl;
    };
    // Funções de encode/decode
    const encodeUrl = () => {
        const input = urlInput.value;
        urlOutput.value = encodeURIComponent(input);
    };
    const decodeUrl = () => {
        const input = urlInput.value.trim();
        // Verificar se é uma URL curta
        const urlParams = new URLSearchParams(new URL(input).search);
        const shortCode = urlParams.get('q');
        if (shortCode) {
            const urlMappings = JSON.parse(localStorage.getItem('urlMappings') || '{}');
            if (urlMappings[shortCode]) {
                urlOutput.value = urlMappings[shortCode];
                return;
            }
        }
        // Caso contrário, realizar decode normal
        urlOutput.value = decodeURIComponent(input);
    };
    // Função para copiar o texto do resultado
    const copyToClipboard = () => {
        if (!urlOutput.value)
            return;
        urlOutput.select();
        document.execCommand('copy');
        // Feedback visual temporário
        const originalValue = urlOutput.value;
        urlOutput.value = "Copiado!";
        setTimeout(() => {
            urlOutput.value = originalValue;
        }, 1000);
    };
    // Adicionar event listeners
    shortenBtn?.addEventListener('click', shortenUrl);
    encodeBtn?.addEventListener('click', encodeUrl);
    decodeBtn?.addEventListener('click', decodeUrl);
    urlOutput?.addEventListener('click', copyToClipboard);
});
