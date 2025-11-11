import { MessageBanner } from "@/components/ui/banner";
import { OrderedList, UnorderedList } from "@/components/ui/list";
import { projectType, type ProjectProps } from "@/types/ProjectTypes";
import { techType } from "@/types/TechTypes";
import { CodeDisplay } from "../../ui/code";


export const javaToReactFormBuilderProject: ProjectProps = {
    type: projectType.NuixRampiva,
    name: 'Java-To-React Form Builder',
    duration: '2023',
    description: `A form generation tool for rendering React forms for backend Java classes, removing the need to manually create forms.`,
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
                This feature enables automated form generation for Java classes via annotations and reflection. It uses Java reflection to process custom annotations (used to define form structure, field options, and all validation logic), converting them into form configuration objects. These objects are then consumed by a dedicated frontend form builder to dynamically render the final React form.
            </p>
            <p>
                Its primary value is removing frontend development time and maintenance for backend model CRUD (Create, Read, Update, Delete) operations. By auto-generating forms for backend models, this feature creates a consistent and reliable form UI/UX.
            </p>
            <p>
                The following advanced features are supported:
            </p>
            <UnorderedList>
                <li><strong>Complex Layouts</strong>: Support for grouping into rows, sections, and tables.</li>
                <li><strong>Advanced Validation</strong>: Implements filters (min, max), custom regular expressions, and values list.</li>
                <li><strong>Dynamic Field Behavior</strong>: Conditional logic for disabling, enabling, hiding, and showing fields based on user input.</li>
                <li><strong>Hierarchy Support</strong>: Handling nested forms for complex object structures.</li>
            </UnorderedList>

            <h3 className="sub-heading">Workflow Builder</h3>
            <p>
                This tool was originally developed to auto-generate operation forms for a <strong>Workflow Builder</strong> component. Supporting over 200 operations—and more being added regularly—this tool is essential for scaling. It allows for the quick creation of fully functional operation forms directly from backend classes, reducing frontend development time and the overall number of components to manage.
            </p>
        </>
    )
}

function FormBlueprint() {
    return (
        <>
            <p>
                In Java's world, <strong>annotations and reflection</strong> are used to generate the form blueprint from the corresponding Java class. This blueprint serves as the single source of truth for form definition and is then delivered to the frontend via a dedicated REST endpoint. The form blueprint fully describes the structure of the form and the data model it represents.
            </p>

            <h3 className="sub-heading">Annotations</h3>
            <p>
                Java annotations are used to describe the form structure and field options:
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
                Most annotation settings are automatically determined via reflection, removing the need for explicit configuration. Settings like the form field name and component type are derived from the corresponding Java field name and type (e.g., a number input for a Java numeric type), simplifying the blueprint definition process.
            </p>
            <MessageBanner type="note"
                message="Explicitly defined settings override reflection derived settings."
            />

            <h3 className="sub-heading">Reflection</h3>
            <p>
                Java reflection is used to parse class annotations, fields and metadata for building form blueprints. It is also used for implicitly deriving blueprint settings—such as mapping Java types (e.g., <code className="code">List&lt;String&gt;</code>) to their specific component type (e.g., <code className="code">InputList</code>), and determining default field values. These blueprints are then serialized and transmitted to the frontend for dynamic rendering by the React form builder component.
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

            <MessageBanner type="info"
                message="To ensure form consistency, form blueprints are created only for Java classes with the annotations correctly applied."
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

            <h3 className="sub-heading">Form Capabilities</h3>
            <p>
                This tool is designed to handle complex data structures and behaviours:
            </p>
            <UnorderedList>
                <li><strong>Dynamic Fields</strong>: Fields can be conditionally rendered or disabled based on the values of other fields. For example, a checkbox value can be used to conditionally show or hide an entire group of related fields.</li>
                <li><strong>Nested Forms</strong>: If a field's type is an annotated Java class (e.g., a <code className="code">Client</code> object containing an <code className="code">Address</code> object), it is dynamically rendered as a nested form using that class's own blueprint. There is no limitation on the depth of nesting, providing developers flexibility for hierarchical data modeling.</li>
                <li><strong>Collection Types</strong>: Components for complex collection types, such as lists and tables, support adding, editing, and removing multiple values. Collections of other annotated Java classes (e.g., <code className="code">List&lt;Parameter&gt;</code>) are fully supported, with each object represented by a row in a table or list and modified via cell components or a dedicated popup form (leveraging the nested form support).</li>
            </UnorderedList>
        </>
    )
}


