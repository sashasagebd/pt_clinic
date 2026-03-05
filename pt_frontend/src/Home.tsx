import Card from './Card';
import Modal from './Modal';
import EmployeeModal from './EmployeeModal';
import EmployeeForm from './EmployeeForm'
import { useState, useEffect } from 'react';
import type { Employee, NewEmployee } from './types/Employee';


function Home() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
    const [showAddEmployee, setShowAddEmployee] = useState<boolean>(false);
    const [checked, setChecked] = useState<Employee[]>([]);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [search, setSearch] = useState<string>("");
    const [loggedIn, setLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        const loadEmployees = async () => {
            const employeeArray = await window.api.getEmployees();
            const mapped = employeeArray.map(e => ({
                id: e.id,
                name: e.name,
                imgPath: e.imagePath || '',
                type: e.type,
            }));
            setEmployees(mapped);
        };

        loadEmployees();
    }, [refresh]);

    useEffect(() => {
        const checkLogin = async () => {
            const result: boolean = await window.api.getLogin();
            setLoggedIn(result)
        };

        checkLogin();
    }, []);

    function triggerRefresh() {
        setRefresh(!refresh);
    }

    async function handleLogin() {
        const result: boolean = await window.api.getLogin();
        setLoggedIn(result)
    }

    async function sendEmails() {
        console.log(checked);
        await window.api.sendEmails(checked);
    }

    async function handleAddEmployee(newEmployee: NewEmployee) {
        await window.api.addEmployee(newEmployee);
        setShowAddEmployee(false);
        triggerRefresh();
    }

    async function handleRemoveEmployee(employee: Employee) {
        await window.api.removeEmployee(employee.id);
        triggerRefresh();
    }

    function handleChecked(employee: Employee) {
        if(checked.some(emp => emp.id === employee.id)) {
            const newArr = checked.filter(emp => emp.id !== employee.id);
            setChecked(newArr);
        }
        else {
            setChecked([employee, ...checked]);
        }
    }
       
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSearch(e.target.value);
    }

    const filteredEmployees = employees.filter(employee =>
        employee.name.toLowerCase().includes(search.toLowerCase())
    );

    //map cards w employees
    return(
        <>
            <button 
                className="absolute top-0 right-0 p-1" 
                onClick={handleLogin}
            >
                {loggedIn ? "Logged in" : "Log in"}
            </button>

            <p>Search</p>
            <input className="mb-4 outline outline-black" type="text" value={search} onChange={handleChange} />
            
            <div className="flex flex-col gap-4">
                {
                filteredEmployees.map((employee) => {   
                    return (
                        <div key={employee.id} className="grid grid-cols-[1fr_4fr_1fr] items-center gap-2">
                            <input type="checkbox" checked={checked.some(emp => emp.id === employee.id)} onClick={() => {handleChecked(employee)}} />
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
            <Modal isOpen={showAddEmployee} onClose={() => setShowAddEmployee(false)}>
                <EmployeeForm submitEmployeeData={handleAddEmployee}/>
            </Modal>
            <button className="mt-4" onClick={() => {setShowAddEmployee(true)}}>
                Add Employee
            </button>
            <button className="mt-4" onClick={() => sendEmails()}>
                Send Emails
            </button>
        </>
    )
}

export default Home;