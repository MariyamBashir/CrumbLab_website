function lazyLoad() {
    const images = document.querySelectorAll("img.lazyImg");
    for (let img of images) {
        if (img.offsetTop < (window.innerHeight + window.pageYOffset)) {
            img.src = img.dataset.src;
            img.classList.remove("lazyImg"); 
        }
    }
}
document.addEventListener("scroll", lazyLoad);
window.addEventListener("resize", lazyLoad);
window.addEventListener("orientationchange", lazyLoad);
lazyLoad();
