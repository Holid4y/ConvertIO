var outType = '';
var convertedFile;

function clearResult() {
    var result = document.getElementById('result');
    result.innerHTML = '';
}

document.getElementById('fileInput').addEventListener('change', function() {
    clearResult();

    var file = this.files[0];
    var fileName = file.name.toLowerCase();
    
    // Получаем все элементы nav-link и tab-pane
    var navLinks = document.querySelectorAll('.typeF');
    var tabPanes = document.querySelectorAll('.typeS');

    // Убираем классы active и show active у всех элементов
    navLinks.forEach(function(link) { link.classList.remove('active'); link.classList.add('disabled'); });
    tabPanes.forEach(function(pane) { pane.classList.remove('show', 'active'); });

    // Проверяем тип файла и добавляем классы active в соответствующие элементы
    if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.png') || fileName.endsWith('.gif') || fileName.endsWith('.tiff') || fileName.endsWith('.bmp') || fileName.endsWith('.raw') || fileName.endsWith('.psd') || fileName.endsWith('.webp') || fileName.endsWith('.hdr') || fileName.endsWith('.avif') || fileName.endsWith('.rgb') || fileName.endsWith('.xpm') || fileName.endsWith('.rgba') || fileName.endsWith('.map') || fileName.endsWith('.wbmp')) {
        navLinks[0].classList.add('active'); navLinks[0].classList.remove('disabled');
        tabPanes[0].classList.add('show', 'active');
        outType = 'image';
    } else if (fileName.endsWith('.docx') || fileName.endsWith('.pdf') || fileName.endsWith('.txt') || fileName.endsWith('.xlsx') || fileName.endsWith('.pptx') || fileName.endsWith('.odt') || fileName.endsWith('.rtf') || fileName.endsWith('.doc') || fileName.endsWith('.csv') || fileName.endsWith('.xml')) {
        navLinks[1].classList.add('active'); navLinks[1].classList.remove('disabled');
        tabPanes[1].classList.add('show', 'active');
        outType = 'doc';
    } else if (fileName.endsWith('.epub') || fileName.endsWith('.mobi') || fileName.endsWith('.azw') || fileName.endsWith('.djvu') || fileName.endsWith('.fb2') || fileName.endsWith('.lit') || fileName.endsWith('.pdb') || fileName.endsWith('.lrf')) {
        navLinks[2].classList.add('active'); navLinks[2].classList.remove('disabled');
        tabPanes[2].classList.add('show', 'active');
        outType = 'book';
    } else if (fileName.endsWith('.svg') || fileName.endsWith('.eps') || fileName.endsWith('.ai') || fileName.endsWith('.cdr') || fileName.endsWith('.dxf') || fileName.endsWith('.emf') || fileName.endsWith('.wmf') || fileName.endsWith('.cgm') || fileName.endsWith('.swf')) {
        navLinks[3].classList.add('active'); navLinks[3].classList.remove('disabled');
        tabPanes[3].classList.add('show', 'active');
        outType = 'vector';
    } else {
        outType = "None";
    }
});

// Функция для сообщений Toast
function showErrorToast(message) {
    var toastElement = document.getElementById('toast');
    var toastBody = toastElement.querySelector('.toast-body');
    toastBody.innerText = message;
    var toast = new bootstrap.Toast(toastElement);
    toast.show();
}

// Функция для конвертации изображения
function convertImage() {
    showErrorToast("Конвертация изображения...");
    var fileInput = document.getElementById('fileInput');
    var selectedFormat = document.querySelector('input[name="format"]:checked');
    if (fileInput.files && fileInput.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var img = new Image();
            img.onload = function () {
                var canvas = document.getElementById('canvas');
                var ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                var convertedFileDataUrl = canvas.toDataURL(`image/${selectedFormat.value}`);
                convertedFile = dataURItoBlob(convertedFileDataUrl);
                showDownloadButton();
            };
            img.src = e.target.result;
        };

        reader.readAsDataURL(fileInput.files[0]);
    }
}
// Функция для преобразования Data URL в Blob
function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], {type: mimeString});
}

// Функция для конвертации документа
function convertDocument() {
    showErrorToast("Конвертация документа...");
    showDownloadButton();
    var docFile = file.txt;
    convertedFile = docFile;
}
// Функция для конвертации книги
function convertBook() {
    showErrorToast("Конвертация книги...");
    showDownloadButton();
    var bookFile = file.txt;
    convertedFile = bookFile;
}
// Функция для конвертации вектора
function convertVector() {
    showErrorToast("Конвертация вектора...");
    showDownloadButton();
    var vectorFile = file.txt;
    convertedFile = vectorFile;
}

function convertFile() {
    // Проверяем, поддерживается ли файл
    if (outType === "None") {
        showErrorToast("Формат не поддерживается");
        return;
    }
    // Проверяем, был ли выбран файл
    var fileInput = document.getElementById('fileInput');
    if (!fileInput.files || fileInput.files.length === 0) {
        showErrorToast("Файл не загружен.");
        return;
    }
    // Проверяем, был ли выбран формат
    var selectedFormat = document.querySelector('input[name="format"]:checked');
    if (!selectedFormat) {
        showErrorToast("Не выбран формат.");
        return;
    }
    
    var result = document.getElementById('result');
    result.innerHTML = `<div class="progress" id="progress"  role="progressbar" aria-label="Animated striped example" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"> <div id="progressBar" class="progress-bar progress-bar-striped progress-bar-animated" style="width: 0%;"></div></div><button id="downloadButton" class="btn btn-primary" style="display: none;" onclick="downloadFile()">Скачать</button>`
    // Если ошибок нет, то выполняем..
    switch(outType) {
        case 'image':
            convertImage();
            break;
        case 'doc':
            convertDocument();
            break;
        case 'book':
            convertBook();
            break;
        case 'vector':
            convertVector();
            break;
        default:
            showErrorToast("Не удалось определить тип файла.");
    }
}

// Функция для скачивания файла
function downloadFile() {
    // Проверяем, есть ли файл для скачивания
    if (!convertedFile) {
        showErrorToast("Файл для скачивания не найден.");
        return;
    }
    // Создаем ссылку на объект Blob, представляющий файловый объект
    var url = URL.createObjectURL(convertedFile);
    // Создаем ссылку для скачивания файла
    var link = document.createElement('a');
    link.href = url;
    link.download = convertedFile.name;
    
    // Добавляем ссылку в документ и эмулируем клик по ней для начала загрузки файла
    document.body.appendChild(link);
    link.click();
    
    // Удаляем ссылку из документа, чтобы избежать утечек памяти
    document.body.removeChild(link);
}

function startProgressAnimation() {
    var progressBar = document.getElementById('progressBar');
    var progress = document.getElementById('progress');
    progressBar.style.width = '0%';

    // Анимация прогресс-бара с 0% до 100% за 2 секунды
    progressBar.style.transition = 'width 2s';
    progressBar.style.width = '100%';

    // После завершения анимации отображаем кнопку "скачать"
    setTimeout(function() {
        progress.style.display = 'none';
        var downloadButton = document.getElementById('downloadButton');
        downloadButton.style.display = 'block';
    }, 2000);
}

function showDownloadButton() {
    startProgressAnimation();
}

// Найти кнопку "конвертировать" и добавить обработчик события на нажатие
var convertBtn = document.getElementById('convertBtn');
convertBtn.addEventListener('click', convertFile);