import GitHubIcon from '@mui/icons-material/GitHub';
import { IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import Showcase from './Showcase';
import "./Home.css";

function Home(){
    return (
        <div className="content">
            <div className="header">
                <div className="intro">
                    <div className="name">Hi, I'm Garrett Blankenship.</div>
                    <div className="small">I like to make stuff.</div>
                </div>
                <div className="links">
                    <Link to={"https://github.com/AlicornLunaa"}>
                        <GitHubIcon fontSize="large" sx={{ color: "white" }} />
                    </Link>
                </div>
            </div>
            <div className="showcase">
                <h2>Projects</h2>
                <div className="showcaseprojects">
                    <Showcase />
                    <Showcase />
                </div>
            </div>
        </div>
    );
}

export default Home;