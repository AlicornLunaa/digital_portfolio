import { ReactP5Wrapper } from "react-p5-wrapper";
import sketch from "./sketch";

function BilliardsTable(){
    return (
        <ReactP5Wrapper sketch={sketch} />
    );
}

export default BilliardsTable;