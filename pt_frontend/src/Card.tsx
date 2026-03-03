

interface CardProps {
    name: string;
    onClick: () => void; //expecting function returning void
}

function Card({ name, onClick }: CardProps) {

    return(
        <div className="">
            <div onClick={onClick} className="h-20 outline-solid flex items-center justify-center">
                <p className="text-sky-800">{name}</p>
            </div>
        </div>
    )
}

export default Card;