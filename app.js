const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const taskList = document.querySelector(".task-list");
const randomBtn = document.getElementById("random-movie-btn");
const randomResult = document.getElementById("random-result");
const searchInput = document.getElementById("search-input");
const sortBtn = document.getElementById("sort-movies-btn");

/* =========================
   PELÍCULAS INICIALES
========================= */

const defaultTasks = [
  { title: "El Caballero Oscuro", category: "Acción", priority: "high", label: "Top" },
  { title: "Superbad", category: "Comedia", priority: "low", label: "Ligera" },
  { title: "Interstellar", category: "Ciencia Ficción", priority: "high", label: "Top" },
  { title: "La La Land", category: "Drama", priority: "medium", label: "Interesante" }
];

/* =========================
   FUNCIONES AUXILIARES
========================= */

function getPriorityLabel(priority) {
  if (priority === "high") return "Top";
  if (priority === "medium") return "Interesante";
  return "Ligera";
}

function isValidTaskTitle(title) {
  return title.trim().length >= 2;
}

function getStoredTasks() {
  const storedTasks = JSON.parse(localStorage.getItem("tasks"));
  return Array.isArray(storedTasks) ? storedTasks : [];
}

/**
 * Obtiene los títulos de todas las películas
 */
function getMovieTitles() {
  const movies = [];

  taskList.querySelectorAll("article h3").forEach(movie => {
    movies.push(movie.textContent);
  });

  return movies;
}

/**
 * Muestra película aleatoria
 */
function showRandomMovie(movieTitle) {
  randomResult.textContent = `🎬 Hoy toca ver: ${movieTitle}`;
  randomResult.classList.remove("random-appear");
  void randomResult.offsetWidth;
  randomResult.classList.add("random-appear");
}

/* =========================
   CREAR TARJETA
========================= */

function createTaskCard(task) {
  const taskCard = document.createElement("article");

  taskCard.dataset.title = task.title;
  taskCard.dataset.category = task.category;
  taskCard.dataset.priority = task.priority;
  taskCard.dataset.label = task.label;

  taskCard.className =
    "relative z-0 flex justify-between items-center bg-gray-100 dark:bg-gray-700/80 backdrop-blur-sm p-4 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1";

  taskCard.innerHTML = `
    <div class="flex flex-col">
      <h3 class="text-lg font-bold text-blue-900 dark:text-gray-100">${task.title}</h3>
      <span class="text-sm text-blue-700 dark:text-gray-300">${task.category}</span>
    </div>

    <div class="flex items-center gap-3 relative">
      <span class="px-2 py-1 rounded text-white ${getPriorityColor(task.priority)}">
        ${task.label}
      </span>

      <div class="relative">
        <button class="menu-btn bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-600 transition">
          ⋮
        </button>

        <div class="menu-dropdown hidden absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded shadow-lg border border-gray-200 dark:border-gray-700 z-10">
          <button class="edit-btn block w-full text-left px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            Editar
          </button>
          <button class="delete-btn block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  `;

  const menuBtn = taskCard.querySelector(".menu-btn");
  const dropdown = taskCard.querySelector(".menu-dropdown");
  const editBtn = taskCard.querySelector(".edit-btn");
  const deleteBtn = taskCard.querySelector(".delete-btn");

  menuBtn.addEventListener("click", event => {
    event.stopPropagation();

    const isOpen = !dropdown.classList.contains("hidden");

    document.querySelectorAll(".menu-dropdown").forEach(menu => {
      menu.classList.add("hidden");
    });

    document.querySelectorAll(".task-list article").forEach(card => {
      card.classList.remove("z-20");
      card.classList.add("z-0");
    });

    if (!isOpen) {
      dropdown.classList.remove("hidden");
      taskCard.classList.remove("z-0");
      taskCard.classList.add("z-20");
    }
  });

  editBtn.addEventListener("click", () => {
    const currentTitle = taskCard.dataset.title;
    const newTitle = prompt("Editar título de la película:", currentTitle);

    if (!newTitle) {
      dropdown.classList.add("hidden");
      return;
    }

    const trimmedTitle = newTitle.trim();

    if (!isValidTaskTitle(trimmedTitle)) {
      alert("Introduce un título válido de al menos 2 caracteres.");
      return;
    }

    taskCard.dataset.title = trimmedTitle;
    taskCard.querySelector("h3").textContent = trimmedTitle;
    dropdown.classList.add("hidden");
    saveTasks();
  });

  deleteBtn.addEventListener("click", () => {
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

  taskList.querySelectorAll("article").forEach(card => {
    tasks.push({
      title: card.dataset.title || "",
      category: card.dataset.category || "",
      priority: card.dataset.priority || "low",
      label: card.dataset.label || "Ligera"
    });
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

  if (!isValidTaskTitle(taskName)) {
    alert("Introduce un título válido de al menos 2 caracteres.");
    return;
  }

  const newTask = {
    title: taskName,
    category,
    priority,
    label: getPriorityLabel(priority)
  };

  createTaskCard(newTask);
  saveTasks();
  form.reset();
});

/* =========================
   CARGAR AL INICIAR
========================= */

document.addEventListener("DOMContentLoaded", () => {
  let storedTasks = getStoredTasks();

  if (storedTasks.length === 0) {
    storedTasks = defaultTasks;
  }

  storedTasks = storedTasks.map(task => {
    let normalizedPriority = task.priority;

    if (task.label === "Top") normalizedPriority = "high";
    if (task.label === "Interesante") normalizedPriority = "medium";
    if (task.label === "Ligera") normalizedPriority = "low";

    return {
      title: task.title,
      category: task.category,
      priority: normalizedPriority,
      label: getPriorityLabel(normalizedPriority)
    };
  });

  localStorage.setItem("tasks", JSON.stringify(storedTasks));

  taskList.innerHTML = "";
  storedTasks.forEach(task => createTaskCard(task));
});

document.addEventListener("click", () => {
  document.querySelectorAll(".menu-dropdown").forEach(menu => {
    menu.classList.add("hidden");
  });

  document.querySelectorAll(".task-list article").forEach(card => {
    card.classList.remove("z-20");
    card.classList.add("z-0");
  });
});

/* =========================
   PELÍCULA ALEATORIA
========================= */

randomBtn.addEventListener("click", () => {
  const movies = getMovieTitles();

  if (movies.length === 0) {
    randomResult.textContent = "No hay películas en la lista.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * movies.length);
  showRandomMovie(movies[randomIndex]);
});

/* =========================
   ORDENAR PELÍCULAS
========================= */

sortBtn.addEventListener("click", () => {
  const cards = Array.from(taskList.querySelectorAll("article"));

  cards.sort((a, b) => {
    const titleA = a.querySelector("h3").textContent.toLowerCase();
    const titleB = b.querySelector("h3").textContent.toLowerCase();
    return titleA.localeCompare(titleB);
  });

  cards.forEach(card => taskList.appendChild(card));
  saveTasks();
});

/* =========================
   BUSCAR PELÍCULAS
========================= */

searchInput.addEventListener("input", () => {
  const searchText = searchInput.value.toLowerCase();

  taskList.querySelectorAll("article").forEach(card => {
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
  if (priority === "high") return "bg-red-600 dark:bg-red-500";
  if (priority === "medium") return "bg-sky-500 dark:bg-sky-400";
  return "bg-green-600 dark:bg-green-500";
}