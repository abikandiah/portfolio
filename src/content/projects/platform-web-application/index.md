---
name: Platform Web Application
type: Work
startYear: 2018
endYear: 2025
description: A React-based management console for the Java backend, enabling users to create, schedule, and submit eDiscovery workflows for processing.
tech: [JavaScript, React, ReactRedux, ReactRouter, WebWorkers, OIDC, SASS]
related: [java-to-react-form-builder, data-upload]
---

## Overview

This web application is the user interface for an enterprise automation platform, providing complete end-to-end system management. Built as a scalable **React Single-Page Application (SPA)** utilizing a custom abstraction framework, the frontend offers a centralized management console.

This console enables users to:

- Design, schedule, and monitor custom workflows.
- Manage core data models (clients/matters) and third-party integrations.
- Administrate system configuration and user access policies.

## The Framework

The framework defines a pattern for integrating backend data models into the frontend application. It standardizes common frontend concerns, offering built-in support for:

:::terms

- **State Management**: Supports querying, polling, and global tracking of application data.
- **Data Operations**: Full CRUD (Create, Read, Update, Delete) functionality.
- **Component Ecosystem**: A suite of custom components, hooks, and utility functions to aid development.

:::

It's built with three main libraries:

:::terms

- **React**: For the user interface, components, and styling (leveraging **SASS** as the CSS pre-processor).
- **React-Redux**: Provides global state management across the application.
- **Redux-Sagas**: For defining and managing complex, asynchronous logic and side-effects.

:::

This pattern is built around two essential abstract classes: The **Model** class and the **ModelSaga** class.

### Model Class

The Model class serves as the central definition for a backend data model within the frontend. It describes the class structure, its integration with Redux state management, and the list of available API endpoints.

```ts
class Model extends BaseModel {
	static actions: {}
	static actionCreators: {}
	static endpoints: {}
	static reducer: (state: {}, action: string) => {}

	id: string
	name: string
	description: string

	constructor(props: { [key: string]: any }) {
		super()
		this.id = props.id
		this.name = props.name
		this.description = props.description
	}
}
```

### Saga Class

The ModelSaga class is responsible for defining and managing all asynchronous user flow handlers for a data model. These handlers are implemented as Redux Saga functions and are triggered by specific Redux actions.

Its responsibilities encompass standard functions for data fetching and CRUD operations, as well as complex logic, such as coordinating multi-step guided job submissions.

```ts
class ModelSaga extends BaseSaga {
	*submit()
	*edit()
	*delete()
	*queryObjects()
	*pollObjects()
	*startGuidedJobSubmission()
	*validateForm()
}
```

:::note

Both Model and ModelSaga extend base classes that contain further abstractions. These base classes also serve as the base for other, specialized classes within the framework.

:::

### Component Ecosystem

The framework includes a suite of reusable components, custom hooks, and utility functions, designed to accelerate frontend development and maintain UI consistency. The components are utilized to construct core application views, including pages, popups, data tables, forms, and model-specific interfaces.

The custom hooks provide abstracted utility and logic across a wide range of needs, from standard input handling and local data fetching to more complex operations, such as virtualized rendering and component intersection observation.

```tsx
function SampleForm() {
	const state = useState(initialState)
	const inputHandler = useInputHandler()
	const submit = useSubmit()

	return (
		<Form>
			<FormHeader />
			<FormBody>
				<Dropdown />
				<Input />
				<TextArea />
				<Checkbox />
			</FormBody>
			<FormFooter />
		</Form>
	)
}
```

## Next, the Support

The framework supports other common operations, such as authentication, API requests, and page navigation.

### Authentication

Authentication is configurable and supports **username/password forms** or **third-party OIDC providers**.

- Upon successful login, the frontend receives a short-lived session token used for API authentication.
- ::redacted{lines=1}
- A refresh token is also utilized to automatically renew the session token at its half-life.

### API Requests

All API requests are made with **Axios** and are routed through a dedicated web worker for token isolation.

- This approach ensures that the session token resides only within the web worker, enhancing security.
- The communication flow—from the application to the Web Worker and subsequently to the backend—is fully handled using Promises.

### Page Navigation

Application navigation is managed using **React-Router**.
