import Card from './Card';
import Modal from './Modal';
import EmployeeModal from './EmployeeModal';
import EmployeeForm from './EmployeeForm'
import ColorPicker from './ColorPicker';
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
    const [showSentEmails, setShowSentEmails] = useState<boolean>(false);
    const [sentEmailMessage, setSentEmailMessage] = useState<string>("");
    const [color, setColor] = useState<string>("theme-gray");

    useEffect(() => {
        const loadEmployees = async () => {
            const employeeArray = await window.api.getEmployees();
            const mapped = employeeArray.map(e => ({
                id: e.id,
                name: e.name,
                email: e.email,
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
        if(loggedIn) {
            const result: boolean = await window.api.logOut();
            setLoggedIn(!result);
        }
        else {
            const result: boolean = await window.api.getLogin();
            setLoggedIn(result);
        }
    }

    async function sendEmails() {
        console.log(checked);
        if(checked.length === 0) {
            setSentEmailMessage("No emails selected");
            setShowSentEmails(true);
        }
        else {
            const sent = await window.api.sendEmails(checked);
            if(sent) {
                setSentEmailMessage("Emails were sent!");
            }
            else {
                setSentEmailMessage("Error sending emails, check developer console for specific errors");
            }
            setShowSentEmails(true);
        }
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

    function handleColorSelect(color: string) {
        setColor(color);
    }

    const filteredEmployees = employees.filter(employee =>
        employee.name.toLowerCase().includes(search.toLowerCase())
    );

    //map cards w employees
    return(
        <div className={`flex flex-col items-center justify-center min-h-screen ${color}`}>
            <button 
                className="absolute top-0 right-0 p-1 m-2" 
                onClick={handleLogin}
            >
                {loggedIn ? "Logged in" : "Log in"}
            </button>

            <ColorPicker setColor={handleColorSelect}></ColorPicker>

            <p>Search</p>
            <input className="mb-4 outline-2 outline-black rounded-sm" type="text" value={search} onChange={handleChange} />
            
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
            <Modal isOpen={showSentEmails} onClose={() => setShowSentEmails(false)}>
                <h2>{sentEmailMessage}</h2>
            </Modal>
            <button className="mt-4" onClick={() => {setShowAddEmployee(true)}}>
                Add Employee
            </button>
            <button className="mt-4" onClick={() => sendEmails()}>
                Send Emails
            </button>
        </div>
    )
}

export default Home;