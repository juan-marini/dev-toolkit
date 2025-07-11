const fileInput = document.getElementById('fileInput');
    const fakeFileBtn = document.querySelector('.file-upload-btn');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const results = document.getElementById('results');

    let fileContent = '';

    fakeFileBtn.addEventListener('click', () => {
      fileInput.click();
    });

    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      if (!file) {
        fileContent = '';
        searchInput.value = '';
        searchInput.disabled = true;
        searchBtn.disabled = true;
        results.textContent = 'Nenhum arquivo carregado.';
        results.classList.add('no-results');
        return;
      }

      if (file.type !== 'text/plain') {
        alert('Por favor, carregue um arquivo de texto (.txt).');
        fileInput.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        fileContent = e.target.result;
        searchInput.disabled = false;
        searchBtn.disabled = false;
        results.textContent = 'Arquivo carregado. Digite uma palavra-chave e clique em Buscar.';
        results.classList.add('no-results');
      };
      reader.readAsText(file);
    });

    searchBtn.addEventListener('click', () => {
      const keyword = searchInput.value.trim();
      if (!keyword) {
        alert('Digite uma palavra-chave para buscar.');
        return;
      }

      const lines = fileContent.split(/\r?\n/);
      const matchedLines = lines.filter(line => line.toLowerCase().includes(keyword.toLowerCase()));

      if (matchedLines.length === 0) {
        results.textContent = `Nenhum resultado encontrado para "${keyword}".`;
        results.classList.add('no-results');
      } else {
        results.classList.remove('no-results');
        results.innerHTML = matchedLines.map(line => line.replace(new RegExp(`(${keyword})`, 'gi'), '<mark>$1</mark>')).join('\n');
      }
    });