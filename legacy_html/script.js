let slideIndex = 0;


function showMovieDetails(movieId) {
    window.location.href = movieId + ".html";
}

function nextSlide() {
    document.querySelector('.movie-container').scrollLeft += 220;
}

function prevSlide() {
    document.querySelector('.movie-container').scrollLeft -= 220;
}

function jumpToSlide(index) {
    slideIndex = index;
    document.querySelector('.movie-container').scrollLeft = index * 220;
}

document.addEventListener("DOMContentLoaded", function() {
    let dots = document.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            jumpToSlide(i);
            dots.forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
        });
    });
});
