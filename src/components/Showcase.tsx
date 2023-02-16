import "./Showcase.css";

interface ShowcaseProps {
    title: string;
    description: JSX.Element;
    link: string;
}

function Showcase(props: ShowcaseProps){
    return (
        <div className="showcaseblock">
            <a href={props.link}>
                <div className="showcasetitle">
                    {props.title}
                </div>
                <div className="showcasecontent">
                    {props.description}
                </div>
            </a>
        </div>
    );
}

export default Showcase;