---
name: Automated Translations
type: Work
startYear: 2019
endYear: 2019
description: A collection of scripts for automating the translation of frontend and backend language files.
tech: [Ruby, i18next, GoogleCloud]
---

## Overview

The automation platform uses internationalization (i18n) to provide multi-language support. All user-facing text is separated into dedicated language files: JSON for the frontend (using i18next) and Java properties for the backend. The base text is maintained in two master English files (one for each stack), and the correct locale is dynamically served based on user selection.

:::note

Users can select their preferred language via a dropdown option in the frontend and as a command-line parameter (or switch) in the backend.

:::

### Translation Script

To generate the translations, we developed an automated translation tool built as a Ruby script. This script performs as follows:

:::steps

1. It takes a master English file, target language, and an output filename as inputs.
2. It parses and submits the English text and target language to the Google Translate API for translation.
3. The resulting translations are then outputted as the corresponding target language file.

:::

To support both stacks, the translation script correctly parses and outputs the language files based on their required format: JSON for the frontend and properties files for the backend.

The tool includes two key resilience features: **Caching** is used to prevent unnecessary API calls and re-translations, while **Exponential Back-off** tolerates the Google Translate API's rate limits.

### Translation Batch

The translation process is managed by a batch file. This file first reads the list of target languages from a configuration file. It then calls the Ruby translation script for each one, specifying the correct output filename and format necessary for either the frontend or backend language files. Upon completion, the frontend and backend will each have a complete set of fully translated language files for all the target languages.

### Pipeline Batch

To ensure translation completeness, a secondary verification batch script is executed early in the CI/CD pipeline.

This verification script checks whether all target languages have corresponding, fully translated language files for both the frontend and backend. Its purpose is to catch missing translations before deployment. If any translations are found missing, it will fail the build, requiring a developer to run the translation batch script and commit the missing translations before proceeding.
