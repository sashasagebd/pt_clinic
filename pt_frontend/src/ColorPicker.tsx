import { useState } from 'react';

interface ColorProps {
    setColor: (color: string) => void;
}

export default function ColorPicker({ setColor } : ColorProps) {
    const [selectedColor, setSelectedColor] = useState<number>(1);

    const colors = [
        {id: 1, label: 'bg-[#292525]', theme: "theme-gray"},
        {id: 2, label: 'bg-white', theme: "theme-white"},
        {id: 3, label: 'bg-teal-600', theme: "theme-teal"},
        {id: 4, label: 'bg-red-500', theme: "theme-red"}
    ];
    
    return(
        <div className="grid grid-cols-2 gap-4 absolute top-0 left-0 p-1 m-2">
            {colors.map(color => (
                <div 
                    key={color.id}
                    className={`outline-2 w-4 h-4 ${color.label} ${selectedColor === color.id ? "outline-black" : ""}`}
                    onClick={() => {setSelectedColor(color.id); setColor(color.theme)}}
                ></div>
            ))}
        </div>
    );
}