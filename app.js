const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const taskList = document.querySelector(".task-list");
const randomBtn = document.getElementById("random-movie-btn");
const randomResult = document.getElementById("random-result");
const searchInput = document.getElementById("search-input");
const sortBtn = document.getElementById("sort-movies-btn");
const categoryFilters = document.querySelectorAll(".category-filter");
const themeToggle = document.getElementById("theme-toggle");

/* =========================
   CONFIG TMDB
========================= */

const TMDB_API_KEY = "f06236af98eb2eb04b3d3760a445a7c2";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/original";
const THEME_STORAGE_KEY = "theme";
const TASKS_STORAGE_KEY = "tasks";

let activeCategory = "Todas";

/* =========================
   PELÍCULAS INICIALES
========================= */

const defaultTasks = [
  {
    title: "El Caballero Oscuro",
    category: "Acción",
    priority: "high",
    label: "Top",
    watched: false,
    poster: "",
    backdrop: ""
  },
  {
    title: "Superbad",
    category: "Comedia",
    priority: "low",
    label: "Ligera",
    watched: false,
    poster: "",
    backdrop: ""
  },
  {
    title: "Interstellar",
    category: "Ciencia Ficción",
    priority: "high",
    label: "Top",
    watched: false,
    poster: "",
    backdrop: ""
  },
  {
    title: "La La Land",
    category: "Musical",
    priority: "medium",
    label: "Interesante",
    watched: false,
    poster: "",
    backdrop: ""
  }
];

/* =========================
   FUNCIONES AUXILIARES
========================= */

function getPriorityLabel(priority) {
  if (priority === "high") return "Top";
  if (priority === "medium") return "Interesante";
  return "Ligera";
}

function getPriorityColor(priority) {
  if (priority === "high") return "bg-red-600 dark:bg-red-500";
  if (priority === "medium") return "bg-sky-500 dark:bg-sky-400";
  return "bg-green-600 dark:bg-green-500";
}

function isValidTaskTitle(title) {
  return title.trim().length >= 2;
}

function getStoredTasks() {
  const storedTasks = JSON.parse(localStorage.getItem(TASKS_STORAGE_KEY));
  return Array.isArray(storedTasks) ? storedTasks : [];
}

function saveTasks() {
  const tasks = [];

  taskList.querySelectorAll("article").forEach(card => {
    tasks.push({
      title: card.dataset.title || "",
      category: card.dataset.category || "",
      priority: card.dataset.priority || "low",
      label: card.dataset.label || "Ligera",
      watched: card.dataset.watched === "true",
      poster: card.dataset.poster || "",
      backdrop: card.dataset.backdrop || ""
    });
  });

  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
}

function saveTasksArray(tasks) {
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
}

function getMovieTitles() {
  const movies = [];

  taskList.querySelectorAll("article").forEach(card => {
    if (card.style.display !== "none") {
      movies.push(card.dataset.title);
    }
  });

  return movies;
}

function showRandomMovie(movieTitle) {
  randomResult.textContent = `🎬 Hoy toca ver: ${movieTitle}`;
  randomResult.classList.remove("random-appear");
  void randomResult.offsetWidth;
  randomResult.classList.add("random-appear");
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getFallbackImage(title) {
  const safeTitle = encodeURIComponent(title || "MovieNight Planner");

  return `data:image/svg+xml;charset=UTF-8,
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 500'>
    <defs>
      <linearGradient id='bg' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='%23111827'/>
        <stop offset='50%' stop-color='%231f2937'/>
        <stop offset='100%' stop-color='%237f1d1d'/>
      </linearGradient>
    </defs>
    <rect width='1200' height='500' fill='url(%23bg)'/>
    <circle cx='960' cy='120' r='90' fill='rgba(255,255,255,0.08)'/>
    <circle cx='1040' cy='380' r='140' fill='rgba(255,255,255,0.05)'/>
    <text x='60' y='220' fill='white' font-size='56' font-family='Arial, Helvetica, sans-serif' font-weight='700'>${safeTitle}</text>
    <text x='60' y='290' fill='rgba(255,255,255,0.78)' font-size='28' font-family='Arial, Helvetica, sans-serif'>MovieNight Planner</text>
  </svg>`.replace(/\n\s+/g, "");
}

function getBestImage(task) {
  return task.backdrop || task.poster || getFallbackImage(task.title);
}

function applyFilters() {
  const searchText = searchInput.value.trim().toLowerCase();

  taskList.querySelectorAll("article").forEach(card => {
    const title = (card.dataset.title || "").toLowerCase();
    const category = card.dataset.category || "";

    const matchesSearch = title.includes(searchText);
    const matchesCategory =
      activeCategory === "Todas" || category === activeCategory;

    card.style.display = matchesSearch && matchesCategory ? "flex" : "none";
  });
}

function closeAllMenus() {
  document.querySelectorAll(".menu-dropdown").forEach(menu => {
    menu.classList.add("hidden");
  });

  document.querySelectorAll(".task-list article").forEach(card => {
    card.classList.remove("z-20");
    card.classList.add("z-0");
  });
}

function setTheme(theme) {
  if (theme === "light") {
    document.documentElement.classList.remove("dark");
  } else {
    document.documentElement.classList.add("dark");
  }

  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

function loadTheme() {
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);

  if (storedTheme === "light" || storedTheme === "dark") {
    setTheme(storedTheme);
    return;
  }

  setTheme("dark");
}

async function fetchMovieImages(title) {
  if (!TMDB_API_KEY || TMDB_API_KEY === "PEGA_AQUI_TU_API_KEY") {
    return { poster: "", backdrop: "" };
  }

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${encodeURIComponent(TMDB_API_KEY)}&query=${encodeURIComponent(title)}&language=es-ES&include_adult=false`
    );

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}`);
    }

    const data = await response.json();
    const movie = data.results?.[0];

    if (!movie) {
      return { poster: "", backdrop: "" };
    }

    return {
      poster: movie.poster_path ? `${TMDB_IMAGE_BASE}${movie.poster_path}` : "",
      backdrop: movie.backdrop_path ? `${TMDB_IMAGE_BASE}${movie.backdrop_path}` : ""
    };
  } catch (error) {
    console.error("Error obteniendo imágenes de TMDB:", error);
    return { poster: "", backdrop: "" };
  }
}

async function hydrateTasksWithImages(tasks) {
  let changed = false;

  const updatedTasks = await Promise.all(
    tasks.map(async task => {
      if (task.poster || task.backdrop) {
        return task;
      }

      const images = await fetchMovieImages(task.title);

      if (images.poster || images.backdrop) {
        changed = true;
      }

      return {
        ...task,
        poster: images.poster || "",
        backdrop: images.backdrop || ""
      };
    })
  );

  if (changed) {
    saveTasksArray(updatedTasks);
  }

  return updatedTasks;
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
  taskCard.dataset.watched = task.watched ? "true" : "false";
  taskCard.dataset.poster = task.poster || "";
  taskCard.dataset.backdrop = task.backdrop || "";

  const imageUrl = getBestImage(task);

  taskCard.className =
    "movie-card relative z-0 flex items-stretch bg-gray-100 dark:bg-gray-700/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 overflow-visible min-h-[150px]";

  taskCard.innerHTML = `
    <div class="flex-1 min-w-0 flex">
      <div class="movie-visual relative w-[385px] min-w-[385px] h-[150px] rounded-l-xl overflow-hidden shrink-0">
        <img
          src="${imageUrl}"
          alt="Imagen de ${escapeHtml(task.title)}"
          class="absolute inset-0 w-full h-full object-cover"
        />

        <div class="absolute inset-0 bg-black/55 z-[1]"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/10 z-[1]"></div>

        <div class="absolute inset-0 flex flex-col justify-start px-4 py-4 z-[3]">
          <h3 class="movie-title text-xl font-extrabold text-white leading-tight max-w-[250px]">
            ${escapeHtml(task.title)}
          </h3>
          <span class="movie-category text-sm font-medium text-gray-200 mt-2 max-w-[250px]">
            ${escapeHtml(task.category)}
          </span>
        </div>
      </div>

      <div class="flex-1 min-w-0 rounded-r-xl bg-white/85 dark:bg-gray-800/55"></div>
    </div>

    <div class="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3 z-[4]">
      <span class="px-2 py-1 rounded text-white text-sm font-semibold ${getPriorityColor(task.priority)}">
        ${escapeHtml(task.label)}
      </span>

      <div class="relative">
        <button class="menu-btn bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-600 transition">
          ⋮
        </button>

        <div class="menu-dropdown hidden absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded shadow-lg border border-gray-200 dark:border-gray-700 z-10">
          <button class="watch-btn block w-full text-left px-4 py-2 text-sm text-green-700 dark:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            ${task.watched ? "Marcar como pendiente" : "Marcar como vista"}
          </button>
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
  const watchBtn = taskCard.querySelector(".watch-btn");
  const editBtn = taskCard.querySelector(".edit-btn");
  const deleteBtn = taskCard.querySelector(".delete-btn");
  const titleElement = taskCard.querySelector(".movie-title");
  const imageElement = taskCard.querySelector("img");

  if (task.watched) {
    taskCard.classList.add("opacity-60");
    titleElement.classList.add("line-through");
  }

  menuBtn.addEventListener("click", event => {
    event.stopPropagation();

    const isOpen = !dropdown.classList.contains("hidden");
    closeAllMenus();

    if (!isOpen) {
      dropdown.classList.remove("hidden");
      taskCard.classList.remove("z-0");
      taskCard.classList.add("z-20");
    }
  });

  dropdown.addEventListener("click", event => {
    event.stopPropagation();
  });

  watchBtn.addEventListener("click", () => {
    const isWatched = taskCard.dataset.watched === "true";
    const newWatchedState = !isWatched;

    taskCard.dataset.watched = newWatchedState ? "true" : "false";

    if (newWatchedState) {
      taskCard.classList.add("opacity-60");
      titleElement.classList.add("line-through");
      watchBtn.textContent = "Marcar como pendiente";
    } else {
      taskCard.classList.remove("opacity-60");
      titleElement.classList.remove("line-through");
      watchBtn.textContent = "Marcar como vista";
    }

    closeAllMenus();
    saveTasks();
    applyFilters();
  });

  editBtn.addEventListener("click", async () => {
    const currentTitle = taskCard.dataset.title;
    const newTitle = prompt("Editar título de la película:", currentTitle);

    if (!newTitle) {
      closeAllMenus();
      return;
    }

    const trimmedTitle = newTitle.trim();

    if (!isValidTaskTitle(trimmedTitle)) {
      alert("Introduce un título válido de al menos 2 caracteres.");
      return;
    }

    const { poster, backdrop } = await fetchMovieImages(trimmedTitle);

    taskCard.dataset.title = trimmedTitle;
    taskCard.dataset.poster = poster || "";
    taskCard.dataset.backdrop = backdrop || "";

    titleElement.textContent = trimmedTitle;
    imageElement.src = backdrop || poster || getFallbackImage(trimmedTitle);
    imageElement.alt = `Imagen de ${trimmedTitle}`;

    closeAllMenus();
    saveTasks();
    applyFilters();
  });

  deleteBtn.addEventListener("click", () => {
    taskCard.remove();
    saveTasks();
    applyFilters();
  });

  taskList.appendChild(taskCard);
}

/* =========================
   AÑADIR NUEVA PELÍCULA
========================= */

form.addEventListener("submit", async event => {
  event.preventDefault();

  const taskName = input.value.trim();
  const category = document.getElementById("category-select").value;
  const priority = document.getElementById("priority-select").value;

  if (!isValidTaskTitle(taskName)) {
    alert("Introduce un título válido de al menos 2 caracteres.");
    return;
  }

  const { poster, backdrop } = await fetchMovieImages(taskName);

  const newTask = {
    title: taskName,
    category,
    priority,
    label: getPriorityLabel(priority),
    watched: false,
    poster,
    backdrop
  };

  createTaskCard(newTask);
  saveTasks();
  applyFilters();
  form.reset();
});

/* =========================
   CARGAR AL INICIAR
========================= */

document.addEventListener("DOMContentLoaded", async () => {
  loadTheme();

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
      label: getPriorityLabel(normalizedPriority),
      watched: task.watched || false,
      poster: task.poster || "",
      backdrop: task.backdrop || ""
    };
  });

  saveTasksArray(storedTasks);

  const hydratedTasks = await hydrateTasksWithImages(storedTasks);

  taskList.innerHTML = "";
  hydratedTasks.forEach(task => createTaskCard(task));
  applyFilters();
});

/* =========================
   CERRAR MENÚS
========================= */

document.addEventListener("click", () => {
  closeAllMenus();
});

/* =========================
   PELÍCULA ALEATORIA
========================= */

randomBtn.addEventListener("click", () => {
  const movies = getMovieTitles();

  if (movies.length === 0) {
    randomResult.textContent = "No hay películas visibles en la lista.";
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
    const titleA = a.dataset.title.toLowerCase();
    const titleB = b.dataset.title.toLowerCase();
    return titleA.localeCompare(titleB, "es");
  });

  cards.forEach(card => taskList.appendChild(card));
  saveTasks();
  applyFilters();
});

/* =========================
   BUSCAR PELÍCULAS
========================= */

searchInput.addEventListener("input", () => {
  applyFilters();
});

/* =========================
   FILTRAR POR GÉNERO
========================= */

categoryFilters.forEach(filter => {
  filter.addEventListener("click", () => {
    activeCategory = filter.dataset.category;
    applyFilters();
  });
});

/* =========================
   MODO OSCURO / CLARO
========================= */

themeToggle.addEventListener("click", () => {
  const isDark = document.documentElement.classList.contains("dark");
  setTheme(isDark ? "light" : "dark");
});