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
  "id": "video-title",
  "title": "Título descriptivo",
  "description": "Descripción breve del contenido.",
  "tags": ["tema1", "subtema"]
}
```

Los archivos `.avi`, `.mkv`, `mov`, `mp4` serán ignorados por Git.

