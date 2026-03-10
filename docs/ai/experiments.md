## Experimento 1 — Sumar números de un array

### Problema
Crear una función que reciba un array de números y devuelva la suma total.


EXPERIMENTO 1.


### Solución sin IA

        ```javascript
        function sumArray(numbers) {
        let total = 0;

        for (let i = 0; i < numbers.length; i++) {
            total += numbers[i];
        }

        return total;
        }

Tiempo invertido: 8 minutos


### Solución con IA

        function sumArray(numbers) {
        return numbers.reduce((total, num) => total + num, 0);
        }

Tiempo invertido: 10 segundos



EXPERIMENTO 2. 

### Solución sin IA

        ```md id="32hd2p"
        ## Experimento 2 — Filtrar películas

        ### Problema
        Crear una función que filtre una lista de películas según un texto de búsqueda.

        ### Solución sin IA
        ```javascript
        function filterMovies(movies, searchText) {
        return movies.filter(movie =>
            movie.title.toLowerCase().includes(searchText.toLowerCase())
        );
        }

Tiempo invertido: 10 minutos


### Solución con IA

        function filterMovies(movies, searchText) {
        return movies.filter(movie =>
            movie.title.toLowerCase().includes(searchText.toLowerCase())
        );
        }

Tiempo invertido: 5 segundos


---

EXPERIMENTO 3. 

### Solución sin IA

        ```md id="3y9jng"
        ## Experimento 3 — Selección de película aleatoria

        ### Problema
        Seleccionar una película aleatoria de la lista de películas.

        ### Solución sin IA
        ```javascript
        function getRandomMovie(movies) {
        const index = Math.floor(Math.random() * movies.length);
        return movies[index];
        }

Tiempo invertido: 10 minutos


### Solución con IA

        function getRandomMovie(movies) {
        return movies[Math.floor(Math.random() * movies.length)];
        }

Tiempo invertido: 5 segundos

-----------------------------------------------------------------------------------


```md id="vfa8mi"
## Experimentos aplicados al proyecto

También probé utilizar IA para mejorar partes del proyecto MovieNight Planner.

### Tarea 1
Refactorizar la función `saveTasks`.

Resultado: la IA propuso una versión más limpia usando dataset.

### Tarea 2
Generar comentarios JSDoc para las funciones principales.

Resultado: se añadieron comentarios que explican el propósito de cada función.

### Tarea 3
Mejorar la selección de película aleatoria.

Resultado: la lógica se separó en funciones más pequeñas y fáciles de mantener.