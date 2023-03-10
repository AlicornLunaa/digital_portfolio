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
                <div className="projectImages">
                    <h2>Images</h2>
                    {
                        props.images.map((item, i) => <div><img src={item}></img></div> )
                    }
                </div>
            }
            { props.videos != null &&
                <div className="projectVideos">
                    <h2>Videos</h2>
                    {
                        props.videos.map((item, i) => <div><iframe width="1280" height="720" src={item} allowFullScreen></iframe></div> )
                    }
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