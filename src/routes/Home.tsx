import GitHubIcon from '@mui/icons-material/GitHub';
import { Box } from '@mui/system';
import { Link } from 'react-router-dom';
import AboutMe from '../components/AboutMe';
import Projects from '../components/Projects';
import "./Home.css";

function Home(){
    return (
        <div className="content">
            <div className="header">
                <div className="intro">Hi, I'm Garrett Blankenship.</div>
                <div className="subheader">I like to make stuff.</div>
            </div>
            <div className="body">
                <div className="section aboutme">
                    <p className="section-header">About Me</p>
                    <div className="section-content"><AboutMe/></div>
                </div>
                <div className="section projects">
                    <p className="section-header">Projects</p>
                    <div className="section-content"><Projects/></div>
                </div>
            </div>
        </div>
    );
}

export default Home;