const SUPABASE_URL = "https://folwzkjjfszvpuicetov.supabase.co";

const SUPABASE_KEY = "sb_publishable_s5qUVlCExv0hy5tdWXiq2A_TNvw7Onp";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
const flightForm = document.getElementById("flight-form");

const flightRequest = document.getElementById("flight-request");
const flightButton = document.querySelector(
    'a[href="#flight-request"]'
);
const closeFlightForm = document.getElementById(
    "close-flight-form"
);

closeFlightForm.addEventListener("click", function () {

    flightRequest.style.display = "none";

});

flightRequest.style.display = "none";

flightButton.addEventListener("click", function (event) {

    event.preventDefault();

    flightRequest.style.display = "block";

    flightRequest.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

});
const tripTypeInputs = document.querySelectorAll(
    'input[name="trip-type"]'
);

const returnDate = document.getElementById("return-date");
const returnDateLabel = document.querySelector(
    'label[for="return-date"]'
);

function updateReturnDate() {

    const selectedTrip = document.querySelector(
        'input[name="trip-type"]:checked'
    ).value;

    if (selectedTrip === "ida-vuelta") {

        returnDateLabel.style.display = "block";
        returnDate.style.display = "block";
        returnDate.required = true;

    } else {

        returnDateLabel.style.display = "none";
        returnDate.style.display = "none";
        returnDate.required = false;
        returnDate.value = "";

    }

}

tripTypeInputs.forEach(function (input) {

    input.addEventListener("change", updateReturnDate);

});

updateReturnDate();

flightForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const name = document.getElementById("passenger-name").value;
    const phone = document.getElementById("customer-phone").value;
    const origin = document.getElementById("origin").value;
    const destination = document.getElementById("destination").value;
    const departureDate = document.getElementById("departure-date").value;
    const returnDate = document.getElementById("return-date").value;
    const tripType = document.querySelector(
        'input[name="trip-type"]:checked'
    ).value;

    const adults = document.getElementById("adults").value;
    const children = document.getElementById("children").value;
    const seniors = document.getElementById("seniors").value;
    const baggage = document.getElementById("baggage").value;
    const observations = document.getElementById("observations").value;

    let message = `Hola, quiero solicitar información para comprar un boleto aéreo.

Nombre: ${name}
WhatsApp / Teléfono: ${phone}
Origen: ${origin}
Destino: ${destination}
Tipo de viaje: ${tripType}
Fecha de ida: ${departureDate}`;

    if (tripType === "ida-vuelta") {
        message += `
Fecha de regreso: ${returnDate}`;
    }

    message += `
Adultos: ${adults}
Niños: ${children}
Adultos mayores: ${seniors}
Equipaje: ${baggage}`;

    if (observations.trim() !== "") {
        message += `
Observaciones: ${observations}`;
    }

        const { error } = await supabaseClient
        .from("requests")
        .insert({
            service_type: "ticket",
            status: "pending",
            customer_name: name,
            customer_phone: phone,
            details: {
                origin: origin,
                destination: destination,
                trip_type: tripType,
                departure_date: departureDate,
                return_date: tripType === "ida-vuelta" ? returnDate : null,
                adults: adults,
                children: children,
                seniors: seniors,
                baggage: baggage,
                observations: observations
            }
        });

    if (error) {
        console.error("Error al guardar la solicitud:", error);
        alert("No pudimos registrar tu solicitud. Inténtalo nuevamente.");
        return;
    }
    const whatsappUrl =
        "https://wa.me/593995769934?text=" +
        encodeURIComponent(message);

    window.open(whatsappUrl, "_blank");

});