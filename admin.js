const SUPABASE_URL = "https://folwzkjjfszvpuicetov.supabase.co";

const SUPABASE_KEY = "sb_publishable_s5qUVlCExv0hy5tdWXiq2A_TNvw7Onp";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
const loginForm = document.getElementById("login-form");
const loginMessage = document.getElementById("login-message");

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const email = document.getElementById("admin-email").value;
    const password = document.getElementById("admin-password").value;

    const { error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {

        console.error(error);
        loginMessage.textContent = "Correo o contraseña incorrectos.";
        return;

    }

    loginMessage.textContent = "Sesión iniciada correctamente.";

    document.getElementById("login-section").style.display = "none";
    document.getElementById("admin-dashboard").style.display = "block";

    loadRequests();
});
async function loadRequests() {

    const { data, error } = await supabaseClient
        .from("requests")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {

        console.error("Error al cargar solicitudes:", error);

        document.getElementById("requests-container").textContent =
            "No pudimos cargar las solicitudes.";

        return;
    }

    const container = document.getElementById("requests-container");

container.innerHTML = "";

data.forEach(function (request) {

    const card = document.createElement("div");

    card.innerHTML = `
    <h3>${request.service_type}</h3>

    <p><strong>Cliente:</strong> ${request.customer_name}</p>

    <p><strong>Teléfono:</strong> ${request.customer_phone}</p>

    <p><strong>Origen:</strong> ${request.details.origin}</p>

    <p><strong>Destino:</strong> ${request.details.destination}</p>

    <p><strong>Tipo de viaje:</strong> ${request.details.trip_type}</p>

    <p><strong>Fecha de ida:</strong> ${request.details.departure_date}</p>

    <p><strong>Fecha de regreso:</strong> ${request.details.return_date || "No aplica"}</p>

    <p><strong>Adultos:</strong> ${request.details.adults}</p>

    <p><strong>Niños:</strong> ${request.details.children}</p>

    <p><strong>Adultos mayores:</strong> ${request.details.seniors}</p>

    <p><strong>Equipaje:</strong> ${request.details.baggage}</p>

    <p><strong>Observaciones:</strong> ${request.details.observations || "Ninguna"}</p>
    
    <p>
      <strong>Notas del administrador:</strong>
    </p>

    <textarea
      class="admin-notes"
      data-id="${request.id}"
      rows="3"
      placeholder="Escribe una nota interna..."
    >${request.admin_notes || ""}</textarea>
    <p>
    <strong>Estado:</strong>

    <select class="status-select" data-id="${request.id}">

        <option value="pending" ${request.status === "pending" ? "selected" : ""}>
            Pendiente
        </option>

        <option value="reviewing" ${request.status === "reviewing" ? "selected" : ""}>
            En revisión
        </option>

        <option value="quoted" ${request.status === "quoted" ? "selected" : ""}>
            Cotizado
        </option>

        <option value="confirmed" ${request.status === "confirmed" ? "selected" : ""}>
            Confirmado
        </option>

        <option value="closed" ${request.status === "closed" ? "selected" : ""}>
            Cerrado
        </option>

    </select>

    </p>
`;

    container.appendChild(card);

});

}
document.addEventListener("change", async function (event) {

    if (!event.target.classList.contains("status-select")) {
        return;
    }

    const requestId = event.target.dataset.id;
    const newStatus = event.target.value;

    const { error } = await supabaseClient
        .from("requests")
        .update({
            status: newStatus
        })
        .eq("id", requestId);

    if (error) {

        console.error("Error al actualizar el estado:", error);

        alert("No pudimos actualizar el estado.");

        return;
    }

    console.log("Estado actualizado correctamente.");

});

document.addEventListener("blur", async function (event) {

    if (!event.target.classList.contains("admin-notes")) {
        return;
    }

    const requestId = event.target.dataset.id;
    const notes = event.target.value;

    const { error } = await supabaseClient
        .from("requests")
        .update({
            admin_notes: notes
        })
        .eq("id", requestId);

    if (error) {

        console.error("Error al guardar la nota:", error);

        alert("No pudimos guardar la nota.");

        return;
    }

    console.log("Nota guardada correctamente.");

}, true);

const logoutButton = document.getElementById("logout-button");

logoutButton.addEventListener("click", async function () {

    const { error } = await supabaseClient.auth.signOut();

    if (error) {

        console.error("Error al cerrar sesión:", error);

        return;
    }

    window.location.reload();

});