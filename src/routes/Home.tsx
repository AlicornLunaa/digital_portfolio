import GitHubIcon from '@mui/icons-material/GitHub';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AboutMe from '../components/AboutMe';
import Projects from '../components/Projects';
import "./Home.css";

function Home(){
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
    const [canvasCtx, setCanvasCtx] = useState<CanvasRenderingContext2D | null>(null);

    const render = () => {
        if(canvas == null) return;
        if(canvasCtx == null) return;
        
        let parent = document.getElementsByClassName("header");
        canvas.width = parent[0].clientWidth;
        canvas.height = parent[0].clientHeight;

        // canvasCtx.globalAlpha = 0;
        // canvasCtx.fillStyle = "#FFAAAA";
        // canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

        requestAnimationFrame(render);
    }

    useEffect(() => {
        if(canvas == null) return;
        setCanvasCtx(canvas.getContext("2d"));
    }, [canvas]);

    useEffect(() => render(), [canvasCtx]);

    return (
        <div className="content">
            <div className="header">
                <div className="intro">Hi, I'm Garrett Blankenship.</div>
                <div className="subheader">I like to make stuff.</div>
                <canvas id="header-canvas" ref={(c) => setCanvas(c)} />
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