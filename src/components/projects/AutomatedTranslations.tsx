import { projectType, type ProjectProps } from "@/types/ProjectTypes";
import { techType } from "@/types/TechTypes";

export const automatedTranslationsProject: ProjectProps = {
    type: projectType.NuixRampiva,
    name: 'Automated Translations',
    duration: '2019',
    description: 'An automated system to include support for multiple languages. Consists of a script that parses and translates text from both the front-end and back-end. Works with JSON and Java properties files and caches seen text to avoid duplicate translations.',
    tech: [techType.Ruby, techType.i18next, techType.GoogleCloud],

    sections: [
        { title: 'Overview', body: Overview }
    ]
};


function Overview() {
    return (
        <>

        </>
    )
}
