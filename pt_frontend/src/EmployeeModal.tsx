import type { Employee } from './types/Employee';
import { useState, useEffect } from 'react';
import Modal from './Modal';

interface EmployeeProps {
    employee: Employee;
    triggerRefresh: () => void;
}

function EmployeeModal({ employee, triggerRefresh } : EmployeeProps) {

    const [imgArr, setImgArr] = useState<string[]>([]);
    const [currentImage, setCurrentImage] = useState<string>("");

    useEffect(() => {
        async function getPath() {
            if(employee.imgPath) {
                setImgArr(JSON.parse(employee.imgPath));
            }
        }
        getPath();
    }, [employee.imgPath])

    async function handleSelectImage(id: number, imgPath: string) { //trigger electron file picker stuff
        const path = await window.api.addImageExisting(id, imgPath);
        if(path) {
            setImgArr(JSON.parse(path));
        }
        triggerRefresh();
    }
        
    return(
        <div className="flex flex-col items-center">
            <div>
                <h3 className="text-black">{employee.name}</h3>
                <p className="text-black">{employee.type}</p>
            </div>
            <div className="grid grid-cols-4 gap-4">
                {
                    imgArr.map((path, index) => {
                        return(
                            <img 
                                key={index} 
                                src={`file:///${path.replace(/\\/g, '/')}`} 
                                className="w-full h-auto"
                                onClick={() => {setCurrentImage(path)}}
                            />
                        )
                    })
                }
            </div>
            <button onClick={() => handleSelectImage(employee.id, employee.imgPath)}>
                Add Images
            </button>
            <Modal isOpen={currentImage !== ""} onClose={() => {setCurrentImage("")}}>
                <img src={`file:///${currentImage.replace(/\\/g, '/')}`} />
            </Modal>
        </div>
    )
}

export default EmployeeModal;