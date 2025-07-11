interface ValidationCode {
  code: string;
  description: string;
}

// Classes principais
class ValidationGenerator {
  private currentLanguage: string = 'javascript';
  private currentValidationType: string = 'cpf';
  private codeGenerators: Record<string, CodeGenerator> = {};

  constructor() {
    // Registrar geradores de código para cada linguagem
    this.codeGenerators['javascript'] = new JavaScriptGenerator();
    this.codeGenerators['typescript'] = new TypeScriptGenerator();
    this.codeGenerators['python'] = new PythonGenerator();
    this.codeGenerators['php'] = new PHPGenerator();
    this.codeGenerators['java'] = new JavaGenerator();
    
    this.setupEventListeners();
    this.generateCode();
  }

  private setupEventListeners(): void {
    // Selecionar linguagem
    document.querySelectorAll('.language-option').forEach(option => {
      option.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        document.querySelectorAll('.language-option').forEach(el => 
          el.classList.remove('active'));
        target.classList.add('active');
        this.currentLanguage = target.getAttribute('data-lang') || 'javascript';
        this.updateCodeTitle();
        this.generateCode();
      });
    });

    // Selecionar tipo de validação
    document.querySelectorAll('.validation-option').forEach(option => {
      option.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        document.querySelectorAll('.validation-option').forEach(el => 
          el.classList.remove('active'));
        target.classList.add('active');
        this.currentValidationType = target.getAttribute('data-type') || 'cpf';
        this.updateCodeTitle();
        this.generateCode();
      });
    });

    // Configurar botão de cópia
    const copyBtn = document.getElementById('copy-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', this.copyCodeToClipboard.bind(this));
    }
  }

  private updateCodeTitle(): void {
    const titleElement = document.getElementById('code-title');
    if (titleElement) {
      const validationName = this.getValidationName(this.currentValidationType);
      const languageName = this.getLanguageName(this.currentLanguage);
      titleElement.textContent = `Validação de ${validationName} em ${languageName}`;
    }
  }

  private getValidationName(type: string): string {
    const types: Record<string, string> = {
      'cpf': 'CPF',
      'cnpj': 'CNPJ',
      'cep': 'CEP',
      'cel': 'Celular',
      'rg': 'RG'
    };
    return types[type] || type.toUpperCase();
  }

  private getLanguageName(lang: string): string {
    const languages: Record<string, string> = {
      'javascript': 'JavaScript',
      'typescript': 'TypeScript',
      'python': 'Python',
      'php': 'PHP',
      'java': 'Java'
    };
    return languages[lang] || lang;
  }

  private generateCode(): void {
    const generator = this.codeGenerators[this.currentLanguage];
    if (!generator) return;

    let validationCode: ValidationCode;
    
    switch(this.currentValidationType) {
      case 'cpf':
        validationCode = generator.generateCPFValidation();
        break;
      case 'cnpj':
        validationCode = generator.generateCNPJValidation();
        break;
      case 'cep':
        validationCode = generator.generateCEPValidation();
        break;
      case 'cel':
        validationCode = generator.generateCelValidation();
        break;
      case 'rg':
        validationCode = generator.generateRGValidation();
        break;
      default:
        validationCode = generator.generateCPFValidation();
    }

    const codeElement = document.getElementById('code-content');
    if (codeElement) {
      codeElement.textContent = validationCode.code;
    }

    const descriptionElement = document.getElementById('validation-description');
    if (descriptionElement) {
      descriptionElement.textContent = validationCode.description;
    }
  }

  private copyCodeToClipboard(): void {
    const codeElement = document.getElementById('code-content');
    if (!codeElement) return;

    const code = codeElement.textContent || '';
    navigator.clipboard.writeText(code).then(() => {
      const copyBtn = document.getElementById('copy-btn');
      if (copyBtn) {
        copyBtn.classList.add('copied');
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copiado!';
        
        setTimeout(() => {
          copyBtn.classList.remove('copied');
          copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copiar';
        }, 2000);
      }
    });
  }
}

// Interface para geradores de código
interface CodeGenerator {
  generateCPFValidation(): ValidationCode;
  generateCNPJValidation(): ValidationCode;
  generateCEPValidation(): ValidationCode;
  generateCelValidation(): ValidationCode;
  generateRGValidation(): ValidationCode;
}

// Implementação para JavaScript
class JavaScriptGenerator implements CodeGenerator {
  generateCPFValidation(): ValidationCode {
    return {
      code: `/**
 * Valida um número de CPF brasileiro sem usar expressões regulares complexas
 * @param {string} cpf - O CPF a ser validado (pode conter pontuação)
 * @returns {boolean} Verdadeiro se o CPF for válido
 */
function validarCPF(cpf) {
  // Remove pontuações manualmente
  let cpfLimpo = '';
  for (let i = 0; i < cpf.length; i++) {
    const char = cpf.charAt(i);
    if (char >= '0' && char <= '9') {
      cpfLimpo += char;
    }
  }
  
  // Verifica se tem 11 dígitos
  if (cpfLimpo.length !== 11) {
    return false;
  }
  
  // Verifica se todos os dígitos são iguais (caso inválido)
  let todosIguais = true;
  for (let i = 1; i < cpfLimpo.length; i++) {
    if (cpfLimpo.charAt(i) !== cpfLimpo.charAt(0)) {
      todosIguais = false;
      break;
    }
  }
  if (todosIguais) {
    return false;
  }
  
  // Calcula o primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
  }
  
  let resto = soma % 11;
  let digitoVerificador1 = resto < 2 ? 0 : 11 - resto;
  
  // Verifica o primeiro dígito verificador
  if (digitoVerificador1 !== parseInt(cpfLimpo.charAt(9))) {
    return false;
  }
  
  // Calcula o segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
  }
  
  resto = soma % 11;
  let digitoVerificador2 = resto < 2 ? 0 : 11 - resto;
  
  // Verifica o segundo dígito verificador
  return digitoVerificador2 === parseInt(cpfLimpo.charAt(10));
}`,
      description: 'Função JavaScript para validar números de CPF brasileiros, verificando os dígitos verificadores e o formato correto. Implementação manual sem uso de expressões regulares complexas.'
    };
  }

  generateCNPJValidation(): ValidationCode {
    return {
      code: `/**
 * Valida um número de CNPJ brasileiro sem usar expressões regulares complexas
 * @param {string} cnpj - O CNPJ a ser validado (pode conter pontuação)
 * @returns {boolean} Verdadeiro se o CNPJ for válido
 */
function validarCNPJ(cnpj) {
  // Remove pontuações manualmente
  let cnpjLimpo = '';
  for (let i = 0; i < cnpj.length; i++) {
    const char = cnpj.charAt(i);
    if (char >= '0' && char <= '9') {
      cnpjLimpo += char;
    }
  }
  
  // Verifica se tem 14 dígitos
  if (cnpjLimpo.length !== 14) {
    return false;
  }
  
  // Verifica se todos os dígitos são iguais (caso inválido)
  let todosIguais = true;
  for (let i = 1; i < cnpjLimpo.length; i++) {
    if (cnpjLimpo.charAt(i) !== cnpjLimpo.charAt(0)) {
      todosIguais = false;
      break;
    }
  }
  if (todosIguais) {
    return false;
  }
  
  // Cálculo do primeiro dígito verificador
  const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let soma = 0;
  
  for (let i = 0; i < 12; i++) {
    soma += parseInt(cnpjLimpo.charAt(i)) * pesos1[i];
  }
  
  let resto = soma % 11;
  let digitoVerificador1 = resto < 2 ? 0 : 11 - resto;
  
  if (digitoVerificador1 !== parseInt(cnpjLimpo.charAt(12))) {
    return false;
  }
  
  // Cálculo do segundo dígito verificador
  const pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  soma = 0;
  
  for (let i = 0; i < 13; i++) {
    soma += parseInt(cnpjLimpo.charAt(i)) * pesos2[i];
  }
  
  resto = soma % 11;
  let digitoVerificador2 = resto < 2 ? 0 : 11 - resto;
  
  return digitoVerificador2 === parseInt(cnpjLimpo.charAt(13));
}`,
      description: 'Função JavaScript para validar números de CNPJ brasileiros, verificando os dígitos verificadores e o formato correto. Implementação manual sem uso de expressões regulares complexas.'
    };
  }

  generateCEPValidation(): ValidationCode {
    return {
      code: `/**
 * Valida um CEP brasileiro sem usar expressões regulares complexas
 * @param {string} cep - O CEP a ser validado (pode conter hífen)
 * @returns {boolean} Verdadeiro se o CEP for válido
 */
function validarCEP(cep) {
  // Remove caracteres não numéricos manualmente
  let cepLimpo = '';
  for (let i = 0; i < cep.length; i++) {
    const char = cep.charAt(i);
    if (char >= '0' && char <= '9') {
      cepLimpo += char;
    }
  }
  
  // Verifica se tem 8 dígitos
  if (cepLimpo.length !== 8) {
    return false;
  }
  
  // Verifica se não é composto apenas por zeros
  let apenasZeros = true;
  for (let i = 0; i < cepLimpo.length; i++) {
    if (cepLimpo.charAt(i) !== '0') {
      apenasZeros = false;
      break;
    }
  }
  
  // CEP não pode ser apenas zeros
  if (apenasZeros) {
    return false;
  }
  
  // Verifica se todos os caracteres são dígitos (já garantido pela limpeza)
  return true;
}`,
      description: 'Função JavaScript para validar CEPs brasileiros, verificando o formato correto. Implementação manual sem uso de expressões regulares complexas.'
    };
  }

  generateCelValidation(): ValidationCode {
    return {
      code: `/**
 * Valida um número de celular brasileiro sem usar expressões regulares complexas
 * @param {string} celular - O número de celular (com ou sem formatação)
 * @returns {boolean} Verdadeiro se o número for válido
 */
function validarCelular(celular) {
  // Remove caracteres não numéricos manualmente
  let celularLimpo = '';
  for (let i = 0; i < celular.length; i++) {
    const char = celular.charAt(i);
    if (char >= '0' && char <= '9') {
      celularLimpo += char;
    }
  }
  
  // Verifica se tem entre 10 e 11 dígitos
  if (celularLimpo.length < 10 || celularLimpo.length > 11) {
    return false;
  }
  
  // Extrai o DDD (primeiros 2 dígitos)
  const ddd = parseInt(celularLimpo.substring(0, 2));
  
  // Verifica se o DDD é válido (entre 11 e 99)
  if (ddd < 11 || ddd > 99) {
    return false;
  }
  
  // Se tiver 11 dígitos, o terceiro dígito deve ser 9
  if (celularLimpo.length === 11 && celularLimpo.charAt(2) !== '9') {
    return false;
  }
  
  // Verifica se o restante são todos dígitos (já garantido pela limpeza)
  return true;
}`,
      description: 'Função JavaScript para validar números de celular brasileiros, verificando o formato e regras como a presença do dígito 9 e DDD válido. Implementação manual sem uso de expressões regulares complexas.'
    };
  }

  generateRGValidation(): ValidationCode {
    return {
      code: `/**
 * Valida um número de RG (modelo básico) sem usar expressões regulares complexas
 * @param {string} rg - O RG a ser validado (pode conter pontuação)
 * @returns {boolean} Verdadeiro se o formato do RG for válido
 */
function validarRG(rg) {
  // Remove caracteres não alfanuméricos manualmente
  let rgLimpo = '';
  for (let i = 0; i < rg.length; i++) {
    const char = rg.charAt(i);
    if ((char >= '0' && char <= '9') || char === 'x' || char === 'X') {
      rgLimpo += char;
    }
  }
  
  // Verifica se tem entre 8 e 10 caracteres (varia por estado)
  if (rgLimpo.length < 8 || rgLimpo.length > 10) {
    return false;
  }
  
  // Verifica se não é composto apenas por zeros
  let apenasZeros = true;
  for (let i = 0; i < rgLimpo.length; i++) {
    if (rgLimpo.charAt(i) !== '0') {
      apenasZeros = false;
      break;
    }
  }
  
  if (apenasZeros) {
    return false;
  }
  
  // Verifica se o último caractere é um dígito ou 'X'/'x'
  const ultimoChar = rgLimpo.charAt(rgLimpo.length - 1);
  const isDigit = ultimoChar >= '0' && ultimoChar <= '9';
  const isX = ultimoChar === 'x' || ultimoChar === 'X';
  
  if (!isDigit && !isX) {
    return false;
  }
  
  // Verifica se os outros caracteres são todos dígitos
  for (let i = 0; i < rgLimpo.length - 1; i++) {
    if (!(rgLimpo.charAt(i) >= '0' && rgLimpo.charAt(i) <= '9')) {
      return false;
    }
  }
  
  return true;
}`,
      description: 'Função JavaScript para validar números de RG brasileiros, verificando o formato básico. Implementação manual sem uso de expressões regulares complexas.'
    };
  }
}

// Implementação para TypeScript
class TypeScriptGenerator implements CodeGenerator {
  generateCPFValidation(): ValidationCode {
    return {
      code: `/**
 * Valida um número de CPF brasileiro sem usar expressões regulares complexas
 * @param cpf - O CPF a ser validado (pode conter pontuação)
 * @returns Verdadeiro se o CPF for válido
 */
function validarCPF(cpf: string): boolean {
  // Remove pontuações manualmente
  let cpfLimpo: string = '';
  for (let i = 0; i < cpf.length; i++) {
    const char = cpf.charAt(i);
    if (char >= '0' && char <= '9') {
      cpfLimpo += char;
    }
  }
  
  // Verifica se tem 11 dígitos
  if (cpfLimpo.length !== 11) {
    return false;
  }
  
  // Verifica se todos os dígitos são iguais (caso inválido)
  let todosIguais: boolean = true;
  for (let i = 1; i < cpfLimpo.length; i++) {
    if (cpfLimpo.charAt(i) !== cpfLimpo.charAt(0)) {
      todosIguais = false;
      break;
    }
  }
  if (todosIguais) {
    return false;
  }
  
  // Calcula o primeiro dígito verificador
  let soma: number = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
  }
  
  let resto: number = soma % 11;
  let digitoVerificador1: number = resto < 2 ? 0 : 11 - resto;
  
  // Verifica o primeiro dígito verificador
  if (digitoVerificador1 !== parseInt(cpfLimpo.charAt(9))) {
    return false;
  }
  
  // Calcula o segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
  }
  
  resto = soma % 11;
  let digitoVerificador2: number = resto < 2 ? 0 : 11 - resto;
  
  // Verifica o segundo dígito verificador
  return digitoVerificador2 === parseInt(cpfLimpo.charAt(10));
}`,
      description: 'Função TypeScript para validar números de CPF brasileiros, com tipagem forte e implementação manual sem uso de expressões regulares complexas.'
    };
  }

  generateCNPJValidation(): ValidationCode {
    return {
      code: `/**
 * Valida um número de CNPJ brasileiro sem usar expressões regulares complexas
 * @param cnpj - O CNPJ a ser validado (pode conter pontuação)
 * @returns Verdadeiro se o CNPJ for válido
 */
function validarCNPJ(cnpj: string): boolean {
  // Remove pontuações manualmente
  let cnpjLimpo: string = '';
  for (let i = 0; i < cnpj.length; i++) {
    const char = cnpj.charAt(i);
    if (char >= '0' && char <= '9') {
      cnpjLimpo += char;
    }
  }
  
  // Verifica se tem 14 dígitos
  if (cnpjLimpo.length !== 14) {
    return false;
  }
  
  // Verifica se todos os dígitos são iguais (caso inválido)
  let todosIguais: boolean = true;
  for (let i = 1; i < cnpjLimpo.length; i++) {
    if (cnpjLimpo.charAt(i) !== cnpjLimpo.charAt(0)) {
      todosIguais = false;
      break;
    }
  }
  if (todosIguais) {
    return false;
  }
  
  // Cálculo do primeiro dígito verificador
  const pesos1: number[] = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let soma: number = 0;
  
  for (let i = 0; i < 12; i++) {
    soma += parseInt(cnpjLimpo.charAt(i)) * pesos1[i];
  }
  
  let resto: number = soma % 11;
  let digitoVerificador1: number = resto < 2 ? 0 : 11 - resto;
  
  if (digitoVerificador1 !== parseInt(cnpjLimpo.charAt(12))) {
    return false;
  }
  
  // Cálculo do segundo dígito verificador
  const pesos2: number[] = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  soma = 0;
  
  for (let i = 0; i < 13; i++) {
    soma += parseInt(cnpjLimpo.charAt(i)) * pesos2[i];
  }
  
  resto = soma % 11;
  let digitoVerificador2: number = resto < 2 ? 0 : 11 - resto;
  
  return digitoVerificador2 === parseInt(cnpjLimpo.charAt(13));
}`,
      description: 'Função TypeScript para validar números de CNPJ brasileiros, com tipagem forte e implementação manual sem uso de expressões regulares complexas.'
    };
  }

  generateCEPValidation(): ValidationCode {
    return {
      code: `/**
 * Valida um CEP brasileiro sem usar expressões regulares complexas
 * @param cep - O CEP a ser validado (pode conter hífen)
 * @returns Verdadeiro se o CEP for válido
 */
function validarCEP(cep: string): boolean {
  // Remove caracteres não numéricos manualmente
  let cepLimpo: string = '';
  for (let i = 0; i < cep.length; i++) {
    const char = cep.charAt(i);
    if (char >= '0' && char <= '9') {
      cepLimpo += char;
    }
  }
  
  // Verifica se tem 8 dígitos
  if (cepLimpo.length !== 8) {
    return false;
  }
  
  // Verifica se não é composto apenas por zeros
  let apenasZeros: boolean = true;
  for (let i = 0; i < cepLimpo.length; i++) {
    if (cepLimpo.charAt(i) !== '0') {
      apenasZeros = false;
      break;
    }
  }
  
  // CEP não pode ser apenas zeros
  if (apenasZeros) {
    return false;
  }
  
  // Verifica se todos os caracteres são dígitos (já garantido pela limpeza)
  return true;
}`,
      description: 'Função TypeScript para validar CEPs brasileiros, com tipagem forte e implementação manual sem uso de expressões regulares complexas.'
    };
  }

  generateCelValidation(): ValidationCode {
    return {
      code: `/**
 * Valida um número de celular brasileiro sem usar expressões regulares complexas
 * @param celular - O número de celular (com ou sem formatação)
 * @returns Verdadeiro se o número for válido
 */
function validarCelular(celular: string): boolean {
  // Remove caracteres não numéricos manualmente
  let celularLimpo: string = '';
  for (let i = 0; i < celular.length; i++) {
    const char = celular.charAt(i);
    if (char >= '0' && char <= '9') {
      celularLimpo += char;
    }
  }
  
  // Verifica se tem entre 10 e 11 dígitos
  if (celularLimpo.length < 10 || celularLimpo.length > 11) {
    return false;
  }
  
  // Extrai o DDD (primeiros 2 dígitos)
  const ddd: number = parseInt(celularLimpo.substring(0, 2));
  
  // Verifica se o DDD é válido (entre 11 e 99)
  if (ddd < 11 || ddd > 99) {
    return false;
  }
  
  // Se tiver 11 dígitos, o terceiro dígito deve ser 9
  if (celularLimpo.length === 11 && celularLimpo.charAt(2) !== '9') {
    return false;
  }
  
  // Verifica se o restante são todos dígitos (já garantido pela limpeza)
  return true;
}`,
      description: 'Função TypeScript para validar números de celular brasileiros, com tipagem forte e implementação manual sem uso de expressões regulares complexas.'
    };
  }

  generateRGValidation(): ValidationCode {
    return {
      code: `/**
 * Valida um número de RG (modelo básico) sem usar expressões regulares complexas
 * @param rg - O RG a ser validado (pode conter pontuação)
 * @returns Verdadeiro se o formato do RG for válido
 */
function validarRG(rg: string): boolean {
  // Remove caracteres não alfanuméricos manualmente
  let rgLimpo: string = '';
  for (let i = 0; i < rg.length; i++) {
    const char = rg.charAt(i);
    if ((char >= '0' && char <= '9') || char === 'x' || char === 'X') {
      rgLimpo += char;
    }
  }
  
  // Verifica se tem entre 8 e 10 caracteres (varia por estado)
  if (rgLimpo.length < 8 || rgLimpo.length > 10) {
    return false;
  }
  
  // Verifica se não é composto apenas por zeros
  let apenasZeros: boolean = true;
  for (let i = 0; i < rgLimpo.length; i++) {
    if (rgLimpo.charAt(i) !== '0') {
      apenasZeros = false;
      break;
    }
  }
  
  if (apenasZeros) {
    return false;
  }
  
  // Verifica se o último caractere é um dígito ou 'X'/'x'
  const ultimoChar: string = rgLimpo.charAt(rgLimpo.length - 1);
  const isDigit: boolean = ultimoChar >= '0' && ultimoChar <= '9';
  const isX: boolean = ultimoChar === 'x' || ultimoChar === 'X';
  
  if (!isDigit && !isX) {
    return false;
  }
  
  // Verifica se os outros caracteres são todos dígitos
  for (let i = 0; i < rgLimpo.length - 1; i++) {
    if (!(rgLimpo.charAt(i) >= '0' && rgLimpo.charAt(i) <= '9')) {
      return false;
    }
  }
  
  return true;
}`,
      description: 'Função TypeScript para validar números de RG brasileiros, com tipagem forte e implementação manual sem uso de expressões regulares complexas.'
    };
  }
}

// Implementação para Python
class PythonGenerator implements CodeGenerator {
  generateCPFValidation(): ValidationCode {
    return {
      code: `def validar_cpf(cpf):
    """
    Valida um número de CPF brasileiro sem usar expressões regulares complexas
    :param cpf: O CPF a ser validado (pode conter pontuação)
    :return: True se o CPF for válido, False caso contrário
    """
    # Remove caracteres não numéricos manualmente
    cpf_limpo = ''
    for char in cpf:
        if char in '0123456789':
            cpf_limpo += char
    
    # Verifica se tem 11 dígitos
    if len(cpf_limpo) != 11:
        return False
    
    # Verifica se todos os dígitos são iguais (caso inválido)
    todos_iguais = True
    for i in range(1, len(cpf_limpo)):
        if cpf_limpo[i] != cpf_limpo[0]:
            todos_iguais = False
            break
    
    if todos_iguais:
        return False
    
    # Calcula o primeiro dígito verificador
    soma = 0
    for i in range(9):
        soma += int(cpf_limpo[i]) * (10 - i)
    
    resto = soma % 11
    digito_verificador1 = 0 if resto < 2 else 11 - resto
    
    # Verifica o primeiro dígito verificador
    if digito_verificador1 != int(cpf_limpo[9]):
        return False
    
    # Calcula o segundo dígito verificador
    soma = 0
    for i in range(10):
        soma += int(cpf_limpo[i]) * (11 - i)
    
    resto = soma % 11
    digito_verificador2 = 0 if resto < 2 else 11 - resto
    
    # Verifica o segundo dígito verificador
    return digito_verificador2 == int(cpf_limpo[10])`,
      description: 'Função Python para validar números de CPF brasileiros, com implementação manual sem uso de expressões regulares complexas.'
    };
  }

  generateCNPJValidation(): ValidationCode {
    return {
      code: `def validar_cnpj(cnpj):
    """
    Valida um número de CNPJ brasileiro sem usar expressões regulares complexas
    :param cnpj: O CNPJ a ser validado (pode conter pontuação)
    :return: True se o CNPJ for válido, False caso contrário
    """
    # Remove caracteres não numéricos manualmente
    cnpj_limpo = ''
    for char in cnpj:
        if char in '0123456789':
            cnpj_limpo += char
    
    # Verifica se tem 14 dígitos
    if len(cnpj_limpo) != 14:
        return False
    
    # Verifica se todos os dígitos são iguais (caso inválido)
    todos_iguais = True
    for i in range(1, len(cnpj_limpo)):
        if cnpj_limpo[i] != cnpj_limpo[0]:
            todos_iguais = False
            break
    
    if todos_iguais:
        return False
    
    # Cálculo do primeiro dígito verificador
    pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    soma = 0
    
    for i in range(12):
        soma += int(cnpj_limpo[i]) * pesos1[i]
    
    resto = soma % 11
    digito1 = 0 if resto < 2 else 11 - resto
    
    if digito1 != int(cnpj_limpo[12]):
        return False
    
    # Cálculo do segundo dígito verificador
    pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    soma = 0
    
    for i in range(13):
        soma += int(cnpj_limpo[i]) * pesos2[i]
    
    resto = soma % 11
    digito2 = 0 if resto < 2 else 11 - resto
    
    return digito2 == int(cnpj_limpo[13])`,
      description: 'Função Python para validar números de CNPJ brasileiros, com implementação manual sem uso de expressões regulares complexas.'
    };
  }

  generateCEPValidation(): ValidationCode {
    return {
      code: `def validar_cep(cep):
    """
    Valida um CEP brasileiro sem usar expressões regulares complexas
    :param cep: O CEP a ser validado (pode conter hífen)
    :return: True se o CEP for válido, False caso contrário
    """
    # Remove caracteres não numéricos manualmente
    cep_limpo = ''
    for char in cep:
        if char in '0123456789':
            cep_limpo += char
    
    # Verifica se tem 8 dígitos
    if len(cep_limpo) != 8:
        return False
    
    # Verifica se não é composto apenas por zeros
    if cep_limpo == '00000000':
        return False
    
    # Verifica se todos os caracteres são dígitos (já garantido pela limpeza)
    return True`,
      description: 'Função Python para validar CEPs brasileiros, com implementação manual sem uso de expressões regulares complexas.'
    };
  }

  generateCelValidation(): ValidationCode {
    return {
      code: `def validar_celular(celular):
    """
    Valida um número de celular brasileiro sem usar expressões regulares complexas
    :param celular: O número de celular (com ou sem formatação)
    :return: True se o número for válido, False caso contrário
    """
    # Remove caracteres não numéricos manualmente
    celular_limpo = ''
    for char in celular:
        if char in '0123456789':
            celular_limpo += char
    
    # Verifica se tem entre 10 e 11 dígitos
    if len(celular_limpo) < 10 or len(celular_limpo) > 11:
        return False
    
    # Extrai o DDD (primeiros 2 dígitos)
    ddd = int(celular_limpo[0:2])
    
    # Verifica se o DDD é válido (entre 11 e 99)
    if ddd < 11 or ddd > 99:
        return False
    
    # Se tiver 11 dígitos, o terceiro dígito deve ser 9
    if len(celular_limpo) == 11 and celular_limpo[2] != '9':
        return False
    
    # Verifica se o restante são todos dígitos (já garantido pela limpeza)
    return True`,
      description: 'Função Python para validar números de celular brasileiros, com implementação manual sem uso de expressões regulares complexas.'
    };
  }

  generateRGValidation(): ValidationCode {
    return {
      code: `def validar_rg(rg):
    """
    Valida um número de RG (modelo básico) sem usar expressões regulares complexas
    :param rg: O RG a ser validado (pode conter pontuação)
    :return: True se o formato do RG for válido, False caso contrário
    """
    # Remove caracteres não alfanuméricos manualmente
    rg_limpo = ''
    for char in rg:
        if char in '0123456789xX':
            rg_limpo += char
    
    # Verifica se tem entre 8 e 10 caracteres (varia por estado)
    if len(rg_limpo) < 8 or len(rg_limpo) > 10:
        return False
    
    # Verifica se não é composto apenas por zeros
    if all(d == '0' for d in rg_limpo):
        return False
    
    # Verifica se o último caractere é um dígito ou 'X'/'x'
    ultimo_char = rg_limpo[-1]
    is_digit = ultimo_char in '0123456789'
    is_x = ultimo_char in 'xX'
    
    if not (is_digit or is_x):
        return False
    
    # Verifica se os outros caracteres são todos dígitos
    for i in range(len(rg_limpo) - 1):
        if rg_limpo[i] not in '0123456789':
            return False
    
    return True`,
      description: 'Função Python para validar números de RG brasileiros, com implementação manual sem uso de expressões regulares complexas.'
    };
  }
}

// Implementação para PHP
class PHPGenerator implements CodeGenerator {
  generateCPFValidation(): ValidationCode {
    return {
      code: `<?php
/**
 * Valida um número de CPF brasileiro sem usar expressões regulares complexas
 * @param string $cpf O CPF a ser validado (pode conter pontuação)
 * @return bool Verdadeiro se o CPF for válido
 */
function validarCPF($cpf) {
    // Remove pontuações manualmente
    $cpfLimpo = '';
    for ($i = 0; $i < strlen($cpf); $i++) {
        $char = $cpf[$i];
        if ($char >= '0' && $char <= '9') {
            $cpfLimpo .= $char;
        }
    }
    
    // Verifica se tem 11 dígitos
    if (strlen($cpfLimpo) !== 11) {
        return false;
    }
    
    // Verifica se todos os dígitos são iguais (caso inválido)
    $todosIguais = true;
    for ($i = 1; $i < strlen($cpfLimpo); $i++) {
        if ($cpfLimpo[$i] !== $cpfLimpo[0]) {
            $todosIguais = false;
            break;
        }
    }
    if ($todosIguais) {
        return false;
    }
    
    // Calcula o primeiro dígito verificador
    $soma = 0;
    for ($i = 0; $i < 9; $i++) {
        $soma += intval($cpfLimpo[$i]) * (10 - $i);
    }
    
    $resto = $soma % 11;
    $digitoVerificador1 = $resto < 2 ? 0 : 11 - $resto;
    
    // Verifica o primeiro dígito verificador
    if ($digitoVerificador1 !== intval($cpfLimpo[9])) {
        return false;
    }
    
    // Calcula o segundo dígito verificador
    $soma = 0;
    for ($i = 0; $i < 10; $i++) {
        $soma += intval($cpfLimpo[$i]) * (11 - $i);
    }
    
    $resto = $soma % 11;
    $digitoVerificador2 = $resto < 2 ? 0 : 11 - $resto;
    
    // Verifica o segundo dígito verificador
    return $digitoVerificador2 === intval($cpfLimpo[10]);
}`,
      description: 'Função PHP para validar números de CPF brasileiros, com implementação manual sem uso de expressões regulares complexas.'
    };
  }

  generateCNPJValidation(): ValidationCode {
    return {
      code: `<?php
/**
 * Valida um número de CNPJ brasileiro sem usar expressões regulares complexas
 * @param string $cnpj O CNPJ a ser validado (pode conter pontuação)
 * @return bool Verdadeiro se o CNPJ for válido
 */
function validarCNPJ($cnpj) {
    // Remove pontuações manualmente
    $cnpjLimpo = '';
    for ($i = 0; $i < strlen($cnpj); $i++) {
        $char = $cnpj[$i];
        if ($char >= '0' && $char <= '9') {
            $cnpjLimpo .= $char;
        }
    }
    
    // Verifica se tem 14 dígitos
    if (strlen($cnpjLimpo) !== 14) {
        return false;
    }
    
    // Verifica se todos os dígitos são iguais (caso inválido)
    $todosIguais = true;
    for ($i = 1; $i < strlen($cnpjLimpo); $i++) {
        if ($cnpjLimpo[$i] !== $cnpjLimpo[0]) {
            $todosIguais = false;
            break;
        }
    }
    if ($todosIguais) {
        return false;
    }
    
    // Cálculo do primeiro dígito verificador
    $pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    $soma = 0;
    
    for ($i = 0; $i < 12; $i++) {
        $soma += intval($cnpjLimpo[$i]) * $pesos1[$i];
    }
    
    $resto = $soma % 11;
    $digito1 = $resto < 2 ? 0 : 11 - $resto;
    
    if ($digito1 !== intval($cnpjLimpo[12])) {
        return false;
    }
    
    // Cálculo do segundo dígito verificador
    $pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    $soma = 0;
    
    for ($i = 0; $i < 13; $i++) {
        $soma += intval($cnpjLimpo[$i]) * $pesos2[$i];
    }
    
    $resto = $soma % 11;
    $digito2 = $resto < 2 ? 0 : 11 - $resto;
    
    return $digito2 === intval($cnpjLimpo[13]);
}`,
      description: 'Função PHP para validar números de CNPJ brasileiros, com implementação manual sem uso de expressões regulares complexas.'
    };
  }

  generateCEPValidation(): ValidationCode {
    return {
      code: `<?php
/**
 * Valida um CEP brasileiro sem usar expressões regulares complexas
 * @param string $cep O CEP a ser validado (pode conter hífen)
 * @return bool Verdadeiro se o CEP for válido
 */
function validarCEP($cep) {
    // Remove caracteres não numéricos manualmente
    $cepLimpo = '';
    for ($i = 0; $i < strlen($cep); $i++) {
        $char = $cep[$i];
        if ($char >= '0' && $char <= '9') {
            $cepLimpo .= $char;
        }
    }
    
    // Verifica se tem 8 dígitos
    if (strlen($cepLimpo) !== 8) {
        return false;
    }
    
    // Verifica se não é composto apenas por zeros
    $apenasZeros = true;
    for ($i = 0; $i < strlen($cepLimpo); $i++) {
        if ($cepLimpo[$i] !== '0') {
            $apenasZeros = false;
            break;
        }
    }
    
    // CEP não pode ser apenas zeros
    if ($apenasZeros) {
        return false;
    }
    
    // Verifica se todos os caracteres são dígitos (já garantido pela limpeza)
    return true;
}`,
      description: 'Função PHP para validar CEPs brasileiros, com implementação manual sem uso de expressões regulares complexas.'
    };
  }

  generateCelValidation(): ValidationCode {
    return {
      code: `<?php
/**
 * Valida um número de celular brasileiro sem usar expressões regulares complexas
 * @param string $celular O número de celular (com ou sem formatação)
 * @return bool Verdadeiro se o número for válido
 */
function validarCelular($celular) {
    // Remove caracteres não numéricos manualmente
    $celularLimpo = '';
    for ($i = 0; $i < strlen($celular); $i++) {
        $char = $celular[$i];
        if ($char >= '0' && $char <= '9') {
            $celularLimpo .= $char;
        }
    }
    
    // Verifica se tem entre 10 e 11 dígitos
    if (strlen($celularLimpo) < 10 || strlen($celularLimpo) > 11) {
        return false;
    }
    
    // Extrai o DDD (primeiros 2 dígitos)
    $ddd = intval(substr($celularLimpo, 0, 2));
    
    // Verifica se o DDD é válido (entre 11 e 99)
    if ($ddd < 11 || $ddd > 99) {
        return false;
    }
    
    // Se tiver 11 dígitos, o terceiro dígito deve ser 9
    if (strlen($celularLimpo) === 11 && $celularLimpo[2] !== '9') {
        return false;
    }
    
    // Verifica se o restante são todos dígitos (já garantido pela limpeza)
    return true;
}`,
      description: 'Função PHP para validar números de celular brasileiros, com implementação manual sem uso de expressões regulares complexas.'
    };
  }

  generateRGValidation(): ValidationCode {
    return {
      code: `<?php
/**
 * Valida um número de RG (modelo básico) sem usar expressões regulares complexas
 * @param string $rg O RG a ser validado (pode conter pontuação)
 * @return bool Verdadeiro se o formato do RG for válido
 */
function validarRG($rg) {
    // Remove caracteres não alfanuméricos manualmente
    $rgLimpo = '';
    for ($i = 0; $i < strlen($rg); $i++) {
        $char = $rg[$i];
        if (($char >= '0' && $char <= '9') || $char === 'x' || $char === 'X') {
            $rgLimpo .= $char;
        }
    }
    
    // Verifica se tem entre 8 e 10 caracteres (varia por estado)
    if (strlen($rgLimpo) < 8 || strlen($rgLimpo) > 10) {
        return false;
    }
    
    // Verifica se não é composto apenas por zeros
    $apenasZeros = true;
    for ($i = 0; $i < strlen($rgLimpo); $i++) {
        if ($rgLimpo[$i] !== '0') {
            $apenasZeros = false;
            break;
        }
    }
    
    if ($apenasZeros) {
        return false;
    }
    
    // Verifica se o último caractere é um dígito ou 'X'/'x'
    $ultimoChar = $rgLimpo[strlen($rgLimpo) - 1];
    $isDigit = $ultimoChar >= '0' && $ultimoChar <= '9';
    $isX = $ultimoChar === 'x' || $ultimoChar === 'X';
    
    if (!$isDigit && !$isX) {
        return false;
    }
    
    // Verifica se os outros caracteres são todos dígitos
    for ($i = 0; $i < strlen($rgLimpo) - 1; $i++) {
        if (!($rgLimpo[$i] >= '0' && $rgLimpo[$i] <= '9')) {
            return false;
        }
    }
    
    return true;
}`,
      description: 'Função PHP para validar números de RG brasileiros, com implementação manual sem uso de expressões regulares complexas.'
    };
  }
}

// Implementação para Java
class JavaGenerator implements CodeGenerator {
  generateCPFValidation(): ValidationCode {
    return {
      code: `/**
 * Classe para validar documentos brasileiros
 */
public class ValidadorDocumentos {
    
    /**
     * Valida um número de CPF brasileiro sem usar expressões regulares complexas
     * @param cpf O CPF a ser validado (pode conter pontuação)
     * @return true se o CPF for válido
     */
    public static boolean validarCPF(String cpf) {
        // Remove pontuações manualmente
        StringBuilder cpfLimpo = new StringBuilder();
        for (int i = 0; i < cpf.length(); i++) {
            char c = cpf.charAt(i);
            if (c >= '0' && c <= '9') {
                cpfLimpo.append(c);
            }
        }
        
        // Verifica se tem 11 dígitos
        if (cpfLimpo.length() != 11) {
            return false;
        }
        
        // Verifica se todos os dígitos são iguais (caso inválido)
        boolean todosIguais = true;
        for (int i = 1; i < cpfLimpo.length(); i++) {
            if (cpfLimpo.charAt(i) != cpfLimpo.charAt(0)) {
                todosIguais = false;
                break;
            }
        }
        if (todosIguais) {
            return false;
        }
        
        // Calcula o primeiro dígito verificador
        int soma = 0;
        for (int i = 0; i < 9; i++) {
            soma += Character.getNumericValue(cpfLimpo.charAt(i)) * (10 - i);
        }
        
        int resto = soma % 11;
        int digitoVerificador1 = resto < 2 ? 0 : 11 - resto;
        
        // Verifica o primeiro dígito verificador
        if (digitoVerificador1 != Character.getNumericValue(cpfLimpo.charAt(9))) {
            return false;
        }
        
        // Calcula o segundo dígito verificador
        soma = 0;
        for (int i = 0; i < 10; i++) {
            soma += Character.getNumericValue(cpfLimpo.charAt(i)) * (11 - i);
        }
        
        resto = soma % 11;
        int digitoVerificador2 = resto < 2 ? 0 : 11 - resto;
        
        // Verifica o segundo dígito verificador
        return digitoVerificador2 == Character.getNumericValue(cpfLimpo.charAt(10));
    }
}`,
      description: 'Classe Java para validar números de CPF brasileiros, com implementação manual sem uso de expressões regulares complexas.'
    };
  }

  generateCNPJValidation(): ValidationCode {
    return {
      code: `/**
 * Classe para validar documentos brasileiros
 */
public class ValidadorDocumentos {
    
    /**
     * Valida um número de CNPJ brasileiro sem usar expressões regulares complexas
     * @param cnpj O CNPJ a ser validado (pode conter pontuação)
     * @return true se o CNPJ for válido
     */
    public static boolean validarCNPJ(String cnpj) {
        // Remove pontuações manualmente
        StringBuilder cnpjLimpo = new StringBuilder();
        for (int i = 0; i < cnpj.length(); i++) {
            char c = cnpj.charAt(i);
            if (c >= '0' && c <= '9') {
                cnpjLimpo.append(c);
            }
        }
        
        // Verifica se tem 14 dígitos
        if (cnpjLimpo.length() != 14) {
            return false;
        }
        
        // Verifica se todos os dígitos são iguais (caso inválido)
        boolean todosIguais = true;
        for (int i = 1; i < cnpjLimpo.length(); i++) {
            if (cnpjLimpo.charAt(i) != cnpjLimpo.charAt(0)) {
                todosIguais = false;
                break;
            }
        }
        if (todosIguais) {
            return false;
        }
        
        // Cálculo do primeiro dígito verificador
        int[] pesos1 = {5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};
        int soma = 0;
        
        for (int i = 0; i < 12; i++) {
            soma += Character.getNumericValue(cnpjLimpo.charAt(i)) * pesos1[i];
        }
        
        int resto = soma % 11;
        int digito1 = resto < 2 ? 0 : 11 - resto;
        
        if (digito1 != Character.getNumericValue(cnpjLimpo.charAt(12))) {
            return false;
        }
        
        // Cálculo do segundo dígito verificador
        int[] pesos2 = {6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};
        soma = 0;
        
        for (int i = 0; i < 13; i++) {
            soma += Character.getNumericValue(cnpjLimpo.charAt(i)) * pesos2[i];
        }
        
        resto = soma % 11;
        int digito2 = resto < 2 ? 0 : 11 - resto;
        
        return digito2 == Character.getNumericValue(cnpjLimpo.charAt(13));
    }
}`,
      description: 'Classe Java para validar números de CNPJ brasileiros, com implementação manual sem uso de expressões regulares complexas.'
    };
  }

  generateCEPValidation(): ValidationCode {
    return {
      code: `/**
 * Classe para validar documentos brasileiros
 */
public class ValidadorDocumentos {
    
    /**
     * Valida um CEP brasileiro sem usar expressões regulares complexas
     * @param cep O CEP a ser validado (pode conter hífen)
     * @return true se o CEP for válido
     */
    public static boolean validarCEP(String cep) {
        // Remove caracteres não numéricos manualmente
        StringBuilder cepLimpo = new StringBuilder();
        for (int i = 0; i < cep.length(); i++) {
            char c = cep.charAt(i);
            if (c >= '0' && c <= '9') {
                cepLimpo.append(c);
            }
        }
        
        // Verifica se tem 8 dígitos
        if (cepLimpo.length() != 8) {
            return false;
        }
        
        // Verifica se não é composto apenas por zeros
        boolean apenasZeros = true;
        for (int i = 0; i < cepLimpo.length(); i++) {
            if (cepLimpo.charAt(i) != '0') {
                apenasZeros = false;
                break;
            }
        }
        
        // CEP não pode ser apenas zeros
        if (apenasZeros) {
            return false;
        }
        
        // Verifica se todos os caracteres são dígitos (já garantido pela limpeza)
        return true;
    }
}`,
      description: 'Classe Java para validar CEPs brasileiros, com implementação manual sem uso de expressões regulares complexas.'
    };
  }

  generateCelValidation(): ValidationCode {
    return {
      code: `/**
 * Classe para validar documentos brasileiros
 */
public class ValidadorDocumentos {
    
    /**
     * Valida um número de celular brasileiro sem usar expressões regulares complexas
     * @param celular O número de celular (com ou sem formatação)
     * @return true se o número for válido
     */
    public static boolean validarCelular(String celular) {
        // Remove caracteres não numéricos manualmente
        StringBuilder celularLimpo = new StringBuilder();
        for (int i = 0; i < celular.length(); i++) {
            char c = celular.charAt(i);
            if (c >= '0' && c <= '9') {
                celularLimpo.append(c);
            }
        }
        
        // Verifica se tem entre 10 e 11 dígitos
        if (celularLimpo.length() < 10 || celularLimpo.length() > 11) {
            return false;
        }
        
        // Extrai o DDD (primeiros 2 dígitos)
        String dddStr = celularLimpo.substring(0, 2);
        int ddd = Integer.parseInt(dddStr);
        
        // Verifica se o DDD é válido (entre 11 e 99)
        if (ddd < 11 || ddd > 99) {
            return false;
        }
        
        // Se tiver 11 dígitos, o terceiro dígito deve ser 9
        if (celularLimpo.length() == 11 && celularLimpo.charAt(2) != '9') {
            return false;
        }
        
        // Verifica se o restante são todos dígitos (já garantido pela limpeza)
        return true;
    }
}`,
      description: 'Classe Java para validar números de celular brasileiros, com implementação manual sem uso de expressões regulares complexas.'
    };
  }

  generateRGValidation(): ValidationCode {
    return {
      code: `/**
 * Classe para validar documentos brasileiros
 */
public class ValidadorDocumentos {
    
    /**
     * Valida um número de RG (modelo básico) sem usar expressões regulares complexas
     * @param rg O RG a ser validado (pode conter pontuação)
     * @return true se o formato do RG for válido
     */
    public static boolean validarRG(String rg) {
        // Remove caracteres não alfanuméricos manualmente
        StringBuilder rgLimpo = new StringBuilder();
        for (int i = 0; i < rg.length(); i++) {
            char c = rg.charAt(i);
            if ((c >= '0' && c <= '9') || c == 'x' || c == 'X') {
                rgLimpo.append(c);
            }
        }
        
        // Verifica se tem entre 8 e 10 caracteres (varia por estado)
        if (rgLimpo.length() < 8 || rgLimpo.length() > 10) {
            return false;
        }
        
        // Verifica se não é composto apenas por zeros
        boolean apenasZeros = true;
        for (int i = 0; i < rgLimpo.length(); i++) {
            if (rgLimpo.charAt(i) != '0') {
                apenasZeros = false;
                break;
            }
        }
        
        if (apenasZeros) {
            return false;
        }
        
        // Verifica se o último caractere é um dígito ou 'X'/'x'
        char ultimoChar = rgLimpo.charAt(rgLimpo.length() - 1);
        boolean isDigit = ultimoChar >= '0' && ultimoChar <= '9';
        boolean isX = ultimoChar == 'x' || ultimoChar == 'X';
        
        if (!isDigit && !isX) {
            return false;
        }
        
        // Verifica se os outros caracteres são todos dígitos
        for (int i = 0; i < rgLimpo.length() - 1; i++) {
            char c = rgLimpo.charAt(i);
            if (!(c >= '0' && c <= '9')) {
                return false;
            }
        }
        
        return true;
    }
}`,
      description: 'Classe Java para validar números de RG brasileiros, com implementação manual sem uso de expressões regulares complexas.'
    };
  }
}

// Iniciar a aplicação
document.addEventListener('DOMContentLoaded', () => {
  new ValidationGenerator();
});