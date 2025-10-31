import { projectType, type ProjectProps } from "@/types/ProjectTypes";
import { techType } from "@/types/TechTypes";

export const automatedTranslationsProject: ProjectProps = {
    type: projectType.NuixRampiva,
    name: 'Automated Translations',
    duration: '2019',
    description: `A Batch script and a Ruby script working together to translate all frontend and back-end user-facing text.`,
    tech: [techType.Ruby, techType.i18next, techType.GoogleCloud],

    sections: [
        { title: 'Overview', body: Overview }
    ]
};


function Overview() {
    return (
        <>
            <p>
                To support multiple languages, we introduced an automated way to generate translations for a given language. A translation script parses a language file containing all the user interface text, translates it with Google Translate, and then tracks the translation in a corresponding translations file. The frontend uses i18next with JSON language files and the back-end uses Java with properties language files.
            </p>
            <p>
                Each language has it's own translations file defined as its locale code, for example: <code className="code">en_US.json</code> for English (US). A cache is used to avoid duplicate translations and a bounce-back was implemented to tolerate Google Translate's rate limiters.
            </p>

            <h3 className="sub-heading">Pipeline</h3>
            <p>
                At the start of every build pipeline, a script runs to verify that all user interface text has corresponding translations for the defined languages. If translations are missing, the build will fail, requiring a dev to run and commit all missing translations.
            </p>
            <p>
                After updating user-facing text, the script is used to generate the corresponding translations before comitting the update.
            </p>
            <p>
                A Batch script is used to call the translation script and to provide the paths for the language files in both the frontend and back-end. The target languages were defined in a file.
            </p>
        </>
    )
}
