# Videos

Guarda aquí los archivos de video **no incluidos en Git**.

Cada video debe tener un archivo JSON con metadatos, por ejemplo:

```
video-title.mp4
video-title.json
```

Ejemplo de `video-title.json`:

```json
{
  "id": "video-title", // Este debe ser el nombre de archivo sin extensión
  "title": "Título descriptivo",
  "description": "Descripción breve del contenido.",
  "tags": ["tema1", "subtema"],
  "ext": "mp4"
}
```

**NOTA**: el archivo de miniatura `JPG` con el mismo nombre del `id` del `JSON` se generará automáticamente si no existe o se usará una miniatura predeterminada en caso de no poderse generar.

Los archivos `.avi`, `.mkv`, `mov`, `mp4` serán ignorados por Git.

