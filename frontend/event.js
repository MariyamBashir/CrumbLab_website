
var fullName = document.querySelector('#full-name');
var email = document.querySelector('#email');
var phone = document.querySelector('#phone');
var date = document.querySelector('#date');
var guestCount = document.querySelector('#guest-count');
var time = document.querySelector('#time');
var message = document.querySelector('#message');
var form = document.querySelector('#quote-request-form');

fullName.addEventListener('change', checkName);
email.addEventListener('change', checkEmail);
phone.addEventListener('change', checkPhone);
date.addEventListener('change', checkDate);
guestCount.addEventListener('change', checkGuest);
time.addEventListener('change', checkTime);
message.addEventListener('change', checkMessage);

form.addEventListener('submit', validateForm);

function checkName() {
    if (this.value.trim().length < 3) {
        this.style.backgroundColor = "lightcoral";
    } else {
        this.style.backgroundColor = "white";
    }
}
function checkEmail() {
    var reg = /[^@]+@[^\.]+\.+[^\.]+/;
    if (!reg.test(this.value)) {
        this.style.backgroundColor = "lightcoral";
    } else {
        this.style.backgroundColor = "white";
    }
}
function checkPhone() {
    if (this.value.trim().length < 11) {
        this.style.backgroundColor = "lightcoral";
    } else {
        this.style.backgroundColor = "white";
    }
}
function checkDate() {
    if (this.value.trim().length < 2) {
        this.style.backgroundColor = "lightcoral";
    } else {
        this.style.backgroundColor = "white";
    }
}
function checkGuest() {
   var val = this.value.trim();
    if (val === "" || val.startsWith("0") || !/[1-9]/.test(val)) {
        this.style.backgroundColor = "lightcoral";
    } else {
        this.style.backgroundColor = "white";
    }
}
function checkTime() {
    var val = this.value.trim();
    if (val === "" || val.startsWith("0") || !/[1-9]/.test(val)) {
        this.style.backgroundColor = "lightcoral";
    } else {
        this.style.backgroundColor = "white";
    }
}
function checkMessage() {
    if (this.value.trim().length < 5) {
        this.style.backgroundColor = "lightcoral";
    } else {
        this.style.backgroundColor = "white";
    }
}
function validateForm(e) {
    if (
        fullName.value.trim().length < 3 ||
        !(/[^@]+@[^\.]+\.+[^\.]+/.test(email.value)) ||
        phone.value.trim().length < 5 ||
        date.value.trim().length < 2 ||
        guestCount.value.trim().length === 0 ||
        time.value.trim().length === 0 ||
        message.value.trim().length < 5
    ) {
        e.preventDefault();
        alert("Please fill the form correctly.");
    }
}
function lazyLoad() {
    const images = document.querySelectorAll("img.lazyImg");
    for (let img of images) {
        if (img.offsetTop < window.innerHeight + window.pageYOffset) {
            img.src = img.dataset.src;
            img.classList.remove("lazyImg");
        }
    }
}
document.addEventListener("scroll", lazyLoad);
window.addEventListener("resize", lazyLoad);
window.addEventListener("orientationchange", lazyLoad);
lazyLoad();
