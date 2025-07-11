document.getElementById('readme-form').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const projectName = e.target.projectName.value.trim();
    const description = e.target.description.value.trim();
    const language = e.target.language.value.trim();
    const features = e.target.features.value.trim();
    const installation = e.target.installation.value.trim();
    const usage = e.target.usage.value.trim();
    const license = e.target.license.value.trim();
    const authorName = e.target.authorName ? e.target.authorName.value.trim() : '';
    const authorLinkedIn = e.target.authorLinkedIn ? e.target.authorLinkedIn.value.trim() : '';
  
    // Função para formatar a seção de funcionalidades em lista Markdown
    function formatFeatures(text) {
      if (!text) return '';
      return text.split(',').map(f => `- ${f.trim()}`).join('\n');
    }
    function formatLang(text) {
        if (!text) return '';
        return text.split(',').map(f => `- ${f.trim()}`).join('\n');
      }
      document.getElementById('copy-btn').addEventListener('click', function () {
        const output = document.getElementById('output');
        output.select();
        output.setSelectionRange(0, 99999); // Para dispositivos móveis
      
        try {
          const successful = document.execCommand('copy');
          if (successful) {
            alert('README copiado para a área de transferência!');
          } else {
            alert('Não foi possível copiar. Tente manualmente.');
          }
        } catch (err) {
          alert('Erro ao copiar: ' + err);
        }
      });
      
    // Função para normalizar indentação do texto (remover espaços extras no início das linhas)
    function normalizeIndentation(text) {
      const lines = text.split('\n');
      // Remove espaços em branco no fim das linhas
      const trimmedLines = lines.map(line => line.trimEnd());
      // Pega o menor número de espaços no começo das linhas não vazias
      const indentLengths = trimmedLines
        .filter(line => line.length > 0)
        .map(line => line.match(/^ */)[0].length);
      const minIndent = indentLengths.length > 0 ? Math.min(...indentLengths) : 0;
      // Remove essa indentação mínima de todas as linhas
      const normalizedLines = trimmedLines.map(line => line.slice(minIndent));
      return normalizedLines.join('\n');
    }
  
    const installationNormalized = normalizeIndentation(installation);
  
    // Gerar o conteúdo do README em Markdown
    const readmeContent = `# ${projectName}
  
  ## 📝 Descrição 
  ${description}
  

  ${language ? `## 🛠️ Tecnologia\n${formatLang(language)}` : ''}

  ${features ? `
## ⚙️ Funcionalidades\n${formatFeatures(features)}` : ''}
  
${installation ? `
## 📦 Instalação
  \`\`\`bash
  ${installationNormalized}
  \`\`\`
  ` : ''
}${usage ? `## 🚀 Como Usar
  ${usage}
  ` : ''
}${license ? `## 📄 Licença 
  Este projeto está licenciado sob a licença ${license}.
  ` : ''
}${authorName ? `
  
  ---
  
  ## 👤 Feito por:
  ### LinkedIn: [${authorName}](${authorLinkedIn || '#'})` : ''}
  
  ---
  
  *Gerado automaticamente com ❤️ pelo Gerador de README do DevKit*
  `;
  
    // Exibir no textarea de saída
    const output = document.getElementById('output');
    output.value = readmeContent;
    output.focus();
    output.select();
  });