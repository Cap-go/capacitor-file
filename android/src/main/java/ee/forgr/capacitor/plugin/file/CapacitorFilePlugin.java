package ee.forgr.capacitor.plugin.file;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.os.StatFs;
import android.provider.Settings;
import android.webkit.MimeTypeMap;
import androidx.appcompat.app.AlertDialog;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;
import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.RandomAccessFile;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@CapacitorPlugin(
    name = "CapacitorFile",
    permissions = {
        @Permission(strings = { Manifest.permission.READ_EXTERNAL_STORAGE }, alias = CapacitorFilePlugin.PUBLIC_STORAGE_PERMISSION_ALIAS),
        @Permission(
            strings = { Manifest.permission.WRITE_EXTERNAL_STORAGE },
            alias = CapacitorFilePlugin.PUBLIC_STORAGE_WRITE_PERMISSION_ALIAS
        ),
        @Permission(
            strings = { Manifest.permission.READ_MEDIA_IMAGES, Manifest.permission.READ_MEDIA_VIDEO, Manifest.permission.READ_MEDIA_AUDIO },
            alias = CapacitorFilePlugin.MEDIA_PERMISSION_ALIAS
        )
    }
)
public class CapacitorFilePlugin extends Plugin {

    static final String PUBLIC_STORAGE_PERMISSION_ALIAS = "publicStorage";
    static final String PUBLIC_STORAGE_WRITE_PERMISSION_ALIAS = "publicStorageWrite";
    static final String MEDIA_PERMISSION_ALIAS = "media";

    private final String pluginVersion = "7.0.0";

    private File getBaseDirectory(String directory) {
        Context context = getContext();
        if (directory == null) {
            return context.getFilesDir();
        }

        switch (directory) {
            case "DOCUMENTS":
                return new File(context.getFilesDir(), "Documents");
            case "DATA":
                return context.getFilesDir();
            case "LIBRARY":
                return context.getFilesDir();
            case "CACHE":
                return context.getCacheDir();
            case "EXTERNAL":
                return Environment.getExternalStorageDirectory();
            case "EXTERNAL_STORAGE":
                return context.getExternalFilesDir(null);
            case "APPLICATION":
                return new File(context.getApplicationInfo().sourceDir).getParentFile();
            default:
                return context.getFilesDir();
        }
    }

    private File resolveFilePath(String path, String directory) {
        File baseDir = getBaseDirectory(directory);
        if (baseDir == null) return null;

        String cleanPath = path.startsWith("/") ? path.substring(1) : path;
        return new File(baseDir, cleanPath);
    }

    private JSObject createEntryResult(File file) {
        JSObject result = new JSObject();
        result.put("isFile", file.isFile());
        result.put("isDirectory", file.isDirectory());
        result.put("name", file.getName());
        result.put("fullPath", file.getAbsolutePath());
        result.put("nativeURL", Uri.fromFile(file).toString());
        return result;
    }

    private String getMimeType(File file) {
        String extension = MimeTypeMap.getFileExtensionFromUrl(Uri.fromFile(file).toString());
        if (extension != null) {
            String mimeType = MimeTypeMap.getSingleton().getMimeTypeFromExtension(extension.toLowerCase());
            if (mimeType != null) return mimeType;
        }
        return "application/octet-stream";
    }

    @PluginMethod
    public void requestFileSystem(PluginCall call) {
        int type = call.getInt("type", 1);
        String name = type == 0 ? "temporary" : "persistent";

        File rootDir = type == 0 ? getContext().getCacheDir() : getContext().getFilesDir();

        JSObject root = createEntryResult(rootDir);
        JSObject result = new JSObject();
        result.put("name", name);
        result.put("root", root);
        call.resolve(result);
    }

    @PluginMethod
    public void resolveLocalFileSystemURL(PluginCall call) {
        String urlString = call.getString("url");
        if (urlString == null) {
            call.reject("URL is required");
            return;
        }

        Uri uri = Uri.parse(urlString);
        String path = uri.getPath();
        if (path == null) {
            call.reject("Invalid URL");
            return;
        }

        File file = new File(path);
        if (!file.exists()) {
            call.reject("NOT_FOUND_ERR", "File or directory not found");
            return;
        }

        call.resolve(createEntryResult(file));
    }

    @PluginMethod
    public void getFile(PluginCall call) {
        String path = call.getString("path");
        if (path == null) {
            call.reject("Path is required");
            return;
        }

        String directory = call.getString("directory");
        JSObject options = call.getObject("options");
        boolean create = options != null && options.optBoolean("create", false);
        boolean exclusive = options != null && options.optBoolean("exclusive", false);

        File file = resolveFilePath(path, directory);
        if (file == null) {
            call.reject("Invalid path");
            return;
        }

        if (file.exists()) {
            if (file.isDirectory()) {
                call.reject("TYPE_MISMATCH_ERR", "Path is a directory");
                return;
            }
            if (create && exclusive) {
                call.reject("PATH_EXISTS_ERR", "File already exists");
                return;
            }
            call.resolve(createEntryResult(file));
        } else if (create) {
            try {
                File parent = file.getParentFile();
                if (parent != null && !parent.exists()) {
                    parent.mkdirs();
                }
                if (file.createNewFile()) {
                    call.resolve(createEntryResult(file));
                } else {
                    call.reject("Failed to create file");
                }
            } catch (IOException e) {
                call.reject("Failed to create file", e.getMessage());
            }
        } else {
            call.reject("NOT_FOUND_ERR", "File not found");
        }
    }

    @PluginMethod
    public void getDirectory(PluginCall call) {
        String path = call.getString("path");
        if (path == null) {
            call.reject("Path is required");
            return;
        }

        String directory = call.getString("directory");
        JSObject options = call.getObject("options");
        boolean create = options != null && options.optBoolean("create", false);
        boolean exclusive = options != null && options.optBoolean("exclusive", false);

        File dir = resolveFilePath(path, directory);
        if (dir == null) {
            call.reject("Invalid path");
            return;
        }

        if (dir.exists()) {
            if (dir.isFile()) {
                call.reject("TYPE_MISMATCH_ERR", "Path is a file");
                return;
            }
            if (create && exclusive) {
                call.reject("PATH_EXISTS_ERR", "Directory already exists");
                return;
            }
            call.resolve(createEntryResult(dir));
        } else if (create) {
            if (dir.mkdirs()) {
                call.resolve(createEntryResult(dir));
            } else {
                call.reject("Failed to create directory");
            }
        } else {
            call.reject("NOT_FOUND_ERR", "Directory not found");
        }
    }

    @PluginMethod
    public void readFile(PluginCall call) {
        String path = call.getString("path");
        if (path == null) {
            call.reject("Path is required");
            return;
        }

        String directory = call.getString("directory");
        String encoding = call.getString("encoding");
        int offset = call.getInt("offset", 0);
        Integer length = call.getInt("length");

        File file = resolveFilePath(path, directory);
        if (file == null) {
            call.reject("Invalid path");
            return;
        }

        if (!file.exists()) {
            call.reject("NOT_FOUND_ERR", "File not found");
            return;
        }

        try {
            long fileSize = file.length();
            long startOffset = Math.max(0, offset);

            // Check if offset is beyond file size
            if (startOffset >= fileSize) {
                JSObject result = new JSObject();
                result.put("data", "");
                call.resolve(result);
                return;
            }

            // Calculate bytes to read
            long remainingBytes = fileSize - startOffset;
            int bytesToRead = length != null ? (int) Math.min(length, remainingBytes) : (int) remainingBytes;

            byte[] bytes = new byte[bytesToRead];
            try (RandomAccessFile raf = new RandomAccessFile(file, "r")) {
                raf.seek(startOffset);
                raf.readFully(bytes);
            }

            if (encoding != null) {
                Charset charset;
                switch (encoding.toLowerCase()) {
                    case "utf8":
                    case "utf-8":
                        charset = StandardCharsets.UTF_8;
                        break;
                    case "ascii":
                        charset = StandardCharsets.US_ASCII;
                        break;
                    case "utf16":
                    case "utf-16":
                        charset = StandardCharsets.UTF_16;
                        break;
                    default:
                        charset = StandardCharsets.UTF_8;
                }
                String content = new String(bytes, charset);
                JSObject result = new JSObject();
                result.put("data", content);
                call.resolve(result);
            } else {
                String base64;
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    base64 = Base64.getEncoder().encodeToString(bytes);
                } else {
                    base64 = android.util.Base64.encodeToString(bytes, android.util.Base64.NO_WRAP);
                }
                JSObject result = new JSObject();
                result.put("data", base64);
                call.resolve(result);
            }
        } catch (IOException e) {
            call.reject("Failed to read file", e.getMessage());
        }
    }

    @PluginMethod
    public void readAsDataURL(PluginCall call) {
        String path = call.getString("path");
        if (path == null) {
            call.reject("Path is required");
            return;
        }

        String directory = call.getString("directory");

        File file = resolveFilePath(path, directory);
        if (file == null) {
            call.reject("Invalid path");
            return;
        }

        if (!file.exists()) {
            call.reject("NOT_FOUND_ERR", "File not found");
            return;
        }

        try {
            byte[] bytes = new byte[(int) file.length()];
            try (FileInputStream fis = new FileInputStream(file)) {
                fis.read(bytes);
            }
            String base64;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                base64 = Base64.getEncoder().encodeToString(bytes);
            } else {
                base64 = android.util.Base64.encodeToString(bytes, android.util.Base64.NO_WRAP);
            }
            String mimeType = getMimeType(file);
            String dataUrl = "data:" + mimeType + ";base64," + base64;

            JSObject result = new JSObject();
            result.put("data", dataUrl);
            call.resolve(result);
        } catch (IOException e) {
            call.reject("Failed to read file", e.getMessage());
        }
    }

    @PluginMethod
    public void writeFile(PluginCall call) {
        String path = call.getString("path");
        String data = call.getString("data");
        if (path == null || data == null) {
            call.reject("Path and data are required");
            return;
        }

        String directory = call.getString("directory");
        String encoding = call.getString("encoding");
        boolean append = call.getBoolean("append", false);
        boolean recursive = call.getBoolean("recursive", false);
        Integer position = call.getInt("position");

        File file = resolveFilePath(path, directory);
        if (file == null) {
            call.reject("Invalid path");
            return;
        }

        try {
            if (recursive) {
                File parent = file.getParentFile();
                if (parent != null && !parent.exists()) {
                    parent.mkdirs();
                }
            }

            byte[] bytes;
            if (encoding != null) {
                bytes = data.getBytes(StandardCharsets.UTF_8);
            } else {
                try {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                        bytes = Base64.getDecoder().decode(data);
                    } else {
                        bytes = android.util.Base64.decode(data, android.util.Base64.DEFAULT);
                    }
                } catch (IllegalArgumentException e) {
                    // If base64 decode fails, treat as plain text
                    bytes = data.getBytes(StandardCharsets.UTF_8);
                }
            }

            boolean fileExists = file.exists();

            if (position != null && fileExists) {
                // Write at specific position (random access)
                try (RandomAccessFile raf = new RandomAccessFile(file, "rw")) {
                    raf.seek(Math.max(0, position));
                    raf.write(bytes);
                }
            } else if (append && fileExists) {
                // Append to end of file
                try (FileOutputStream fos = new FileOutputStream(file, true)) {
                    fos.write(bytes);
                }
            } else {
                // Overwrite or create new file
                try (FileOutputStream fos = new FileOutputStream(file)) {
                    fos.write(bytes);
                }
            }

            JSObject result = new JSObject();
            result.put("uri", Uri.fromFile(file).toString());
            call.resolve(result);
        } catch (IOException e) {
            call.reject("Failed to write file", e.getMessage());
        }
    }

    @PluginMethod
    public void appendFile(PluginCall call) {
        call.getData().put("append", true);
        writeFile(call);
    }

    @PluginMethod
    public void deleteFile(PluginCall call) {
        String path = call.getString("path");
        if (path == null) {
            call.reject("Path is required");
            return;
        }

        String directory = call.getString("directory");

        File file = resolveFilePath(path, directory);
        if (file == null) {
            call.reject("Invalid path");
            return;
        }

        if (!file.exists()) {
            call.reject("NOT_FOUND_ERR", "File not found");
            return;
        }

        if (file.delete()) {
            call.resolve();
        } else {
            call.reject("Failed to delete file");
        }
    }

    @PluginMethod
    public void mkdir(PluginCall call) {
        String path = call.getString("path");
        if (path == null) {
            call.reject("Path is required");
            return;
        }

        String directory = call.getString("directory");
        boolean recursive = call.getBoolean("recursive", false);

        File dir = resolveFilePath(path, directory);
        if (dir == null) {
            call.reject("Invalid path");
            return;
        }

        boolean success;
        if (recursive) {
            success = dir.mkdirs();
        } else {
            success = dir.mkdir();
        }

        if (success || dir.exists()) {
            call.resolve();
        } else {
            call.reject("Failed to create directory");
        }
    }

    @PluginMethod
    public void rmdir(PluginCall call) {
        String path = call.getString("path");
        if (path == null) {
            call.reject("Path is required");
            return;
        }

        String directory = call.getString("directory");
        boolean recursive = call.getBoolean("recursive", false);

        File dir = resolveFilePath(path, directory);
        if (dir == null) {
            call.reject("Invalid path");
            return;
        }

        if (!dir.exists()) {
            call.reject("NOT_FOUND_ERR", "Directory not found");
            return;
        }

        if (recursive) {
            if (deleteRecursively(dir)) {
                call.resolve();
            } else {
                call.reject("Failed to delete directory");
            }
        } else {
            String[] children = dir.list();
            if (children != null && children.length > 0) {
                call.reject("INVALID_MODIFICATION_ERR", "Directory is not empty");
                return;
            }
            if (dir.delete()) {
                call.resolve();
            } else {
                call.reject("Failed to delete directory");
            }
        }
    }

    private boolean deleteRecursively(File file) {
        if (file.isDirectory()) {
            File[] children = file.listFiles();
            if (children != null) {
                for (File child : children) {
                    if (!deleteRecursively(child)) {
                        return false;
                    }
                }
            }
        }
        return file.delete();
    }

    @PluginMethod
    public void readdir(PluginCall call) {
        String path = call.getString("path");
        if (path == null) {
            call.reject("Path is required");
            return;
        }

        String directory = call.getString("directory");

        File dir = resolveFilePath(path, directory);
        if (dir == null) {
            call.reject("Invalid path");
            return;
        }

        if (!dir.exists() || !dir.isDirectory()) {
            call.reject("NOT_FOUND_ERR", "Directory not found");
            return;
        }

        File[] files = dir.listFiles();
        JSArray entries = new JSArray();
        if (files != null) {
            for (File file : files) {
                entries.put(createEntryResult(file));
            }
        }

        JSObject result = new JSObject();
        result.put("entries", entries);
        call.resolve(result);
    }

    @PluginMethod
    public void stat(PluginCall call) {
        String path = call.getString("path");
        if (path == null) {
            call.reject("Path is required");
            return;
        }

        String directory = call.getString("directory");

        File file = resolveFilePath(path, directory);
        if (file == null) {
            call.reject("Invalid path");
            return;
        }

        if (!file.exists()) {
            call.reject("NOT_FOUND_ERR", "File or directory not found");
            return;
        }

        JSObject result = new JSObject();
        result.put("type", file.isDirectory() ? "directory" : "file");
        result.put("size", file.length());
        result.put("mtime", file.lastModified());
        result.put("uri", Uri.fromFile(file).toString());
        call.resolve(result);
    }

    @PluginMethod
    public void getMetadata(PluginCall call) {
        String path = call.getString("path");
        if (path == null) {
            call.reject("Path is required");
            return;
        }

        String directory = call.getString("directory");

        File file = resolveFilePath(path, directory);
        if (file == null) {
            call.reject("Invalid path");
            return;
        }

        if (!file.exists()) {
            call.reject("NOT_FOUND_ERR", "File or directory not found");
            return;
        }

        JSObject result = new JSObject();
        result.put("modificationTime", file.lastModified());
        result.put("size", file.length());
        call.resolve(result);
    }

    @PluginMethod
    public void rename(PluginCall call) {
        String from = call.getString("from");
        String to = call.getString("to");
        if (from == null || to == null) {
            call.reject("From and to paths are required");
            return;
        }

        String directory = call.getString("directory");
        String toDirectory = call.getString("toDirectory", directory);

        File fromFile = resolveFilePath(from, directory);
        File toFile = resolveFilePath(to, toDirectory);
        if (fromFile == null || toFile == null) {
            call.reject("Invalid path");
            return;
        }

        if (!fromFile.exists()) {
            call.reject("NOT_FOUND_ERR", "Source file not found");
            return;
        }

        File parent = toFile.getParentFile();
        if (parent != null && !parent.exists()) {
            parent.mkdirs();
        }

        if (toFile.exists()) {
            toFile.delete();
        }

        if (fromFile.renameTo(toFile)) {
            call.resolve();
        } else {
            try {
                copyFile(fromFile, toFile);
                deleteRecursively(fromFile);
                call.resolve();
            } catch (IOException e) {
                call.reject("Failed to rename", e.getMessage());
            }
        }
    }

    @PluginMethod
    public void move(PluginCall call) {
        rename(call);
    }

    @PluginMethod
    public void copy(PluginCall call) {
        String from = call.getString("from");
        String to = call.getString("to");
        if (from == null || to == null) {
            call.reject("From and to paths are required");
            return;
        }

        String directory = call.getString("directory");
        String toDirectory = call.getString("toDirectory", directory);

        File fromFile = resolveFilePath(from, directory);
        File toFile = resolveFilePath(to, toDirectory);
        if (fromFile == null || toFile == null) {
            call.reject("Invalid path");
            return;
        }

        if (!fromFile.exists()) {
            call.reject("NOT_FOUND_ERR", "Source file not found");
            return;
        }

        try {
            File parent = toFile.getParentFile();
            if (parent != null && !parent.exists()) {
                parent.mkdirs();
            }

            if (fromFile.isDirectory()) {
                copyDirectory(fromFile, toFile);
            } else {
                copyFile(fromFile, toFile);
            }

            JSObject result = new JSObject();
            result.put("uri", Uri.fromFile(toFile).toString());
            call.resolve(result);
        } catch (IOException e) {
            call.reject("Failed to copy", e.getMessage());
        }
    }

    private void copyFile(File source, File dest) throws IOException {
        try (InputStream in = new BufferedInputStream(new FileInputStream(source)); OutputStream out = new FileOutputStream(dest)) {
            byte[] buffer = new byte[8192];
            int length;
            while ((length = in.read(buffer)) > 0) {
                out.write(buffer, 0, length);
            }
        }
    }

    private void copyDirectory(File source, File dest) throws IOException {
        if (!dest.exists()) {
            dest.mkdirs();
        }
        File[] files = source.listFiles();
        if (files != null) {
            for (File file : files) {
                File destFile = new File(dest, file.getName());
                if (file.isDirectory()) {
                    copyDirectory(file, destFile);
                } else {
                    copyFile(file, destFile);
                }
            }
        }
    }

    @PluginMethod
    public void exists(PluginCall call) {
        String path = call.getString("path");
        if (path == null) {
            call.reject("Path is required");
            return;
        }

        String directory = call.getString("directory");

        File file = resolveFilePath(path, directory);
        if (file == null) {
            call.reject("Invalid path");
            return;
        }

        JSObject result = new JSObject();
        if (file.exists()) {
            result.put("exists", true);
            result.put("type", file.isDirectory() ? "directory" : "file");
        } else {
            result.put("exists", false);
        }
        call.resolve(result);
    }

    @PluginMethod
    public void getUri(PluginCall call) {
        String path = call.getString("path");
        if (path == null) {
            call.reject("Path is required");
            return;
        }

        String directory = call.getString("directory");

        File file = resolveFilePath(path, directory);
        if (file == null) {
            call.reject("Invalid path");
            return;
        }

        JSObject result = new JSObject();
        result.put("uri", Uri.fromFile(file).toString());
        call.resolve(result);
    }

    @PluginMethod
    public void truncate(PluginCall call) {
        String path = call.getString("path");
        if (path == null) {
            call.reject("Path is required");
            return;
        }

        String directory = call.getString("directory");
        int size = call.getInt("size", 0);

        File file = resolveFilePath(path, directory);
        if (file == null) {
            call.reject("Invalid path");
            return;
        }

        if (!file.exists()) {
            call.reject("NOT_FOUND_ERR", "File not found");
            return;
        }

        try (RandomAccessFile raf = new RandomAccessFile(file, "rw")) {
            raf.setLength(size);
            call.resolve();
        } catch (IOException e) {
            call.reject("Failed to truncate file", e.getMessage());
        }
    }

    @PluginMethod
    public void getDirectories(PluginCall call) {
        Context context = getContext();

        JSObject result = new JSObject();
        result.put("applicationDirectory", "file://" + context.getApplicationInfo().sourceDir);
        result.put("applicationStorageDirectory", Uri.fromFile(context.getFilesDir().getParentFile()).toString());
        result.put("dataDirectory", Uri.fromFile(context.getFilesDir()).toString());
        result.put("cacheDirectory", Uri.fromFile(context.getCacheDir()).toString());
        result.put("tempDirectory", Uri.fromFile(context.getCacheDir()).toString());

        File externalDir = context.getExternalFilesDir(null);
        if (externalDir != null) {
            result.put("externalDataDirectory", Uri.fromFile(externalDir).toString());
        }

        File externalCacheDir = context.getExternalCacheDir();
        if (externalCacheDir != null) {
            result.put("externalCacheDirectory", Uri.fromFile(externalCacheDir).toString());
        }

        result.put("externalRootDirectory", Uri.fromFile(Environment.getExternalStorageDirectory()).toString());

        File documentsDir = new File(context.getFilesDir(), "Documents");
        if (!documentsDir.exists()) {
            documentsDir.mkdirs();
        }
        result.put("documentsDirectory", Uri.fromFile(documentsDir).toString());

        call.resolve(result);
    }

    @PluginMethod
    public void getFreeDiskSpace(PluginCall call) {
        File path = getContext().getFilesDir();
        StatFs stat = new StatFs(path.getPath());
        long freeSpace;

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR2) {
            freeSpace = stat.getAvailableBlocksLong() * stat.getBlockSizeLong();
        } else {
            freeSpace = (long) stat.getAvailableBlocks() * (long) stat.getBlockSize();
        }

        JSObject result = new JSObject();
        result.put("free", freeSpace);
        call.resolve(result);
    }

    @PluginMethod
    public void getPluginVersion(PluginCall call) {
        JSObject result = new JSObject();
        result.put("version", pluginVersion);
        call.resolve(result);
    }

    @PluginMethod
    public void checkPermissions(PluginCall call) {
        JSObject result = new JSObject();
        result.put("publicStorage", mapPermissionState(getPublicStoragePermissionState()));
        call.resolve(result);
    }

    @PluginMethod
    public void requestPermissions(PluginCall call) {
        PermissionState currentState = getPublicStoragePermissionState();

        if (PermissionState.GRANTED.equals(currentState)) {
            JSObject result = new JSObject();
            result.put("publicStorage", "granted");
            call.resolve(result);
            return;
        }

        // On Android 13+ (API 33+), we need media permissions
        // On Android 10-12 (API 29-32), scoped storage means we don't need permissions for app-specific dirs
        // On Android 9 and below (API < 29), we need READ_EXTERNAL_STORAGE
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            requestPermissionForAlias(MEDIA_PERMISSION_ALIAS, call, "handlePermissionResult");
        } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            // Scoped storage - permissions not needed for app directories
            JSObject result = new JSObject();
            result.put("publicStorage", "granted");
            call.resolve(result);
        } else {
            requestPermissionForAlias(PUBLIC_STORAGE_PERMISSION_ALIAS, call, "handlePermissionResult");
        }
    }

    @PermissionCallback
    private void handlePermissionResult(PluginCall call) {
        PermissionState state = getPublicStoragePermissionState();
        JSObject result = new JSObject();
        result.put("publicStorage", mapPermissionState(state));

        boolean showSettingsAlert = call.getBoolean("showSettingsAlert", false);
        boolean needsSettings = "denied".equals(mapPermissionState(state)) || "prompt-with-rationale".equals(mapPermissionState(state));

        if (showSettingsAlert && needsSettings) {
            Activity activity = getActivity();
            if (activity == null) {
                call.resolve(result);
                return;
            }

            String title = call.getString("title", "Storage Permission Needed");
            String message = call.getString("message", "Enable storage access in Settings to access files.");
            String openSettingsText = call.getString("openSettingsButtonTitle", "Open Settings");
            String cancelText = call.getString("cancelButtonTitle", activity.getString(android.R.string.cancel));

            showPermissionDialog(title, message, openSettingsText, cancelText, () -> call.resolve(result));
        } else {
            call.resolve(result);
        }
    }

    private PermissionState getPublicStoragePermissionState() {
        // On Android 13+ (API 33+), check media permissions
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            return getPermissionState(MEDIA_PERMISSION_ALIAS);
        }
        // On Android 10-12 (API 29-32), scoped storage means we don't need permissions for app directories
        else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            return PermissionState.GRANTED;
        }
        // On Android 9 and below
        else {
            return getPermissionState(PUBLIC_STORAGE_PERMISSION_ALIAS);
        }
    }

    private String mapPermissionState(PermissionState state) {
        if (state == null) {
            return "prompt";
        }
        switch (state) {
            case GRANTED:
                return "granted";
            case DENIED:
                return "denied";
            case PROMPT:
                return "prompt";
            case PROMPT_WITH_RATIONALE:
                return "prompt-with-rationale";
            default:
                return "prompt";
        }
    }

    private void showPermissionDialog(String title, String message, String openSettingsText, String cancelText, Runnable onDismiss) {
        Activity activity = getActivity();
        if (activity == null) {
            onDismiss.run();
            return;
        }

        activity.runOnUiThread(() -> {
            new AlertDialog.Builder(activity)
                .setTitle(title)
                .setMessage(message)
                .setPositiveButton(openSettingsText, (dialog, which) -> {
                    Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
                    intent.setData(Uri.fromParts("package", activity.getPackageName(), null));
                    activity.startActivity(intent);
                    onDismiss.run();
                })
                .setNegativeButton(cancelText, (dialog, which) -> {
                    onDismiss.run();
                })
                .setOnCancelListener((dialog) -> onDismiss.run())
                .show();
        });
    }
}
