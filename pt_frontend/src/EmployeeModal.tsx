import type { Employee } from './types/Employee';

interface EmployeeProps {
    employee: Employee;
}


function EmployeeModal({ employee } : EmployeeProps) {

    function handleSelectImage() { //trigger electron file picker stuff

    }

    return(
        <div>
            <div>
                <h3 className="text-black">{employee.name}</h3>
            </div>
            <div>

            </div>
            <button onClick={handleSelectImage}>
                Add Images
            </button>
        </div>
    )
}

export default EmployeeModal;