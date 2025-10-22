import { projectType, type ProjectProps } from "@/types/ProjectTypes";
import { techType } from "@/types/TechTypes";


export const javaToReactFormBuilderProject: ProjectProps = {
    type: projectType.NuixRampiva,
    name: 'Java-To-React Form Builder',
    duration: '2023',
    description: `A React form builder for Java classes. Describes forms with Java annotations and creates them with a Form Builder component. Greatly reduces front-end development time.`,
    tech: [techType.Java, techType.JavaScript, techType.SASS, techType.JSX, techType.React, techType.Dropwizard,
    techType.RestAPI, techType.JavaAnnotations, techType.JavaReflections],
    sections: [
        { title: 'Overview', body: Overview },
    ]
};

function Overview() {
    return (
        <>
            <p>
                A React form builder for Java classes. Helps automating form creation for back-end data models used in the front-end. Primarily used for workflow operation forms in the Workflow Builder component.
            </p>
            <p>
                Capable of grouping form components in a row, table or group, and supports form validation settings.
            </p>
        </>
    )
}
