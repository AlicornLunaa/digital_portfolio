import Carousel from "react-material-ui-carousel";
import GitHubIcon from '@mui/icons-material/GitHub';
import "./ProjectPage.css"

interface ProjectProps {
    name: string;
    description: string;
    githubRepo?: string;
    images?: string[];
    videos?: string[];
    children?: JSX.Element;
}

function ProjectPage(props: ProjectProps){
    return (
        <div className="projectContent">
            <div className="projectDetails">
                <div className="projectTitle">{props.name}</div>
                <div className="projectDesc">{props.description}</div>
                { props.githubRepo != null &&
                    <a className="projectRepo" href={props.githubRepo}><GitHubIcon />Repository</a>
                }
            </div>
            { props.images != null &&
                <Carousel className="projectImages">
                    {
                        props.images.map((item, i) => <img src={item}></img> )
                    }
                </Carousel>
            }
            { props.videos != null &&
                <div className="projectVideos">
                    <Carousel className="projectImages">
                        {
                            props.videos.map((item, i) => <iframe width="1280" height="720" src={item} allowFullScreen></iframe> )
                        }
                    </Carousel>
                </div>
            }
            { props.children != null &&
                <div>
                    {props.children}
                </div>
            }
        </div>
    )
}

export default ProjectPage;