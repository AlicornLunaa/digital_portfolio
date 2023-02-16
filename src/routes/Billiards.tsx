import BilliardsTable from "../components/BilliardsDemo/BilliardsTable";
import ProjectPage from "../components/ProjectPage";

function Billiards(){
    return (
        <ProjectPage
            name="Billiards"
            description="Billiards was a final project for my high school's AP Computer Science Principles class. It includes a basic impulse-based
            physics engine to solve the collisions between the balls. The requirements of the project said I must make the game somehow different,
            so I included randomly generated obstacles."
            githubRepo="https://github.com/AlicornLunaa/Billiards"
        >
            <BilliardsTable />
        </ProjectPage>
    )
}

export default Billiards;