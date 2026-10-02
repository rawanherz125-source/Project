let cart = JSON.parse(localStorage.getItem("donutCart")) || [];

const deliveryFee = 30;

function saveCart() {
    localStorage.setItem("donutCart", JSON.stringify(cart));
}

function getCartTotals() {

    let subtotal = 0;

    cart.forEach(function(item) {
        subtotal += item.price * item.quantity;
    });

    let delivery = cart.length > 0 ? deliveryFee : 0;

    return {
        subtotal: subtotal,
        delivery: delivery,
        total: subtotal + delivery
    };
}

function addToCart(name, price) {

    let existingItem = cart.find(function(item) {
        return item.name === name;
    });

    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({
            name: name,
            price: price,
            quantity: 1
        });

    }

    saveCart();
    updateCart();
}

function updateCart() {

    let count = 0;

    cart.forEach(function(item) {
        count += item.quantity;
    });

    document.getElementById("cartCount").textContent =
        count;

    displayCart();
}

function displayCart() {

    let container =
        document.getElementById("cartItems");

    if (cart.length === 0) {

        container.innerHTML = `
            <div class="empty-cart">

                <div style="font-size:60px;">
                    🍩
                </div>

                <h3>
                    Your cart is empty
                </h3>

                <p>
                    Add some delicious donuts!
                </p>

            </div>
        `;

    } else {

        container.innerHTML = "";

        cart.forEach(function(item, index) {

            let itemTotal =
                item.price * item.quantity;

            container.innerHTML += `

                <div class="cart-item">

                    <div class="cart-item-top">

                        <span class="cart-item-name">
                            ${item.name}
                        </span>

                        <span class="cart-item-price">
                            ${itemTotal} EGP
                        </span>

                    </div>

                    <div class="cart-controls">

                        <button
                            onclick="decreaseQuantity(${index})"
                        >
                            −
                        </button>

                        <span>
                            ${item.quantity}
                        </span>

                        <button
                            onclick="increaseQuantity(${index})"
                        >
                            +
                        </button>

                        <button
                            class="remove-btn"
                            onclick="removeItem(${index})"
                        >
                            Remove
                        </button>

                    </div>

                </div>

            `;
        });
    }

    let totals = getCartTotals();

    document.getElementById("cartSubtotal").textContent =
        totals.subtotal + " EGP";

    document.getElementById("deliveryFee").textContent =
        totals.delivery + " EGP";

    document.getElementById("cartFinalTotal").textContent =
        totals.total + " EGP";
}

function increaseQuantity(index) {

    cart[index].quantity++;

    saveCart();
    updateCart();
}

function decreaseQuantity(index) {

    if (cart[index].quantity > 1) {

        cart[index].quantity--;

    } else {

        cart.splice(index, 1);

    }

    saveCart();
    updateCart();
}

function removeItem(index) {

    cart.splice(index, 1);

    saveCart();
    updateCart();
}

function clearCart() {

    cart = [];

    saveCart();
    updateCart();
}

function openCart() {

    document.getElementById("cartOverlay").style.display =
        "flex";
}

function closeCart() {

    document.getElementById("cartOverlay").style.display =
        "none";
}

function goToMenu() {

    document.getElementById("menu").scrollIntoView({
        behavior: "smooth"
    });
}

function goToBooking() {

    if (cart.length === 0) {

        alert("Your cart is empty!");

        return;
    }

    closeCart();

    displayBookingSummary();

    document.getElementById("booking").scrollIntoView({
        behavior: "smooth"
    });
}

function displayBookingSummary() {

    let container =
        document.getElementById("bookingItems");

    container.innerHTML = "";

    cart.forEach(function(item) {

        container.innerHTML += `

            <div class="booking-item">

                <span>
                    ${item.name} × ${item.quantity}
                </span>

                <strong>
                    ${item.price * item.quantity} EGP
                </strong>

            </div>

        `;
    });

    let totals = getCartTotals();

    document.getElementById("bookingSubtotal").textContent =
        totals.subtotal + " EGP";

    document.getElementById("bookingDelivery").textContent =
        totals.delivery + " EGP";

    document.getElementById("bookingTotal").textContent =
        totals.total + " EGP";
}


let flavors = {
    Chocolate: 0,
    Strawberry: 0,
    Oreo: 0,
    Lotus: 0
};

function getBoxSize() {

    return Number(
        document.querySelector(
            'input[name="boxSize"]:checked'
        ).value
    );
}

function getBoxPrice() {

    return getBoxSize() === 6
        ? 250
        : 450;
}

function getSelectedCount() {

    let total = 0;

    for (let flavor in flavors) {

        total += flavors[flavor];

    }

    return total;
}

function updateFlavorDisplay() {

    for (let flavor in flavors) {

        document.getElementById(flavor).textContent =
            flavors[flavor];

    }

    let selected =
        getSelectedCount();

    let boxSize =
        getBoxSize();

    document.getElementById("selectedCount").textContent =
        selected;

    document.getElementById("boxCount").textContent =
        boxSize;

    document.getElementById("customPrice").textContent =
        getBoxPrice() + " EGP";
}

function changeFlavor(flavor, amount) {

    let boxSize =
        getBoxSize();

    let selected =
        getSelectedCount();

    if (
        amount === 1 &&
        selected >= boxSize
    ) {
        return;
    }

    if (
        amount === -1 &&
        flavors[flavor] === 0
    ) {
        return;
    }

    flavors[flavor] += amount;

    updateFlavorDisplay();
}

function addCustomBox() {

    let boxSize =
        getBoxSize();

    let selected =
        getSelectedCount();

    if (selected !== boxSize) {

        alert(
            "Please select exactly " +
            boxSize +
            " donuts."
        );

        return;
    }

    let flavorText = [];

    for (let flavor in flavors) {

        if (flavors[flavor] > 0) {

            flavorText.push(
                flavor +
                " x " +
                flavors[flavor]
            );

        }
    }

    let boxName =
        "Custom Box (" +
        boxSize +
        " Donuts) - " +
        flavorText.join(", ");

    addToCart(
        boxName,
        getBoxPrice()
    );

    resetFlavors();
}

function resetFlavors() {

    flavors = {
        Chocolate: 0,
        Strawberry: 0,
        Oreo: 0,
        Lotus: 0
    };

    updateFlavorDisplay();
}


document
    .querySelectorAll('input[name="boxSize"]')
    .forEach(function(radio) {

        radio.addEventListener(
            "change",
            function() {

                resetFlavors();

            }
        );

    });


document
    .getElementById("bookingForm")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();

            if (cart.length === 0) {

                alert("Your cart is empty!");

                return;
            }

            let name =
                document.getElementById("name").value;

            let phone =
                document.getElementById("phone").value;

            let address =
                document.getElementById("address").value;

            let date =
                document.getElementById("date").value;

            let time =
                document.getElementById("time").value;

            let payment =
                document.querySelector(
                    'input[name="payment"]:checked'
                ).value;

            let totals =
                getCartTotals();

            let orderNumber =
                Math.floor(
                    100000 +
                    Math.random() * 900000
                );

            document.getElementById("orderNumber").textContent =
                orderNumber;

            document.getElementById("confirmName").textContent =
                name;

            document.getElementById("confirmPhone").textContent =
                phone;

            document.getElementById("confirmAddress").textContent =
                address;

            document.getElementById("confirmDate").textContent =
                date;

            document.getElementById("confirmTime").textContent =
                time;

            document.getElementById("confirmPayment").textContent =
                payment;


            let confirmedItems =
                document.getElementById("confirmedItems");

            confirmedItems.innerHTML = "";


            cart.forEach(function(item) {

                confirmedItems.innerHTML += `

                    <div class="confirmed-item">

                        <span>
                            ${item.name} × ${item.quantity}
                        </span>

                        <strong>
                            ${item.price * item.quantity} EGP
                        </strong>

                    </div>

                `;

            });


            document.getElementById(
                "confirmedSubtotal"
            ).textContent =
                totals.subtotal + " EGP";


            document.getElementById(
                "confirmedDelivery"
            ).textContent =
                totals.delivery + " EGP";


            document.getElementById(
                "confirmedTotal"
            ).textContent =
                totals.total + " EGP";


            document.getElementById("home").style.display =
                "none";

            document.getElementById("menu").style.display =
                "none";

            document.getElementById("customize").style.display =
                "none";

            document.getElementById("booking").style.display =
                "none";


            document.getElementById(
                "confirmation"
            ).style.display =
                "block";


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });


            cart = [];

            saveCart();

            updateCart();

            this.reset();


            document.querySelector(
                'input[name="payment"][value="Cash on Delivery"]'
            ).checked = true;

        }
    );


function goToHome() {

    document.getElementById(
        "confirmation"
    ).style.display =
        "none";


    document.getElementById(
        "home"
    ).style.display =
        "flex";


    document.getElementById(
        "menu"
    ).style.display =
        "block";


    document.getElementById(
        "customize"
    ).style.display =
        "block";


    document.getElementById(
        "booking"
    ).style.display =
        "block";


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


updateFlavorDisplay();

updateCart();