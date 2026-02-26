import React, { useEffect, useState } from 'react';

interface Employee {
    name: string;
}

interface AddEmployeeProps {
    onAdd: (employee: Employee) => void;
}

function Settings() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [name, setName] = useState<string>("");

    useEffect(() => { //fetch employees from database

    }, [employees])

    function handleSubmit(e: SubmitEvent) {
        e.stopPropagation;
        if(!name)
            return;

        setName("");
    }

    
    //map cards w employees
    return(
        <>
            <p className="text-black-800">Settings</p>
            
            
        </>
    )
}

export default Settings;