import { projectType, type ProjectProps } from "@/types/ProjectTypes";
import { techType } from "@/types/TechTypes";
import { CodeDisplay } from "../../ui/code";


export const javaToReactFormBuilderProject: ProjectProps = {
    type: projectType.NuixRampiva,
    name: 'Java-To-React Form Builder',
    duration: '2023',
    description: `A React form builder and a Java form blueprint. Generating forms based on Java class and field annotations, reducing front-end development time.`,
    tech: [techType.Java, techType.JavaScript, techType.SASS, techType.JSX, techType.React, techType.Dropwizard,
    techType.RestAPI, techType.JavaAnnotations, techType.JavaReflections],
    
    sections: [
        { title: 'Overview', body: Overview },
        { title: 'Java Form Blueprint', body: FormBlueprint },
        { title: 'The Form Builder', body: FormBuilder },
    ]
};

function Overview() {
    return (
        <>
            <p>
                A React form builder for Java classes. Helps automating form creation for back-end data models used in the front-end. Primarily used for workflow operation forms in the Workflow Builder component. Capable of describing complex forms including rows, tables and groups, as well as performing form validation.
            </p>
        </>
    )
}

function FormBlueprint() {
    return (
        <>
            <p>
                In the back-end, Java annotations and reflections are used to generate form blueprints from Java classes. Those blueprints are then sent to the front-end via a REST endpoint.
            </p>

            <h3 className="sub-heading">Annotations</h3>
            <p>
                Form field annotations are used to describe a class's form. Everything to do with the form layout, fields, and validation where described by the annotations.
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
                The annotations are then translated with reflections into form blueprints. Reflections is used to get metadata about a class's structure which when paired with the annotations helps fill in the blueprint. Information such as default field values, field names for the corresponding JSON representation, and the implicit component type.
            </p>
            <p>
                Most form settings can be determined implicitly with reflections, reducing the need to set them in the annotations. By default, annotation settings don't need to be set, as long as the annotation is present. Only when a field is more complex or requires specal behaviour does the settings need to be explicitly set.
            </p>
            <CodeDisplay>
                {`@FormBlueprint
class Something {
    @FormField
    String name;

    @FormField(values=["a", "ab", "ba"])
    Enum type;

    @FormField
    Boolean checked;
}
`}
            </CodeDisplay>

            <p>
                The blueprints are then sent to the front-end. The front-end receives them and builds forms with them. The forms are initialized with the default JSON representation of the corresponding Java class.
            </p>
            <p>
                Allowing the front-end to easily create and submit JSON representations of a Java class. The back-end receives it and deserializes it into the correct Java class, ensuring it is one of the expected classes.
            </p>
        </>
    )
}

function FormBuilder() {
    return (
        <>
            <p>
                The front-end consists of a generic React form builder component.
            </p>

            <h3 className="sub-heading">Form Builder</h3>
            <p>
                The form builder takes a blueprint and creates a form out of it. It consists of Field, Row and Group components. It includes support for validating, disabling and hiding fields, highlighting and describing errors, and nesting forms within each other.
            </p>
            <p>
                If a class contains another class, both of which are described by form annotations, then the containing class will also include the form for the containee. It would appear as a nested form, and can be crafted to appear as a list or table of objects, or as a popup form.
            </p>
            <p>
                The Field component renders and manages an object's field.
            </p>

            <h3 className="sub-heading">Workflow Builder</h3>
            <p>
                This feature was built for a workflow builder consisting of nearly 200 operations. Each operation needed a form and new operations were always being created, so we needed a way to automate form creation.
            </p>
        </>
    )
}


