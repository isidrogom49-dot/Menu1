// ======== MODALES ========
const productModal = document.getElementById("productModal");
const purchaseModal = document.getElementById("purchaseModal");
const ticketModal = document.getElementById("ticketModal");
const cards = document.querySelectorAll(".card");
const buyBtn = document.getElementById("buyBtn");
const purchaseForm = document.getElementById("purchaseForm");
const ticketContent = document.getElementById("ticketContent");

// ======== CARD CLICK - MOSTRAR PLATO ========
cards.forEach(card => {
    // Click en card
    card.addEventListener("click", () => {
        const img = card.dataset.img;
        const name = card.querySelector("h3").textContent;
        const price = card.querySelector(".price").textContent;

        productModal.querySelector("img").src = img;
        productModal.querySelector("h3").textContent = name;
        productModal.querySelector(".price").textContent = price;
        productModal.querySelector("p").textContent = "Delicious gourmet dish carefully prepared for you.";

        openModal(productModal);
    });

    // 3D hover
    card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 15;
        const rotateY = (centerX - x) / 15;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });
    card.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
    });
});

// ======== OPEN/CLOSE MODAL ========
function openModal(modal) { modal.classList.add("active"); document.body.style.overflow = "hidden"; }
function closeModal(modal) { modal.classList.remove("active"); document.body.style.overflow = "auto"; }

// Close buttons
document.querySelectorAll(".modal .close").forEach(btn => {
    btn.addEventListener("click", (e) => closeModal(e.target.closest(".modal")));
});

// ESC key
document.addEventListener("keydown", e => { if (e.key === "Escape") document.querySelectorAll(".modal.active").forEach(m => closeModal(m)); });

// Click outside
document.querySelectorAll(".modal").forEach(modal => {
    modal.addEventListener("click", e => { if (e.target === modal) closeModal(modal); });
});

// ======== PURCHASE ========
buyBtn.addEventListener("click", () => {
    closeModal(productModal);
    purchaseForm.reset();
    purchaseForm.querySelector(".subtotal").textContent = "";
    openModal(purchaseModal);

    const name = productModal.querySelector("h3").textContent;
    const priceText = productModal.querySelector(".price").textContent.replace('$','');
    purchaseForm.dataset.dishName = name;
    purchaseForm.dataset.price = parseFloat(priceText);
});

// ======== FORM SUBMIT ========
purchaseForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const customer = document.getElementById("customerName").value;
    const extras = document.getElementById("extras").value || "None";
    const quantity = parseInt(document.getElementById("quantity").value);
    const dish = purchaseForm.dataset.dishName;
    const price = parseFloat(purchaseForm.dataset.price);
    const subtotal = price * quantity;
    purchaseForm.querySelector(".subtotal").textContent = `Subtotal: $${subtotal.toFixed(2)}`;

    closeModal(purchaseModal);

    ticketContent.innerHTML = `
        <h3>Ticket</h3>
        <p><strong>Customer:</strong> ${customer}</p>
        <p><strong>Dish:</strong> ${dish}</p>
        <p><strong>Extras:</strong> ${extras}</p>
        <p><strong>Quantity:</strong> ${quantity}</p>
        <p><strong>Total:</strong> $${subtotal.toFixed(2)}</p>
        <div id="qrcodeWrapper"></div>
    `;
    openModal(ticketModal);

    document.getElementById("qrcodeWrapper").innerHTML = "";
    new QRCode(document.getElementById("qrcodeWrapper"), {
        text: `Customer: ${customer}, Dish: ${dish}, Total: $${subtotal.toFixed(2)}`,
        width: 120,
        height: 120
    });
});

// ======== BACK BUTTON ========
document.querySelector(".back-btn").addEventListener("click", () => { window.history.back(); });