export function debounce(func, wait) {
    let timer;
    return function (...args) {
        if (timer) {
            clearTimeout(timer);
        }
        const context = this;
        timer = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    }
}