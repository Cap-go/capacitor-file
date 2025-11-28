import { WebPlugin } from '@capacitor/core';

import type {
  CapacitorFilePlugin,
  RequestFileSystemOptions,
  FileSystem,
  ResolveURLOptions,
  Entry,
  GetFileOptions,
  FileEntry,
  GetDirectoryOptions,
  DirectoryEntry,
  ReadFileOptions,
  ReadFileResult,
  WriteFileOptions,
  WriteFileResult,
  DeleteFileOptions,
  MkdirOptions,
  DeleteDirectoryOptions,
  ReaddirOptions,
  ReaddirResult,
  StatOptions,
  StatResult,
  Metadata,
  RenameOptions,
  CopyOptions,
  CopyResult,
  ExistsOptions,
  ExistsResult,
  GetUriOptions,
  GetUriResult,
  TruncateOptions,
  FileDirectories,
  FilePermissionStatus,
} from './definitions';
import { Directory, FileSystemType } from './definitions';

export class CapacitorFileWeb extends WebPlugin implements CapacitorFilePlugin {
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'CapacitorFileSystem';
  private readonly STORE_NAME = 'files';

  private async getDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, 1);

      request.onerror = () => reject(new Error('Failed to open database'));

      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          db.createObjectStore(this.STORE_NAME, { keyPath: 'path' });
        }
      };
    });
  }

  private normalizePath(path: string, directory?: Directory): string {
    let basePath = '';
    if (directory) {
      switch (directory) {
        case Directory.Documents:
          basePath = '/documents';
          break;
        case Directory.Data:
          basePath = '/data';
          break;
        case Directory.Library:
          basePath = '/library';
          break;
        case Directory.Cache:
          basePath = '/cache';
          break;
        case Directory.External:
        case Directory.ExternalStorage:
          basePath = '/external';
          break;
        case Directory.Application:
          basePath = '/application';
          break;
        default:
          basePath = '/data';
      }
    }
    const fullPath = basePath + (path.startsWith('/') ? path : '/' + path);
    return fullPath.replace(/\/+/g, '/');
  }

  async requestFileSystem(options: RequestFileSystemOptions): Promise<FileSystem> {
    const name = options.type === FileSystemType.PERSISTENT ? 'persistent' : 'temporary';
    return {
      name,
      root: {
        isFile: false,
        isDirectory: true,
        name: '',
        fullPath: '/',
        nativeURL: `indexeddb://localhost/${name}/`,
      },
    };
  }

  async resolveLocalFileSystemURL(options: ResolveURLOptions): Promise<Entry> {
    const path = options.url.replace(/^(file:\/\/|indexeddb:\/\/localhost\/[^/]+)/, '');
    const db = await this.getDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.get(path);

      request.onsuccess = () => {
        if (request.result) {
          const entry = request.result;
          resolve({
            isFile: entry.type === 'file',
            isDirectory: entry.type === 'directory',
            name: path.split('/').pop() || '',
            fullPath: path,
            nativeURL: `indexeddb://localhost/persistent${path}`,
          });
        } else {
          reject(new Error('NOT_FOUND_ERR'));
        }
      };

      request.onerror = () => reject(new Error('Failed to resolve URL'));
    });
  }

  async getFile(options: GetFileOptions): Promise<FileEntry> {
    const path = this.normalizePath(options.path, options.directory);
    const db = await this.getDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.get(path);

      request.onsuccess = () => {
        if (request.result) {
          if (request.result.type !== 'file') {
            reject(new Error('TYPE_MISMATCH_ERR'));
            return;
          }
          if (options.options?.create && options.options?.exclusive) {
            reject(new Error('PATH_EXISTS_ERR'));
            return;
          }
          resolve({
            isFile: true,
            isDirectory: false,
            name: path.split('/').pop() || '',
            fullPath: path,
            nativeURL: `indexeddb://localhost/persistent${path}`,
          });
        } else if (options.options?.create) {
          const entry = {
            path,
            type: 'file',
            data: '',
            mtime: Date.now(),
            ctime: Date.now(),
          };
          const putRequest = store.put(entry);
          putRequest.onsuccess = () => {
            resolve({
              isFile: true,
              isDirectory: false,
              name: path.split('/').pop() || '',
              fullPath: path,
              nativeURL: `indexeddb://localhost/persistent${path}`,
            });
          };
          putRequest.onerror = () => reject(new Error('Failed to create file'));
        } else {
          reject(new Error('NOT_FOUND_ERR'));
        }
      };

      request.onerror = () => reject(new Error('Failed to get file'));
    });
  }

  async getDirectory(options: GetDirectoryOptions): Promise<DirectoryEntry> {
    const path = this.normalizePath(options.path, options.directory);
    const db = await this.getDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.get(path);

      request.onsuccess = () => {
        if (request.result) {
          if (request.result.type !== 'directory') {
            reject(new Error('TYPE_MISMATCH_ERR'));
            return;
          }
          if (options.options?.create && options.options?.exclusive) {
            reject(new Error('PATH_EXISTS_ERR'));
            return;
          }
          resolve({
            isFile: false,
            isDirectory: true,
            name: path.split('/').pop() || '',
            fullPath: path,
            nativeURL: `indexeddb://localhost/persistent${path}`,
          });
        } else if (options.options?.create) {
          const entry = {
            path,
            type: 'directory',
            mtime: Date.now(),
            ctime: Date.now(),
          };
          const putRequest = store.put(entry);
          putRequest.onsuccess = () => {
            resolve({
              isFile: false,
              isDirectory: true,
              name: path.split('/').pop() || '',
              fullPath: path,
              nativeURL: `indexeddb://localhost/persistent${path}`,
            });
          };
          putRequest.onerror = () => reject(new Error('Failed to create directory'));
        } else {
          reject(new Error('NOT_FOUND_ERR'));
        }
      };

      request.onerror = () => reject(new Error('Failed to get directory'));
    });
  }

  async readFile(options: ReadFileOptions): Promise<ReadFileResult> {
    const path = this.normalizePath(options.path, options.directory);
    const db = await this.getDB();
    const offset = options.offset ?? 0;
    const length = options.length;

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.get(path);

      request.onsuccess = () => {
        if (request.result && request.result.type === 'file') {
          let data = request.result.data || '';

          // Apply offset and length
          if (offset > 0 || length !== undefined) {
            const end = length !== undefined ? offset + length : undefined;
            data = data.slice(offset, end);
          }

          if (options.encoding) {
            resolve({ data: typeof data === 'string' ? data : atob(data) });
          } else {
            resolve({ data: typeof data === 'string' ? btoa(data) : data });
          }
        } else {
          reject(new Error('NOT_FOUND_ERR'));
        }
      };

      request.onerror = () => reject(new Error('Failed to read file'));
    });
  }

  async readAsDataURL(options: ReadFileOptions): Promise<{ data: string }> {
    const result = await this.readFile({ ...options, encoding: undefined });
    const path = options.path.toLowerCase();
    let mimeType = 'application/octet-stream';

    if (path.endsWith('.txt')) mimeType = 'text/plain';
    else if (path.endsWith('.html') || path.endsWith('.htm')) mimeType = 'text/html';
    else if (path.endsWith('.json')) mimeType = 'application/json';
    else if (path.endsWith('.jpg') || path.endsWith('.jpeg')) mimeType = 'image/jpeg';
    else if (path.endsWith('.png')) mimeType = 'image/png';
    else if (path.endsWith('.gif')) mimeType = 'image/gif';
    else if (path.endsWith('.pdf')) mimeType = 'application/pdf';

    return { data: `data:${mimeType};base64,${result.data}` };
  }

  async writeFile(options: WriteFileOptions): Promise<WriteFileResult> {
    const path = this.normalizePath(options.path, options.directory);
    const db = await this.getDB();

    if (options.recursive) {
      const parts = path.split('/').filter((p) => p);
      let currentPath = '';
      for (let i = 0; i < parts.length - 1; i++) {
        currentPath += '/' + parts[i];
        await this.mkdir({
          path: currentPath,
          directory: undefined,
          recursive: false,
        }).catch(() => {
          // Ignore errors for intermediate directories
        });
      }
    }

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);

      const getRequest = store.get(path);
      getRequest.onsuccess = () => {
        let data = options.data;
        const existing = getRequest.result?.data || '';

        if (options.position !== undefined && getRequest.result) {
          // Write at specific position
          const pos = Math.max(0, options.position);
          const before = existing.slice(0, pos);
          const after = existing.slice(pos + data.length);
          data = before + data + after;
        } else if (options.append && getRequest.result) {
          // Append to end
          data = existing + data;
        }

        const entry = {
          path,
          type: 'file',
          data,
          mtime: Date.now(),
          ctime: getRequest.result?.ctime || Date.now(),
        };

        const putRequest = store.put(entry);
        putRequest.onsuccess = () => {
          resolve({ uri: `indexeddb://localhost/persistent${path}` });
        };
        putRequest.onerror = () => reject(new Error('Failed to write file'));
      };

      getRequest.onerror = () => reject(new Error('Failed to write file'));
    });
  }

  async appendFile(options: WriteFileOptions): Promise<WriteFileResult> {
    return this.writeFile({ ...options, append: true });
  }

  async deleteFile(options: DeleteFileOptions): Promise<void> {
    const path = this.normalizePath(options.path, options.directory);
    const db = await this.getDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.delete(path);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to delete file'));
    });
  }

  async mkdir(options: MkdirOptions): Promise<void> {
    const path = this.normalizePath(options.path, options.directory);
    const db = await this.getDB();

    if (options.recursive) {
      const parts = path.split('/').filter((p) => p);
      let currentPath = '';
      for (const part of parts) {
        currentPath += '/' + part;
        await this.createDirectory(db, currentPath).catch(() => {
          // Ignore errors for intermediate directories
        });
      }
      return;
    }

    await this.createDirectory(db, path);
  }

  private async createDirectory(db: IDBDatabase, path: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);

      const entry = {
        path,
        type: 'directory',
        mtime: Date.now(),
        ctime: Date.now(),
      };

      const request = store.put(entry);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to create directory'));
    });
  }

  async rmdir(options: DeleteDirectoryOptions): Promise<void> {
    const path = this.normalizePath(options.path, options.directory);
    const db = await this.getDB();

    if (options.recursive) {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.STORE_NAME], 'readwrite');
        const store = transaction.objectStore(this.STORE_NAME);
        const request = store.openCursor();

        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
          if (cursor) {
            if (cursor.value.path.startsWith(path)) {
              cursor.delete();
            }
            cursor.continue();
          } else {
            resolve();
          }
        };

        request.onerror = () => reject(new Error('Failed to delete directory'));
      });
    }

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.delete(path);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to delete directory'));
    });
  }

  async readdir(options: ReaddirOptions): Promise<ReaddirResult> {
    const path = this.normalizePath(options.path, options.directory);
    const db = await this.getDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.openCursor();
      const entries: Entry[] = [];

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor) {
          const entryPath = cursor.value.path;
          if (entryPath.startsWith(path + '/')) {
            const relativePath = entryPath.slice(path.length + 1);
            if (!relativePath.includes('/')) {
              entries.push({
                isFile: cursor.value.type === 'file',
                isDirectory: cursor.value.type === 'directory',
                name: relativePath,
                fullPath: entryPath,
                nativeURL: `indexeddb://localhost/persistent${entryPath}`,
              });
            }
          }
          cursor.continue();
        } else {
          resolve({ entries });
        }
      };

      request.onerror = () => reject(new Error('Failed to read directory'));
    });
  }

  async stat(options: StatOptions): Promise<StatResult> {
    const path = this.normalizePath(options.path, options.directory);
    const db = await this.getDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.get(path);

      request.onsuccess = () => {
        if (request.result) {
          const entry = request.result;
          resolve({
            type: entry.type === 'file' ? 'file' : 'directory',
            size: entry.type === 'file' ? entry.data?.length || 0 : 0,
            ctime: entry.ctime,
            mtime: entry.mtime,
            uri: `indexeddb://localhost/persistent${path}`,
          });
        } else {
          reject(new Error('NOT_FOUND_ERR'));
        }
      };

      request.onerror = () => reject(new Error('Failed to get stat'));
    });
  }

  async getMetadata(options: StatOptions): Promise<Metadata> {
    const stat = await this.stat(options);
    return {
      modificationTime: stat.mtime,
      size: stat.size,
    };
  }

  async rename(options: RenameOptions): Promise<void> {
    const fromPath = this.normalizePath(options.from, options.directory);
    const toPath = this.normalizePath(options.to, options.toDirectory || options.directory);
    const db = await this.getDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const getRequest = store.get(fromPath);

      getRequest.onsuccess = () => {
        if (getRequest.result) {
          const entry = { ...getRequest.result, path: toPath, mtime: Date.now() };
          const putRequest = store.put(entry);
          putRequest.onsuccess = () => {
            const deleteRequest = store.delete(fromPath);
            deleteRequest.onsuccess = () => resolve();
            deleteRequest.onerror = () => reject(new Error('Failed to delete original'));
          };
          putRequest.onerror = () => reject(new Error('Failed to create new entry'));
        } else {
          reject(new Error('NOT_FOUND_ERR'));
        }
      };

      getRequest.onerror = () => reject(new Error('Failed to rename'));
    });
  }

  async move(options: RenameOptions): Promise<void> {
    return this.rename(options);
  }

  async copy(options: CopyOptions): Promise<CopyResult> {
    const fromPath = this.normalizePath(options.from, options.directory);
    const toPath = this.normalizePath(options.to, options.toDirectory || options.directory);
    const db = await this.getDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const getRequest = store.get(fromPath);

      getRequest.onsuccess = () => {
        if (getRequest.result) {
          const entry = {
            ...getRequest.result,
            path: toPath,
            ctime: Date.now(),
            mtime: Date.now(),
          };
          const putRequest = store.put(entry);
          putRequest.onsuccess = () => {
            resolve({ uri: `indexeddb://localhost/persistent${toPath}` });
          };
          putRequest.onerror = () => reject(new Error('Failed to copy'));
        } else {
          reject(new Error('NOT_FOUND_ERR'));
        }
      };

      getRequest.onerror = () => reject(new Error('Failed to copy'));
    });
  }

  async exists(options: ExistsOptions): Promise<ExistsResult> {
    const path = this.normalizePath(options.path, options.directory);
    const db = await this.getDB();

    return new Promise((resolve) => {
      const transaction = db.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.get(path);

      request.onsuccess = () => {
        if (request.result) {
          resolve({
            exists: true,
            type: request.result.type === 'file' ? 'file' : 'directory',
          });
        } else {
          resolve({ exists: false });
        }
      };

      request.onerror = () => resolve({ exists: false });
    });
  }

  async getUri(options: GetUriOptions): Promise<GetUriResult> {
    const path = this.normalizePath(options.path, options.directory);
    return { uri: `indexeddb://localhost/persistent${path}` };
  }

  async truncate(options: TruncateOptions): Promise<void> {
    const path = this.normalizePath(options.path, options.directory);
    const size = options.size || 0;
    const db = await this.getDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const getRequest = store.get(path);

      getRequest.onsuccess = () => {
        if (getRequest.result && getRequest.result.type === 'file') {
          const entry = {
            ...getRequest.result,
            data: (getRequest.result.data || '').slice(0, size),
            mtime: Date.now(),
          };
          const putRequest = store.put(entry);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(new Error('Failed to truncate'));
        } else {
          reject(new Error('NOT_FOUND_ERR'));
        }
      };

      getRequest.onerror = () => reject(new Error('Failed to truncate'));
    });
  }

  async getDirectories(): Promise<FileDirectories> {
    return {
      applicationDirectory: 'indexeddb://localhost/persistent/application/',
      applicationStorageDirectory: 'indexeddb://localhost/persistent/',
      dataDirectory: 'indexeddb://localhost/persistent/data/',
      cacheDirectory: 'indexeddb://localhost/persistent/cache/',
      tempDirectory: 'indexeddb://localhost/temporary/',
      documentsDirectory: 'indexeddb://localhost/persistent/documents/',
      libraryDirectory: 'indexeddb://localhost/persistent/library/',
    };
  }

  async getFreeDiskSpace(): Promise<{ free: number }> {
    if (navigator.storage?.estimate) {
      const estimate = await navigator.storage.estimate();
      const quota = estimate.quota || 0;
      const usage = estimate.usage || 0;
      return { free: quota - usage };
    }
    return { free: 0 };
  }

  async getPluginVersion(): Promise<{ version: string }> {
    return { version: 'web' };
  }

  async checkPermissions(): Promise<FilePermissionStatus> {
    // On web, file access through IndexedDB doesn't require special permissions
    return { publicStorage: 'granted' };
  }

  async requestPermissions(): Promise<FilePermissionStatus> {
    // On web, file access through IndexedDB doesn't require special permissions
    return { publicStorage: 'granted' };
  }
}
