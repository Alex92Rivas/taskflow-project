const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const taskList = document.querySelector(".task-list");
const randomBtn = document.getElementById("random-movie-btn");
const randomResult = document.getElementById("random-result");
const searchInput = document.getElementById("search-input");
const sortBtn = document.getElementById("sort-movies-btn");
const categoryFilters = document.querySelectorAll(".category-filter");
const themeToggle = document.getElementById("theme-toggle");

const toggleGenresBtn = document.getElementById("toggle-genres");
const genreList = document.getElementById("genre-list");
const genreArrow = document.getElementById("genre-arrow");
const seenCounter = document.getElementById("seen-counter");

const TMDB_API_KEY = "f06236af98eb2eb04b3d3760a445a7c2";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/original";
const THEME_STORAGE_KEY = "theme";
const GENRES_OPEN_STORAGE_KEY = "genresOpen";

const API_BASE_URL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:3000/api/v1/tasks"
    : "https://taskflow-project-backend-alpha.vercel.app/api/v1/tasks";

const loadingState = document.getElementById("loading-state");
const errorState = document.getElementById("error-state");
const successState = document.getElementById("success-state");

let activeCategory = "Todas";
let tasksState = [];

let apiAvailable = true;
let demoCurrentId = 1000;

const defaultTasks = [
  {
    title: "El Caballero Oscuro",
    category: "Acción",
    priority: "high",
    label: "Top",
    completed: false,
    poster: "",
    backdrop: "",
    releaseYear: "",
    tmdbRating: null,
  },
  {
    title: "Superbad",
    category: "Comedia",
    priority: "low",
    label: "Ligera",
    completed: false,
    poster: "",
    backdrop: "",
    releaseYear: "",
    tmdbRating: null,
  },
  {
    title: "Interstellar",
    category: "Ciencia Ficción",
    priority: "high",
    label: "Top",
    completed: false,
    poster: "",
    backdrop: "",
    releaseYear: "",
    tmdbRating: null,
  },
  {
    title: "La La Land",
    category: "Musical",
    priority: "medium",
    label: "Interesante",
    completed: false,
    poster: "",
    backdrop: "",
    releaseYear: "",
    tmdbRating: null,
  },
];

function parseCompleted(value) {
  return value === true || value === "true" || value === 1 || value === "1";
}

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

function getRatingColor(rating) {
  if (rating === null || Number.isNaN(rating)) return "text-gray-300";
  if (rating >= 8) return "text-green-300";
  if (rating >= 6) return "text-yellow-300";
  return "text-red-300";
}

function isValidTaskTitle(title) {
  return title.trim().length >= 2;
}

function getMovieTitles() {
  const movies = [];
  if (!taskList) return movies;

  taskList.querySelectorAll("article").forEach((card) => {
    if (card.style.display !== "none") {
      movies.push(card.dataset.title);
    }
  });

  return movies;
}

function showRandomMovie(movieTitle) {
  if (!randomResult) return;

  randomResult.textContent = `🎬 Hoy toca ver: ${movieTitle}`;
  randomResult.classList.remove("random-appear");
  void randomResult.offsetWidth;
  randomResult.classList.add("random-appear");
}

function showLoading(message = "Cargando datos...") {
  if (!loadingState) return;
  loadingState.textContent = message;
  loadingState.classList.remove("hidden");
}

function hideLoading() {
  if (!loadingState) return;
  loadingState.classList.add("hidden");
}

function showError(message = "Ha ocurrido un error.") {
  if (errorState) {
    errorState.textContent = message;
    errorState.classList.remove("hidden");

    setTimeout(() => {
      errorState.classList.add("hidden");
    }, 3500);
  } else {
    alert(message);
  }
}

function showSuccess(message = "Operación realizada correctamente.") {
  if (!successState) return;

  successState.textContent = message;
  successState.classList.remove("hidden");

  setTimeout(() => {
    successState.classList.add("hidden");
  }, 2200);
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
  const safeTitle = escapeHtml(title || "MovieNight Planner");

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

function normalizeTask(task) {
  const priority = task.priority || "medium";

  return {
    id: task.id,
    title: task.title || "Sin título",
    category: task.category || "Sin género",
    priority,
    label: task.label || getPriorityLabel(priority),
    completed: parseCompleted(task.completed),
    poster: task.poster || "",
    backdrop: task.backdrop || "",
    releaseYear: task.releaseYear || "",
    tmdbRating:
      task.tmdbRating !== undefined && task.tmdbRating !== null
        ? Number(task.tmdbRating)
        : null,
  };
}

function closeAllMenus() {
  document.querySelectorAll(".menu-dropdown").forEach((menu) => {
    menu.classList.add("hidden");
  });

  document.querySelectorAll(".task-list article").forEach((card) => {
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

function updateSeenCounter() {
  if (!seenCounter) return;

  const totalSeen = tasksState.filter((task) =>
    parseCompleted(task.completed)
  ).length;

  seenCounter.textContent = `Vistas: ${totalSeen}`;
}

function setActiveCategoryUI() {
  categoryFilters.forEach((filter) => {
    if (filter.dataset.category === activeCategory) {
      filter.classList.add("active-category");
    } else {
      filter.classList.remove("active-category");
    }
  });
}

function setGenresOpenState(isOpen) {
  if (!genreList || !genreArrow) return;

  if (isOpen) {
    genreList.classList.remove("hidden");
    genreArrow.textContent = "▼";
    toggleGenresBtn?.setAttribute("aria-expanded", "true");
    localStorage.setItem(GENRES_OPEN_STORAGE_KEY, "true");
  } else {
    genreList.classList.add("hidden");
    genreArrow.textContent = "▶";
    toggleGenresBtn?.setAttribute("aria-expanded", "false");
    localStorage.setItem(GENRES_OPEN_STORAGE_KEY, "false");
  }
}

function loadGenresState() {
  const storedState = localStorage.getItem(GENRES_OPEN_STORAGE_KEY);
  setGenresOpenState(storedState !== "false");
}

async function fetchMovieImages(title) {
  if (!TMDB_API_KEY || TMDB_API_KEY === "PEGA_AQUI_TU_API_KEY") {
    return {
      poster: "",
      backdrop: "",
      releaseYear: "",
      tmdbRating: null,
    };
  }

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${encodeURIComponent(
        TMDB_API_KEY
      )}&query=${encodeURIComponent(
        title
      )}&language=es-ES&include_adult=false`
    );

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}`);
    }

    const data = await response.json();
    const movie = data.results?.[0];

    if (!movie) {
      return {
        poster: "",
        backdrop: "",
        releaseYear: "",
        tmdbRating: null,
      };
    }

    const releaseYear = movie.release_date
      ? movie.release_date.slice(0, 4)
      : "";

    const tmdbRating =
      typeof movie.vote_average === "number"
        ? Number(movie.vote_average.toFixed(1))
        : null;

    return {
      poster: movie.poster_path ? `${TMDB_IMAGE_BASE}${movie.poster_path}` : "",
      backdrop: movie.backdrop_path
        ? `${TMDB_IMAGE_BASE}${movie.backdrop_path}`
        : "",
      releaseYear,
      tmdbRating,
    };
  } catch (error) {
    console.error("Error obteniendo datos de TMDB:", error);
    return {
      poster: "",
      backdrop: "",
      releaseYear: "",
      tmdbRating: null,
    };
  }
}

async function apiFetch(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || "Error en la petición al servidor.");
  }

  return data;
}

async function getTasksFromApi() {
  const data = await apiFetch(API_BASE_URL);
  return Array.isArray(data) ? data.map(normalizeTask) : [];
}

async function createTaskInApi(task) {
  const createdTask = await apiFetch(API_BASE_URL, {
    method: "POST",
    body: JSON.stringify(task),
  });

  return createdTask ? normalizeTask(createdTask) : null;
}

async function deleteTaskInApi(id) {
  return apiFetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });
}

async function updateTaskInApi(id, updates) {
  const updatedTask = await apiFetch(`${API_BASE_URL}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });

  return updatedTask ? normalizeTask(updatedTask) : null;
}

function applyFilters() {
  if (!taskList) return;

  const searchText = searchInput ? searchInput.value.trim().toLowerCase() : "";

  taskList.querySelectorAll("article").forEach((card) => {
    const title = (card.dataset.title || "").toLowerCase();
    const category = card.dataset.category || "";
    const isCompleted = parseCompleted(card.dataset.completed);

    const matchesSearch = title.includes(searchText);
    const matchesCategory =
      activeCategory === "Todas" || category === activeCategory;

    const shouldShow = matchesSearch && matchesCategory && !isCompleted;
    card.style.display = shouldShow ? "flex" : "none";
  });

  setActiveCategoryUI();
}

async function renderTasks(tasks) {
  if (!taskList) return;

  const normalizedTasks = tasks.map(normalizeTask);

  const hydratedTasks = await Promise.all(
    normalizedTasks.map(async (task) => {
      if (
        (task.poster || task.backdrop) &&
        task.releaseYear &&
        task.tmdbRating !== null
      ) {
        return task;
      }

      const movieData = await fetchMovieImages(task.title);

      return {
        ...task,
        poster: task.poster || movieData.poster || "",
        backdrop: task.backdrop || movieData.backdrop || "",
        releaseYear: movieData.releaseYear || "",
        tmdbRating: movieData.tmdbRating,
      };
    })
  );

  taskList.innerHTML = "";
  hydratedTasks.forEach((task) => createTaskCard(task));
  applyFilters();
}

async function refreshTasks() {
  if (apiAvailable) {
    tasksState = await getTasksFromApi();
  }

  updateSeenCounter();
  await renderTasks(tasksState);
}

function getNextDemoId() {
  demoCurrentId += 1;
  return demoCurrentId;
}

async function buildDemoTasks() {
  const demoTasks = await Promise.all(
    defaultTasks.map(async (task, index) => {
      const movieData = await fetchMovieImages(task.title);
      return normalizeTask({
        id: index + 1,
        ...task,
        poster: movieData.poster || "",
        backdrop: movieData.backdrop || "",
        releaseYear: movieData.releaseYear || "",
        tmdbRating: movieData.tmdbRating,
      });
    })
  );

  demoCurrentId = demoTasks.length;
  return demoTasks;
}

async function ensureDefaultTasks() {
  if (!apiAvailable) {
    tasksState = await buildDemoTasks();
    updateSeenCounter();
    await renderTasks(tasksState);
    showSuccess("Modo demo cargado correctamente.");
    return;
  }

  try {
    const existingTasks = await getTasksFromApi();

    if (existingTasks.length > 0) {
      tasksState = existingTasks;
      updateSeenCounter();
      await renderTasks(tasksState);
      return;
    }

    for (const task of defaultTasks) {
      const movieData = await fetchMovieImages(task.title);

      await createTaskInApi({
        ...task,
        poster: movieData.poster || "",
        backdrop: movieData.backdrop || "",
        releaseYear: movieData.releaseYear || "",
        tmdbRating: movieData.tmdbRating,
        completed: false,
      });
    }

    tasksState = await getTasksFromApi();
    updateSeenCounter();
    await renderTasks(tasksState);
  } catch (error) {
    console.warn("API no disponible. Se activa modo demo.", error);
    apiAvailable = false;
    tasksState = await buildDemoTasks();
    updateSeenCounter();
    await renderTasks(tasksState);

    showError(
      "No se ha podido conectar con el servidor. Se ha cargado una versión demo para revisión."
    );
  }
}

function createTaskCard(task) {
  if (!taskList) return;

  task = normalizeTask(task);

  const taskCard = document.createElement("article");

  taskCard.dataset.id = task.id;
  taskCard.dataset.title = task.title;
  taskCard.dataset.category = task.category;
  taskCard.dataset.priority = task.priority;
  taskCard.dataset.label = task.label;
  taskCard.dataset.completed = task.completed ? "true" : "false";
  taskCard.dataset.poster = task.poster || "";
  taskCard.dataset.backdrop = task.backdrop || "";
  taskCard.dataset.releaseYear = task.releaseYear || "";
  taskCard.dataset.tmdbRating =
    task.tmdbRating !== null && task.tmdbRating !== undefined
      ? String(task.tmdbRating)
      : "";

  const imageUrl = getBestImage(task);

  const movieMeta = task.releaseYear
    ? `${task.category} / ${task.releaseYear}`
    : task.category;

  const movieRating =
    task.tmdbRating !== null && !Number.isNaN(task.tmdbRating)
      ? `⭐ ${task.tmdbRating} TMDB`
      : "⭐ Sin nota TMDB";

  const ratingColorClass = getRatingColor(task.tmdbRating);

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

          <p class="movie-category text-sm font-medium text-gray-200 mt-2 max-w-[250px]">
            ${escapeHtml(movieMeta)}
          </p>

          <p class="movie-rating text-sm font-semibold mt-1 max-w-[250px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] ${ratingColorClass}">
            ${escapeHtml(movieRating)}
          </p>
        </div>
      </div>

      <div class="flex-1 min-w-0 rounded-r-xl bg-white/85 dark:bg-gray-800/55"></div>
    </div>

    <div class="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3 z-[4]">
      <span class="px-2 py-1 rounded text-white text-sm font-semibold ${getPriorityColor(
        task.priority
      )}">
        ${escapeHtml(task.label)}
      </span>

      <button class="quick-watch-btn px-3 py-1 rounded text-sm font-semibold transition bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
        Vista
      </button>

      <div class="relative">
        <button class="menu-btn bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-600 transition" aria-label="Abrir menú de película">
          ⋮
        </button>

        <div class="menu-dropdown hidden absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 rounded shadow-lg border border-gray-200 dark:border-gray-700 z-10">
          <button class="watch-btn block w-full text-left px-4 py-2 text-sm text-green-700 dark:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            Marcar como vista
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
  const quickWatchBtn = taskCard.querySelector(".quick-watch-btn");
  const editBtn = taskCard.querySelector(".edit-btn");
  const deleteBtn = taskCard.querySelector(".delete-btn");
  const titleElement = taskCard.querySelector(".movie-title");
  const imageElement = taskCard.querySelector("img");

  if (task.completed) {
    taskCard.style.display = "none";
  }

  menuBtn.addEventListener("click", (event) => {
    event.stopPropagation();

    const isOpen = !dropdown.classList.contains("hidden");
    closeAllMenus();

    if (!isOpen) {
      dropdown.classList.remove("hidden");
      taskCard.classList.remove("z-0");
      taskCard.classList.add("z-20");
    }
  });

  dropdown.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  async function markAsWatched() {
    if (parseCompleted(taskCard.dataset.completed)) {
      closeAllMenus();
      return;
    }

    showLoading("Marcando película como vista...");

    try {
      const id = Number(taskCard.dataset.id);

      if (apiAvailable) {
        await updateTaskInApi(id, { completed: true });
        await refreshTasks();
      } else {
        tasksState = tasksState.map((movie) =>
          movie.id === id ? { ...movie, completed: true } : movie
        );
        await refreshTasks();
      }

      showSuccess("Película marcada como vista.");
    } catch (error) {
      showError(error.message);
    } finally {
      hideLoading();
      closeAllMenus();
    }
  }

  quickWatchBtn.addEventListener("click", async (event) => {
    event.stopPropagation();
    await markAsWatched();
  });

  watchBtn.addEventListener("click", async () => {
    await markAsWatched();
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
      showError("Introduce un título válido de al menos 2 caracteres.");
      return;
    }

    showLoading("Editando película...");

    try {
      const { poster, backdrop, releaseYear, tmdbRating } =
        await fetchMovieImages(trimmedTitle);
      const id = Number(taskCard.dataset.id);

      if (apiAvailable) {
        await updateTaskInApi(id, {
          title: trimmedTitle,
          poster: poster || "",
          backdrop: backdrop || "",
          releaseYear: releaseYear || "",
          tmdbRating,
        });
      } else {
        tasksState = tasksState.map((movie) =>
          movie.id === id
            ? {
                ...movie,
                title: trimmedTitle,
                poster: poster || "",
                backdrop: backdrop || "",
                releaseYear: releaseYear || "",
                tmdbRating,
              }
            : movie
        );
      }

      titleElement.textContent = trimmedTitle;
      imageElement.src = backdrop || poster || getFallbackImage(trimmedTitle);
      imageElement.alt = `Imagen de ${trimmedTitle}`;

      await refreshTasks();
      closeAllMenus();
      showSuccess("Película editada correctamente.");
    } catch (error) {
      showError(error.message);
    } finally {
      hideLoading();
    }
  });

  deleteBtn.addEventListener("click", async () => {
    showLoading("Eliminando película...");

    try {
      const id = Number(taskCard.dataset.id);

      if (apiAvailable) {
        await deleteTaskInApi(id);
      } else {
        tasksState = tasksState.filter((movie) => movie.id !== id);
      }

      await refreshTasks();
      showSuccess("Película eliminada correctamente.");
    } catch (error) {
      showError(error.message);
    } finally {
      hideLoading();
    }
  });

  taskList.appendChild(taskCard);
}

document.addEventListener("DOMContentLoaded", async () => {
  loadTheme();
  loadGenresState();
  showLoading("Cargando películas...");

  try {
    await ensureDefaultTasks();
    setActiveCategoryUI();
  } catch (error) {
    console.error(error);
    showError("No se han podido cargar las películas.");
  } finally {
    hideLoading();
  }
});

document.addEventListener("click", () => {
  closeAllMenus();
});

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const taskName = input.value.trim();
    const category = document.getElementById("category-select").value;
    const priority = document.getElementById("priority-select").value;

    if (!isValidTaskTitle(taskName)) {
      showError("Introduce un título válido de al menos 2 caracteres.");
      return;
    }

    showLoading("Añadiendo película...");

    try {
      const { poster, backdrop, releaseYear, tmdbRating } =
        await fetchMovieImages(taskName);

      if (apiAvailable) {
        await createTaskInApi({
          title: taskName,
          category,
          priority,
          label: getPriorityLabel(priority),
          completed: false,
          poster,
          backdrop,
          releaseYear,
          tmdbRating,
        });
      } else {
        tasksState.unshift(
          normalizeTask({
            id: getNextDemoId(),
            title: taskName,
            category,
            priority,
            label: getPriorityLabel(priority),
            completed: false,
            poster,
            backdrop,
            releaseYear,
            tmdbRating,
          })
        );
      }

      form.reset();
      await refreshTasks();
      showSuccess(
        apiAvailable
          ? "Película añadida correctamente."
          : "Película añadida en modo demo."
      );
    } catch (error) {
      showError(error.message);
    } finally {
      hideLoading();
    }
  });
}

if (randomBtn) {
  randomBtn.addEventListener("click", () => {
    const movies = getMovieTitles();

    if (movies.length === 0) {
      if (randomResult) {
        randomResult.textContent = "No hay películas visibles en la lista.";
      }
      return;
    }

    const randomIndex = Math.floor(Math.random() * movies.length);
    showRandomMovie(movies[randomIndex]);
  });
}

if (sortBtn) {
  sortBtn.addEventListener("click", () => {
    if (!taskList) return;

    const cards = Array.from(taskList.querySelectorAll("article"));

    cards.sort((a, b) => {
      const titleA = a.dataset.title.toLowerCase();
      const titleB = b.dataset.title.toLowerCase();
      return titleA.localeCompare(titleB, "es");
    });

    cards.forEach((card) => taskList.appendChild(card));
    applyFilters();
  });
}

if (searchInput) {
  searchInput.addEventListener("input", () => {
    applyFilters();
  });
}

categoryFilters.forEach((filter) => {
  filter.addEventListener("click", () => {
    activeCategory = filter.dataset.category;
    applyFilters();
  });
});

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "light" : "dark");
  });
}

if (toggleGenresBtn) {
  toggleGenresBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = genreList && !genreList.classList.contains("hidden");
    setGenresOpenState(!isOpen);
  });
}