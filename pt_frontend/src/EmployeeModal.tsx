import type { Employee } from './types/Employee';

interface EmployeeProps {
    employee: Employee;
}


function EmployeeModal({ employee } : EmployeeProps) {

    function handleSelectImage() { //trigger electron file picker stuff

    }

    let imgArr: string[] = [];
        
    if(employee.imgPath) {
        imgArr = JSON.parse(employee.imgPath);
    }

    return(
        <div>
            <div>
                <h3 className="text-black">{employee.name}</h3>
            </div>
            <div>
                {
                    imgArr.map((path) => {
                        return <img src={`file:///${path.replace(/\\/g, '/')}`} />;
                    })
                }
            </div>
            <button onClick={handleSelectImage}>
                Add Images
            </button>
        </div>
    )
}

export default EmployeeModal;