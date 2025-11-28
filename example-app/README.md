# Example App for `@capgo/capacitor-file`

This Vite project links directly to the local plugin source so you can exercise the native APIs while developing.

## Actions in this playground

- **Write file** – Write text content to a file.
- **Read file** – Read text content from a file.
- **Read partial file** – Read a portion of a file using offset and length.
- **Append to file** – Append content to an existing file.
- **Write at position** – Write at a specific byte position (random access).
- **Check exists** – Check if a file or directory exists.
- **Get file info** – Get metadata about a file (size, modification time).
- **Create directory** – Create a new directory.
- **List directory** – List contents of a directory.
- **Copy file** – Copy a file to a new location.
- **Rename/Move file** – Rename or move a file.
- **Delete file** – Delete a file.
- **Delete directory** – Delete a directory.
- **Truncate file** – Truncate a file to a specific size.
- **Get file URI** – Get the native URI for a file.
- **Get directories** – Get all known file system directories.
- **Get free disk space** – Get free disk space in bytes.
- **Get plugin version** – Get the plugin version number.

## Getting started

```bash
npm install
npm start
```

Add native shells with `npx cap add ios` or `npx cap add android` from this folder to try behaviour on device or simulator.
