import type { Employee } from './types/Employee';

export {};

declare global {
    interface Window {
        api: { //all functions exposed by preload.ts go here
            getEmployees: () => Promise<Employee[]>;
            addEmployee: (employee: { name: string; imgPath: string }) => void;
            addImage: () => Promise<string | null>;
            removeEmployee: (id: number) => void;
        }
    }
}