// api-tester.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// Envolvendo todo o código em uma IIFE (Immediately Invoked Function Expression)
// para evitar conflitos de variáveis no escopo global
(function () {
    // Elementos DOM
    var methodSelect = document.getElementById('method');
    var apiUrlInput = document.getElementById('apiUrl');
    var headersContainer = document.getElementById('headers-container');
    var paramsContainer = document.getElementById('params-container');
    var requestBodyTextarea = document.getElementById('request-body');
    var bodyFormatSelect = document.getElementById('body-format');
    var sendRequestBtn = document.getElementById('send-request');
    var statusCodeElement = document.getElementById('status-code');
    var responseTimeElement = document.getElementById('response-time');
    var responseBodyElement = document.getElementById('response-body');
    // Elementos da tab
    var tabHeaders = document.querySelectorAll('.tab-header');
    var tabContents = document.querySelectorAll('.tab-content');
    // Botões de ação
    var addHeaderBtn = document.getElementById('add-header');
    var addParamBtn = document.getElementById('add-param');
    // Inicialização
    document.addEventListener('DOMContentLoaded', function () {
        initTabs();
        addHeaderRow();
        addParamRow();
        addEventListeners();
    });
    // Inicializa as tabs
    function initTabs() {
        tabHeaders.forEach(function (header) {
            header.addEventListener('click', function () {
                var _a;
                // Remove active das outras tabs
                tabHeaders.forEach(function (h) { return h.classList.remove('active'); });
                tabContents.forEach(function (c) { return c.classList.remove('active'); });
                // Adiciona active na tab clicada
                header.classList.add('active');
                var tabId = "".concat(header.dataset.tab, "-tab");
                (_a = document.getElementById(tabId)) === null || _a === void 0 ? void 0 : _a.classList.add('active');
            });
        });
    }
    // Adiciona listeners para os botões
    function addEventListeners() {
        addHeaderBtn.addEventListener('click', addHeaderRow);
        addParamBtn.addEventListener('click', addParamRow);
        sendRequestBtn.addEventListener('click', sendRequest);
    }
    // Cria uma nova linha de header
    function addHeaderRow() {
        var row = document.createElement('div');
        row.className = 'param-row';
        var keyInput = document.createElement('input');
        keyInput.type = 'text';
        keyInput.placeholder = 'Nome do Header';
        keyInput.className = 'header-key';
        var valueInput = document.createElement('input');
        valueInput.type = 'text';
        valueInput.placeholder = 'Valor do Header';
        valueInput.className = 'header-value';
        var removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn';
        removeBtn.innerHTML = '<i class="fas fa-times"></i>';
        removeBtn.addEventListener('click', function () { return row.remove(); });
        row.appendChild(keyInput);
        row.appendChild(valueInput);
        row.appendChild(removeBtn);
        headersContainer.appendChild(row);
    }
    // Cria uma nova linha de parâmetro
    function addParamRow() {
        var row = document.createElement('div');
        row.className = 'param-row';
        var keyInput = document.createElement('input');
        keyInput.type = 'text';
        keyInput.placeholder = 'Nome do Parâmetro';
        keyInput.className = 'param-key';
        var valueInput = document.createElement('input');
        valueInput.type = 'text';
        valueInput.placeholder = 'Valor do Parâmetro';
        valueInput.className = 'param-value';
        var removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn';
        removeBtn.innerHTML = '<i class="fas fa-times"></i>';
        removeBtn.addEventListener('click', function () { return row.remove(); });
        row.appendChild(keyInput);
        row.appendChild(valueInput);
        row.appendChild(removeBtn);
        paramsContainer.appendChild(row);
    }
    // Coleta os headers do formulário
    function getHeaders() {
        var headers = {};
        var headerRows = headersContainer.querySelectorAll('.param-row');
        headerRows.forEach(function (row) {
            var keyInput = row.querySelector('.header-key');
            var valueInput = row.querySelector('.header-value');
            if (keyInput.value.trim() !== '') {
                headers[keyInput.value.trim()] = valueInput.value.trim();
            }
        });
        return headers;
    }
    // Coleta os parâmetros de URL do formulário
    function getParams() {
        var params = {};
        var paramRows = paramsContainer.querySelectorAll('.param-row');
        paramRows.forEach(function (row) {
            var keyInput = row.querySelector('.param-key');
            var valueInput = row.querySelector('.param-value');
            if (keyInput.value.trim() !== '') {
                params[keyInput.value.trim()] = valueInput.value.trim();
            }
        });
        return params;
    }
    // Constrói a URL com os parâmetros
    function buildUrl(baseUrl, params) {
        var url = new URL(baseUrl);
        Object.keys(params).forEach(function (key) {
            url.searchParams.append(key, params[key]);
        });
        return url.toString();
    }
    // Prepara o corpo da requisição
    function getRequestBody() {
        var bodyFormat = bodyFormatSelect.value;
        var bodyContent = requestBodyTextarea.value.trim();
        if (!bodyContent)
            return null;
        switch (bodyFormat) {
            case 'json':
                try {
                    // Valida se é um JSON válido
                    JSON.parse(bodyContent);
                    return bodyContent;
                }
                catch (e) {
                    alert('O JSON informado é inválido. Verifique a sintaxe.');
                    return null;
                }
            case 'form':
                try {
                    var formData_1 = new FormData();
                    var jsonData_1 = JSON.parse(bodyContent);
                    Object.keys(jsonData_1).forEach(function (key) {
                        formData_1.append(key, jsonData_1[key]);
                    });
                    return formData_1;
                }
                catch (e) {
                    alert('Os dados de formulário são inválidos. Use formato JSON para representar os campos.');
                    return null;
                }
            case 'text':
                return bodyContent;
            default:
                return null;
        }
    }
    // Atualiza a UI com a resposta
    function updateResponseUI(response) {
        // Atualiza o status code
        statusCodeElement.textContent = response.status.toString();
        statusCodeElement.className = 'status-code';
        if (response.status >= 200 && response.status < 300) {
            statusCodeElement.classList.add('success');
        }
        else {
            statusCodeElement.classList.add('error');
        }
        // Atualiza o tempo de resposta
        responseTimeElement.textContent = "".concat(response.time.toFixed(0), " ms");
        // Atualiza o corpo da resposta
        try {
            if (typeof response.data === 'object') {
                responseBodyElement.textContent = JSON.stringify(response.data, null, 2);
            }
            else {
                responseBodyElement.textContent = response.data;
            }
        }
        catch (e) {
            responseBodyElement.textContent = 'Erro ao processar a resposta.';
        }
    }
    // Envia a requisição
    function sendRequest() {
        return __awaiter(this, void 0, void 0, function () {
            var method, url, headers, params, fullUrl, body, startTime, requestInit, response, endTime, responseTime, responseData, contentType, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 8, 9, 10]);
                        method = methodSelect.value;
                        url = apiUrlInput.value.trim();
                        if (!url) {
                            alert('Por favor, informe uma URL válida.');
                            return [2 /*return*/];
                        }
                        // Verifica se a URL é válida
                        if (!url.startsWith('http://') && !url.startsWith('https://')) {
                            url = "https://".concat(url);
                        }
                        try {
                            new URL(url);
                        }
                        catch (e) {
                            alert('A URL informada é inválida.');
                            return [2 /*return*/];
                        }
                        headers = getHeaders();
                        params = getParams();
                        fullUrl = buildUrl(url, params);
                        body = ['POST', 'PUT', 'PATCH'].includes(method) ? getRequestBody() : null;
                        if (body === null && ['POST', 'PUT', 'PATCH'].includes(method) && requestBodyTextarea.value.trim() !== '') {
                            return [2 /*return*/]; // A validação do corpo falhou, então cancelamos a requisição
                        }
                        // Atualiza a UI para indicar que a requisição está em andamento
                        statusCodeElement.textContent = '...';
                        responseTimeElement.textContent = '...';
                        responseBodyElement.textContent = 'Enviando requisição...';
                        sendRequestBtn.disabled = true;
                        startTime = performance.now();
                        requestInit = {
                            method: method,
                            headers: headers,
                            mode: 'cors',
                            cache: 'no-cache',
                            credentials: 'same-origin',
                            redirect: 'follow',
                        };
                        // Adiciona o corpo se necessário
                        if (body) {
                            if (body instanceof FormData) {
                                requestInit.body = body;
                            }
                            else {
                                if (headers['Content-Type'] === undefined && bodyFormatSelect.value === 'json') {
                                    // Adiciona Content-Type se não estiver definido e for JSON
                                    requestInit.headers['Content-Type'] = 'application/json';
                                }
                                requestInit.body = body;
                            }
                        }
                        return [4 /*yield*/, fetch(fullUrl, requestInit)];
                    case 1:
                        response = _a.sent();
                        endTime = performance.now();
                        responseTime = endTime - startTime;
                        responseData = void 0;
                        contentType = response.headers.get('content-type') || '';
                        if (!contentType.includes('application/json')) return [3 /*break*/, 3];
                        return [4 /*yield*/, response.json()];
                    case 2:
                        responseData = _a.sent();
                        return [3 /*break*/, 7];
                    case 3:
                        if (!contentType.includes('text/')) return [3 /*break*/, 5];
                        return [4 /*yield*/, response.text()];
                    case 4:
                        responseData = _a.sent();
                        return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, response.text()];
                    case 6:
                        responseData = _a.sent();
                        _a.label = 7;
                    case 7:
                        // Atualiza a UI com a resposta
                        updateResponseUI({
                            status: response.status,
                            time: responseTime,
                            data: responseData
                        });
                        return [3 /*break*/, 10];
                    case 8:
                        error_1 = _a.sent();
                        // Atualiza a UI em caso de erro
                        updateResponseUI({
                            status: 0,
                            time: 0,
                            data: "Erro ao enviar requisi\u00E7\u00E3o: ".concat(error_1.message)
                        });
                        return [3 /*break*/, 10];
                    case 9:
                        // Habilita o botão novamente
                        sendRequestBtn.disabled = false;
                        return [7 /*endfinally*/];
                    case 10: return [2 /*return*/];
                }
            });
        });
    }
})(); // Fim da IIFE
