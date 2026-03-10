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

    taskCard.className =
        "flex justify-between items-center bg-gray-100 dark:bg-gray-700/80 backdrop-blur-sm p-4 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1";

    taskCard.innerHTML = `
        <div class="flex flex-col">
            <h3 class="text-lg font-bold text-blue-900 dark:text-gray-100">${task.title}</h3>
            <span class="text-sm text-blue-700 dark:text-gray-300">${task.category}</span>
        </div>

        <div class="flex items-center gap-2">
            <span class="px-2 py-1 rounded text-white ${getPriorityColor(task.priority)}">
                ${task.label}
            </span>

            <button class="delete-btn bg-red-600 text-white px-2 py-1 rounded hover:bg-red-500 transition">
                Eliminar
            </button>
        </div>
    `;

    taskCard.querySelector(".delete-btn").addEventListener("click", () => {
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

    document.querySelectorAll("article").forEach(card => {
        const title = card.querySelector("h3").textContent;
        const category = card.querySelector("div > span")?.textContent || "";

        const prioritySpan = card.querySelector("span.px-2");
        const label = prioritySpan?.textContent || "";

        const priorityClass = prioritySpan?.classList[3] || "";

        let priority = "low";
        if (priorityClass.includes("red")) priority = "high";
        if (priorityClass.includes("yellow")) priority = "medium";

        tasks.push({ title, category, priority, label });
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* =========================
   AÑADIR NUEVA PELÍCULA
========================= */

form.addEventListener("submit", event => {
    event.preventDefault();

    const taskName = input.value.trim();
    const category = document.getElementById("category-select").value;
    const priority = document.getElementById("priority-select").value;

    if (taskName !== "") {
        const label =
            priority === "high" ? "Top" :
            priority === "medium" ? "Interesante" :
            "Ligera";

        const newTask = { title: taskName, category, priority, label };

        createTaskCard(newTask);
        saveTasks();
        input.value = "";
    }
});

/* =========================
   CARGAR AL INICIAR
========================= */

document.addEventListener("DOMContentLoaded", () => {
    let storedTasks = JSON.parse(localStorage.getItem("tasks"));

    if (!storedTasks || storedTasks.length === 0) {
        storedTasks = defaultTasks;
        localStorage.setItem("tasks", JSON.stringify(defaultTasks));
    }

    storedTasks.forEach(task => createTaskCard(task));
});

/* =========================
   ELEGIR PELÍCULA ALEATORIA
========================= */

const randomBtn = document.getElementById("random-movie-btn");
const randomResult = document.getElementById("random-result");

randomBtn.addEventListener("click", () => {
    const movies = [];

    document.querySelectorAll("article h3").forEach(movie => {
        movies.push(movie.textContent);
    });

    if (movies.length === 0) {
        randomResult.textContent = "No hay películas en la lista.";
        return;
    }

    const randomIndex = Math.floor(Math.random() * movies.length);
    randomResult.textContent = "🎬 Hoy toca ver: " + movies[randomIndex];
    randomResult.classList.remove("random-appear");
    void randomResult.offsetWidth;
    randomResult.classList.add("random-appear");
});

/* =========================
   BUSCAR PELÍCULAS
========================= */

const searchInput = document.getElementById("search-input");

searchInput.addEventListener("input", () => {
    const searchText = searchInput.value.toLowerCase();

    document.querySelectorAll("article").forEach(card => {
        const title = card.querySelector("h3").textContent.toLowerCase();
        card.style.display = title.includes(searchText) ? "flex" : "none";
    });
});

/* =========================
   MODO OSCURO
========================= */

document.getElementById("theme-toggle").addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
});

/* =========================
   COLORES DE PRIORIDAD
========================= */

function getPriorityColor(priority) {
    if (priority === "high") return "bg-red-700 dark:bg-red-600";
    if (priority === "medium") return "bg-yellow-600 dark:bg-yellow-500";
    return "bg-green-700 dark:bg-green-600";
}
