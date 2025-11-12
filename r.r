function handleUrlAnchor(clickDelay = 100, maxAttempts = 5) {
    var anchor = window.location.hash;

    if (!anchor) return;

    function attemptClick(attempt = 0) {
        var $target = $(anchor);

        if ($target.length) {
            setTimeout(function() {
                $target.click();
            }, clickDelay);
        } else if (attempt < maxAttempts) {
            // Пытаемся снова, если элемент еще не загружен
            setTimeout(function() {
                attemptClick(attempt + 1);
            }, 200);
        } else {
            console.log('Элемент с якорем ' + anchor + ' не найден после ' + maxAttempts + ' попыток');
        }
    }

    attemptClick();
}

// Использование
$(document).ready(function() {
    handleUrlAnchor();
});
