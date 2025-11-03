import { MessageBanner } from "@/components/ui/banner";
import { UnorderedList } from "@/components/ui/list";
import { projectType, type ProjectProps } from "@/types/ProjectTypes";
import { techType } from "@/types/TechTypes";
import { CodeDisplay } from "../../ui/code";


export const javaToReactFormBuilderProject: ProjectProps = {
    type: projectType.NuixRampiva,
    name: 'Java-To-React Form Builder',
    duration: '2023',
    description: `A Java form blueprint and a React form builder, used to auto-generate forms based on class annotations.`,
    tech: [techType.Java, techType.JavaScript, techType.SASS, techType.JSX, techType.React, techType.Dropwizard,
    techType.RestAPI, techType.JavaAnnotations, techType.JavaReflection],

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
                This feature auto-generates React forms for corresponding Java classes. The classes need to use annotations to describe their form and field characteristics, such as the type of component and any validation logic. Then reflection is used to process those annotations and build form configuration objects. The objects are then sent to the frontend form builder component to build the React form.
            </p>
            <p>
                It was used internally to build forms for workflow operations. It can auto-generate any frontend form for a backend data model. Customization was made and added as complexity was required.
            </p>
            <p>
                Forms supported the following and more:
            </p>
            <UnorderedList>
                <li>Rows, groups and tables</li>
                <li>Filters (min, max, regexps) and validations</li>
                <li>Disabling and enabling fields</li>
                <li>Hiding and showing fields</li>
                <li>Nested forms</li>
            </UnorderedList>
        </>
    )
}

function FormBlueprint() {
    return (
        <>
            <p>
                In Java's world, annotations and reflection are used to generate form blueprints from Java classes. Those blueprints are then sent to the frontend via a REST endpoint. Form blueprints describe everything to do with the form and the model it represents.
            </p>

            <h3 className="sub-heading">Annotations</h3>
            <p>
                Annotations are used to describe everything about a form. There are both class and field annotations. Field annotations describe which fields to use in the form and their properties. Class annotations describe layout and extra metadata.
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

            <p>
                A lot of form settings are implicitly determined through reflection, such as the component type (number component for a number type) and field position (same as in the class).
            </p>


            <h3 className="sub-heading">Reflection</h3>
            <p>
                Reflection is used to read class annotations, fields and metadata to build form blueprints. This is done at runtime to implicitly generate blueprint settings based on class and field metadata, such as the component type (InputList for a <code className="code">List&lt;String&gt;</code>) and initial value, allowing for easy form markup. The blueprints are then sent to the frontend to be rendered by the React form builder component.
            </p>
            <p>
                Implicitly determining settings with reflection reduces the need for explicit settings within annotations. Most fields are automatically configured, requiring explicit settings only for fields with complex or special behavior.
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

            <MessageBanner type="note"
                message="Settings are only implicitly set if they aren't defined by the annotations."
            />
            <MessageBanner type="info"
                message="Form blueprints are only created for classes and fields with annotations correctly applied."
            />
        </>
    )
}

function FormBuilder() {
    return (
        <>
            <p>
                The frontend takes the form blueprint and passes it to a React form builder component. This component takes the blueprint and builds a form out of it.
            </p>
            <p>
                First, it organizes the fields according to the form layout, arranging them into a grid-like pattern of rows and columns. Next, it selects and renders the field components based on their configuration objects. These components can be configured with default values and value restrictions, such as regular expressions, lists of allowed values, or minimum/maximum ranges.
            </p>
            <p>
                They can also be configured to set their visibility and active state based on the values of other fields. For example, the value of a checkbox could be used to show or hide a group of fields.
            </p>
            <p>
                If a field's type is another Java class (e.g., a Client object containing an Address object), it will be rendered as a nested form using that class's configuration. However, it's only rendered if that Java class is annotated and has its own form blueprint. There's no limitation to how many forms can be nested nor the level of nesting (All though things could get messy if there's too much nesting; power is left in the hands of the developer).
            </p>
            <p>
                Complex collection type components, such as lists and tables, have support for adding, editing and removing multiple values. Fields that are collections of other Java classes are also supported, for example the field type <code className="code">List&lt;Parameter&gt;</code> supports modifying a list of <code className="code">Parameter</code> objects. These objects are modified via the nested form support. Each object is represented by a row in a table or list and can either be modified via row cell components or a popup form.
            </p>

            <h3 className="sub-heading">Workflow Builder</h3>
            <p>
                This feature was designed to auto-generate operation forms for our workflow builder. With over 200 supported operations—and more being added regularly—this tool is essential. It allows for quick and easy creation of forms directly from backend configurations, reducing frontend development time and the overall number of components to manage.
            </p>
        </>
    )
}


