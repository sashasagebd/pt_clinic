import { contextBridge, ipcRenderer } from 'electron';
import type { Employee } from './types/Employee';

contextBridge.exposeInMainWorld('api', {
  getEmployees: () => ipcRenderer.invoke('get-employees'), //invoke is always async and returns a promise
  addEmployee: (employee: { name: string; imgPath: string }) => ipcRenderer.invoke('add-employee', employee),
  addImage: () => ipcRenderer.invoke('add-image'),
  removeEmployee: (id: number) => ipcRenderer.invoke('remove-employee', id),
  addImageExisting: (id: number, imgPath: string) => ipcRenderer.invoke('add-image-existing', id, imgPath),
  getLogin: () => ipcRenderer.invoke('gmail-login'),
  sendEmails: (employee: Employee[]) => ipcRenderer.invoke('gmail-send', employee),
  logOut: () => ipcRenderer.invoke('gmail-logout'),
});