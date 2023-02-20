import GitHubIcon from '@mui/icons-material/GitHub';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Boid from '../classes/Boid';
import AboutMe from '../components/AboutMe';
import Projects from '../components/Projects';
import "./Home.css";

function Home(){
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
    const [canvasCtx, setCanvasCtx] = useState<CanvasRenderingContext2D | null>(null);
    const [boidList, setBoidList] = useState<Boid[]>([]);

    const render = (ctx: CanvasRenderingContext2D) => {
        console.log(ctx);
        if(canvas == null) return;
        if(canvasCtx == null) return;

        let parent = document.getElementsByClassName("header");
        let intro = document.getElementsByClassName("intro");
        let subheader = document.getElementsByClassName("subheader");
        let mouseX = 0;
        let mouseY = 0;
        document.onmousemove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        }

        console.log(intro[0].clientLeft);

        const frame = () => {
            canvas.width = parent[0].clientWidth;
            canvas.height = parent[0].clientHeight;
            canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

            for(let b of boidList){
                b.updateViewport(canvas.width, canvas.height);
                b.update(boidList);
                b.avoid(mouseX, mouseY);
                b.avoidRect(intro[0].getBoundingClientRect().left, intro[0].getBoundingClientRect().top, intro[0].clientWidth, intro[0].clientHeight);
                b.avoidRect(subheader[0].getBoundingClientRect().left, subheader[0].getBoundingClientRect().top, subheader[0].clientWidth, subheader[0].clientHeight);
                b.draw(canvasCtx);
            }

            requestAnimationFrame(frame);
        };

        requestAnimationFrame(frame);
    }

    useEffect(() => {
        if(canvas == null) return;
        setCanvasCtx(canvas.getContext("2d"));

        let parent = document.getElementsByClassName("header");
        canvas.width = parent[0].clientWidth;
        canvas.height = parent[0].clientHeight;
        
        let boids: Boid[] = [];
        for(let i = 0; i < 200; i++){
            boids.push(new Boid(Math.random() * canvas.width, Math.random() * canvas.height, canvas.width, canvas.height));
        }
        setBoidList(boids);
    }, [canvas]);

    useEffect(() => { render(canvasCtx!); }, [canvasCtx]);

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