import "./Showcase.css";

interface ShowcaseProps {
    title: string;
    description: JSX.Element;
    link: string;
}

function Showcase(props: ShowcaseProps){
    return (
        <div className="showcase"><a href={props.link}>
            <div className="showcase-title">{props.title}</div>
            <div className="showcase-content">{props.description}</div>
        </a></div>
    );
}

export default Showcase;