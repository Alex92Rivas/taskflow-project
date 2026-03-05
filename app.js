const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const taskList = document.querySelector(".task-list");

/* =========================
   PELÍCULAS INICIALES
========================= */

const defaultTasks = [
    { title: "El Caballero Oscuro", category: "Acción", priority: "high", label: "Top" },
    { title: "Superbad", category: "Comedia", priority: "low", label: "Ligera" },
    { title: "Interstellar", category: "Ciencia Ficción", priority: "high", label: "Imprescindible" },
    { title: "La La Land", category: "Drama", priority: "medium", label: "Interesante" }
];

/* =========================
   CREAR TARJETA
========================= */

function createTaskCard(task) {
    const taskCard = document.createElement("article");
    taskCard.className = "task-card";

    taskCard.innerHTML = `
        <h3>${task.title}</h3>
        <span class="category">${task.category}</span>
        <span class="priority ${task.priority}">${task.label}</span>
        <button class="delete-btn">Eliminar</button>
    `;

    const deleteBtn = taskCard.querySelector(".delete-btn");

    deleteBtn.addEventListener("click", function() {
        taskCard.remove();
        saveTasks();
    });

    taskList.appendChild(taskCard);
}

/* =========================
   GUARDAR EN LOCALSTORAGE
========================= */

function saveTasks() {
    const tasks = [];

    document.querySelectorAll(".task-card").forEach(card => {
        const title = card.querySelector("h3").textContent;
        const category = card.querySelector(".category").textContent;
        const label = card.querySelector(".priority").textContent;
        const priorityClass = card.querySelector(".priority").classList[1];

        tasks.push({ title, category, priority: priorityClass, label });
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}



/* =========================
   AÑADIR NUEVA PELÍCULA CON CATEGORÍA Y PRIORIDAD
========================= */
form.addEventListener("submit", function(event) {
    event.preventDefault();

    const taskName = input.value.trim();

    const category = document.getElementById("category-select").value;
    const priority = document.getElementById("priority-select").value;

    if (taskName !== "") {

        // Traducción de la prioridad a la etiqueta visible
        const label = priority === "high" ? "Top" :
                      priority === "medium" ? "Interesante" :
                      "Ligera";

        const newTask = {
            title: taskName,
            category: category,
            priority: priority,
            label: label
        };

        createTaskCard(newTask);
        saveTasks();
        input.value = "";
    }
});

/* =========================
   CARGAR AL INICIAR
========================= */

document.addEventListener("DOMContentLoaded", function() {

    let storedTasks = JSON.parse(localStorage.getItem("tasks"));

    if (!storedTasks || storedTasks.length === 0) {
        storedTasks = defaultTasks;
        localStorage.setItem("tasks", JSON.stringify(defaultTasks));
    }

    storedTasks.forEach(task => {
        createTaskCard(task);
    });

});


/* =========================
   ELEGIR PELÍCULA ALEATORIA
========================= */

const randomBtn = document.getElementById("random-movie-btn");
const randomResult = document.getElementById("random-result");

randomBtn.addEventListener("click", function() {

    const movies = [];

    document.querySelectorAll(".task-card h3").forEach(movie => {
        movies.push(movie.textContent);
    });

    if (movies.length === 0) {
        randomResult.textContent = "No hay películas en la lista.";
        return;
    }

    const randomIndex = Math.floor(Math.random() * movies.length);
    const chosenMovie = movies[randomIndex];

    randomResult.textContent = "🎬 Hoy toca ver: " + chosenMovie;

});


/* =========================
   BUSCAR PELÍCULAS
========================= */

const searchInput = document.getElementById("search-input");

searchInput.addEventListener("input", function() {

    const searchText = searchInput.value.toLowerCase();

    document.querySelectorAll(".task-card").forEach(card => {

        const title = card.querySelector("h3").textContent.toLowerCase();

        if (title.includes(searchText)) {
            card.style.display = "flex";
        } else {
            card.style.display = "none";
        }

    });

});