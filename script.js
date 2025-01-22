document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('file-upload');
  const downloadButton = document.querySelector('.download-button');
  const progressBar = document.getElementById('progress-bar');
  const progressText = document.getElementById('progress-text'); // Adiciona a referência ao texto da porcentagem
  let processedFile;

  document.querySelector('form').addEventListener('submit', (event) => {
      event.preventDefault();

      const file = fileInput.files[0];
      if (file) {
          const reader = new FileReader();
          progressBar.style.display = 'block'; // Exibe a barra de progresso
          progressText.style.display = 'block'; // Exibe o texto da porcentagem
          progressBar.value = 0; // Reseta a barra de progresso
          progressText.textContent = '0%'; // Reseta o texto da porcentagem

          reader.onload = async (e) => {
              const content = e.target.result;
              const zip = new JSZip();

              zip.file(file.name, content);
              progressBar.value = 50; // Simula 50% de progresso
              progressText.textContent = '50%'; // Atualiza o texto da porcentagem

              // Gera o arquivo zip com uma função que pode informar o progresso
              const zipContent = await zip.generateAsync({
                  type: 'blob',
                  streamFiles: true,
                  onprogress: (meta) => {
                      const percent = (meta.current / meta.total) * 100; // Calcula a porcentagem
                      progressBar.value = percent; // Atualiza a barra de progresso
                      progressText.textContent = Math.round(percent) + '%'; // Atualiza o texto da porcentagem
                  }
              });

              const url = URL.createObjectURL(zipContent);
              processedFile = url;

              progressBar.value = 100; // Finaliza a barra de progresso
              progressText.textContent = '100%'; // Atualiza o texto da porcentagem
              downloadButton.style.display = 'block'; // Habilita o botão de download
          };

          reader.readAsArrayBuffer(file);
      }
  });

  downloadButton.addEventListener('click', () => {
      if (processedFile) {
          const a = document.createElement('a');
          a.href = processedFile;
          a.download = 'arquivo_processado.zip';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
      }
  });
});
