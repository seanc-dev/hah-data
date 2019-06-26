document.addEventListener('appready', function(){
    console.log('appready event fired')
    let overlay = document.getElementById('loadingOverlay')
    overlay.classList.add('page-loaded');
    setTimeout(() => {
        overlay.classList.add('d-none');
    }, 1200);
})