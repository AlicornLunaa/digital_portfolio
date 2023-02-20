import ProjectPage from "../components/ProjectPage";

function Pacman(){
    return (
        <ProjectPage
            name="Pacman"
            description="This was a project for my AP Computer Science A class. It is a simple Pac-man clone. It incorporates the A*
            pathfinding algorithm in order to give the location to the player for the ghosts."
        >
            <video controls>
                <source src="./pacman/pacman.mp4" type="video/mp4" />
            </video>
        </ProjectPage>
    )
}

export default Pacman;