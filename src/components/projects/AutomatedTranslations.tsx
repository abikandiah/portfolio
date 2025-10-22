import { projectType, type ProjectProps } from "@/types/ProjectTypes";
import { techType } from "@/types/TechTypes";

export const automatedTranslationsProject: ProjectProps = {
    type: projectType.NuixRampiva,
    name: 'Automated Translations',
    duration: '2019',
    description: `A Bash script and a Ruby script working together to translate all front-end and back-end user-facing text.`,
    tech: [techType.Ruby, techType.i18next, techType.GoogleCloud],

    sections: [
        { title: 'Overview', body: Overview }
    ]
};


function Overview() {
    return (
        <>
        <p>
            To support multiple languages, we introduced an automated way to generate translations for a given language. The script parses a language file containing all the user interface text, translates them with Google Translate, and tracks the translation in a corresponding translations file. The front-end uses i18next with JSON language files and the back-end uses Java with properties language files.
        </p>
        <p>
            Each language has it's own language file defined as its locale code, for example: <code className="code">en_US.json</code>. A cache is used to avoid duplicate text translations and a bounce-back was implemented to tolerate Google Translate's rate limiters.
        </p>

        <h3 className="sub-heading">Pipeline</h3>
        <p>
            At the start of every build pipeline, a script runs to verify that all user interface text has corresponding translations for the defined languages. If translations are missing, the build will fail, requiring a dev to run and commit all missing translations.
        </p>
        <p>
            After updating user-facing text, the script is used to generate the corresponding translations before comitting the update.
        </p>
        </>
    )
}
