# @capgo/capacitor-file
 <a href="https://capgo.app/"><img src='https://raw.githubusercontent.com/Cap-go/capgo/main/assets/capgo_banner.png' alt='Capgo - Instant updates for capacitor'/></a>

<div align="center">
  <h2><a href="https://capgo.app/?ref=plugin_file"> ➡️ Get Instant updates for your App with Capgo</a></h2>
  <h2><a href="https://capgo.app/consulting/?ref=plugin_file"> Missing a feature? We'll build the plugin for you 💪</a></h2>
</div>


Capacitor plugin for file system operations. A modern replacement for `cordova-plugin-file` with a compatible API.

## Why Capacitor File?

A reliable **native file system** plugin built for Capacitor apps with advanced features not available in the official Filesystem plugin:

- **Partial file reading** - Read specific portions of files with `offset` and `length` parameters (great for large files)
- **Random access writes** - Write at specific byte positions with `position` parameter
- **Cordova compatible API** - Familiar methods like `requestFileSystem()`, `resolveLocalFileSystemURL()`, `getFile()`, and `getDirectory()`
- **All platform directories** - Access Documents, Library, Cache, External storage and more
- **Progress events** - Monitor read/write operations with real-time progress updates
- **Free and open source** - No paid services required

Perfect for apps that need to work with large files, migrate from Cordova, or require random access file operations.

## Documentation

The most complete doc is available here: https://capgo.app/docs/plugins/file/

## Compatibility

| Plugin version | Capacitor compatibility | Maintained |
| -------------- | ----------------------- | ---------- |
| v8.\*.\*       | v8.\*.\*                | ✅          |
| v7.\*.\*       | v7.\*.\*                | On demand   |
| v6.\*.\*       | v6.\*.\*                | ❌          |
| v5.\*.\*       | v5.\*.\*                | ❌          |

> **Note:** The major version of this plugin follows the major version of Capacitor. Use the version that matches your Capacitor installation (e.g., plugin v8 for Capacitor 8). Only the latest major version is actively maintained.

## Install

```bash
npm install @capgo/capacitor-file
npx cap sync
```

## API

<docgen-index>

* [`requestFileSystem(...)`](#requestfilesystem)
* [`resolveLocalFileSystemURL(...)`](#resolvelocalfilesystemurl)
* [`getFile(...)`](#getfile)
* [`getDirectory(...)`](#getdirectory)
* [`readFile(...)`](#readfile)
* [`readAsDataURL(...)`](#readasdataurl)
* [`writeFile(...)`](#writefile)
* [`appendFile(...)`](#appendfile)
* [`deleteFile(...)`](#deletefile)
* [`mkdir(...)`](#mkdir)
* [`rmdir(...)`](#rmdir)
* [`readdir(...)`](#readdir)
* [`stat(...)`](#stat)
* [`getMetadata(...)`](#getmetadata)
* [`rename(...)`](#rename)
* [`move(...)`](#move)
* [`copy(...)`](#copy)
* [`exists(...)`](#exists)
* [`getUri(...)`](#geturi)
* [`truncate(...)`](#truncate)
* [`getDirectories()`](#getdirectories)
* [`getFreeDiskSpace()`](#getfreediskspace)
* [`addListener('readProgress', ...)`](#addlistenerreadprogress-)
* [`addListener('writeProgress', ...)`](#addlistenerwriteprogress-)
* [`removeAllListeners()`](#removealllisteners)
* [`getPluginVersion()`](#getpluginversion)
* [`checkPermissions()`](#checkpermissions)
* [`requestPermissions(...)`](#requestpermissions)
* [Interfaces](#interfaces)
* [Type Aliases](#type-aliases)
* [Enums](#enums)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

Capacitor File Plugin
Implements file system operations similar to the Cordova File plugin

### requestFileSystem(...)

```typescript
requestFileSystem(options: RequestFileSystemOptions) => Promise<FileSystem>
```

Request a file system.

| Param         | Type                                                                          | Description                   |
| ------------- | ----------------------------------------------------------------------------- | ----------------------------- |
| **`options`** | <code><a href="#requestfilesystemoptions">RequestFileSystemOptions</a></code> | - File system request options |

**Returns:** <code>Promise&lt;<a href="#filesystem">FileSystem</a>&gt;</code>

--------------------


### resolveLocalFileSystemURL(...)

```typescript
resolveLocalFileSystemURL(options: ResolveURLOptions) => Promise<Entry>
```

Resolve a file URL to an entry.

| Param         | Type                                                            | Description      |
| ------------- | --------------------------------------------------------------- | ---------------- |
| **`options`** | <code><a href="#resolveurloptions">ResolveURLOptions</a></code> | - URL to resolve |

**Returns:** <code>Promise&lt;<a href="#entry">Entry</a>&gt;</code>

--------------------


### getFile(...)

```typescript
getFile(options: GetFileOptions) => Promise<FileEntry>
```

Get a file entry.

| Param         | Type                                                      | Description             |
| ------------- | --------------------------------------------------------- | ----------------------- |
| **`options`** | <code><a href="#getfileoptions">GetFileOptions</a></code> | - File path and options |

**Returns:** <code>Promise&lt;<a href="#fileentry">FileEntry</a>&gt;</code>

--------------------


### getDirectory(...)

```typescript
getDirectory(options: GetDirectoryOptions) => Promise<DirectoryEntry>
```

Get a directory entry.

| Param         | Type                                                                | Description                                           |
| ------------- | ------------------------------------------------------------------- | ----------------------------------------------------- |
| **`options`** | <code><a href="#getdirectoryoptions">GetDirectoryOptions</a></code> | - <a href="#directory">Directory</a> path and options |

**Returns:** <code>Promise&lt;<a href="#directoryentry">DirectoryEntry</a>&gt;</code>

--------------------


### readFile(...)

```typescript
readFile(options: ReadFileOptions) => Promise<ReadFileResult>
```

Read a file as text or base64.

| Param         | Type                                                        | Description    |
| ------------- | ----------------------------------------------------------- | -------------- |
| **`options`** | <code><a href="#readfileoptions">ReadFileOptions</a></code> | - Read options |

**Returns:** <code>Promise&lt;<a href="#readfileresult">ReadFileResult</a>&gt;</code>

--------------------


### readAsDataURL(...)

```typescript
readAsDataURL(options: ReadFileOptions) => Promise<{ data: string; }>
```

Read a file as a data URL (base64 with MIME type prefix).

| Param         | Type                                                        | Description    |
| ------------- | ----------------------------------------------------------- | -------------- |
| **`options`** | <code><a href="#readfileoptions">ReadFileOptions</a></code> | - Read options |

**Returns:** <code>Promise&lt;{ data: string; }&gt;</code>

--------------------


### writeFile(...)

```typescript
writeFile(options: WriteFileOptions) => Promise<WriteFileResult>
```

Write data to a file.

| Param         | Type                                                          | Description     |
| ------------- | ------------------------------------------------------------- | --------------- |
| **`options`** | <code><a href="#writefileoptions">WriteFileOptions</a></code> | - Write options |

**Returns:** <code>Promise&lt;<a href="#writefileresult">WriteFileResult</a>&gt;</code>

--------------------


### appendFile(...)

```typescript
appendFile(options: WriteFileOptions) => Promise<WriteFileResult>
```

Append data to a file.

| Param         | Type                                                          | Description                                |
| ------------- | ------------------------------------------------------------- | ------------------------------------------ |
| **`options`** | <code><a href="#writefileoptions">WriteFileOptions</a></code> | - Write options (append is forced to true) |

**Returns:** <code>Promise&lt;<a href="#writefileresult">WriteFileResult</a>&gt;</code>

--------------------


### deleteFile(...)

```typescript
deleteFile(options: DeleteFileOptions) => Promise<void>
```

Delete a file.

| Param         | Type                                                            | Description      |
| ------------- | --------------------------------------------------------------- | ---------------- |
| **`options`** | <code><a href="#deletefileoptions">DeleteFileOptions</a></code> | - Delete options |

--------------------


### mkdir(...)

```typescript
mkdir(options: MkdirOptions) => Promise<void>
```

Create a directory.

| Param         | Type                                                  | Description                                           |
| ------------- | ----------------------------------------------------- | ----------------------------------------------------- |
| **`options`** | <code><a href="#mkdiroptions">MkdirOptions</a></code> | - <a href="#directory">Directory</a> creation options |

--------------------


### rmdir(...)

```typescript
rmdir(options: DeleteDirectoryOptions) => Promise<void>
```

Delete a directory.

| Param         | Type                                                                      | Description      |
| ------------- | ------------------------------------------------------------------------- | ---------------- |
| **`options`** | <code><a href="#deletedirectoryoptions">DeleteDirectoryOptions</a></code> | - Delete options |

--------------------


### readdir(...)

```typescript
readdir(options: ReaddirOptions) => Promise<ReaddirResult>
```

Read directory contents.

| Param         | Type                                                      | Description    |
| ------------- | --------------------------------------------------------- | -------------- |
| **`options`** | <code><a href="#readdiroptions">ReaddirOptions</a></code> | - Read options |

**Returns:** <code>Promise&lt;<a href="#readdirresult">ReaddirResult</a>&gt;</code>

--------------------


### stat(...)

```typescript
stat(options: StatOptions) => Promise<StatResult>
```

Get metadata about a file or directory.

| Param         | Type                                                | Description    |
| ------------- | --------------------------------------------------- | -------------- |
| **`options`** | <code><a href="#statoptions">StatOptions</a></code> | - Stat options |

**Returns:** <code>Promise&lt;<a href="#statresult">StatResult</a>&gt;</code>

--------------------


### getMetadata(...)

```typescript
getMetadata(options: StatOptions) => Promise<Metadata>
```

Get metadata about a file or directory.
Alias for stat().

| Param         | Type                                                | Description    |
| ------------- | --------------------------------------------------- | -------------- |
| **`options`** | <code><a href="#statoptions">StatOptions</a></code> | - Stat options |

**Returns:** <code>Promise&lt;<a href="#metadata">Metadata</a>&gt;</code>

--------------------


### rename(...)

```typescript
rename(options: RenameOptions) => Promise<void>
```

Rename or move a file or directory.

| Param         | Type                                                    | Description      |
| ------------- | ------------------------------------------------------- | ---------------- |
| **`options`** | <code><a href="#renameoptions">RenameOptions</a></code> | - Rename options |

--------------------


### move(...)

```typescript
move(options: RenameOptions) => Promise<void>
```

Move a file or directory.
Alias for rename().

| Param         | Type                                                    | Description    |
| ------------- | ------------------------------------------------------- | -------------- |
| **`options`** | <code><a href="#renameoptions">RenameOptions</a></code> | - Move options |

--------------------


### copy(...)

```typescript
copy(options: CopyOptions) => Promise<CopyResult>
```

Copy a file or directory.

| Param         | Type                                                | Description    |
| ------------- | --------------------------------------------------- | -------------- |
| **`options`** | <code><a href="#copyoptions">CopyOptions</a></code> | - Copy options |

**Returns:** <code>Promise&lt;<a href="#copyresult">CopyResult</a>&gt;</code>

--------------------


### exists(...)

```typescript
exists(options: ExistsOptions) => Promise<ExistsResult>
```

Check if a file or directory exists.

| Param         | Type                                                    | Description     |
| ------------- | ------------------------------------------------------- | --------------- |
| **`options`** | <code><a href="#existsoptions">ExistsOptions</a></code> | - Check options |

**Returns:** <code>Promise&lt;<a href="#existsresult">ExistsResult</a>&gt;</code>

--------------------


### getUri(...)

```typescript
getUri(options: GetUriOptions) => Promise<GetUriResult>
```

Get the URI for a file.

| Param         | Type                                                    | Description   |
| ------------- | ------------------------------------------------------- | ------------- |
| **`options`** | <code><a href="#geturioptions">GetUriOptions</a></code> | - URI options |

**Returns:** <code>Promise&lt;<a href="#geturiresult">GetUriResult</a>&gt;</code>

--------------------


### truncate(...)

```typescript
truncate(options: TruncateOptions) => Promise<void>
```

Truncate a file to a specified size.

| Param         | Type                                                        | Description        |
| ------------- | ----------------------------------------------------------- | ------------------ |
| **`options`** | <code><a href="#truncateoptions">TruncateOptions</a></code> | - Truncate options |

--------------------


### getDirectories()

```typescript
getDirectories() => Promise<FileDirectories>
```

Get all known file system directories.

**Returns:** <code>Promise&lt;<a href="#filedirectories">FileDirectories</a>&gt;</code>

--------------------


### getFreeDiskSpace()

```typescript
getFreeDiskSpace() => Promise<{ free: number; }>
```

Get the free disk space in bytes.

**Returns:** <code>Promise&lt;{ free: number; }&gt;</code>

--------------------


### addListener('readProgress', ...)

```typescript
addListener(eventName: 'readProgress', listenerFunc: (progress: ProgressEvent) => void) => Promise<PluginListenerHandle>
```

Listen for read progress events.

| Param              | Type                                                                           | Description                           |
| ------------------ | ------------------------------------------------------------------------------ | ------------------------------------- |
| **`eventName`**    | <code>'readProgress'</code>                                                    | - Must be 'readProgress'              |
| **`listenerFunc`** | <code>(progress: <a href="#progressevent">ProgressEvent</a>) =&gt; void</code> | - Callback receiving progress updates |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

--------------------


### addListener('writeProgress', ...)

```typescript
addListener(eventName: 'writeProgress', listenerFunc: (progress: ProgressEvent) => void) => Promise<PluginListenerHandle>
```

Listen for write progress events.

| Param              | Type                                                                           | Description                           |
| ------------------ | ------------------------------------------------------------------------------ | ------------------------------------- |
| **`eventName`**    | <code>'writeProgress'</code>                                                   | - Must be 'writeProgress'             |
| **`listenerFunc`** | <code>(progress: <a href="#progressevent">ProgressEvent</a>) =&gt; void</code> | - Callback receiving progress updates |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

--------------------


### removeAllListeners()

```typescript
removeAllListeners() => Promise<void>
```

Remove all event listeners.

--------------------


### getPluginVersion()

```typescript
getPluginVersion() => Promise<{ version: string; }>
```

Get the plugin version.

**Returns:** <code>Promise&lt;{ version: string; }&gt;</code>

--------------------


### checkPermissions()

```typescript
checkPermissions() => Promise<FilePermissionStatus>
```

Check the current permission status for file operations.
On Android, this checks for external storage permissions.
On iOS and web, this always returns 'granted' as no special permissions are needed.

**Returns:** <code>Promise&lt;<a href="#filepermissionstatus">FilePermissionStatus</a>&gt;</code>

--------------------


### requestPermissions(...)

```typescript
requestPermissions(options?: PermissionRequestOptions | undefined) => Promise<FilePermissionStatus>
```

Request permissions for file operations.
On Android, this requests external storage permissions needed for
accessing files outside the app's private directories.
On iOS and web, this always returns 'granted' as no special permissions are needed.

| Param         | Type                                                                          | Description                                         |
| ------------- | ----------------------------------------------------------------------------- | --------------------------------------------------- |
| **`options`** | <code><a href="#permissionrequestoptions">PermissionRequestOptions</a></code> | - Optional configuration for the permission request |

**Returns:** <code>Promise&lt;<a href="#filepermissionstatus">FilePermissionStatus</a>&gt;</code>

--------------------


### Interfaces


#### FileSystem

Represents a file system

| Prop       | Type                                                      | Description                           |
| ---------- | --------------------------------------------------------- | ------------------------------------- |
| **`name`** | <code>string</code>                                       | The name of the file system           |
| **`root`** | <code><a href="#directoryentry">DirectoryEntry</a></code> | The root directory of the file system |


#### DirectoryEntry

Represents a directory entry

| Prop              | Type               | Description                 |
| ----------------- | ------------------ | --------------------------- |
| **`isFile`**      | <code>false</code> | True if this is a file      |
| **`isDirectory`** | <code>true</code>  | True if this is a directory |


#### RequestFileSystemOptions

Options for requesting a file system

| Prop       | Type                                                      | Description                                                    |
| ---------- | --------------------------------------------------------- | -------------------------------------------------------------- |
| **`type`** | <code><a href="#filesystemtype">FileSystemType</a></code> | The type of file system to request                             |
| **`size`** | <code>number</code>                                       | Requested size in bytes (may not be enforced on all platforms) |


#### Entry

Represents a file or directory entry

| Prop              | Type                 | Description                                   |
| ----------------- | -------------------- | --------------------------------------------- |
| **`isFile`**      | <code>boolean</code> | True if this is a file                        |
| **`isDirectory`** | <code>boolean</code> | True if this is a directory                   |
| **`name`**        | <code>string</code>  | The name of the file or directory             |
| **`fullPath`**    | <code>string</code>  | The full path relative to the filesystem root |
| **`nativeURL`**   | <code>string</code>  | The native file:// URI                        |


#### ResolveURLOptions

Options for resolving a URL to an entry

| Prop      | Type                | Description                                |
| --------- | ------------------- | ------------------------------------------ |
| **`url`** | <code>string</code> | The URL to resolve (file:// or cdvfile://) |


#### FileEntry

Represents a file entry

| Prop              | Type               | Description                 |
| ----------------- | ------------------ | --------------------------- |
| **`isFile`**      | <code>true</code>  | True if this is a file      |
| **`isDirectory`** | <code>false</code> | True if this is a directory |


#### GetFileOptions

Options for getting a file

| Prop            | Type                                              | Description                   |
| --------------- | ------------------------------------------------- | ----------------------------- |
| **`path`**      | <code>string</code>                               | Path to the file              |
| **`directory`** | <code><a href="#directory">Directory</a></code>   | Base directory                |
| **`options`**   | <code><a href="#getoptions">GetOptions</a></code> | Options for creating the file |


#### GetOptions

Options for creating or getting files/directories

| Prop            | Type                 | Description                                                              |
| --------------- | -------------------- | ------------------------------------------------------------------------ |
| **`create`**    | <code>boolean</code> | Create the file/directory if it doesn't exist                            |
| **`exclusive`** | <code>boolean</code> | If true and create is true, throw error if file/directory already exists |


#### GetDirectoryOptions

Options for getting a directory

| Prop            | Type                                              | Description                        |
| --------------- | ------------------------------------------------- | ---------------------------------- |
| **`path`**      | <code>string</code>                               | Path to the directory              |
| **`directory`** | <code><a href="#directory">Directory</a></code>   | Base directory                     |
| **`options`**   | <code><a href="#getoptions">GetOptions</a></code> | Options for creating the directory |


#### ReadFileResult

Result of reading a file

| Prop       | Type                | Description                                       |
| ---------- | ------------------- | ------------------------------------------------- |
| **`data`** | <code>string</code> | File contents as string (text) or base64 (binary) |


#### ReadFileOptions

Options for reading a file

| Prop            | Type                                            | Description                                                              |
| --------------- | ----------------------------------------------- | ------------------------------------------------------------------------ |
| **`path`**      | <code>string</code>                             | Path to the file                                                         |
| **`directory`** | <code><a href="#directory">Directory</a></code> | Base directory                                                           |
| **`encoding`**  | <code><a href="#encoding">Encoding</a></code>   | <a href="#encoding">Encoding</a> for text files (omit for binary/base64) |
| **`offset`**    | <code>number</code>                             | Byte offset to start reading from (default: 0)                           |
| **`length`**    | <code>number</code>                             | Number of bytes to read (default: read to end of file)                   |


#### WriteFileResult

Result of writing a file

| Prop      | Type                | Description                 |
| --------- | ------------------- | --------------------------- |
| **`uri`** | <code>string</code> | The URI of the written file |


#### WriteFileOptions

Options for writing a file

| Prop            | Type                                            | Description                                                                                                                             |
| --------------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **`path`**      | <code>string</code>                             | Path to the file                                                                                                                        |
| **`directory`** | <code><a href="#directory">Directory</a></code> | Base directory                                                                                                                          |
| **`data`**      | <code>string</code>                             | Data to write (string for text, base64 for binary)                                                                                      |
| **`encoding`**  | <code><a href="#encoding">Encoding</a></code>   | <a href="#encoding">Encoding</a> for text files                                                                                         |
| **`append`**    | <code>boolean</code>                            | If true, append to existing file instead of overwriting                                                                                 |
| **`recursive`** | <code>boolean</code>                            | Create intermediate directories if they don't exist                                                                                     |
| **`position`**  | <code>number</code>                             | Byte position to start writing at (for random access writes). If not specified, writes from beginning or appends based on 'append' flag |


#### DeleteFileOptions

Options for deleting a file or directory

| Prop            | Type                                            | Description                   |
| --------------- | ----------------------------------------------- | ----------------------------- |
| **`path`**      | <code>string</code>                             | Path to the file or directory |
| **`directory`** | <code><a href="#directory">Directory</a></code> | Base directory                |


#### MkdirOptions

Options for creating a directory

| Prop            | Type                                            | Description                                         |
| --------------- | ----------------------------------------------- | --------------------------------------------------- |
| **`path`**      | <code>string</code>                             | Path to the directory                               |
| **`directory`** | <code><a href="#directory">Directory</a></code> | Base directory                                      |
| **`recursive`** | <code>boolean</code>                            | Create intermediate directories if they don't exist |


#### DeleteDirectoryOptions

Options for deleting a directory recursively

| Prop            | Type                                            | Description                          |
| --------------- | ----------------------------------------------- | ------------------------------------ |
| **`path`**      | <code>string</code>                             | Path to the directory                |
| **`directory`** | <code><a href="#directory">Directory</a></code> | Base directory                       |
| **`recursive`** | <code>boolean</code>                            | If true, delete contents recursively |


#### ReaddirResult

Result of reading a directory

| Prop          | Type                 | Description                      |
| ------------- | -------------------- | -------------------------------- |
| **`entries`** | <code>Entry[]</code> | List of entries in the directory |


#### ReaddirOptions

Options for reading a directory

| Prop            | Type                                            | Description           |
| --------------- | ----------------------------------------------- | --------------------- |
| **`path`**      | <code>string</code>                             | Path to the directory |
| **`directory`** | <code><a href="#directory">Directory</a></code> | Base directory        |


#### StatResult

Result of getting file/directory information

| Prop        | Type                               | Description                  |
| ----------- | ---------------------------------- | ---------------------------- |
| **`type`**  | <code>'file' \| 'directory'</code> | Type: 'file' or 'directory'  |
| **`size`**  | <code>number</code>                | Size in bytes                |
| **`ctime`** | <code>number</code>                | Creation time (if available) |
| **`mtime`** | <code>number</code>                | Last modification time       |
| **`uri`**   | <code>string</code>                | The URI                      |


#### StatOptions

Options for getting file information

| Prop            | Type                                            | Description                   |
| --------------- | ----------------------------------------------- | ----------------------------- |
| **`path`**      | <code>string</code>                             | Path to the file or directory |
| **`directory`** | <code><a href="#directory">Directory</a></code> | Base directory                |


#### Metadata

Represents metadata about a file or directory

| Prop                   | Type                | Description                       |
| ---------------------- | ------------------- | --------------------------------- |
| **`modificationTime`** | <code>number</code> | Last modification date            |
| **`size`**             | <code>number</code> | Size in bytes (0 for directories) |


#### RenameOptions

Options for renaming/moving a file or directory

| Prop              | Type                                            | Description                    |
| ----------------- | ----------------------------------------------- | ------------------------------ |
| **`from`**        | <code>string</code>                             | Current path                   |
| **`to`**          | <code>string</code>                             | New path                       |
| **`directory`**   | <code><a href="#directory">Directory</a></code> | Base directory for 'from' path |
| **`toDirectory`** | <code><a href="#directory">Directory</a></code> | Base directory for 'to' path   |


#### CopyResult

Result of copy operation

| Prop      | Type                | Description                |
| --------- | ------------------- | -------------------------- |
| **`uri`** | <code>string</code> | The URI of the copied file |


#### CopyOptions

Options for copying a file or directory

| Prop              | Type                                            | Description                    |
| ----------------- | ----------------------------------------------- | ------------------------------ |
| **`from`**        | <code>string</code>                             | Source path                    |
| **`to`**          | <code>string</code>                             | Destination path               |
| **`directory`**   | <code><a href="#directory">Directory</a></code> | Base directory for source      |
| **`toDirectory`** | <code><a href="#directory">Directory</a></code> | Base directory for destination |


#### ExistsResult

Result of existence check

| Prop         | Type                               | Description                           |
| ------------ | ---------------------------------- | ------------------------------------- |
| **`exists`** | <code>boolean</code>               | True if the file or directory exists  |
| **`type`**   | <code>'file' \| 'directory'</code> | Type if exists: 'file' or 'directory' |


#### ExistsOptions

Options for checking if a file or directory exists

| Prop            | Type                                            | Description    |
| --------------- | ----------------------------------------------- | -------------- |
| **`path`**      | <code>string</code>                             | Path to check  |
| **`directory`** | <code><a href="#directory">Directory</a></code> | Base directory |


#### GetUriResult

Result of getting a URI

| Prop      | Type                | Description    |
| --------- | ------------------- | -------------- |
| **`uri`** | <code>string</code> | The native URI |


#### GetUriOptions

Options for getting the URI of a file

| Prop            | Type                                            | Description      |
| --------------- | ----------------------------------------------- | ---------------- |
| **`path`**      | <code>string</code>                             | Path to the file |
| **`directory`** | <code><a href="#directory">Directory</a></code> | Base directory   |


#### TruncateOptions

Options for truncating a file

| Prop            | Type                                            | Description                      |
| --------------- | ----------------------------------------------- | -------------------------------- |
| **`path`**      | <code>string</code>                             | Path to the file                 |
| **`directory`** | <code><a href="#directory">Directory</a></code> | Base directory                   |
| **`size`**      | <code>number</code>                             | Size to truncate to (default: 0) |


#### FileDirectories

Known file system directories exposed by the plugin

| Prop                                      | Type                | Description                                      |
| ----------------------------------------- | ------------------- | ------------------------------------------------ |
| **`applicationDirectory`**                | <code>string</code> | Application installation directory (read-only)   |
| **`applicationStorageDirectory`**         | <code>string</code> | Application storage directory root               |
| **`dataDirectory`**                       | <code>string</code> | Persistent private data directory                |
| **`cacheDirectory`**                      | <code>string</code> | Cache directory                                  |
| **`externalRootDirectory`**               | <code>string</code> | External root directory (Android)                |
| **`externalApplicationStorageDirectory`** | <code>string</code> | External application storage directory (Android) |
| **`externalDataDirectory`**               | <code>string</code> | External data directory (Android)                |
| **`externalCacheDirectory`**              | <code>string</code> | External cache directory (Android)               |
| **`documentsDirectory`**                  | <code>string</code> | Documents directory (iOS)                        |
| **`syncedDataDirectory`**                 | <code>string</code> | Synced data directory (iOS iCloud)               |
| **`libraryDirectory`**                    | <code>string</code> | Library directory (iOS)                          |
| **`tempDirectory`**                       | <code>string</code> | Temporary directory                              |


#### PluginListenerHandle

| Prop         | Type                                      |
| ------------ | ----------------------------------------- |
| **`remove`** | <code>() =&gt; Promise&lt;void&gt;</code> |


#### ProgressEvent

Progress event for file operations

| Prop                   | Type                 | Description                 |
| ---------------------- | -------------------- | --------------------------- |
| **`loaded`**           | <code>number</code>  | Bytes loaded so far         |
| **`total`**            | <code>number</code>  | Total bytes (if known)      |
| **`lengthComputable`** | <code>boolean</code> | Whether total is computable |


#### FilePermissionStatus

Permission status for file operations

| Prop                | Type                                                        | Description                                          |
| ------------------- | ----------------------------------------------------------- | ---------------------------------------------------- |
| **`publicStorage`** | <code><a href="#permissionstate">PermissionState</a></code> | Permission state for reading public/external storage |


#### PermissionRequestOptions

Options for requesting permissions

| Prop                          | Type                 | Description                                                        | Default            |
| ----------------------------- | -------------------- | ------------------------------------------------------------------ | ------------------ |
| **`showSettingsAlert`**       | <code>boolean</code> | If true, shows an alert to open settings when permission is denied | <code>false</code> |
| **`title`**                   | <code>string</code>  | Title for the settings alert dialog                                |                    |
| **`message`**                 | <code>string</code>  | Message for the settings alert dialog                              |                    |
| **`openSettingsButtonTitle`** | <code>string</code>  | Text for the "Open Settings" button                                |                    |
| **`cancelButtonTitle`**       | <code>string</code>  | Text for the "Cancel" button                                       |                    |


### Type Aliases


#### PermissionState

<code>'prompt' | 'prompt-with-rationale' | 'granted' | 'denied'</code>


### Enums


#### FileSystemType

| Members          | Value          |
| ---------------- | -------------- |
| **`TEMPORARY`**  | <code>0</code> |
| **`PERSISTENT`** | <code>1</code> |


#### Directory

| Members               | Value                           | Description                                                                                   |
| --------------------- | ------------------------------- | --------------------------------------------------------------------------------------------- |
| **`Documents`**       | <code>'DOCUMENTS'</code>        | The Documents directory (iOS) / files directory (Android) Persistent, user-visible, backed up |
| **`Data`**            | <code>'DATA'</code>             | The Data directory Persistent private data storage                                            |
| **`Library`**         | <code>'LIBRARY'</code>          | The Library directory (iOS) / files directory (Android) Persistent but not visible to user    |
| **`Cache`**           | <code>'CACHE'</code>            | The Cache directory Temporary cache, may be cleared by OS                                     |
| **`External`**        | <code>'EXTERNAL'</code>         | External storage (Android only) SD card or external storage root                              |
| **`ExternalStorage`** | <code>'EXTERNAL_STORAGE'</code> | External storage data directory (Android only)                                                |
| **`Application`**     | <code>'APPLICATION'</code>      | Application bundle/assets directory (read-only)                                               |


#### Encoding

| Members     | Value                |
| ----------- | -------------------- |
| **`UTF8`**  | <code>'utf8'</code>  |
| **`ASCII`** | <code>'ascii'</code> |
| **`UTF16`** | <code>'utf16'</code> |

</docgen-api>

## Usage Examples

### Reading a File

```typescript
import { CapacitorFile, Directory, Encoding } from '@capgo/capacitor-file';

// Read as text
const result = await CapacitorFile.readFile({
  path: 'my-file.txt',
  directory: Directory.Documents,
  encoding: Encoding.UTF8,
});
console.log(result.data);

// Read as base64 (binary)
const binaryResult = await CapacitorFile.readFile({
  path: 'image.png',
  directory: Directory.Documents,
});
console.log(binaryResult.data); // base64 string

// Read partial file (offset and length) - great for large files!
const partialResult = await CapacitorFile.readFile({
  path: 'large-file.bin',
  directory: Directory.Documents,
  offset: 1024,    // Start at byte 1024
  length: 512,     // Read 512 bytes
});
console.log(partialResult.data); // base64 encoded chunk
```

### Writing a File

```typescript
import { CapacitorFile, Directory, Encoding } from '@capgo/capacitor-file';

// Write text
await CapacitorFile.writeFile({
  path: 'my-file.txt',
  directory: Directory.Documents,
  data: 'Hello, World!',
  encoding: Encoding.UTF8,
  recursive: true, // Create parent directories if needed
});

// Write binary (base64)
await CapacitorFile.writeFile({
  path: 'image.png',
  directory: Directory.Documents,
  data: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
});

// Write at specific position (random access) - great for patching files!
await CapacitorFile.writeFile({
  path: 'data.bin',
  directory: Directory.Documents,
  data: 'PATCHED',
  encoding: Encoding.UTF8,
  position: 100,  // Write starting at byte 100
});
```

### Creating and Reading Directories

```typescript
import { CapacitorFile, Directory } from '@capgo/capacitor-file';

// Create a directory
await CapacitorFile.mkdir({
  path: 'my-folder/sub-folder',
  directory: Directory.Documents,
  recursive: true,
});

// Read directory contents
const result = await CapacitorFile.readdir({
  path: 'my-folder',
  directory: Directory.Documents,
});

for (const entry of result.entries) {
  console.log(`${entry.name} - ${entry.isFile ? 'file' : 'directory'}`);
}
```

### Copying and Moving Files

```typescript
import { CapacitorFile, Directory } from '@capgo/capacitor-file';

// Copy a file
await CapacitorFile.copy({
  from: 'original.txt',
  to: 'backup/original-copy.txt',
  directory: Directory.Documents,
  toDirectory: Directory.Documents,
});

// Move/rename a file
await CapacitorFile.rename({
  from: 'old-name.txt',
  to: 'new-name.txt',
  directory: Directory.Documents,
});
```

### Checking File Existence

```typescript
import { CapacitorFile, Directory } from '@capgo/capacitor-file';

const result = await CapacitorFile.exists({
  path: 'my-file.txt',
  directory: Directory.Documents,
});

if (result.exists) {
  console.log(`Found ${result.type}`);
}
```

### Getting File Information

```typescript
import { CapacitorFile, Directory } from '@capgo/capacitor-file';

const stat = await CapacitorFile.stat({
  path: 'my-file.txt',
  directory: Directory.Documents,
});

console.log(`Size: ${stat.size} bytes`);
console.log(`Modified: ${new Date(stat.mtime)}`);
console.log(`Type: ${stat.type}`);
```

## Migration from cordova-plugin-file

This plugin provides similar functionality to `cordova-plugin-file` with a more modern API. Here's a quick comparison:

| Cordova File Plugin | This Plugin |
|---------------------|-------------|
| `window.resolveLocalFileSystemURL()` | `CapacitorFile.resolveLocalFileSystemURL()` |
| `directoryEntry.getFile()` | `CapacitorFile.getFile()` |
| `directoryEntry.getDirectory()` | `CapacitorFile.getDirectory()` |
| `fileReader.readAsText()` | `CapacitorFile.readFile({ encoding: Encoding.UTF8 })` |
| `fileReader.readAsDataURL()` | `CapacitorFile.readAsDataURL()` |
| `fileWriter.write()` | `CapacitorFile.writeFile()` |
| `entry.remove()` | `CapacitorFile.deleteFile()` |
| `entry.moveTo()` | `CapacitorFile.move()` |
| `entry.copyTo()` | `CapacitorFile.copy()` |
| `directoryEntry.removeRecursively()` | `CapacitorFile.rmdir({ recursive: true })` |
| `cordova.file.dataDirectory` | `Directory.Data` |
| `cordova.file.documentsDirectory` | `Directory.Documents` |
| `cordova.file.cacheDirectory` | `Directory.Cache` |

## License

MPL-2.0
