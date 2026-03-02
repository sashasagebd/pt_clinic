import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  getEmployees: () => ipcRenderer.invoke('get-employees'), //invoke is always async and returns a promise
  addEmployee: (employee: { name: string; imgPath: string }) => ipcRenderer.invoke('add-employee', employee),
  addImage: () => ipcRenderer.invoke('add-image'),
  removeEmployee: (id: number) => ipcRenderer.invoke('remove-employee', id),
});