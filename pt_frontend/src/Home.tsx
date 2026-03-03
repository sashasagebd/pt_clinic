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
    const [checked, setChecked] = useState<Employee[]>([]);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [search, setSearch] = useState<string>("");
    const [matchedEmployees, setMatchedEmployees] = useState<Employee[]>([]); 

    //const arr = [Practicum, Observation, Internship];

    useEffect(() => {
        const loadEmployees = async () => {
            const employeeArray = await window.api.getEmployees();
            const mapped = employeeArray.map(e => ({
                id: e.id,
                name: e.name,
                imgPath: e.imagePath || ''
            }));
            setEmployees(mapped);
            setMatchedEmployees(mapped);
        };

        loadEmployees();
    }, [refresh]);

    function triggerRefresh() {
        setRefresh(!refresh);
    }

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

    function handleChecked(employee: Employee) {
        if(checked.includes(employee)) {
            const newArr = checked.filter(emp => emp.id !== employee.id);
            setChecked(newArr);
        }
        else {
            setChecked([employee, ...checked]);
        }
    }
       
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSearch(e.target.value);
        if(e.target.value === "") {
            setMatchedEmployees(employees);
        }
        else {
            setMatchedEmployees(employees.filter(employee => employee.name.toLowerCase().includes(search.toLowerCase())));
        }
    }

    //map cards w employees
    return(
        <>
            <img 
                src={settingsIcon} 
                className="absolute top-0 right-0 w-10 h-10 p-1" 
                onClick={() => setShowSettings(true)}
            />

            <p>Search</p>
            <input className="mb-4 outline outline-black" type="text" value={search} onChange={handleChange} />
            
            <div className="flex flex-col gap-4">
                {
                
                matchedEmployees.map((employee) => {   
                    return (
                        <div key={employee.id} className="grid grid-cols-[1fr_4fr_1fr] items-center gap-2">
                            <input type="checkbox" checked={checked.includes(employee)} onClick={() => {handleChecked(employee)}} />
                            <Card 
                                onClick={ () => 
                                { 
                                    setCurrentEmployee(employee);
                                }} 
                                name={employee.name} 
                            />
                            <button onClick={() => {handleRemoveEmployee(employee)}}>Remove Intern</button>
                        </div>
                    )
                })}
            </div>
        
            <Modal isOpen={currentEmployee !== null} onClose={() => setCurrentEmployee(null)}>
                {currentEmployee !== null && ( //narrow type to not be null
                    <EmployeeModal employee={currentEmployee} triggerRefresh={triggerRefresh} />
                )}
            </Modal>
            <Modal isOpen={showSettings} onClose={() => setShowSettings(false)}>
                <Settings />
            </Modal>
            <Modal isOpen={showAddEmployee} onClose={() => setShowAddEmployee(false)}>
                <EmployeeForm submitEmployeeData={handleAddEmployee}/>
            </Modal>
            <button className="mt-4" onClick={() => {setShowAddEmployee(true)}}>
                Add Employee
            </button>
        </>
    )
}

export default Home;