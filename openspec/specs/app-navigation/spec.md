# app-navigation Specification

## Purpose

Provides a persistent top-level navigation shell so users can move between
admin sections and always know which section they are in.

## Requirements

### Requirement: Persistent header navigation
Every application page SHALL render a header containing a navigation entry for
each available section: at minimum "Home" and "AI Models".

#### Scenario: Header visible on a section page
- **WHEN** the user is on any application page
- **THEN** the header is displayed with an entry for Home and an entry for
  AI Models

#### Scenario: Selecting a navigation entry
- **WHEN** the user activates a navigation entry
- **THEN** the application shows the page for that section without a full
  browser reload

### Requirement: Active section indication
The header SHALL visually indicate which navigation entry corresponds to the
currently displayed route.

#### Scenario: Viewing the models section
- **WHEN** the current route is the models page
- **THEN** the AI Models entry is marked as active and Home is not

#### Scenario: Viewing the home section
- **WHEN** the current route is the home page
- **THEN** the Home entry is marked as active and AI Models is not

### Requirement: Deep-linkable sections
Each section SHALL be reachable by direct URL entry or browser refresh,
rendering the full page shell with navigation in its active state.

#### Scenario: Direct load of a section URL
- **WHEN** the user opens the models section URL directly in the browser
- **THEN** the models page renders inside the standard layout with the header
  navigation visible and AI Models marked active
