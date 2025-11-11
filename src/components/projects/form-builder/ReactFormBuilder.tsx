import { MessageBanner } from "@/components/ui/banner";
import { OrderedList, UnorderedList } from "@/components/ui/list";
import { projectType, type ProjectProps } from "@/types/ProjectTypes";
import { techType } from "@/types/TechTypes";
import { CodeDisplay } from "../../ui/code";


export const javaToReactFormBuilderProject: ProjectProps = {
    type: projectType.NuixRampiva,
    name: 'Java-To-React Form Builder',
    duration: '2023',
    description: `A form generation tool that renders React forms based on Java class and field annotations, greatly reducing UI development time for new back-end models.`,
    tech: [techType.Java, techType.JavaScript, techType.SASS, techType.JSX, techType.React, techType.Dropwizard,
    techType.RestAPI, techType.JavaAnnotations, techType.JavaReflection],

    sections: [
        { title: 'Overview', body: Overview },
        { title: 'Java Form Blueprint', body: FormBlueprint },
        { title: 'React Form Builder', body: FormBuilder },
    ]
};

function Overview() {
    return (
        <>
            <p>
                This feature enables automated, synchronized form generation for Java classes. It uses Java reflection to process custom annotations (used to define form structure, field types, value options, and all validation logic), converting them into form configuration objects. These objects are then consumed by a dedicated frontend form builder to dynamically render the final React form.
            </p>
            <p>
                Initially developed to generate complex workflow operation forms, this tool allows for the automatic generation of frontend forms for any backend data model. Its primary value is establishing Java classes as the blueprint for UI forms, removing frontend development time and maintenance. The architecture was designed for extensibility to handle growing complexity.
            </p>
            <p>
                The form builder component supports a wide array of advanced features, including:
            </p>
            <UnorderedList>
                <li><strong>Complex Layouts</strong>: Support for grouping into rows, sections, and dynamic tables.</li>
                <li><strong>Advanced Validation</strong>: Implementing filters (min, max), custom regular expressions, and input validation checks.</li>
                <li><strong>Dynamic Field Behavior</strong>: Conditional logic for disabling, enabling, hiding, and showing fields based on user input.</li>
                <li><strong>Hierarchy Support</strong>: Handling nested forms for complex object structures.</li>
            </UnorderedList>
        </>
    )
}

function FormBlueprint() {
    return (
        <>
            <p>
                In Java's world, <strong>annotations and reflection</strong> are used to generate the form blueprint from the corresponding Java class. This blueprint serves as the single source of truth for form definition and is then delivered to the frontend via a dedicated REST endpoint. The form blueprint fully describes the structure of the form and the data model it represents, ensuring synchronization.
            </p>

            <h3 className="sub-heading">Annotations</h3>
            <p>
                Java class and field annotations are utilized to describe every aspect of the form:
            </p>
            <UnorderedList>
                <li><strong>Field Annotations</strong>: Define which fields are included in the form, along with their individual properties (e.g., component type, value options, and validation rules).</li>
                <li><strong>Class Annotations</strong>: Define the overall form structure, including layout (e.g., grouping and rows) and essential metadata.</li>
            </UnorderedList>

            <CodeDisplay>
                {`@interface Field {
    String label();
    String name();
    ComponentType type();
    String[] allowedValues();
    String regex();
    int min();
    int max();
}
@interface FieldRow {
}
@interface FieldGroup {
}`}
            </CodeDisplay>

            <p>
                A lot of form settings are implicitly determined with reflection, effectively reducing the need for manual annotation. Settings, such as the <strong>component type</strong> (e.g., a number input for a Java numeric type) and the default <strong>field position</strong> (inherited directly from the class declaration order), are automatically determined, making it easier to define blueprints.
            </p>

            <h3 className="sub-heading">Reflection</h3>
            <p>
                Java reflection is used to parse class annotations, fields and metadata for building form blueprints. It is also used for implicitly generating blueprint settings—such as mapping Java types (e.g., <code className="code">List&lt;String&gt;</code>) to their specific component type (e.g., <code className="code">InputList</code>), and determining default field values. These complete blueprints are then serialized and transmitted to the frontend for dynamic rendering by the React form builder component.
            </p>
            <p>
                The strategy of implicit determination via reflection reduces the need for explicit settings within the annotations. By automatically configuring most form field settings based on Java field properties, the tool ensures that explicit settings are only necessary for fields requiring complex or highly customized behaviour, easing the whole blueprint definition process.
            </p>

            <CodeDisplay>
                {`@FormBlueprint
class Something {
    @Field
    String name;

    @Field(values=["a", "ab", "ba"])
    Enum type;

    @Field
    Boolean checked;
}
`}
            </CodeDisplay>

            <MessageBanner type="note"
                message="Settings are only implicitly set if they aren't explicitly defined by the annotations."
            />
            <MessageBanner type="info"
                message="Blueprint creation is limited to Java classes and fields that have the necessary custom annotations correctly applied."
            />
        </>
    )
}

function FormBuilder() {
    return (
        <>
            <p>
                The frontend takes the form blueprint delivered via the REST endpoint and passes it to the dedicated React form builder component. This builder constructs the form in two main phases:
            </p>
            <OrderedList>
                <li><strong>Layout and Structure</strong>: Fields are organized according to the blueprint's layout specifications, arranging them into grid-like patterns of rows and columns.</li>
                <li><strong>Component Rendering</strong>: Field components are rendered for the field configurations, applying default values, value restrictions (like regular expressions, allowed value lists, or min/max ranges), and dynamic validation handlers.</li>
            </OrderedList>
            <p>
                A key feature is the support for <strong>Dynamic Field Behavior</strong>: components can be configured to set their visibility or active state based on the real-time values of other fields. For example, a checkbox value can be used to conditionally show or hide an entire group of related fields.
            </p>

            <h3 className="sub-heading">Advanced Form Capabilities</h3>
            <p>
                This tool is designed to handle complex data structures:
            </p>
            <UnorderedList>
                <li><strong>Nested Forms</strong>: If a field's type is an annotated Java class (e.g., a `Client` object containing an `Address` object), it is dynamically rendered as a nested form using that class's own blueprint. There is no limitation on the depth of nesting, providing developers flexibility for hierarchical data modeling.</li>
                <li><strong>Collection Types</strong>: Components for complex collection types, such as lists and tables, support adding, editing, and removing multiple values. Collections of other annotated Java classes (e.g., <code className="code">List&lt;Parameter&gt;</code>) are fully supported, with each object represented by a row in a table or list and modified via cell components or a dedicated popup form (leveraging the nested form support).</li>
            </UnorderedList>

            <h3 className="sub-heading">Workflow Builder</h3>
            <p>
                This feature was originally designed to auto-generate operation forms for a <strong>Workflow Builder</strong> component.With over 200 supported operations—and more being added regularly—this tool has become essential. It allows for quick and easy creation of fully functional forms directly from backend configurations, reducing frontend development time and the overall number of components to manage.
            </p>
        </>
    )
}


