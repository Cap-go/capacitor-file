import './style.css';
import { CapacitorFile, Directory, Encoding } from '@capgo/capacitor-file';

const plugin = CapacitorFile;
const state = {};
state.lastFilePath = 'test-file.txt';

const actions = [
  {
    id: 'write-file',
    label: 'Write file',
    description: 'Write text content to a file.',
    inputs: [
      { name: 'path', label: 'File path', type: 'text', value: 'test-file.txt' },
      { name: 'data', label: 'Content', type: 'textarea', value: 'Hello from Capacitor File plugin!' },
      { name: 'recursive', label: 'Create directories', type: 'checkbox', value: true },
    ],
    run: async (values) => {
      const result = await plugin.writeFile({
        path: values.path,
        directory: Directory.Documents,
        data: values.data,
        encoding: Encoding.UTF8,
        recursive: values.recursive,
      });
      state.lastFilePath = values.path;
      return result;
    },
  },
  {
    id: 'read-file',
    label: 'Read file',
    description: 'Read text content from a file.',
    inputs: [{ name: 'path', label: 'File path', type: 'text', placeholder: 'Uses last written file' }],
    run: async (values) => {
      const path = values.path || state.lastFilePath;
      const result = await plugin.readFile({
        path,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
      return result;
    },
  },
  {
    id: 'read-partial',
    label: 'Read partial file',
    description: 'Read a portion of a file using offset and length.',
    inputs: [
      { name: 'path', label: 'File path', type: 'text', placeholder: 'Uses last written file' },
      { name: 'offset', label: 'Offset (bytes)', type: 'number', value: 0 },
      { name: 'length', label: 'Length (bytes)', type: 'number', value: 10 },
    ],
    run: async (values) => {
      const path = values.path || state.lastFilePath;
      const result = await plugin.readFile({
        path,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
        offset: values.offset,
        length: values.length,
      });
      return result;
    },
  },
  {
    id: 'append-file',
    label: 'Append to file',
    description: 'Append content to an existing file.',
    inputs: [
      { name: 'path', label: 'File path', type: 'text', placeholder: 'Uses last written file' },
      { name: 'data', label: 'Content to append', type: 'textarea', value: '\nAppended content!' },
    ],
    run: async (values) => {
      const path = values.path || state.lastFilePath;
      const result = await plugin.appendFile({
        path,
        directory: Directory.Documents,
        data: values.data,
        encoding: Encoding.UTF8,
      });
      return result;
    },
  },
  {
    id: 'write-position',
    label: 'Write at position',
    description: 'Write at a specific byte position (random access).',
    inputs: [
      { name: 'path', label: 'File path', type: 'text', placeholder: 'Uses last written file' },
      { name: 'data', label: 'Content', type: 'text', value: 'PATCHED' },
      { name: 'position', label: 'Position (bytes)', type: 'number', value: 6 },
    ],
    run: async (values) => {
      const path = values.path || state.lastFilePath;
      const result = await plugin.writeFile({
        path,
        directory: Directory.Documents,
        data: values.data,
        encoding: Encoding.UTF8,
        position: values.position,
      });
      return result;
    },
  },
  {
    id: 'exists',
    label: 'Check exists',
    description: 'Check if a file or directory exists.',
    inputs: [{ name: 'path', label: 'Path', type: 'text', placeholder: 'Uses last written file' }],
    run: async (values) => {
      const path = values.path || state.lastFilePath;
      const result = await plugin.exists({
        path,
        directory: Directory.Documents,
      });
      return result;
    },
  },
  {
    id: 'stat',
    label: 'Get file info',
    description: 'Get metadata about a file (size, modification time).',
    inputs: [{ name: 'path', label: 'File path', type: 'text', placeholder: 'Uses last written file' }],
    run: async (values) => {
      const path = values.path || state.lastFilePath;
      const result = await plugin.stat({
        path,
        directory: Directory.Documents,
      });
      return result;
    },
  },
  {
    id: 'mkdir',
    label: 'Create directory',
    description: 'Create a new directory.',
    inputs: [
      { name: 'path', label: 'Directory path', type: 'text', value: 'my-folder/sub-folder' },
      { name: 'recursive', label: 'Create recursively', type: 'checkbox', value: true },
    ],
    run: async (values) => {
      await plugin.mkdir({
        path: values.path,
        directory: Directory.Documents,
        recursive: values.recursive,
      });
      return `Directory created: ${values.path}`;
    },
  },
  {
    id: 'readdir',
    label: 'List directory',
    description: 'List contents of a directory.',
    inputs: [{ name: 'path', label: 'Directory path', type: 'text', value: '' }],
    run: async (values) => {
      const result = await plugin.readdir({
        path: values.path || '',
        directory: Directory.Documents,
      });
      return result;
    },
  },
  {
    id: 'copy',
    label: 'Copy file',
    description: 'Copy a file to a new location.',
    inputs: [
      { name: 'from', label: 'Source path', type: 'text', placeholder: 'Uses last written file' },
      { name: 'to', label: 'Destination path', type: 'text', value: 'backup/copy.txt' },
    ],
    run: async (values) => {
      const from = values.from || state.lastFilePath;
      const result = await plugin.copy({
        from,
        to: values.to,
        directory: Directory.Documents,
        toDirectory: Directory.Documents,
      });
      return result;
    },
  },
  {
    id: 'rename',
    label: 'Rename/Move file',
    description: 'Rename or move a file.',
    inputs: [
      { name: 'from', label: 'Source path', type: 'text', placeholder: 'Uses last written file' },
      { name: 'to', label: 'New path', type: 'text', value: 'renamed-file.txt' },
    ],
    run: async (values) => {
      const from = values.from || state.lastFilePath;
      await plugin.rename({
        from,
        to: values.to,
        directory: Directory.Documents,
      });
      state.lastFilePath = values.to;
      return `Renamed ${from} to ${values.to}`;
    },
  },
  {
    id: 'delete-file',
    label: 'Delete file',
    description: 'Delete a file.',
    inputs: [{ name: 'path', label: 'File path', type: 'text', placeholder: 'Uses last written file' }],
    run: async (values) => {
      const path = values.path || state.lastFilePath;
      await plugin.deleteFile({
        path,
        directory: Directory.Documents,
      });
      return `Deleted: ${path}`;
    },
  },
  {
    id: 'rmdir',
    label: 'Delete directory',
    description: 'Delete a directory.',
    inputs: [
      { name: 'path', label: 'Directory path', type: 'text', value: 'my-folder' },
      { name: 'recursive', label: 'Delete recursively', type: 'checkbox', value: true },
    ],
    run: async (values) => {
      await plugin.rmdir({
        path: values.path,
        directory: Directory.Documents,
        recursive: values.recursive,
      });
      return `Deleted directory: ${values.path}`;
    },
  },
  {
    id: 'truncate',
    label: 'Truncate file',
    description: 'Truncate a file to a specific size.',
    inputs: [
      { name: 'path', label: 'File path', type: 'text', placeholder: 'Uses last written file' },
      { name: 'size', label: 'Size (bytes)', type: 'number', value: 10 },
    ],
    run: async (values) => {
      const path = values.path || state.lastFilePath;
      await plugin.truncate({
        path,
        directory: Directory.Documents,
        size: values.size,
      });
      return `Truncated ${path} to ${values.size} bytes`;
    },
  },
  {
    id: 'get-uri',
    label: 'Get file URI',
    description: 'Get the native URI for a file.',
    inputs: [{ name: 'path', label: 'File path', type: 'text', placeholder: 'Uses last written file' }],
    run: async (values) => {
      const path = values.path || state.lastFilePath;
      const result = await plugin.getUri({
        path,
        directory: Directory.Documents,
      });
      return result;
    },
  },
  {
    id: 'get-directories',
    label: 'Get directories',
    description: 'Get all known file system directories.',
    inputs: [],
    run: async () => {
      const result = await plugin.getDirectories();
      return result;
    },
  },
  {
    id: 'get-free-space',
    label: 'Get free disk space',
    description: 'Get free disk space in bytes.',
    inputs: [],
    run: async () => {
      const result = await plugin.getFreeDiskSpace();
      return { free: result.free, freeGB: (result.free / 1024 / 1024 / 1024).toFixed(2) + ' GB' };
    },
  },
  {
    id: 'get-version',
    label: 'Get plugin version',
    description: 'Get the plugin version number.',
    inputs: [],
    run: async () => {
      const result = await plugin.getPluginVersion();
      return result;
    },
  },
  {
    id: 'check-permissions',
    label: 'Check permissions',
    description: 'Check current permission status for file operations.',
    inputs: [],
    run: async () => {
      const result = await plugin.checkPermissions();
      return result;
    },
  },
  {
    id: 'request-permissions',
    label: 'Request permissions',
    description: 'Request permissions for file operations (Android only).',
    inputs: [{ name: 'showSettingsAlert', label: 'Show settings alert if denied', type: 'checkbox', value: true }],
    run: async (values) => {
      const result = await plugin.requestPermissions({
        showSettingsAlert: values.showSettingsAlert,
        title: 'Storage Permission',
        message: 'This app needs storage access to read and write files.',
      });
      return result;
    },
  },
];

const actionSelect = document.getElementById('action-select');
const formContainer = document.getElementById('action-form');
const descriptionBox = document.getElementById('action-description');
const runButton = document.getElementById('run-action');
const output = document.getElementById('plugin-output');

function buildForm(action) {
  formContainer.innerHTML = '';
  if (!action.inputs || !action.inputs.length) {
    const note = document.createElement('p');
    note.className = 'no-input-note';
    note.textContent = 'This action does not require any inputs.';
    formContainer.appendChild(note);
    return;
  }
  action.inputs.forEach((input) => {
    const fieldWrapper = document.createElement('div');
    fieldWrapper.className = input.type === 'checkbox' ? 'form-field inline' : 'form-field';

    const label = document.createElement('label');
    label.textContent = input.label;
    label.htmlFor = `field-${input.name}`;

    let field;
    switch (input.type) {
      case 'textarea': {
        field = document.createElement('textarea');
        field.rows = input.rows || 4;
        break;
      }
      case 'select': {
        field = document.createElement('select');
        (input.options || []).forEach((option) => {
          const opt = document.createElement('option');
          opt.value = option.value;
          opt.textContent = option.label;
          if (input.value !== undefined && option.value === input.value) {
            opt.selected = true;
          }
          field.appendChild(opt);
        });
        break;
      }
      case 'checkbox': {
        field = document.createElement('input');
        field.type = 'checkbox';
        field.checked = Boolean(input.value);
        break;
      }
      case 'number': {
        field = document.createElement('input');
        field.type = 'number';
        if (input.value !== undefined && input.value !== null) {
          field.value = String(input.value);
        }
        break;
      }
      default: {
        field = document.createElement('input');
        field.type = 'text';
        if (input.value !== undefined && input.value !== null) {
          field.value = String(input.value);
        }
      }
    }

    field.id = `field-${input.name}`;
    field.name = input.name;
    field.dataset.type = input.type || 'text';

    if (input.placeholder && input.type !== 'checkbox') {
      field.placeholder = input.placeholder;
    }

    if (input.type === 'checkbox') {
      fieldWrapper.appendChild(field);
      fieldWrapper.appendChild(label);
    } else {
      fieldWrapper.appendChild(label);
      fieldWrapper.appendChild(field);
    }

    formContainer.appendChild(fieldWrapper);
  });
}

function getFormValues(action) {
  const values = {};
  (action.inputs || []).forEach((input) => {
    const field = document.getElementById(`field-${input.name}`);
    if (!field) return;
    switch (input.type) {
      case 'number': {
        values[input.name] = field.value === '' ? null : Number(field.value);
        break;
      }
      case 'checkbox': {
        values[input.name] = field.checked;
        break;
      }
      default: {
        values[input.name] = field.value;
      }
    }
  });
  return values;
}

function setAction(action) {
  descriptionBox.textContent = action.description || '';
  buildForm(action);
  output.textContent = 'Ready to run the selected action.';
}

function populateActions() {
  actionSelect.innerHTML = '';
  actions.forEach((action) => {
    const option = document.createElement('option');
    option.value = action.id;
    option.textContent = action.label;
    actionSelect.appendChild(option);
  });
  setAction(actions[0]);
}

actionSelect.addEventListener('change', () => {
  const action = actions.find((item) => item.id === actionSelect.value);
  if (action) {
    setAction(action);
  }
});

runButton.addEventListener('click', async () => {
  const action = actions.find((item) => item.id === actionSelect.value);
  if (!action) return;
  const values = getFormValues(action);
  try {
    const result = await action.run(values);
    if (result === undefined) {
      output.textContent = 'Action completed.';
    } else if (typeof result === 'string') {
      output.textContent = result;
    } else {
      output.textContent = JSON.stringify(result, null, 2);
    }
  } catch (error) {
    output.textContent = `Error: ${error?.message ?? error}`;
  }
});

populateActions();
