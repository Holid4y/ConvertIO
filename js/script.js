document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('fileInput');
    const convertBtn = document.getElementById('convertBtn');
    const progressBar = document.querySelector('.progress-bar');

    // Функция для отображения прогресс-бара
    function showProgressBar() {
        const progressBar = document.querySelector('.progress-bar');
        progressBar.style.display = 'block';
        progressBar.style.width = '0%';
    }

    // Функция для скрытия прогресс-бара и отображения кнопки "Скачать"
    function hideProgressBarAndShowDownloadButton(dataUrl, format) {
        const progressBar = document.querySelector('.progress-bar');
        progressBar.style.display = 'none';
        showDownloadButton(dataUrl, format);
    }

    // Функция для отображения кнопки "Скачать"
    function showDownloadButton(dataUrl, format) {
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = `<a href="${dataUrl}" download="converted_image.${format}" class="btn btn-success mt-3" id="downloadButton">Скачать</a>`;
    }

    // Функция для удаления кнопки "Скачать"
    function removeDownloadButton() {
        const downloadButton = document.getElementById('downloadButton');
        downloadButton.remove();
    }

    // Функция для конвертации изображения
    function convertImage(file, format) {
        showProgressBar(); // Отображаем полоску прогресса перед началом конвертации

        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                const convertedData = canvas.toDataURL(`image/${format}`);

                // Имитируем процесс конвертации
                setTimeout(function() {
                    progressBar.style.width = '100%';
                    setTimeout(function() {
                        hideProgressBarAndShowDownloadButton(convertedData, format);
                    }, 1000);
                }, 500);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }

    // Обработчик события для кнопки "Конвертировать"
    convertBtn.addEventListener('click', function() {
        const selectedFormat = document.querySelector('input[name="format"]:checked');
        if (!selectedFormat) {
            alert('Пожалуйста, выберите формат для конвертации');
            return;
        }
        const file = fileInput.files[0];
        if (!file) {
            alert('Пожалуйста, выберите файл для конвертации');
            return;
        }
    
        const format = selectedFormat.value;

        convertImage(file, format);
    });

    function resetConversion() {
        hideProgressBar();
        removeDownloadButton();
    }

    // Обработчик события для кнопки "Конвертировать" при повторном нажатии
    convertBtn.addEventListener('click', resetConversion);
});
