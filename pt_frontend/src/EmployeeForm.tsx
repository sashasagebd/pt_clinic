import { useState } from 'react';
import type { NewEmployee } from './types/Employee';

type EmployeeFormProps = {
    submitEmployeeData: (employee: NewEmployee) => void;
}

function EmployeeForm({ submitEmployeeData } : EmployeeFormProps) {
    const [name, setName] = useState<string>("");
    const [imagePath, setImagePath] = useState<string>("");
    const [selectedEmployeeType, setSelectedEmployeeType] = useState<number | null>(null);
    const [imgArr, setImgArr] = useState<string[]>([]);

    const employeeTypes = [
        {id: 1, label: 'Practicum'},
        {id: 2, label: 'Observation'},
        {id: 3, label: 'Intern'},
    ];

    async function handleSelectImage() { //trigger electron file picker stuff
        const path = await window.api.addImage();
        if(path) {
            setImagePath(path);
            setImgArr(JSON.parse(path))
        }
    }


    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setName(e.target.value);
    }

    function handleSubmit() {
        const selectedType = employeeTypes.find(
            type => type.id === selectedEmployeeType
        );

        const type = selectedType?.label ?? "";
        submitEmployeeData({name, imgPath: imagePath, type});
    }

    return(
        <div>
            <form className="flex flex-col items-center">
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

                <div className="grid grid-cols-4 gap-4">
                {
                    imgArr.map((path, index) => {
                        return(
                            <img 
                                key={index} 
                                src={`file:///${path.replace(/\\/g, '/')}`} 
                                className="w-full h-auto"
                            />
                        )
                    })
                }
                </div>

                <button type="button" className="mt-2" onClick={handleSelectImage}>Add Images</button><br/>
                
                <button type="button" onClick={handleSubmit}>Add Employee</button>
            </form>
        </div>
    )
}

export default EmployeeForm;