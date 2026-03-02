

interface CardProps {
    name: string;
    onClick: () => void; //expecting function returning void
}

function Card({ name, onClick }: CardProps) {

    return(
        <div className="outline-solid">
            <div onClick={onClick} className="max-w-sm bg-white p-6 m-3 rounded-md">
                <p className="text-sky-800">{name}</p>
            </div>
        </div>
    )
}

export default Card;