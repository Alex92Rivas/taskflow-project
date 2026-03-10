## Conexión de servidores MCP

Para este ejercicio configuré un servidor MCP de tipo filesystem en Cursor. Este servidor permite que el asistente de IA acceda a los archivos del proyecto.

La configuración se realizó mediante el archivo `mcp.json` con el siguiente contenido:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "C:\\Users\\Alejandro\\Desktop\\taskflow-project"
      ]
    }
  }
}
```

Después de configurar el servidor reinicié Cursor y probé varias consultas.

### Consultas realizadas

1. Listar los archivos del proyecto.
2. Mostrar el árbol de directorios.
3. Leer el archivo app.js y explicar su funcionamiento.
4. Buscar la función saveTasks dentro del proyecto.
5. Analizar la estructura del proyecto.

Esto demuestra que el servidor MCP permite acceder al contenido del proyecto y utilizarlo como contexto para la inteligencia artificial.