---
name: Selenium E2E Test Suite
type: Work
startYear: 2019
endYear: 2025
description: A scalable end-to-end (E2E) test suite for validating web application user flows, executed as part of the CI/CD pipeline's test stage.
tech: [Java, Selenium, XPath, Jenkins, Fiddler]
related: [platform-web-application]
---

## Overview

This E2E test suite is the central validation tool for the entire web application.

It automates all core user flows and complex niche operations—such as a full end-to-end collection with the Microsoft eDiscovery platform—to proactively detect inconsistencies and regressions. Integrated directly into the CI/CD pipeline, it is a mandatory quality check that blocks deployment on failure. It has successfully prevented hundreds of bugs and complex race conditions.

Designed for scalability, the suite uses reusable Selenium components (e.g., dedicated classes for frontend components) and helper classes for efficient test creation as the application evolves. On failure, it provides debugging context by capturing application logs, network logs, and screenshots.

## Framework

The suite is implemented in Java leveraging Selenium for browser automation and XPath for element selection. The design promotes reusability by abstracting regular user actions into dedicated Selenium classes shared across the test suite. To enhance modularity and robustness, helper classes were introduced to simplify XPath usage and implement custom wait conditions. A foundational base test class defines a consistent pattern for all data model tests, specifying the test initialization logic, test patterns for standard CRUD operations, and test tear-down procedures.

### Reusable Classes

The **Page Object Model (POM)** was used to simplify test creation and maximize reusability, assigning a dedicated Selenium class to every frontend component. This approach abstracts low-level details, such as XPath logic and component behaviour, allowing tests to remain clean and interact with components—such as forms, views, inputs, and complex workflow submitters—by simply calling the relevant class. It was rare for a test to need any XPath interaction logic.

### Wait Conditions

Selenium includes a native frontend state validation mechanism called `ExpectedConditions`. This mechanism allows tests to query for components and wait a limited time for them to meet a specified state. We extended this core behavior by developing our own custom validation logic to provide more tailored and precise state checks as needed.

### Base E2E Test

The base E2E test class centralized the initialization and tear-down procedure for all end-to-end tests. To ensure a clean and consistent starting state, every test run followed the same sequence:

:::steps

1. **Initialization**: The web application platform is started and the databases are refreshed to a standard test configuration, preventing interference from previous tests.
2. **Execution**: Running the core test logic.
3. **Cleanup**: Tearing down the application and associated resources, such as the Fiddler network capture tool.

:::

Every data model had its own dedicated E2E test class that extended the base E2E class, ensuring strict isolation between models. Complex user flows were also housed in their own separate E2E test classes. Consequently, executing the full test suite would result in many cycles of initialization, execution, and resource tear-down.

### CI/CD Integration

This test suite found its golden place as part of the test stage in the Jenkins CI/CD pipeline. It acts as the central quality control gate and prevents all deployments on a single failure. To ensure fast feedback, the End-to-End (E2E) tests are executed in parallel.

On test failure, application logs, network logs, and screenshots are automatically captured and available for debugging and analysis.
