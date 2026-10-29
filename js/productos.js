// ==================================================
// 1. ELEMENTOS DE LA PÁGINA
// ==================================================

const productsGrid = document.querySelector("#products-grid");
const productSearch = document.querySelector("#product-search");
const productCounter = document.querySelector("#product-counter");
const catalogEmpty = document.querySelector("#catalog-empty");

const loadMoreButton = document.querySelector(
    "#load-more-button"
);


// ==================================================
// 2. CONFIGURACIÓN
// ==================================================

// Número de WhatsApp de Marcelo en formato internacional.
const whatsappNumber = "573227194171";

// Extensiones que pueden tener las imágenes.
const imageExtensions = [
    ".JPG",
    ".JPEG",
    ".PNG",
    ".WEBP",
    ".jpg",
    ".jpeg",
    ".png",
    ".webp"
];

// Cantidad de productos que se muestran por grupo.
const productsPerPage = 12;

// Cantidad de productos visibles actualmente.
let visibleProducts = productsPerPage;

// Lista que se está mostrando actualmente.
let currentProducts = productos;


// ==================================================
// 3. NORMALIZAR TEXTOS
// ==================================================

function normalizeText(text) {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

// ==================================================
// FORMATEAR PRECIOS
// ==================================================

function formatPrice(price) {
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
}

// ==================================================
// 4. CREAR ENLACE DE WHATSAPP
// ==================================================

function createWhatsAppLink(productName, productPrice) {
    const formattedPrice = formatPrice(productPrice);

    const message =
        `Hola Marcelo, vi el catálogo de Distribuidora Y&K ` +
        `y deseo recibir información sobre el producto: ` +
        `${productName}, publicado por ${formattedPrice}.`;

    return (
        `https://wa.me/${whatsappNumber}` +
        `?text=${encodeURIComponent(message)}`
    );
}

// ==================================================
// 5. CARGAR LA IMAGEN DEL PRODUCTO
// ==================================================

function loadProductImage(
    imageElement,
    product,
    extensionIndex = 0
) {
    // Si ninguna extensión funcionó, mostramos el logo.
    if (extensionIndex >= imageExtensions.length) {
        imageElement.onerror = null;
        imageElement.src = "./img/logo-yk.png";

        imageElement.classList.add(
            "product-card__image--fallback"
        );

        return;
    }

    const extension = imageExtensions[extensionIndex];

    const encodedFileName = encodeURIComponent(
        product.archivoBase
    );

    imageElement.src =
        `./img/productos/${encodedFileName}${extension}`;

    // Si falla, prueba la extensión siguiente.
    imageElement.onerror = function () {
        loadProductImage(
            imageElement,
            product,
            extensionIndex + 1
        );
    };
}

// ==================================================
// 6. CREAR UNA TARJETA
// ==================================================

function createProductCard(product) {
    const article = document.createElement("article");
    article.className = "product-card";

    // Área de imagen.
    const imageContainer = document.createElement("div");

    imageContainer.className =
        "product-card__image-container";

    const image = document.createElement("img");
    image.className = "product-card__image";
    image.alt = `Presentación de ${product.nombre}`;
    image.loading = "lazy";
    image.decoding = "async";

    loadProductImage(image, product);

    // Área de contenido.
    const content = document.createElement("div");
    content.className = "product-card__content";

    const label = document.createElement("p");
    label.className = "product-card__label";
    label.textContent = "Producto para consulta";

    const title = document.createElement("h2");
    title.className = "product-card__title";
    title.textContent = product.nombre;

    const price = document.createElement("p");
    price.className = "product-card__price";
    price.textContent = formatPrice(product.precio);    

    const description = document.createElement("p");

    description.className =
        "product-card__description";

    description.textContent =
        "Consulta disponibilidad y presentación con el asesor.";

    // Botón de WhatsApp.
    const whatsappLink = document.createElement("a");

    whatsappLink.className =
        "product-card__button";

    whatsappLink.href = createWhatsAppLink(
        product.nombre,
        product.precio
    );

    whatsappLink.target = "_blank";
    whatsappLink.rel = "noopener noreferrer";

    whatsappLink.innerHTML = `
        <span aria-hidden="true">WA</span>
        Consultar producto
    `;

    // Armar la tarjeta.
    imageContainer.appendChild(image);

    content.appendChild(label);
    content.appendChild(title);
    content.appendChild(price);
    content.appendChild(description);
    content.appendChild(whatsappLink);

    article.appendChild(imageContainer);
    article.appendChild(content);

    return article;
}

// ==================================================
// 7. MOSTRAR LOS PRODUCTOS
// ==================================================

function renderProducts(productList, showAll = false) {
    // Guardamos la lista que se está mostrando.
    currentProducts = productList;

    // Eliminamos las tarjetas anteriores.
    productsGrid.innerHTML = "";

    const totalProducts = productList.length;

    // Si hay una búsqueda, mostramos todas las coincidencias.
    // Si no hay búsqueda, respetamos el límite visible.
    const productsToShow = showAll
        ? productList
        : productList.slice(0, visibleProducts);

    // Actualizamos el contador.
    if (
        showAll ||
        productsToShow.length === totalProducts
    ) {
        productCounter.textContent =
            `${totalProducts} producto` +
            `${totalProducts === 1 ? "" : "s"}`;
    } else {
        productCounter.textContent =
            `Mostrando ${productsToShow.length} ` +
            `de ${totalProducts} productos`;
    }

    // Muestra el aviso solo cuando no hay productos.
    catalogEmpty.hidden = totalProducts !== 0;

    // Si no hay resultados, ocultamos Cargar más.
    if (totalProducts === 0) {
        loadMoreButton.hidden = true;
        return;
    }

    // Creamos un fragmento temporal.
    const fragment = document.createDocumentFragment();

    // Creamos únicamente las tarjetas necesarias.
    productsToShow.forEach(function (product) {
        const card = createProductCard(product);
        fragment.appendChild(card);
    });

    // Insertamos las tarjetas en la página.
    productsGrid.appendChild(fragment);

    // Ocultamos el botón si ya se muestran todos.
    loadMoreButton.hidden =
        showAll ||
        productsToShow.length >= totalProducts;
}

// ==================================================
// BUSCADOR
// ==================================================

productSearch.addEventListener("input", function () {
    const searchTerm = normalizeText(
        productSearch.value.trim()
    );

    // Si el buscador está vacío, volvemos al catálogo.
    if (searchTerm === "") {
        visibleProducts = productsPerPage;
        renderProducts(productos);
        return;
    }

    const filteredProducts = productos.filter(
        function (product) {
            const normalizedName = normalizeText(
                product.nombre
            );

            return normalizedName.includes(searchTerm);
        }
    );

    // Durante la búsqueda mostramos todas las coincidencias.
    renderProducts(filteredProducts, true);
});

// ==================================================
// BOTÓN CARGAR MÁS
// ==================================================

loadMoreButton.addEventListener("click", function () {
    // Agregamos otro grupo de productos.
    visibleProducts += productsPerPage;

    // Volvemos a presentar la lista actual.
    renderProducts(currentProducts);
});


// ==================================================
// 9. CARGA INICIAL
// ==================================================

// Ordenamos alfabéticamente.
productos.sort(function (productA, productB) {
    return productA.nombre.localeCompare(
        productB.nombre,
        "es"
    );
});

// Mostramos todo el catálogo.
renderProducts(productos);