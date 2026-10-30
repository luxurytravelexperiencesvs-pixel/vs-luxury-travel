const flightForm = document.getElementById("flight-form");
const flightRequest = document.getElementById("flight-request");
const flightButton = document.querySelector('a[href="#flight-request"]');
const closeFlightForm = document.getElementById("close-flight-form");

// Número de WhatsApp configurado
const WHATSAPP_NUMBER = "593995769934";

// Mostrar y ocultar formulario
if (flightRequest) {
    flightRequest.style.display = "none";
}

if (closeFlightForm && flightRequest) {
    closeFlightForm.addEventListener("click", function () {
        flightRequest.style.display = "none";
    });
}

if (flightButton && flightRequest) {
    flightButton.addEventListener("click", function (event) {
        event.preventDefault();

        flightRequest.style.display = "block";

        flightRequest.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
}

// Tipo de viaje y fecha de regreso
const tripTypeInputs = document.querySelectorAll('input[name="trip-type"]');
const returnDate = document.getElementById("return-date");
const returnDateLabel = document.querySelector('label[for="return-date"]');

function updateReturnDate() {
    const selectedTrip = document.querySelector(
        'input[name="trip-type"]:checked'
    );

    if (!selectedTrip) {
        if (returnDate) {
            returnDate.style.display = "none";
            returnDate.required = false;
        }

        if (returnDateLabel) {
            returnDateLabel.style.display = "none";
        }

        return;
    }

    if (selectedTrip.value === "ida-vuelta") {
        if (returnDateLabel) {
            returnDateLabel.style.display = "block";
        }

        if (returnDate) {
            returnDate.style.display = "block";
            returnDate.required = true;
        }
    } else {
        if (returnDateLabel) {
            returnDateLabel.style.display = "none";
        }

        if (returnDate) {
            returnDate.style.display = "none";
            returnDate.required = false;
            returnDate.value = "";
        }
    }
}

tripTypeInputs.forEach(function (input) {
    input.addEventListener("change", updateReturnDate);
});

updateReturnDate();

// ==========================================
// ENVÍO DE SOLICITUDES A WHATSAPP
// ==========================================

if (flightForm) {
    flightForm.addEventListener("submit", function (event) {
        event.preventDefault();

        // Datos del pasajero
        const name = document.getElementById("passenger-name").value.trim();
        const phone = document.getElementById("customer-phone").value.trim();
        const origin = document.getElementById("origin").value.trim();
        const destination = document.getElementById("destination").value.trim();
        const departureDate = document.getElementById("departure-date").value;
        const returnDateValue = document.getElementById("return-date").value;

        const selectedTrip = document.querySelector(
            'input[name="trip-type"]:checked'
        );

        if (!selectedTrip) {
            alert("Por favor, selecciona el tipo de viaje.");
            return;
        }

        const tripType = selectedTrip.value;

        const adults = document.getElementById("adults").value;
        const children = document.getElementById("children").value;
        const seniors = document.getElementById("seniors").value;
        const baggage = document.getElementById("baggage").value;
        const observations = document.getElementById("observations").value.trim();

        // Preparar mensaje
        let message = `Hola, quiero solicitar información para comprar un boleto aéreo.

Nombre: ${name}
WhatsApp / Teléfono: ${phone}
Origen: ${origin}
Destino: ${destination}
Tipo de viaje: ${tripType}
Fecha de ida: ${departureDate}`;

        if (tripType === "ida-vuelta") {
            message += `\nFecha de regreso: ${returnDateValue}`;
        }

        message += `

Adultos: ${adults}
Niños: ${children}
Adultos mayores: ${seniors}
Equipaje: ${baggage}`;

        if (observations !== "") {
            message += `\nObservaciones: ${observations}`;
        }

        // Crear dirección de WhatsApp
        const whatsappUrl =
            "https://wa.me/" + WHATSAPP_NUMBER +
            "?text=" + encodeURIComponent(message);

        // Abrir WhatsApp
        const whatsappWindow = window.open(whatsappUrl, "_blank");

        if (!whatsappWindow) {
            alert(
                "El navegador bloqueó la ventana de WhatsApp. " +
                "Se abrirá en esta pestaña."
            );

            window.location.href = whatsappUrl;
        }
    });
}
