import Foundation
import Capacitor

@objc(CapacitorFilePlugin)
public class CapacitorFilePlugin: CAPPlugin, CAPBridgedPlugin {
    private let pluginVersion: String = "7.1.1"
    public let identifier = "CapacitorFilePlugin"
    public let jsName = "CapacitorFile"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "requestFileSystem", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "resolveLocalFileSystemURL", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getFile", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getDirectory", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "readFile", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "readAsDataURL", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "writeFile", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "appendFile", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "deleteFile", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "mkdir", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "rmdir", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "readdir", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "stat", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getMetadata", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "rename", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "move", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "copy", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "exists", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getUri", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "truncate", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getDirectories", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getFreeDiskSpace", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getPluginVersion", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "checkPermissions", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "requestPermissions", returnType: CAPPluginReturnPromise)
    ]

    private let fileManager = FileManager.default

    // MARK: - Directory Helpers

    private func getBaseDirectory(_ directory: String?) -> URL? {
        guard let dir = directory else {
            return fileManager.urls(for: .documentDirectory, in: .userDomainMask).first
        }

        switch dir {
        case "DOCUMENTS":
            return fileManager.urls(for: .documentDirectory, in: .userDomainMask).first
        case "DATA":
            return fileManager.urls(for: .applicationSupportDirectory, in: .userDomainMask).first
        case "LIBRARY":
            return fileManager.urls(for: .libraryDirectory, in: .userDomainMask).first
        case "CACHE":
            return fileManager.urls(for: .cachesDirectory, in: .userDomainMask).first
        case "EXTERNAL", "EXTERNAL_STORAGE":
            return fileManager.urls(for: .documentDirectory, in: .userDomainMask).first
        case "APPLICATION":
            return Bundle.main.bundleURL
        default:
            return fileManager.urls(for: .documentDirectory, in: .userDomainMask).first
        }
    }

    private func resolveFilePath(_ path: String, directory: String?) -> URL? {
        guard let baseDir = getBaseDirectory(directory) else { return nil }
        let cleanPath = path.hasPrefix("/") ? String(path.dropFirst()) : path
        return baseDir.appendingPathComponent(cleanPath)
    }

    private func createEntryResult(for url: URL, isDirectory: Bool) -> [String: Any] {
        return [
            "isFile": !isDirectory,
            "isDirectory": isDirectory,
            "name": url.lastPathComponent,
            "fullPath": url.path,
            "nativeURL": url.absoluteString
        ]
    }

    private func getMimeType(for url: URL) -> String {
        let ext = url.pathExtension.lowercased()
        switch ext {
        case "txt": return "text/plain"
        case "html", "htm": return "text/html"
        case "css": return "text/css"
        case "js": return "application/javascript"
        case "json": return "application/json"
        case "xml": return "application/xml"
        case "jpg", "jpeg": return "image/jpeg"
        case "png": return "image/png"
        case "gif": return "image/gif"
        case "bmp": return "image/bmp"
        case "webp": return "image/webp"
        case "svg": return "image/svg+xml"
        case "pdf": return "application/pdf"
        case "zip": return "application/zip"
        case "mp3": return "audio/mpeg"
        case "mp4": return "video/mp4"
        case "wav": return "audio/wav"
        default: return "application/octet-stream"
        }
    }

    // MARK: - Plugin Methods

    @objc func requestFileSystem(_ call: CAPPluginCall) {
        let type = call.getInt("type") ?? 1
        let name = type == 0 ? "temporary" : "persistent"

        guard let rootURL = type == 0 ?
                fileManager.temporaryDirectory :
                fileManager.urls(for: .documentDirectory, in: .userDomainMask).first else {
            call.reject("Failed to get file system root")
            return
        }

        call.resolve([
            "name": name,
            "root": createEntryResult(for: rootURL, isDirectory: true)
        ])
    }

    @objc func resolveLocalFileSystemURL(_ call: CAPPluginCall) {
        guard let urlString = call.getString("url"),
              let url = URL(string: urlString) else {
            call.reject("Invalid URL")
            return
        }

        var isDir: ObjCBool = false
        guard fileManager.fileExists(atPath: url.path, isDirectory: &isDir) else {
            call.reject("NOT_FOUND_ERR", "File or directory not found")
            return
        }

        call.resolve(createEntryResult(for: url, isDirectory: isDir.boolValue))
    }

    @objc func getFile(_ call: CAPPluginCall) {
        guard let path = call.getString("path") else {
            call.reject("Path is required")
            return
        }

        let directory = call.getString("directory")
        let create = call.getObject("options")?["create"] as? Bool ?? false
        let exclusive = call.getObject("options")?["exclusive"] as? Bool ?? false

        guard let fileURL = resolveFilePath(path, directory: directory) else {
            call.reject("Invalid path")
            return
        }

        var isDir: ObjCBool = false
        let exists = fileManager.fileExists(atPath: fileURL.path, isDirectory: &isDir)

        if exists {
            if isDir.boolValue {
                call.reject("TYPE_MISMATCH_ERR", "Path is a directory")
                return
            }
            if create && exclusive {
                call.reject("PATH_EXISTS_ERR", "File already exists")
                return
            }
            call.resolve(createEntryResult(for: fileURL, isDirectory: false))
        } else if create {
            let parentDir = fileURL.deletingLastPathComponent()
            do {
                try fileManager.createDirectory(at: parentDir, withIntermediateDirectories: true)
                fileManager.createFile(atPath: fileURL.path, contents: nil)
                call.resolve(createEntryResult(for: fileURL, isDirectory: false))
            } catch {
                call.reject("Failed to create file", error.localizedDescription)
            }
        } else {
            call.reject("NOT_FOUND_ERR", "File not found")
        }
    }

    @objc func getDirectory(_ call: CAPPluginCall) {
        guard let path = call.getString("path") else {
            call.reject("Path is required")
            return
        }

        let directory = call.getString("directory")
        let create = call.getObject("options")?["create"] as? Bool ?? false
        let exclusive = call.getObject("options")?["exclusive"] as? Bool ?? false

        guard let dirURL = resolveFilePath(path, directory: directory) else {
            call.reject("Invalid path")
            return
        }

        var isDir: ObjCBool = false
        let exists = fileManager.fileExists(atPath: dirURL.path, isDirectory: &isDir)

        if exists {
            if !isDir.boolValue {
                call.reject("TYPE_MISMATCH_ERR", "Path is a file")
                return
            }
            if create && exclusive {
                call.reject("PATH_EXISTS_ERR", "Directory already exists")
                return
            }
            call.resolve(createEntryResult(for: dirURL, isDirectory: true))
        } else if create {
            do {
                try fileManager.createDirectory(at: dirURL, withIntermediateDirectories: true)
                call.resolve(createEntryResult(for: dirURL, isDirectory: true))
            } catch {
                call.reject("Failed to create directory", error.localizedDescription)
            }
        } else {
            call.reject("NOT_FOUND_ERR", "Directory not found")
        }
    }

    @objc func readFile(_ call: CAPPluginCall) {
        guard let path = call.getString("path") else {
            call.reject("Path is required")
            return
        }

        let directory = call.getString("directory")
        let encoding = call.getString("encoding")
        let offset = call.getInt("offset") ?? 0
        let length = call.getInt("length")

        guard let fileURL = resolveFilePath(path, directory: directory) else {
            call.reject("Invalid path")
            return
        }

        guard fileManager.fileExists(atPath: fileURL.path) else {
            call.reject("NOT_FOUND_ERR", "File not found")
            return
        }

        do {
            let fileHandle = try FileHandle(forReadingFrom: fileURL)
            defer { fileHandle.closeFile() }

            // Get file size
            fileHandle.seekToEndOfFile()
            let fileSize = fileHandle.offsetInFile

            // Seek to offset
            let startOffset = UInt64(max(0, offset))
            if startOffset >= fileSize {
                // Offset beyond file size, return empty
                call.resolve(["data": ""])
                return
            }
            fileHandle.seek(toFileOffset: startOffset)

            // Calculate how many bytes to read
            let remainingBytes = fileSize - startOffset
            let bytesToRead: Int
            if let len = length {
                bytesToRead = min(len, Int(remainingBytes))
            } else {
                bytesToRead = Int(remainingBytes)
            }

            // Read the data
            let data = fileHandle.readData(ofLength: bytesToRead)

            if let encoding = encoding {
                let stringEncoding: String.Encoding
                switch encoding.lowercased() {
                case "utf8", "utf-8":
                    stringEncoding = .utf8
                case "ascii":
                    stringEncoding = .ascii
                case "utf16", "utf-16":
                    stringEncoding = .utf16
                default:
                    stringEncoding = .utf8
                }
                let content = String(data: data, encoding: stringEncoding) ?? ""
                call.resolve(["data": content])
            } else {
                let base64 = data.base64EncodedString()
                call.resolve(["data": base64])
            }
        } catch {
            call.reject("Failed to read file", error.localizedDescription)
        }
    }

    @objc func readAsDataURL(_ call: CAPPluginCall) {
        guard let path = call.getString("path") else {
            call.reject("Path is required")
            return
        }

        let directory = call.getString("directory")

        guard let fileURL = resolveFilePath(path, directory: directory) else {
            call.reject("Invalid path")
            return
        }

        guard fileManager.fileExists(atPath: fileURL.path) else {
            call.reject("NOT_FOUND_ERR", "File not found")
            return
        }

        do {
            let data = try Data(contentsOf: fileURL)
            let base64 = data.base64EncodedString()
            let mimeType = getMimeType(for: fileURL)
            let dataURL = "data:\(mimeType);base64,\(base64)"
            call.resolve(["data": dataURL])
        } catch {
            call.reject("Failed to read file", error.localizedDescription)
        }
    }

    @objc func writeFile(_ call: CAPPluginCall) {
        guard let path = call.getString("path"),
              let dataString = call.getString("data") else {
            call.reject("Path and data are required")
            return
        }

        let directory = call.getString("directory")
        let encoding = call.getString("encoding")
        let append = call.getBool("append") ?? false
        let recursive = call.getBool("recursive") ?? false
        let position = call.getInt("position")

        guard let fileURL = resolveFilePath(path, directory: directory) else {
            call.reject("Invalid path")
            return
        }

        do {
            if recursive {
                let parentDir = fileURL.deletingLastPathComponent()
                try fileManager.createDirectory(at: parentDir, withIntermediateDirectories: true)
            }

            var data: Data
            if let _ = encoding {
                data = dataString.data(using: .utf8) ?? Data()
            } else {
                data = Data(base64Encoded: dataString) ?? dataString.data(using: .utf8) ?? Data()
            }

            let fileExists = fileManager.fileExists(atPath: fileURL.path)

            if let pos = position, fileExists {
                // Write at specific position (random access)
                let fileHandle = try FileHandle(forWritingTo: fileURL)
                fileHandle.seek(toFileOffset: UInt64(max(0, pos)))
                fileHandle.write(data)
                fileHandle.closeFile()
            } else if append && fileExists {
                // Append to end of file
                let fileHandle = try FileHandle(forWritingTo: fileURL)
                fileHandle.seekToEndOfFile()
                fileHandle.write(data)
                fileHandle.closeFile()
            } else {
                // Overwrite or create new file
                try data.write(to: fileURL)
            }

            call.resolve(["uri": fileURL.absoluteString])
        } catch {
            call.reject("Failed to write file", error.localizedDescription)
        }
    }

    @objc func appendFile(_ call: CAPPluginCall) {
        call.setValue(true, forKey: "append")
        writeFile(call)
    }

    @objc func deleteFile(_ call: CAPPluginCall) {
        guard let path = call.getString("path") else {
            call.reject("Path is required")
            return
        }

        let directory = call.getString("directory")

        guard let fileURL = resolveFilePath(path, directory: directory) else {
            call.reject("Invalid path")
            return
        }

        do {
            try fileManager.removeItem(at: fileURL)
            call.resolve()
        } catch {
            call.reject("Failed to delete file", error.localizedDescription)
        }
    }

    @objc func mkdir(_ call: CAPPluginCall) {
        guard let path = call.getString("path") else {
            call.reject("Path is required")
            return
        }

        let directory = call.getString("directory")
        let recursive = call.getBool("recursive") ?? false

        guard let dirURL = resolveFilePath(path, directory: directory) else {
            call.reject("Invalid path")
            return
        }

        do {
            try fileManager.createDirectory(at: dirURL, withIntermediateDirectories: recursive)
            call.resolve()
        } catch {
            call.reject("Failed to create directory", error.localizedDescription)
        }
    }

    @objc func rmdir(_ call: CAPPluginCall) {
        guard let path = call.getString("path") else {
            call.reject("Path is required")
            return
        }

        let directory = call.getString("directory")
        let recursive = call.getBool("recursive") ?? false

        guard let dirURL = resolveFilePath(path, directory: directory) else {
            call.reject("Invalid path")
            return
        }

        do {
            if recursive {
                try fileManager.removeItem(at: dirURL)
            } else {
                let contents = try fileManager.contentsOfDirectory(atPath: dirURL.path)
                if !contents.isEmpty {
                    call.reject("INVALID_MODIFICATION_ERR", "Directory is not empty")
                    return
                }
                try fileManager.removeItem(at: dirURL)
            }
            call.resolve()
        } catch {
            call.reject("Failed to delete directory", error.localizedDescription)
        }
    }

    @objc func readdir(_ call: CAPPluginCall) {
        guard let path = call.getString("path") else {
            call.reject("Path is required")
            return
        }

        let directory = call.getString("directory")

        guard let dirURL = resolveFilePath(path, directory: directory) else {
            call.reject("Invalid path")
            return
        }

        do {
            let contents = try fileManager.contentsOfDirectory(at: dirURL, includingPropertiesForKeys: [.isDirectoryKey])

            var entries: [[String: Any]] = []
            for item in contents {
                let resourceValues = try item.resourceValues(forKeys: [.isDirectoryKey])
                let isDir = resourceValues.isDirectory ?? false
                entries.append(createEntryResult(for: item, isDirectory: isDir))
            }

            call.resolve(["entries": entries])
        } catch {
            call.reject("Failed to read directory", error.localizedDescription)
        }
    }

    @objc func stat(_ call: CAPPluginCall) {
        guard let path = call.getString("path") else {
            call.reject("Path is required")
            return
        }

        let directory = call.getString("directory")

        guard let fileURL = resolveFilePath(path, directory: directory) else {
            call.reject("Invalid path")
            return
        }

        var isDir: ObjCBool = false
        guard fileManager.fileExists(atPath: fileURL.path, isDirectory: &isDir) else {
            call.reject("NOT_FOUND_ERR", "File or directory not found")
            return
        }

        do {
            let attributes = try fileManager.attributesOfItem(atPath: fileURL.path)
            let size = attributes[.size] as? Int64 ?? 0
            let mtime = (attributes[.modificationDate] as? Date)?.timeIntervalSince1970 ?? 0
            let ctime = (attributes[.creationDate] as? Date)?.timeIntervalSince1970 ?? 0

            call.resolve([
                "type": isDir.boolValue ? "directory" : "file",
                "size": size,
                "mtime": mtime * 1000,
                "ctime": ctime * 1000,
                "uri": fileURL.absoluteString
            ])
        } catch {
            call.reject("Failed to get stat", error.localizedDescription)
        }
    }

    @objc func getMetadata(_ call: CAPPluginCall) {
        guard let path = call.getString("path") else {
            call.reject("Path is required")
            return
        }

        let directory = call.getString("directory")

        guard let fileURL = resolveFilePath(path, directory: directory) else {
            call.reject("Invalid path")
            return
        }

        guard fileManager.fileExists(atPath: fileURL.path) else {
            call.reject("NOT_FOUND_ERR", "File or directory not found")
            return
        }

        do {
            let attributes = try fileManager.attributesOfItem(atPath: fileURL.path)
            let size = attributes[.size] as? Int64 ?? 0
            let mtime = (attributes[.modificationDate] as? Date)?.timeIntervalSince1970 ?? 0

            call.resolve([
                "modificationTime": mtime * 1000,
                "size": size
            ])
        } catch {
            call.reject("Failed to get metadata", error.localizedDescription)
        }
    }

    @objc func rename(_ call: CAPPluginCall) {
        guard let from = call.getString("from"),
              let to = call.getString("to") else {
            call.reject("From and to paths are required")
            return
        }

        let directory = call.getString("directory")
        let toDirectory = call.getString("toDirectory") ?? directory

        guard let fromURL = resolveFilePath(from, directory: directory),
              let toURL = resolveFilePath(to, directory: toDirectory) else {
            call.reject("Invalid path")
            return
        }

        do {
            let parentDir = toURL.deletingLastPathComponent()
            try fileManager.createDirectory(at: parentDir, withIntermediateDirectories: true)

            if fileManager.fileExists(atPath: toURL.path) {
                try fileManager.removeItem(at: toURL)
            }
            try fileManager.moveItem(at: fromURL, to: toURL)
            call.resolve()
        } catch {
            call.reject("Failed to rename", error.localizedDescription)
        }
    }

    @objc func move(_ call: CAPPluginCall) {
        rename(call)
    }

    @objc func copy(_ call: CAPPluginCall) {
        guard let from = call.getString("from"),
              let to = call.getString("to") else {
            call.reject("From and to paths are required")
            return
        }

        let directory = call.getString("directory")
        let toDirectory = call.getString("toDirectory") ?? directory

        guard let fromURL = resolveFilePath(from, directory: directory),
              let toURL = resolveFilePath(to, directory: toDirectory) else {
            call.reject("Invalid path")
            return
        }

        do {
            let parentDir = toURL.deletingLastPathComponent()
            try fileManager.createDirectory(at: parentDir, withIntermediateDirectories: true)

            if fileManager.fileExists(atPath: toURL.path) {
                try fileManager.removeItem(at: toURL)
            }
            try fileManager.copyItem(at: fromURL, to: toURL)
            call.resolve(["uri": toURL.absoluteString])
        } catch {
            call.reject("Failed to copy", error.localizedDescription)
        }
    }

    @objc func exists(_ call: CAPPluginCall) {
        guard let path = call.getString("path") else {
            call.reject("Path is required")
            return
        }

        let directory = call.getString("directory")

        guard let fileURL = resolveFilePath(path, directory: directory) else {
            call.reject("Invalid path")
            return
        }

        var isDir: ObjCBool = false
        let exists = fileManager.fileExists(atPath: fileURL.path, isDirectory: &isDir)

        if exists {
            call.resolve([
                "exists": true,
                "type": isDir.boolValue ? "directory" : "file"
            ])
        } else {
            call.resolve(["exists": false])
        }
    }

    @objc func getUri(_ call: CAPPluginCall) {
        guard let path = call.getString("path") else {
            call.reject("Path is required")
            return
        }

        let directory = call.getString("directory")

        guard let fileURL = resolveFilePath(path, directory: directory) else {
            call.reject("Invalid path")
            return
        }

        call.resolve(["uri": fileURL.absoluteString])
    }

    @objc func truncate(_ call: CAPPluginCall) {
        guard let path = call.getString("path") else {
            call.reject("Path is required")
            return
        }

        let directory = call.getString("directory")
        let size = call.getInt("size") ?? 0

        guard let fileURL = resolveFilePath(path, directory: directory) else {
            call.reject("Invalid path")
            return
        }

        guard fileManager.fileExists(atPath: fileURL.path) else {
            call.reject("NOT_FOUND_ERR", "File not found")
            return
        }

        do {
            let fileHandle = try FileHandle(forWritingTo: fileURL)
            fileHandle.truncateFile(atOffset: UInt64(size))
            fileHandle.closeFile()
            call.resolve()
        } catch {
            call.reject("Failed to truncate file", error.localizedDescription)
        }
    }

    @objc func getDirectories(_ call: CAPPluginCall) {
        let documentsDir = fileManager.urls(for: .documentDirectory, in: .userDomainMask).first?.absoluteString
        let applicationSupportDir = fileManager.urls(for: .applicationSupportDirectory, in: .userDomainMask).first?.absoluteString
        let cacheDir = fileManager.urls(for: .cachesDirectory, in: .userDomainMask).first?.absoluteString
        let libraryDir = fileManager.urls(for: .libraryDirectory, in: .userDomainMask).first?.absoluteString
        let tempDir = fileManager.temporaryDirectory.absoluteString
        let applicationDir = Bundle.main.bundleURL.absoluteString

        call.resolve([
            "applicationDirectory": applicationDir,
            "applicationStorageDirectory": libraryDir ?? "",
            "dataDirectory": applicationSupportDir ?? "",
            "cacheDirectory": cacheDir ?? "",
            "tempDirectory": tempDir,
            "documentsDirectory": documentsDir ?? "",
            "libraryDirectory": libraryDir ?? ""
        ])
    }

    @objc func getFreeDiskSpace(_ call: CAPPluginCall) {
        do {
            let documentsDir = fileManager.urls(for: .documentDirectory, in: .userDomainMask).first
            if let url = documentsDir {
                let values = try url.resourceValues(forKeys: [.volumeAvailableCapacityForImportantUsageKey])
                if let freeSpace = values.volumeAvailableCapacityForImportantUsage {
                    call.resolve(["free": freeSpace])
                    return
                }
            }
            call.resolve(["free": 0])
        } catch {
            call.resolve(["free": 0])
        }
    }

    @objc func getPluginVersion(_ call: CAPPluginCall) {
        call.resolve(["version": pluginVersion])
    }

    // MARK: - Permissions

    @objc override public func checkPermissions(_ call: CAPPluginCall) {
        // On iOS, file access within app sandbox doesn't require special permissions
        // Always return 'granted' as we have access to app directories
        call.resolve(["publicStorage": "granted"])
    }

    @objc override public func requestPermissions(_ call: CAPPluginCall) {
        // On iOS, file access within app sandbox doesn't require special permissions
        // Always return 'granted' as we have access to app directories
        call.resolve(["publicStorage": "granted"])
    }
}
