import { projectType, type ProjectProps } from "@/types/ProjectTypes";
import { techType } from "@/types/TechTypes";
import { CodeDisplay } from "../ui/code";


export const javaToReactFormBuilderProject: ProjectProps = {
    type: projectType.NuixRampiva,
    name: 'Java-To-React Form Builder',
    duration: '2023',
    description: `A React form builder for Java classes. Describes forms with Java annotations and creates them with a Form Builder component. Greatly reduces front-end development time.`,
    tech: [techType.Java, techType.JavaScript, techType.SASS, techType.JSX, techType.React, techType.Dropwizard,
    techType.RestAPI, techType.JavaAnnotations, techType.JavaReflections],
    sections: [
        { title: 'Overview', body: Overview },
        { title: 'Back-End Implementation', body: BackendImplementation },
        { title: 'The Form Builder', body: FormBuilder },
    ]
};

function Overview() {
    return (
        <>
            <p>
                A React form builder for Java classes. Helps automating form creation for back-end data models used in the front-end. Primarily used for workflow operation forms in the Workflow Builder component. Capable of describing complex forms including rows, tables and groups, as well as form validation.
            </p>
        </>
    )
}

function BackendImplementation() {
    return (
        <>
            <p>
                In the back-end, Java annotations and reflections are used to generate form configurations from Java classes; only Java classes with form builder annotations can generate forms. The configurations are then sent to the front-end via a REST endpoint.
            </p>

            <h3 className="sub-heading">Annotations</h3>
            <p>
                A family of form field annotations are used to describe a class form. They include all the settings needed to describe the fields, layout and validation of a form. Below are an example of a few:
            </p>

            <CodeDisplay>
                {`@interface FormField {
    String label();
    String name();
    ComponentType type();
    String[] allowedValues();
    String regex();
    int min();
    int max();
}
@interface FormFieldRow {
}
@interface FormFieldGroup {
}`}
            </CodeDisplay>


            <h3 className="sub-heading">Reflections</h3>
            <p>
                Those annotations are then processed with reflections into corresponding form configuration objects. Reflections is needed to read a Java class's annotations, and then to also populate implicit settings such as the default field value and component type, if not already defined.
            </p>
            <p>
                A lot of configuration details for a class field can be determined through reflections, such as the form field component type. A string field would use an input component type, a number field would use a number component, etc. The name of a field and its order are the same as its Java field name and order.
            </p>
            <p>
                The front-end submits forms as a JSON representation of the Java class, determined through the names and values of the form field configurations.
            </p>
        </>
    )
}

function FormBuilder() {
    return (
        <>

        </>
    )
}
