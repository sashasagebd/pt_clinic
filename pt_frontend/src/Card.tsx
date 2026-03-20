

interface CardProps {
    name: string;
    onClick: () => void;
}

function Card({ name, onClick }: CardProps) {

    return(
        <div className="employee-card">
            <div onClick={() => { onClick(); } } className="h-20 outline-2 flex items-center justify-center rounded-sm">
                <p>{name}</p>
            </div>
        </div>
    )
}

export default Card;