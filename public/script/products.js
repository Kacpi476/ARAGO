const arago = document.querySelector('.arago_container');
const clarb = document.querySelector('.clarb_container');
const aragoImg = arago.querySelector('img');
const clarbImg = clarb.querySelector('img');
const isMobile = window.innerWidth <= 550;

if (isMobile) {
    arago.addEventListener('mouseenter', () => {
    arago.style.height = '95%';
    clarb.style.height = '5%';
    clarbImg.style.opacity = '0';
    arago.style.backgroundColor = '#1f2f70';
    clarb.style.backgroundColor = '#05090a';
    clarbImg.style.opacity = '0';
    aragoImg.style.opacity = '1';
});


clarb.addEventListener('mouseenter', () => {
    clarb.style.height = '95%';
    arago.style.height = '5%';
    aragoImg.style.opacity = '0';
    clarb.style.backgroundColor = '#05090a';
    arago.style.backgroundColor = '#1f2f70';
    clarbImg.style.opacity = '1';
    aragoImg.style.opacity = '0';
    
});


} else {
    arago.addEventListener('mouseenter', () => {
    arago.style.width = '95%';
    clarb.style.width = '5%';
    clarbImg.style.opacity = '0';
    arago.style.backgroundColor = '#1f2f70';
    clarb.style.backgroundColor = '#05090a';
});

arago.addEventListener('mouseleave', () => {
    arago.style.width = '50%';
    clarb.style.width = '50%';
    clarbImg.style.opacity = '1';
    arago.style.backgroundColor = '#32449880';
    clarb.style.backgroundColor = '#0B121580';
});

clarb.addEventListener('mouseenter', () => {
    clarb.style.width = '95%';
    arago.style.width = '5%';
    aragoImg.style.opacity = '0';
    clarb.style.backgroundColor = '#05090a';
    arago.style.backgroundColor = '#1f2f70';
});

clarb.addEventListener('mouseleave', () => {
    clarb.style.width = '50%';
    arago.style.width = '50%';
    aragoImg.style.opacity = '1';
    clarb.style.backgroundColor = '#0B121580';
    arago.style.backgroundColor = '#32449880';
});
}
