import LoremIpsum from "@/constants/LoremIpsum";
import { projectType, type ProjectProps } from "@/types/ProjectTypes";


export const javaToReactFormBuilderProject: ProjectProps = {
    type: projectType.NuixRampiva,
    name: 'Java-To-React Form Builder',
    duration: '2023',
    description: 'A React form generator for backend Java classes. Removes front-end development time by allowing back-end devs to describe form configurations directly on the Java class with annotations.',
    sections: [
        { title: 'Back-end Implementation', body: BackEndProjectSection },
    ]
};

function BackEndProjectSection() {
    return (
        <>
            <p>
                {LoremIpsum}
            </p>
        </>
    )
}
