import ProjectPage from "../components/ProjectPage";

function SpaceGame(){
    return (
        <ProjectPage
            name="Space Game"
            description="Space Game is a project I started randomly out of a random burst of motivation. It is a 2D space survival game that
            incorporates orbital mechanics. These orbital mechanics are simulated with Newton's equations and are predict using Kepler's Laws.
            This allows the player to experience space travel in a semi-realistic sense. The simulation implements a patched conics approximation
            algorithm in order to simulate a simplified gravity field. This game is not complete, however advances are being made. Recently an
            atomspheric scattering simulation was added in order to simulate what an atmosphere would look like for the planet."
            images={["spacegame/atmosphere.png", "spacegame/editor.png"]}
            videos={["https://www.youtube.com/embed/Sdc4epQEOEw", "https://www.youtube.com/embed/s7FO9unvbC4"]}
        />
    )
}

export default SpaceGame;