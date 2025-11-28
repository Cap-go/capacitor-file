import type { PermissionState, PluginListenerHandle } from '@capacitor/core';

/**
 * Error codes matching the W3C FileError specification
 */
export enum FileErrorCode {
  NOT_FOUND_ERR = 1,
  SECURITY_ERR = 2,
  ABORT_ERR = 3,
  NOT_READABLE_ERR = 4,
  ENCODING_ERR = 5,
  NO_MODIFICATION_ALLOWED_ERR = 6,
  INVALID_STATE_ERR = 7,
  SYNTAX_ERR = 8,
  INVALID_MODIFICATION_ERR = 9,
  QUOTA_EXCEEDED_ERR = 10,
  TYPE_MISMATCH_ERR = 11,
  PATH_EXISTS_ERR = 12,
}

/**
 * File system types
 */
export enum FileSystemType {
  TEMPORARY = 0,
  PERSISTENT = 1,
}

/**
 * Represents a file system directory location
 */
export enum Directory {
  /**
   * The Documents directory (iOS) / files directory (Android)
   * Persistent, user-visible, backed up
   */
  Documents = 'DOCUMENTS',
  /**
   * The Data directory
   * Persistent private data storage
   */
  Data = 'DATA',
  /**
   * The Library directory (iOS) / files directory (Android)
   * Persistent but not visible to user
   */
  Library = 'LIBRARY',
  /**
   * The Cache directory
   * Temporary cache, may be cleared by OS
   */
  Cache = 'CACHE',
  /**
   * External storage (Android only)
   * SD card or external storage root
   */
  External = 'EXTERNAL',
  /**
   * External storage data directory (Android only)
   */
  ExternalStorage = 'EXTERNAL_STORAGE',
  /**
   * Application bundle/assets directory (read-only)
   */
  Application = 'APPLICATION',
}

/**
 * Encoding types for reading files
 */
export enum Encoding {
  UTF8 = 'utf8',
  ASCII = 'ascii',
  UTF16 = 'utf16',
}

/**
 * Options for creating or getting files/directories
 */
export interface GetOptions {
  /** Create the file/directory if it doesn't exist */
  create?: boolean;
  /** If true and create is true, throw error if file/directory already exists */
  exclusive?: boolean;
}

/**
 * Represents metadata about a file or directory
 */
export interface Metadata {
  /** Last modification date */
  modificationTime: number;
  /** Size in bytes (0 for directories) */
  size: number;
}

/**
 * Represents a file or directory entry
 */
export interface Entry {
  /** True if this is a file */
  isFile: boolean;
  /** True if this is a directory */
  isDirectory: boolean;
  /** The name of the file or directory */
  name: string;
  /** The full path relative to the filesystem root */
  fullPath: string;
  /** The native file:// URI */
  nativeURL: string;
}

/**
 * Represents a file entry
 */
export interface FileEntry extends Entry {
  isFile: true;
  isDirectory: false;
}

/**
 * Represents a directory entry
 */
export interface DirectoryEntry extends Entry {
  isFile: false;
  isDirectory: true;
}

/**
 * Represents a file system
 */
export interface FileSystem {
  /** The name of the file system */
  name: string;
  /** The root directory of the file system */
  root: DirectoryEntry;
}

/**
 * Represents file content along with metadata
 */
export interface FileInfo {
  /** The name of the file */
  name: string;
  /** The full path */
  path: string;
  /** MIME type if determinable */
  type: string;
  /** Size in bytes */
  size: number;
  /** Last modification timestamp */
  modificationTime: number;
  /** Native URI */
  uri: string;
}

/**
 * Options for requesting a file system
 */
export interface RequestFileSystemOptions {
  /** The type of file system to request */
  type: FileSystemType;
  /** Requested size in bytes (may not be enforced on all platforms) */
  size?: number;
}

/**
 * Options for resolving a URL to an entry
 */
export interface ResolveURLOptions {
  /** The URL to resolve (file:// or cdvfile://) */
  url: string;
}

/**
 * Options for getting a file
 */
export interface GetFileOptions {
  /** Path to the file */
  path: string;
  /** Base directory */
  directory?: Directory;
  /** Options for creating the file */
  options?: GetOptions;
}

/**
 * Options for getting a directory
 */
export interface GetDirectoryOptions {
  /** Path to the directory */
  path: string;
  /** Base directory */
  directory?: Directory;
  /** Options for creating the directory */
  options?: GetOptions;
}

/**
 * Options for reading a file
 */
export interface ReadFileOptions {
  /** Path to the file */
  path: string;
  /** Base directory */
  directory?: Directory;
  /** Encoding for text files (omit for binary/base64) */
  encoding?: Encoding;
  /** Byte offset to start reading from (default: 0) */
  offset?: number;
  /** Number of bytes to read (default: read to end of file) */
  length?: number;
}

/**
 * Result of reading a file
 */
export interface ReadFileResult {
  /** File contents as string (text) or base64 (binary) */
  data: string;
}

/**
 * Options for writing a file
 */
export interface WriteFileOptions {
  /** Path to the file */
  path: string;
  /** Base directory */
  directory?: Directory;
  /** Data to write (string for text, base64 for binary) */
  data: string;
  /** Encoding for text files */
  encoding?: Encoding;
  /** If true, append to existing file instead of overwriting */
  append?: boolean;
  /** Create intermediate directories if they don't exist */
  recursive?: boolean;
  /** Byte position to start writing at (for random access writes). If not specified, writes from beginning or appends based on 'append' flag */
  position?: number;
}

/**
 * Result of writing a file
 */
export interface WriteFileResult {
  /** The URI of the written file */
  uri: string;
}

/**
 * Options for deleting a file or directory
 */
export interface DeleteFileOptions {
  /** Path to the file or directory */
  path: string;
  /** Base directory */
  directory?: Directory;
}

/**
 * Options for deleting a directory recursively
 */
export interface DeleteDirectoryOptions {
  /** Path to the directory */
  path: string;
  /** Base directory */
  directory?: Directory;
  /** If true, delete contents recursively */
  recursive?: boolean;
}

/**
 * Options for creating a directory
 */
export interface MkdirOptions {
  /** Path to the directory */
  path: string;
  /** Base directory */
  directory?: Directory;
  /** Create intermediate directories if they don't exist */
  recursive?: boolean;
}

/**
 * Options for reading a directory
 */
export interface ReaddirOptions {
  /** Path to the directory */
  path: string;
  /** Base directory */
  directory?: Directory;
}

/**
 * Result of reading a directory
 */
export interface ReaddirResult {
  /** List of entries in the directory */
  entries: Entry[];
}

/**
 * Options for getting file information
 */
export interface StatOptions {
  /** Path to the file or directory */
  path: string;
  /** Base directory */
  directory?: Directory;
}

/**
 * Result of getting file/directory information
 */
export interface StatResult {
  /** Type: 'file' or 'directory' */
  type: 'file' | 'directory';
  /** Size in bytes */
  size: number;
  /** Creation time (if available) */
  ctime?: number;
  /** Last modification time */
  mtime: number;
  /** The URI */
  uri: string;
}

/**
 * Options for renaming/moving a file or directory
 */
export interface RenameOptions {
  /** Current path */
  from: string;
  /** New path */
  to: string;
  /** Base directory for 'from' path */
  directory?: Directory;
  /** Base directory for 'to' path */
  toDirectory?: Directory;
}

/**
 * Options for copying a file or directory
 */
export interface CopyOptions {
  /** Source path */
  from: string;
  /** Destination path */
  to: string;
  /** Base directory for source */
  directory?: Directory;
  /** Base directory for destination */
  toDirectory?: Directory;
}

/**
 * Result of copy operation
 */
export interface CopyResult {
  /** The URI of the copied file */
  uri: string;
}

/**
 * Options for checking if a file or directory exists
 */
export interface ExistsOptions {
  /** Path to check */
  path: string;
  /** Base directory */
  directory?: Directory;
}

/**
 * Result of existence check
 */
export interface ExistsResult {
  /** True if the file or directory exists */
  exists: boolean;
  /** Type if exists: 'file' or 'directory' */
  type?: 'file' | 'directory';
}

/**
 * Options for getting the URI of a file
 */
export interface GetUriOptions {
  /** Path to the file */
  path: string;
  /** Base directory */
  directory?: Directory;
}

/**
 * Result of getting a URI
 */
export interface GetUriResult {
  /** The native URI */
  uri: string;
}

/**
 * Options for truncating a file
 */
export interface TruncateOptions {
  /** Path to the file */
  path: string;
  /** Base directory */
  directory?: Directory;
  /** Size to truncate to (default: 0) */
  size?: number;
}

/**
 * Known file system directories exposed by the plugin
 */
export interface FileDirectories {
  /** Application installation directory (read-only) */
  applicationDirectory?: string;
  /** Application storage directory root */
  applicationStorageDirectory?: string;
  /** Persistent private data directory */
  dataDirectory?: string;
  /** Cache directory */
  cacheDirectory?: string;
  /** External root directory (Android) */
  externalRootDirectory?: string;
  /** External application storage directory (Android) */
  externalApplicationStorageDirectory?: string;
  /** External data directory (Android) */
  externalDataDirectory?: string;
  /** External cache directory (Android) */
  externalCacheDirectory?: string;
  /** Documents directory (iOS) */
  documentsDirectory?: string;
  /** Synced data directory (iOS iCloud) */
  syncedDataDirectory?: string;
  /** Library directory (iOS) */
  libraryDirectory?: string;
  /** Temporary directory */
  tempDirectory?: string;
}

/**
 * Progress event for file operations
 */
export interface ProgressEvent {
  /** Bytes loaded so far */
  loaded: number;
  /** Total bytes (if known) */
  total: number;
  /** Whether total is computable */
  lengthComputable: boolean;
}

/**
 * Permission status for file operations
 */
export interface FilePermissionStatus {
  /** Permission state for reading public/external storage */
  publicStorage: PermissionState;
}

/**
 * Options for requesting permissions
 */
export interface PermissionRequestOptions {
  /**
   * If true, shows an alert to open settings when permission is denied
   * @default false
   */
  showSettingsAlert?: boolean;
  /** Title for the settings alert dialog */
  title?: string;
  /** Message for the settings alert dialog */
  message?: string;
  /** Text for the "Open Settings" button */
  openSettingsButtonTitle?: string;
  /** Text for the "Cancel" button */
  cancelButtonTitle?: string;
}

/**
 * Capacitor File Plugin
 * Implements file system operations similar to the Cordova File plugin
 */
export interface CapacitorFilePlugin {
  /**
   * Request a file system.
   *
   * @param options - File system request options
   * @returns Promise with the file system
   */
  requestFileSystem(options: RequestFileSystemOptions): Promise<FileSystem>;

  /**
   * Resolve a file URL to an entry.
   *
   * @param options - URL to resolve
   * @returns Promise with the entry (file or directory)
   */
  resolveLocalFileSystemURL(options: ResolveURLOptions): Promise<Entry>;

  /**
   * Get a file entry.
   *
   * @param options - File path and options
   * @returns Promise with the file entry
   */
  getFile(options: GetFileOptions): Promise<FileEntry>;

  /**
   * Get a directory entry.
   *
   * @param options - Directory path and options
   * @returns Promise with the directory entry
   */
  getDirectory(options: GetDirectoryOptions): Promise<DirectoryEntry>;

  /**
   * Read a file as text or base64.
   *
   * @param options - Read options
   * @returns Promise with file content
   */
  readFile(options: ReadFileOptions): Promise<ReadFileResult>;

  /**
   * Read a file as a data URL (base64 with MIME type prefix).
   *
   * @param options - Read options
   * @returns Promise with data URL string
   */
  readAsDataURL(options: ReadFileOptions): Promise<{ data: string }>;

  /**
   * Write data to a file.
   *
   * @param options - Write options
   * @returns Promise with the result
   */
  writeFile(options: WriteFileOptions): Promise<WriteFileResult>;

  /**
   * Append data to a file.
   *
   * @param options - Write options (append is forced to true)
   * @returns Promise with the result
   */
  appendFile(options: WriteFileOptions): Promise<WriteFileResult>;

  /**
   * Delete a file.
   *
   * @param options - Delete options
   * @returns Promise that resolves when complete
   */
  deleteFile(options: DeleteFileOptions): Promise<void>;

  /**
   * Create a directory.
   *
   * @param options - Directory creation options
   * @returns Promise that resolves when complete
   */
  mkdir(options: MkdirOptions): Promise<void>;

  /**
   * Delete a directory.
   *
   * @param options - Delete options
   * @returns Promise that resolves when complete
   */
  rmdir(options: DeleteDirectoryOptions): Promise<void>;

  /**
   * Read directory contents.
   *
   * @param options - Read options
   * @returns Promise with directory entries
   */
  readdir(options: ReaddirOptions): Promise<ReaddirResult>;

  /**
   * Get metadata about a file or directory.
   *
   * @param options - Stat options
   * @returns Promise with metadata
   */
  stat(options: StatOptions): Promise<StatResult>;

  /**
   * Get metadata about a file or directory.
   * Alias for stat().
   *
   * @param options - Stat options
   * @returns Promise with metadata
   */
  getMetadata(options: StatOptions): Promise<Metadata>;

  /**
   * Rename or move a file or directory.
   *
   * @param options - Rename options
   * @returns Promise that resolves when complete
   */
  rename(options: RenameOptions): Promise<void>;

  /**
   * Move a file or directory.
   * Alias for rename().
   *
   * @param options - Move options
   * @returns Promise that resolves when complete
   */
  move(options: RenameOptions): Promise<void>;

  /**
   * Copy a file or directory.
   *
   * @param options - Copy options
   * @returns Promise with the result
   */
  copy(options: CopyOptions): Promise<CopyResult>;

  /**
   * Check if a file or directory exists.
   *
   * @param options - Check options
   * @returns Promise with existence result
   */
  exists(options: ExistsOptions): Promise<ExistsResult>;

  /**
   * Get the URI for a file.
   *
   * @param options - URI options
   * @returns Promise with the URI
   */
  getUri(options: GetUriOptions): Promise<GetUriResult>;

  /**
   * Truncate a file to a specified size.
   *
   * @param options - Truncate options
   * @returns Promise that resolves when complete
   */
  truncate(options: TruncateOptions): Promise<void>;

  /**
   * Get all known file system directories.
   *
   * @returns Promise with directory paths
   */
  getDirectories(): Promise<FileDirectories>;

  /**
   * Get the free disk space in bytes.
   *
   * @returns Promise with free space in bytes
   */
  getFreeDiskSpace(): Promise<{ free: number }>;

  /**
   * Listen for read progress events.
   *
   * @param eventName - Must be 'readProgress'
   * @param listenerFunc - Callback receiving progress updates
   * @returns Promise with listener handle
   */
  addListener(
    eventName: 'readProgress',
    listenerFunc: (progress: ProgressEvent) => void,
  ): Promise<PluginListenerHandle>;

  /**
   * Listen for write progress events.
   *
   * @param eventName - Must be 'writeProgress'
   * @param listenerFunc - Callback receiving progress updates
   * @returns Promise with listener handle
   */
  addListener(
    eventName: 'writeProgress',
    listenerFunc: (progress: ProgressEvent) => void,
  ): Promise<PluginListenerHandle>;

  /**
   * Remove all event listeners.
   *
   * @returns Promise that resolves when complete
   */
  removeAllListeners(): Promise<void>;

  /**
   * Get the plugin version.
   *
   * @returns Promise with version string
   */
  getPluginVersion(): Promise<{ version: string }>;

  /**
   * Check the current permission status for file operations.
   * On Android, this checks for external storage permissions.
   * On iOS and web, this always returns 'granted' as no special permissions are needed.
   *
   * @returns Promise with permission status
   */
  checkPermissions(): Promise<FilePermissionStatus>;

  /**
   * Request permissions for file operations.
   * On Android, this requests external storage permissions needed for
   * accessing files outside the app's private directories.
   * On iOS and web, this always returns 'granted' as no special permissions are needed.
   *
   * @param options - Optional configuration for the permission request
   * @returns Promise with permission status after the request
   */
  requestPermissions(options?: PermissionRequestOptions): Promise<FilePermissionStatus>;
}
