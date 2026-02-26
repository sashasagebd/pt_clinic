import settingsIcon from './assets/settings.png';
import Card from './Card';
import Modal from './Modal';
import Settings from './Settings';
import EmployeeModal from './EmployeeModal';
import { useState, useEffect } from 'react';
import type { Employee } from './types/Employee';


function Home() {
    const [showSettings, setShowSettings] = useState<boolean>(false);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);

    useEffect(() => {
        setEmployees(
            [
                {name: "John Pork", imgPath: ""},
                {name: "Tim Cheese", imgPath: ""},
                {name: "Peter Griffin", imgPath: ""},
            ]
        )
    }, []);

    

    //map cards w employees
    return(
        <>
            <img 
                src={settingsIcon} 
                className="absolute top-0 right-0 w-10 h-10 p-1" 
                onClick={() => setShowSettings(true)}
            />
            {
                employees.map((employee) => {   
                    return <Card 
                        onClick={ () => 
                        { 
                            setCurrentEmployee(employee);
                        }} 
                        name={employee.name} 
                    />
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
        </>
    )
}

export default Home;