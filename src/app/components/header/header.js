require('./header.less'); // example of including component's styles

let header = document.querySelector('header');

window.addEventListener('scroll', () => {
    if (!header) {
        header = document.querySelector('header');
        return;
    }
    const scroll = window.pageYOffset || document.documentElement.scrollTop;

    if (!header.classList.length && scroll > 50) {
        header.classList = 'sticky-header';
    }
    if (header.classList.length && scroll <= 50) {
        header.classList = '';
    }
});
