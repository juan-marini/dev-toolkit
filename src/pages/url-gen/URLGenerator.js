// URLGenerator.ts
document.addEventListener('DOMContentLoaded', function () {
    // Elementos do DOM
    var urlInput = document.getElementById('url-input');
    var urlOutput = document.getElementById('url-output');
    var shortenBtn = document.getElementById('shorten-btn');
    var encodeBtn = document.getElementById('encode-btn');
    var decodeBtn = document.getElementById('decode-btn');
    // Função para gerar um código curto único
    var generateShortCode = function () {
        var timestamp = Date.now().toString(36);
        var randomChars = Math.random().toString(36).substring(2, 6);
        return timestamp.substring(timestamp.length - 4) + randomChars;
    };
    // Verificar se há um código na URL atual para redirecionar
    var checkRedirect = function () {
        var urlParams = new URLSearchParams(window.location.search);
        var shortCode = urlParams.get('q');
        if (shortCode) {
            var urlMappings = JSON.parse(localStorage.getItem('urlMappings') || '{}');
            var originalUrl = urlMappings[shortCode];
            if (originalUrl) {
                // Adicionar http:// se necessário
                var formattedUrl = originalUrl.startsWith('http')
                    ? originalUrl
                    : "http://".concat(originalUrl);
                // Redirecionar para a URL original
                window.location.href = formattedUrl;
            }
        }
    };
    // Verificar redirecionamento ao carregar a página
    checkRedirect();
    // Função para encurtar a URL
    var shortenUrl = function () {
        var originalUrl = urlInput.value.trim();
        if (!originalUrl) {
            urlOutput.value = "Por favor, insira uma URL válida";
            return;
        }
        // Gerar código curto
        var shortCode = generateShortCode();
        // Salvar o mapeamento no localStorage
        var urlMappings = JSON.parse(localStorage.getItem('urlMappings') || '{}');
        urlMappings[shortCode] = originalUrl;
        localStorage.setItem('urlMappings', JSON.stringify(urlMappings));
        // Criar link curto que aponta para a mesma página com parâmetro de consulta
        var currentUrl = window.location.href.split('?')[0]; // Remover parâmetros existentes
        var shortUrl = "".concat(currentUrl, "?q=").concat(shortCode);
        // Exibir o link curto
        urlOutput.value = shortUrl;
    };
    // Funções de encode/decode
    var encodeUrl = function () {
        var input = urlInput.value;
        urlOutput.value = encodeURIComponent(input);
    };
    var decodeUrl = function () {
        var input = urlInput.value.trim();
        // Verificar se é uma URL curta
        var urlParams = new URLSearchParams(new URL(input).search);
        var shortCode = urlParams.get('q');
        if (shortCode) {
            var urlMappings = JSON.parse(localStorage.getItem('urlMappings') || '{}');
            if (urlMappings[shortCode]) {
                urlOutput.value = urlMappings[shortCode];
                return;
            }
        }
        // Caso contrário, realizar decode normal
        urlOutput.value = decodeURIComponent(input);
    };
    // Função para copiar o texto do resultado
    var copyToClipboard = function () {
        if (!urlOutput.value)
            return;
        urlOutput.select();
        document.execCommand('copy');
        // Feedback visual temporário
        var originalValue = urlOutput.value;
        urlOutput.value = "Copiado!";
        setTimeout(function () {
            urlOutput.value = originalValue;
        }, 1000);
    };
    // Adicionar event listeners
    shortenBtn === null || shortenBtn === void 0 ? void 0 : shortenBtn.addEventListener('click', shortenUrl);
    encodeBtn === null || encodeBtn === void 0 ? void 0 : encodeBtn.addEventListener('click', encodeUrl);
    decodeBtn === null || decodeBtn === void 0 ? void 0 : decodeBtn.addEventListener('click', decodeUrl);
    urlOutput === null || urlOutput === void 0 ? void 0 : urlOutput.addEventListener('click', copyToClipboard);
});
