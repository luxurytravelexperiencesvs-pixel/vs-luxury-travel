
const chatbotOptions = {
    es: {
        welcome: "¡Bienvenido a VS Luxury Travel Experiences! ✨ Soy VS Travel Concierge. ¿Qué experiencia estás buscando?",
        options: [
            "🌴 Viajes a Galápagos",
            "🇪🇨 Ecuador y sus destinos",
            "✈️ Boletos de avión",
            "🏨 Hoteles y experiencias de lujo",
            "💬 Asesoría personalizada"
        ],
        questions: {
            galapagos: "¿Qué tipo de experiencia buscas en Galápagos? Por ejemplo: crucero, alojamiento en islas o excursiones.",
            ecuador: "¿Qué tipo de experiencia te interesa en Ecuador? Naturaleza, cultura, aventura, gastronomía o lujo.",
            hotels: "¿Qué tipo de alojamiento o experiencia buscas? Hotel boutique, resort, hacienda, spa u otra experiencia.",
            personalized: "Cuéntame qué tipo de viaje o experiencia tienes en mente.",
            origin: "¿Desde qué ciudad o aeropuerto saldrían?",
            destination: "¿Cuál es el destino?",
            tripType: "¿Qué tipo de viaje necesitan?",
            adults: "¿Cuántos adultos viajarán? Escribe 0 si no hay adultos.",
            children: "¿Cuántos niños viajarán? Escribe 0 si no hay niños.",
            seniors: "¿Cuántas personas de tercera edad viajarán? Escribe 0 si no hay.",
            baggage: "¿Qué tipo de equipaje necesitan?",
            dates: "¿Cuáles son las fechas de viaje?",
            name: "¿Cuál es tu nombre?",
            extra: "¿Hay alguna preferencia o detalle adicional que debamos conocer? Si no tienes ninguno, escribe Ninguno.",
            travelers: "¿Cuántas personas viajarán?",
            summary: "¡Gracias! Este es el resumen de tu solicitud:",
            contact: "Enviar solicitud por WhatsApp 📲",
            restart: "Comenzar una nueva consulta",
            oneWay: "Solo ida",
            roundTrip: "Ida y vuelta",
            baggageOptions: [
                "Maleta de 10 kg",
                "Maleta de 23 kg",
                "Maletas de 10 kg y 23 kg",
                "Sin equipaje adicional"
            ]
        },
        whatsappIntro: "Hola, deseo solicitar información sobre un viaje con VS Luxury Travel Experiences."
    },

    en: {
        welcome: "Welcome to VS Luxury Travel Experiences! ✨ I'm VS Travel Concierge. What kind of experience are you looking for?",
        options: [
            "🌴 Galápagos trips",
            "🇪🇨 Ecuador and its destinations",
            "✈️ Flight tickets",
            "🏨 Luxury hotels and experiences",
            "💬 Personal travel assistance"
        ],
        questions: {
            galapagos: "What kind of Galápagos experience are you looking for? For example: cruise, island accommodation or excursions.",
            ecuador: "What kind of Ecuador experience interests you? Nature, culture, adventure, gastronomy or luxury.",
            hotels: "What kind of accommodation or experience are you looking for? Boutique hotel, resort, hacienda, spa or another experience.",
            personalized: "Tell me what kind of trip or experience you have in mind.",
            origin: "Which city or airport will you depart from?",
            destination: "What is your destination?",
            tripType: "What type of trip do you need?",
            adults: "How many adults will be travelling? Type 0 if none.",
            children: "How many children will be travelling? Type 0 if none.",
            seniors: "How many senior travellers will be travelling? Type 0 if none.",
            baggage: "What type of baggage do you need?",
            dates: "What are your travel dates?",
            name: "What is your name?",
            extra: "Any additional preferences or details we should know? If not, type None.",
            travelers: "How many people will be travelling?",
            summary: "Thank you! Here is your request summary:",
            contact: "Send request via WhatsApp 📲",
            restart: "Start a new enquiry",
            oneWay: "One way",
            roundTrip: "Round trip",
            baggageOptions: [
                "10 kg suitcase",
                "23 kg suitcase",
                "Both 10 kg and 23 kg",
                "No additional baggage"
            ]
        },
        whatsappIntro: "Hello, I would like to request information about a trip with VS Luxury Travel Experiences."
    }
};

// Número de WhatsApp general del concierge
const whatsappNumber = "593969082024";
const flightWhatsappNumber = "593995769934";

let currentLanguage = "es";
let currentStep = "";
let lead = {};

const chatButton = document.createElement("button");
chatButton.id = "vs-chat-button";
chatButton.type = "button";
chatButton.setAttribute("aria-label", "Open VS Travel Concierge");
chatButton.innerHTML = "✦";

const chatWindow = document.createElement("div");
chatWindow.id = "vs-chat-window";
chatWindow.setAttribute("aria-label", "VS Travel Concierge");

chatWindow.innerHTML = `
    <div class="vs-chat-header">
        <div>
            <strong>VS Travel Concierge</strong>
            <small>Luxury Travel Experiences</small>
        </div>
        <button id="vs-chat-close" type="button" aria-label="Close chat">×</button>
    </div>

    <div class="vs-chat-language">
        <button type="button" data-lang="es">ES</button>
        <button type="button" data-lang="en">EN</button>
    </div>

    <div id="vs-chat-messages" aria-live="polite"></div>
    <div id="vs-chat-options"></div>

    <form id="vs-chat-form">
        <input id="vs-chat-input" type="text" autocomplete="off">
        <button type="submit" aria-label="Send message">➤</button>
    </form>
`;

document.body.appendChild(chatButton);
document.body.appendChild(chatWindow);

const messages = document.getElementById("vs-chat-messages");
const options = document.getElementById("vs-chat-options");
const input = document.getElementById("vs-chat-input");
const chatForm = document.getElementById("vs-chat-form");
const sendButton = chatForm.querySelector("button");

function addMessage(text, type = "bot") {
    const message = document.createElement("div");
    message.className = `vs-chat-message ${type}`;
    message.textContent = text;
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
}

function clearOptions() {
    options.innerHTML = "";
}

function showTextQuestion(step) {
    currentStep = step;
    input.value = "";
    input.disabled = false;
    sendButton.disabled = false;

    input.placeholder = currentLanguage === "es"
        ? "Escribe tu respuesta..."
        : "Type your answer...";

    addMessage(chatbotOptions[currentLanguage].questions[step]);
}

function showChoiceQuestion(step, choices) {
    currentStep = step;
    input.value = "";
    input.disabled = true;
    sendButton.disabled = true;
    input.placeholder = "";

    clearOptions();

    addMessage(chatbotOptions[currentLanguage].questions[step]);

    choices.forEach(choice => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = choice;

        button.addEventListener("click", () => {
            lead[step] = choice;
            addMessage(choice, "user");
            clearOptions();
            continueConversation();
        });

        options.appendChild(button);
    });
}

function selectCategory(option) {
    lead.category = option;
    clearOptions();

    addMessage(option, "user");

    if (option === chatbotOptions[currentLanguage].options[0]) {
        showTextQuestion("galapagos");
    } else if (option === chatbotOptions[currentLanguage].options[1]) {
        showTextQuestion("ecuador");
    } else if (option === chatbotOptions[currentLanguage].options[2]) {
        showTextQuestion("origin");
    } else if (option === chatbotOptions[currentLanguage].options[3]) {
        showTextQuestion("hotels");
    } else {
        showTextQuestion("personalized");
    }
}

function showOptions() {
    clearOptions();

    chatbotOptions[currentLanguage].options.forEach(option => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = option;

        button.addEventListener("click", () => {
            selectCategory(option);
        });

        options.appendChild(button);
    });
}

function continueConversation() {
    const q = chatbotOptions[currentLanguage].questions;

    if (currentStep === "galapagos") {
        showTextQuestion("destination");
    } else if (currentStep === "ecuador") {
        showTextQuestion("destination");
    } else if (currentStep === "hotels") {
        showTextQuestion("destination");
    } else if (currentStep === "personalized") {
        showTextQuestion("destination");
    } else if (currentStep === "origin") {
        showTextQuestion("destination");
    } else if (currentStep === "destination") {
        if (lead.category === chatbotOptions[currentLanguage].options[2]) {
            showChoiceQuestion("tripType", [q.oneWay, q.roundTrip]);
        } else {
            showTextQuestion("dates");
        }
    } else if (currentStep === "tripType") {
        showTextQuestion("adults");
    } else if (currentStep === "adults") {
        showTextQuestion("children");
    } else if (currentStep === "children") {
        showTextQuestion("seniors");
    } else if (currentStep === "seniors") {
        showChoiceQuestion("baggage", q.baggageOptions);
    } else if (currentStep === "baggage") {
        showTextQuestion("dates");
    } else if (currentStep === "dates") {
        if (lead.category === chatbotOptions[currentLanguage].options[2]) {
            showTextQuestion("name");
        } else {
            showTextQuestion("travelers");
        }
    } else if (currentStep === "travelers") {
        showTextQuestion("name");
    } else if (currentStep === "name") {
        showTextQuestion("extra");
    } else if (currentStep === "extra") {
        showSummary();
    }
}

function processAnswer(answer) {
    addMessage(answer, "user");
    lead[currentStep] = answer;
    continueConversation();
}

function showSummary() {
    currentStep = "finished";
    clearOptions();

    const isFlight = lead.category === chatbotOptions[currentLanguage].options[2];

    let summary;

    if (currentLanguage === "es") {
        summary = isFlight
            ? `Categoría: ${lead.category}
Origen: ${lead.origin}
Destino: ${lead.destination}
Tipo de viaje: ${lead.tripType}
Adultos: ${lead.adults}
Niños: ${lead.children}
Personas de tercera edad: ${lead.seniors}
Equipaje solicitado: ${lead.baggage}
Fechas: ${lead.dates}
Nombre: ${lead.name}
Preferencias adicionales: ${lead.extra}`
            : `Categoría: ${lead.category}
Experiencia solicitada: ${lead.galapagos || lead.ecuador || lead.hotels || lead.personalized || "No especificada"}
Destino: ${lead.destination}
Fechas: ${lead.dates}
Viajeros: ${lead.travelers}
Nombre: ${lead.name}
Preferencias adicionales: ${lead.extra}`;
    } else {
        summary = isFlight
            ? `Category: ${lead.category}
Origin: ${lead.origin}
Destination: ${lead.destination}
Trip type: ${lead.tripType}
Adults: ${lead.adults}
Children: ${lead.children}
Senior travellers: ${lead.seniors}
Requested baggage: ${lead.baggage}
Dates: ${lead.dates}
Name: ${lead.name}
Additional preferences: ${lead.extra}`
            : `Category: ${lead.category}
Requested experience: ${lead.galapagos || lead.ecuador || lead.hotels || lead.personalized || "Not specified"}
Destination: ${lead.destination}
Dates: ${lead.dates}
Travellers: ${lead.travelers}
Name: ${lead.name}
Additional preferences: ${lead.extra}`;
    }

    addMessage(chatbotOptions[currentLanguage].questions.summary);
    addMessage(summary);

    input.disabled = true;
    sendButton.disabled = true;
    input.placeholder = "";

    const contactButton = document.createElement("button");
    contactButton.type = "button";
    contactButton.textContent = chatbotOptions[currentLanguage].questions.contact;

    contactButton.addEventListener("click", () => {
        const text = encodeURIComponent(
            chatbotOptions[currentLanguage].whatsappIntro + "\n\n" + summary
        );

        const destinationNumber = isFlight
    ? flightWhatsappNumber
    : whatsappNumber;

window.open(
    `https://wa.me/${destinationNumber}?text=${text}`,
    "_blank",
    "noopener,noreferrer"
);
    });

    options.appendChild(contactButton);

    const restartButton = document.createElement("button");
    restartButton.type = "button";
    restartButton.textContent = chatbotOptions[currentLanguage].questions.restart;
    restartButton.addEventListener("click", startChat);

    options.appendChild(restartButton);
}

function startChat() {
    lead = {};
    currentStep = "";

    messages.innerHTML = "";
    clearOptions();

    input.disabled = false;
    sendButton.disabled = false;
    input.placeholder = currentLanguage === "es"
        ? "Escribe tu respuesta..."
        : "Type your answer...";

    addMessage(chatbotOptions[currentLanguage].welcome);
    showOptions();
}

chatButton.addEventListener("click", () => {
    chatWindow.classList.toggle("open");

    if (chatWindow.classList.contains("open")) {
        startChat();
    }
});

document.getElementById("vs-chat-close").addEventListener("click", () => {
    chatWindow.classList.remove("open");
});

document.querySelectorAll(".vs-chat-language button").forEach(button => {
    button.addEventListener("click", () => {
        currentLanguage = button.dataset.lang;
        startChat();
    });
});

chatForm.addEventListener("submit", event => {
    event.preventDefault();

    const answer = input.value.trim();

    if (!answer || !currentStep || currentStep === "finished") {
        return;
    }

    processAnswer(answer);
});

startChat();
