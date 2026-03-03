import { useState } from 'react';
import type { NewEmployee } from './types/Employee';

type EmployeeFormProps = {
    submitEmployeeData: (employee: NewEmployee) => void;
}

function EmployeeForm({ submitEmployeeData } : EmployeeFormProps) {
    const [name, setName] = useState<string>("");
    const [imagePath, setImagePath] = useState<string>("") //change to arr of strings later
    const [selectedEmployeeType, setSelectedEmployeeType] = useState<number | null>(null);

    const employeeTypes = [
        {id: 1, label: 'Practicum'},
        {id: 2, label: 'Observation'},
        {id: 3, label: 'Intern'},
    ]

    async function handleSelectImage() { //trigger electron file picker stuff
        const path = await window.api.addImage();
        if(path) {
            setImagePath(path);
        }
    }


    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setName(e.target.value);
    }

    function handleSubmit() {
        submitEmployeeData({name, imgPath: imagePath})
    }

    return(
        <div>
            <form className="flex flex-col items-center gap-2">
                <label htmlFor="name">Name</label>
                <input className="outline outline-black" id="name" type="text" value={name} onChange={handleChange}/><br/>

                {employeeTypes.map(type => (
                    <label key={type.id} className="flex items-center gap-2">
                        <input 
                            type="checkbox"
                            checked={selectedEmployeeType === type.id}
                            onChange={() => setSelectedEmployeeType(type.id)}
                        />
                        {type.label}
                    </label>
                ))}

                <button type="button" onClick={handleSelectImage}>Add Images</button><br/>
                
                <button type="button" onClick={handleSubmit}>Add Employee</button>
            </form>
        </div>
    )
}

export default EmployeeForm;