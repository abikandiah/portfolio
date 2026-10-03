---
name: Java-To-React Form Builder
type: Work
startYear: 2023
endYear: 2023
description: A form generation tool for rendering React forms for backend Java classes, removing the need to manually create forms.
tech: [Java, Dropwizard, React, JavaScript, SASS]
related: [platform-web-application]
---

## Overview

This feature enables automated form generation for Java classes via annotations and reflection. It uses Java reflection to process custom annotations (used to define form structure, field options, and all validation logic), converting them into form configuration objects. These objects are then consumed by a dedicated frontend form builder to dynamically render the final React form.

Its primary value is removing frontend development time and maintenance for backend model CRUD (Create, Read, Update, Delete) operations. By auto-generating forms for backend models, this feature creates a consistent and reliable form UI/UX.

The following advanced features are supported:

:::terms

- **Complex Layouts**: Support for grouping into rows, sections, and tables.
- **Advanced Validation**: Implements filters (min, max), custom regular expressions, and values list.
- **Dynamic Field Behavior**: Conditional logic for disabling, enabling, hiding, and showing fields based on user input.
- **Hierarchy Support**: Handling nested forms for complex object structures.

:::

### Workflow Builder

This tool was originally developed to auto-generate operation forms for a **Workflow Builder** component. Supporting over 200 operations—and more being added regularly—this tool is essential for scaling. It allows for the quick creation of fully functional operation forms directly from backend classes, reducing frontend development time and the overall number of components to manage.

## Java Form Blueprint

In Java's world, **annotations and reflection** are used to generate the form blueprint from the corresponding Java class. This blueprint serves as the single source of truth for form definition and is then delivered to the frontend via a dedicated REST endpoint. The form blueprint fully describes the structure of the form and the data model it represents.

### Annotations

Java annotations are used to describe the form structure and field options:

:::terms

- **Field Annotations**: Define which fields are included in the form, along with their individual properties (e.g., component type, value options, and validation rules).
- **Class Annotations**: Define the overall form structure, including layout (e.g., grouping and rows) and essential metadata.

:::

```java
@interface Field {
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
}
```

Most annotation settings are automatically determined via reflection, removing the need for explicit configuration. Settings like the form field name and component type are derived from the corresponding Java field name and type (e.g., a number input for a Java numeric type), simplifying the blueprint definition process.

:::note

Explicitly defined settings override reflection derived settings.

:::

### Reflection

Java reflection is used to parse class annotations, fields and metadata for building form blueprints. It is also used for implicitly deriving blueprint settings—such as mapping Java types (e.g., `List<String>`) to their specific component type (e.g., `InputList`), and determining default field values. These blueprints are then serialized and transmitted to the frontend for dynamic rendering by the React form builder component.

```java
@FormBlueprint
class Something {
    @Field
    String name;

    @Field(values=["a", "ab", "ba"])
    Enum type;

    @Field
    Boolean checked;
}
```

:::info

To ensure form consistency, form blueprints are created only for Java classes with the annotations correctly applied.

:::

## React Form Builder

The frontend takes the form blueprint delivered via the REST endpoint and passes it to the dedicated React form builder component. This builder constructs the form in two main phases:

:::steps

1. **Layout and Structure**: Fields are organized according to the blueprint's layout specifications, arranging them into grid-like patterns of rows and columns.
2. **Component Rendering**: Field components are rendered for the field configurations, applying default values, value restrictions (like regular expressions, allowed value lists, or min/max ranges), and dynamic validation handlers.

:::

### Form Capabilities

This tool is designed to handle complex data structures and behaviours:

:::terms

- **Dynamic Fields**: Fields can be conditionally rendered or disabled based on the values of other fields. For example, a checkbox value can be used to conditionally show or hide an entire group of related fields.
- **Nested Forms**: If a field's type is an annotated Java class (e.g., a `Client` object containing an `Address` object), it is dynamically rendered as a nested form using that class's own blueprint. There is no limitation on the depth of nesting, providing developers flexibility for hierarchical data modeling.
- **Collection Types**: Components for complex collection types, such as lists and tables, support adding, editing, and removing multiple values. Collections of other annotated Java classes (e.g., `List<Parameter>`) are fully supported, with each object represented by a row in a table or list and modified via cell components or a dedicated popup form (leveraging the nested form support).

:::
