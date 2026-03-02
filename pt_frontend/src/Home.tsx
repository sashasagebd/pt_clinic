import settingsIcon from './assets/settings.png';
import Card from './Card';
import Modal from './Modal';
import Settings from './Settings';
import EmployeeModal from './EmployeeModal';
import EmployeeForm from './EmployeeForm'
import { useState, useEffect } from 'react';
import type { Employee, NewEmployee } from './types/Employee';


function Home() {
    const [showSettings, setShowSettings] = useState<boolean>(false);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
    const [showAddEmployee, setShowAddEmployee] = useState<boolean>(false);

    useEffect(() => {
        const loadEmployees = async () => {
            const employeeArray = await window.api.getEmployees();
            const mapped = employeeArray.map(e => ({
                id: e.id,
                name: e.name,
                imgPath: e.imagePath || ''
            }));
            setEmployees(mapped);
        };

        loadEmployees();
    }, []);

    async function handleAddEmployee(newEmployee: NewEmployee) {
        await window.api.addEmployee(newEmployee);
        const employeeArray = await window.api.getEmployees();
        const mapped = employeeArray.map(e => ({
            id: e.id,
            name: e.name,
            imgPath: e.imagePath || ''
        }));
        setEmployees(mapped);
    }

    async function handleRemoveEmployee(employee: Employee) {
        await window.api.removeEmployee(employee.id);
        const employeeArray = await window.api.getEmployees();
        const mapped = employeeArray.map(e => ({
            id: e.id,
            name: e.name,
            imgPath: e.imagePath || ''
        }));
        setEmployees(mapped);
    }

    //map cards w employees
    return(
        <>
            <img 
                src={settingsIcon} 
                className="absolute top-0 right-0 w-10 h-10 p-1" 
                onClick={() => setShowSettings(true)}
            />
            {console.log(employees)}
            {
                employees.map((employee) => {   
                    return (
                        <div className="grid grid-cols-2 gap-6 p-6 min-w">
                            <Card 
                                onClick={ () => 
                                { 
                                    setCurrentEmployee(employee);
                                }} 
                                name={employee.name} 
                            />
                            <button onClick={() => {handleRemoveEmployee(employee)}}>Remove Employee</button>
                        </div>
                    )
                })
            }
            <Modal isOpen={currentEmployee !== null} onClose={() => setCurrentEmployee(null)}>
                {currentEmployee !== null && ( //narrow type to not be null
                    <EmployeeModal employee={currentEmployee}/>
                )}
            </Modal>
            <Modal isOpen={showSettings} onClose={() => setShowSettings(false)}>
                <Settings />
            </Modal>
            <Modal isOpen={showAddEmployee} onClose={() => setShowAddEmployee(false)}>
                <EmployeeForm submitEmployeeData={handleAddEmployee}/>
            </Modal>
            <button onClick={() => {setShowAddEmployee(true)}}>
                Add Employee
            </button>
        </>
    )
}

export default Home;