import { Grid } from "@mui/material";
import Showcase from "./Showcase";

function Projects(){
    return (
        <Grid container spacing={4} paddingLeft={8} paddingRight={8} paddingBottom={8} justifyContent="center">
            <Grid xs={4} item>
                <Showcase title="Space Game" description={<p>A 2D survival orbit-based game.</p>} link="./#/SpaceGame" />
            </Grid>
            <Grid xs={4} item>
                <Showcase title="Automating Minecraft" description={<p>Automating minecraft using algorithms</p>} link="./#/AutomatingMinecraft" />
            </Grid>
            <Grid xs={4} item>
                <Showcase title="Billiards" description={<p>Classic game of pool</p>} link="./#/Billiards" />
            </Grid>
            {/* <Grid xs={4} item>
                <Showcase title="Grappling Hook Mod" description={<p>Lorem Ipsum</p>} link="./#/GrapplingHook" />
            </Grid>
            <Grid xs={4} item>
                <Showcase title="Boat Soccer Mod" description={<p>Lorem Ipsum</p>} link="./#/BoatSoccer" />
            </Grid> */}
            <Grid xs={4} item>
                <Showcase title="Pacman" description={<p>Classic game of Pac-Man</p>} link="./#/Pacman" />
            </Grid>
            {/* <Grid xs={4} item>
                <Showcase title="Robot" description={<p>Lorem Ipsum</p>} link="./#/Robot" />
            </Grid> */}
        </Grid>
    );
}

export default Projects;