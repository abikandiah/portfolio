import { FolderCode } from "lucide-react";
import { Card, CardH2Header } from "../ui/card";

function ProjectsOverview() {
    return (
        <Card>
            <CardH2Header title={'Notable Projects'}
                Icon={FolderCode}
            />
            
        </Card>
    )
}

export default ProjectsOverview;
