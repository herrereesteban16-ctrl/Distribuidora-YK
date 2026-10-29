// Seleccionamos los elementos que controlan el menú.
const menuToggle = document.querySelector("#menu-toggle");
const navbarMenu = document.querySelector("#navbar-menu");

// Abrimos o cerramos el menú cuando se pulsa el botón.
menuToggle.addEventListener("click", function () {

    // Alterna la clase "is-open" y guarda el resultado.
    const menuEstaAbierto = navbarMenu.classList.toggle("is-open");

    // Actualiza el estado accesible del botón.
    menuToggle.setAttribute("aria-expanded", menuEstaAbierto);

    // Actualiza la descripción accesible del botón.
    if (menuEstaAbierto) {
        menuToggle.setAttribute(
            "aria-label",
            "Cerrar menú de navegación"
        );
    } else {
        menuToggle.setAttribute(
            "aria-label",
            "Abrir menú de navegación"
        );
    }

});

// Seleccionamos todos los enlaces del menú.
const enlacesMenu = document.querySelectorAll(".navbar__link");

// Recorremos cada enlace.
enlacesMenu.forEach(function (enlace) {

    enlace.addEventListener("click", function () {

        // Cerramos el menú después de seleccionar una opción.
        navbarMenu.classList.remove("is-open");

        // Restablecemos los atributos del botón.
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute(
            "aria-label",
            "Abrir menú de navegación"
        );

    });

});