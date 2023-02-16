import ProjectPage from "../components/ProjectPage";

function AutomatingMinecraft(){
    return (
        <ProjectPage
            name="Automating Minecraft"
            description="This is a project I started to occupy my time. I set out to automate the game Minecraft using one of the mods for this game.
            I used the mod Computercraft to create a script for the in-game computer, as well as a react-powered control panel. The control panel uses
            ThreeJS to render the 3D in-game world and show what each computer is doing. The control panel implements the A* pathfinding algorithm
            and a basic database to recreate the world as it travels. One of the biggest limitations with these computers is that they can only see
            the block in front, above, and below. The script has to plan around this by intelligently considering different paths and obstacles."
            images={["minecraft/interface.png", "minecraft/pathfinding.png"]}
            githubRepo="https://github.com/AlicornLunaa/ReplicatingQuarry"
        />
    )
}

export default AutomatingMinecraft;