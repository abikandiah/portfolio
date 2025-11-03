import { projectType, type ProjectProps } from "@/types/ProjectTypes";
import { techType } from "@/types/TechTypes";
import { MessageBanner } from "../ui/banner";

export const automatedTranslationsProject: ProjectProps = {
    type: projectType.NuixRampiva,
    name: 'Automated Translations',
    duration: '2019',
    description: `A Batch script and a Ruby script working together to translate all frontend and backend user-facing text.`,
    tech: [techType.Ruby, techType.i18next, techType.GoogleCloud],

    sections: [
        { title: 'Overview', body: Overview }
    ]
};


function Overview() {
    return (
        <>
            <p>
                This tool automates the translation of frontend and backend language files into a target language. The translation logic is written as a Ruby script and uses Google Translate for the translations. A cache is used to avoid duplicate translations and an exponential back-off is implemented to tolerate Google Translate's rate limiters. A batch script is used to call the translation script for all frontend and backend language files. The list of target languages is specified by a supported-languages file.
            </p>
            <p>
                All user-facing text is stored in a base English language file (both the frontend and backend have their own file, a JSON for the frontend and a Java properties file for the backend). This file is the source for the automated translations. Each target language produces its own translated copy of the base language file. When users select their preferred language, the application switches to use the correct language file. For example, in the frontend, <code className="code">en_US.json</code> for English (US) and <code className="code">fr_CA.json</code> for French (CA).
            </p>
            <p>
                Users can select their preferred langauge via a dropdown option in the frontend and as a command-line parameter (or switch) in the backend.
            </p>
            <MessageBanner type="info"
                message="As an on-premise deployment, clients had full access to configure and manage their backend environments. This allowed them to pass command-line parameters (or switches) when initialzing the backend." />

            <h3 className="sub-heading">Pipeline</h3>
            <p>
                At the start of every build pipeline, a script runs to verify that all user-facing text has corresponding translations for the target languages. If translations are missing, the build will fail, requiring a dev to run and commit all missing translations.
            </p>
        </>
    )
}
