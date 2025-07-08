// api-tester.ts

// Envolvendo todo o código em uma IIFE (Immediately Invoked Function Expression)
// para evitar conflitos de variáveis no escopo global
(function() {
  // Interfaces
  interface Header {
    key: string;
    value: string;
  }

  interface Param {
    key: string;
    value: string;
  }

  interface ApiResponse {
    status: number;
    time: number;
    data: any;
  }

  // Elementos DOM
  const methodSelect = document.getElementById('method') as HTMLSelectElement;
  const apiUrlInput = document.getElementById('apiUrl') as HTMLInputElement;
  const headersContainer = document.getElementById('headers-container') as HTMLDivElement;
  const paramsContainer = document.getElementById('params-container') as HTMLDivElement;
  const requestBodyTextarea = document.getElementById('request-body') as HTMLTextAreaElement;
  const bodyFormatSelect = document.getElementById('body-format') as HTMLSelectElement;
  const sendRequestBtn = document.getElementById('send-request') as HTMLButtonElement;
  const statusCodeElement = document.getElementById('status-code') as HTMLSpanElement;
  const responseTimeElement = document.getElementById('response-time') as HTMLSpanElement;
  const responseBodyElement = document.getElementById('response-body') as HTMLPreElement;

  // Elementos da tab
  const tabHeaders = document.querySelectorAll('.tab-header') as NodeListOf<HTMLDivElement>;
  const tabContents = document.querySelectorAll('.tab-content') as NodeListOf<HTMLDivElement>;

  // Botões de ação
  const addHeaderBtn = document.getElementById('add-header') as HTMLButtonElement;
  const addParamBtn = document.getElementById('add-param') as HTMLButtonElement;

  // Inicialização
  document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    addHeaderRow();
    addParamRow();
    addEventListeners();
  });

  // Inicializa as tabs
  function initTabs(): void {
    tabHeaders.forEach(header => {
      header.addEventListener('click', () => {
        // Remove active das outras tabs
        tabHeaders.forEach(h => h.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        // Adiciona active na tab clicada
        header.classList.add('active');
        const tabId = `${header.dataset.tab}-tab`;
        document.getElementById(tabId)?.classList.add('active');
      });
    });
  }

  // Adiciona listeners para os botões
  function addEventListeners(): void {
    addHeaderBtn.addEventListener('click', addHeaderRow);
    addParamBtn.addEventListener('click', addParamRow);
    sendRequestBtn.addEventListener('click', sendRequest);
  }

  // Cria uma nova linha de header
  function addHeaderRow(): void {
    const row = document.createElement('div');
    row.className = 'param-row';
    
    const keyInput = document.createElement('input');
    keyInput.type = 'text';
    keyInput.placeholder = 'Nome do Header';
    keyInput.className = 'header-key';
    
    const valueInput = document.createElement('input');
    valueInput.type = 'text';
    valueInput.placeholder = 'Valor do Header';
    valueInput.className = 'header-value';
    
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.innerHTML = '<i class="fas fa-times"></i>';
    removeBtn.addEventListener('click', () => row.remove());
    
    row.appendChild(keyInput);
    row.appendChild(valueInput);
    row.appendChild(removeBtn);
    
    headersContainer.appendChild(row);
  }

  // Cria uma nova linha de parâmetro
  function addParamRow(): void {
    const row = document.createElement('div');
    row.className = 'param-row';
    
    const keyInput = document.createElement('input');
    keyInput.type = 'text';
    keyInput.placeholder = 'Nome do Parâmetro';
    keyInput.className = 'param-key';
    
    const valueInput = document.createElement('input');
    valueInput.type = 'text';
    valueInput.placeholder = 'Valor do Parâmetro';
    valueInput.className = 'param-value';
    
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.innerHTML = '<i class="fas fa-times"></i>';
    removeBtn.addEventListener('click', () => row.remove());
    
    row.appendChild(keyInput);
    row.appendChild(valueInput);
    row.appendChild(removeBtn);
    
    paramsContainer.appendChild(row);
  }

  // Coleta os headers do formulário
  function getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};
    const headerRows = headersContainer.querySelectorAll('.param-row');
    
    headerRows.forEach(row => {
      const keyInput = row.querySelector('.header-key') as HTMLInputElement;
      const valueInput = row.querySelector('.header-value') as HTMLInputElement;
      
      if (keyInput.value.trim() !== '') {
        headers[keyInput.value.trim()] = valueInput.value.trim();
      }
    });
    
    return headers;
  }

  // Coleta os parâmetros de URL do formulário
  function getParams(): Record<string, string> {
    const params: Record<string, string> = {};
    const paramRows = paramsContainer.querySelectorAll('.param-row');
    
    paramRows.forEach(row => {
      const keyInput = row.querySelector('.param-key') as HTMLInputElement;
      const valueInput = row.querySelector('.param-value') as HTMLInputElement;
      
      if (keyInput.value.trim() !== '') {
        params[keyInput.value.trim()] = valueInput.value.trim();
      }
    });
    
    return params;
  }

  // Constrói a URL com os parâmetros
  function buildUrl(baseUrl: string, params: Record<string, string>): string {
    const url = new URL(baseUrl);
    
    Object.keys(params).forEach(key => {
      url.searchParams.append(key, params[key]);
    });
    
    return url.toString();
  }

  // Prepara o corpo da requisição
  function getRequestBody(): string | FormData | null {
    const bodyFormat = bodyFormatSelect.value;
    const bodyContent = requestBodyTextarea.value.trim();
    
    if (!bodyContent) return null;
    
    switch (bodyFormat) {
      case 'json':
        try {
          // Valida se é um JSON válido
          JSON.parse(bodyContent);
          return bodyContent;
        } catch (e) {
          alert('O JSON informado é inválido. Verifique a sintaxe.');
          return null;
        }
      
      case 'form':
        try {
          const formData = new FormData();
          const jsonData = JSON.parse(bodyContent);
          
          Object.keys(jsonData).forEach(key => {
            formData.append(key, jsonData[key]);
          });
          
          return formData;
        } catch (e) {
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
  function updateResponseUI(response: ApiResponse): void {
    // Atualiza o status code
    statusCodeElement.textContent = response.status.toString();
    statusCodeElement.className = 'status-code';
    
    if (response.status >= 200 && response.status < 300) {
      statusCodeElement.classList.add('success');
    } else {
      statusCodeElement.classList.add('error');
    }
    
    // Atualiza o tempo de resposta
    responseTimeElement.textContent = `${response.time.toFixed(0)} ms`;
    
    // Atualiza o corpo da resposta
    try {
      if (typeof response.data === 'object') {
        responseBodyElement.textContent = JSON.stringify(response.data, null, 2);
      } else {
        responseBodyElement.textContent = response.data;
      }
    } catch (e) {
      responseBodyElement.textContent = 'Erro ao processar a resposta.';
    }
  }

  // Envia a requisição
  async function sendRequest(): Promise<void> {
    try {
      const method = methodSelect.value;
      let url = apiUrlInput.value.trim();
      
      if (!url) {
        alert('Por favor, informe uma URL válida.');
        return;
      }
      
      // Verifica se a URL é válida
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = `https://${url}`;
      }
      
      try {
        new URL(url);
      } catch (e) {
        alert('A URL informada é inválida.');
        return;
      }
      
      // Prepara os headers
      const headers = getHeaders();
      
      // Prepara os parâmetros
      const params = getParams();
      
      // Constrói a URL com os parâmetros
      const fullUrl = buildUrl(url, params);
      
      // Prepara o corpo da requisição
      const body = ['POST', 'PUT', 'PATCH'].includes(method) ? getRequestBody() : null;
      
      if (body === null && ['POST', 'PUT', 'PATCH'].includes(method) && requestBodyTextarea.value.trim() !== '') {
        return; // A validação do corpo falhou, então cancelamos a requisição
      }
      
      // Atualiza a UI para indicar que a requisição está em andamento
      statusCodeElement.textContent = '...';
      responseTimeElement.textContent = '...';
      responseBodyElement.textContent = 'Enviando requisição...';
      sendRequestBtn.disabled = true;
      
      // Marca o tempo inicial
      const startTime = performance.now();
      
      // Configuração da requisição
      const requestInit: RequestInit = {
        method,
        headers: headers as HeadersInit,
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        redirect: 'follow',
      };
      
      // Adiciona o corpo se necessário
      if (body) {
        if (body instanceof FormData) {
          requestInit.body = body;
        } else {
          if (headers['Content-Type'] === undefined && bodyFormatSelect.value === 'json') {
            // Adiciona Content-Type se não estiver definido e for JSON
            (requestInit.headers as Record<string, string>)['Content-Type'] = 'application/json';
          }
          requestInit.body = body as string;
        }
      }
      
      // Envia a requisição
      const response = await fetch(fullUrl, requestInit);
      
      // Calcula o tempo da requisição
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      // Processa a resposta
      let responseData: any;
      const contentType = response.headers.get('content-type') || '';
      
      if (contentType.includes('application/json')) {
        responseData = await response.json();
      } else if (contentType.includes('text/')) {
        responseData = await response.text();
      } else {
        responseData = await response.text();
      }
      
      // Atualiza a UI com a resposta
      updateResponseUI({
        status: response.status,
        time: responseTime,
        data: responseData
      });
    } catch (error) {
      // Atualiza a UI em caso de erro
      updateResponseUI({
        status: 0,
        time: 0,
        data: `Erro ao enviar requisição: ${(error as Error).message}`
      });
    } finally {
      // Habilita o botão novamente
      sendRequestBtn.disabled = false;
    }
  }
})(); // Fim da IIFE