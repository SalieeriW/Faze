const jumbo_photo = document.getElementById("jumbotron");
const jumbo_description = document.getElementById("jumbo_description");
const colortext = document.querySelector(".bloc1");

const LoadContent = (entradas) => {
    entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
            entrada.target.classList.add("visible");
        }
    });
};
const observador = new IntersectionObserver(LoadContent, {
    root: null,
    rootMargin: "50000px 500000px 500000px 500000px",
    threshold: 1.0,
});

observador.observe(jumbo_description);
observador.observe(jumbo_photo);

const observador2 = new IntersectionObserver(LoadContent, {
    root: null,
    rootMargin: "0px",
    threshold: 0.9,
});

observador2.observe(colortext);
