

interface CardProps {
    name: string;
    onClick: () => void;
}

function Card({ name, onClick }: CardProps) {

    return(
        <div className="employee-card">
            <div onClick={() => { onClick(); } } className="h-20 outline-solid flex items-center justify-center">
                <p className="text-sky-800">{name}</p>
            </div>
        </div>
    )
}

export default Card;