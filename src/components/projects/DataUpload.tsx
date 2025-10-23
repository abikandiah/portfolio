import { projectType, type ProjectProps } from "@/types/ProjectTypes";
import { techType } from "@/types/TechTypes";

export const dataUploadProject: ProjectProps = {
    type: projectType.NuixRampiva,
    name: 'Data Upload',
    duration: '2020',
    description: `A data set upload tool for uploading data to admin-defined repositories. Implements the tus resumable file upload protocol with the help of two open source projects; Uppy for the front-end and another for the back-end.`,
    tech: [techType.Java, techType.JavaScript, techType.SASS, techType.JSX,
    techType.React, techType.Dropwizard, techType.RestAPI, techType.OpenSource, techType.TusProtocol],

    sections: [
        { title: 'Overview', body: Overview }
    ]
};

function Overview() {
    return (
        <>
            <p>
                
            </p>
        </>
    )
}