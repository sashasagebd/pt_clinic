import { useState } from 'react';
import type { NewEmployee } from './types/Employee';

type EmployeeFormProps = {
    submitEmployeeData: (employee: NewEmployee) => void;
}

function EmployeeForm({ submitEmployeeData } : EmployeeFormProps) {
    const [name, setName] = useState<string>("");
    const [imagePath, setImagePath] = useState<string>("") //change to arr of strings later


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
            <form>
                <label htmlFor="name">Name</label>
                <input id="name" type="text" value={name} onChange={handleChange}/><br/>

                <button type="button" onClick={handleSelectImage}>Add Image</button><br/>
                
                <button type="button" onClick={handleSubmit}>Add Employee</button>
            </form>
        </div>
    )
}

export default EmployeeForm;