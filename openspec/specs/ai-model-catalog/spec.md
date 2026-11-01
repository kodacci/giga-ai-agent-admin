# ai-model-catalog Specification

## Purpose

Gives admins a read-only view of the AI models the giga-ai-agent backend
currently exposes, including handling of fetching, error, and empty states.

## Requirements

### Requirement: Models page lists backend models
The system SHALL provide a page that retrieves the list of available AI models
from the giga-ai-agent backend models endpoint and displays every returned
model name verbatim, including vendor suffixes and preview variants.

#### Scenario: Backend returns a populated model list
- **WHEN** the models page loads and the backend responds with a list of models
- **THEN** every model in the response is displayed with its exact name from
  the response, unmodified

#### Scenario: Navigating to the models section
- **WHEN** the user opens the models section (via navigation or direct URL)
- **THEN** the system requests the model list from the backend over the
  relative `/api/...` path without hardcoded absolute host URLs

### Requirement: Loading state
While the model list is being fetched, the page SHALL show a loading indicator
and SHALL NOT show an empty or stale model list in place of content.

#### Scenario: Request in flight
- **WHEN** the models page has started fetching but no response has arrived
- **THEN** a loading indicator is visible and no model entries are rendered

### Requirement: Error state with retry
If fetching the model list fails (network error or non-success response), the
page SHALL display an error message and a retry affordance, and activating
retry SHALL fetch the list again.

#### Scenario: Request fails
- **WHEN** the backend request fails or returns a non-success status
- **THEN** an error message is shown along with a retry control, and no model
  entries are rendered

#### Scenario: Retry succeeds
- **WHEN** the user activates retry and the backend responds successfully
- **THEN** the model list is displayed normally

### Requirement: Empty state
If the backend responds with an empty model list, the page SHALL display an
explicit "no models" message instead of an unexplained blank area.

#### Scenario: Backend returns zero models
- **WHEN** the models endpoint responds successfully with an empty list
- **THEN** an explicit message stating that no models are available is shown

### Requirement: Grouping by model kind
The page SHALL present chat models and embedding models as separate, labeled
groups, classifying a model as an embedding model when its name contains
"embedding" (case-insensitive) and as a chat model otherwise.

#### Scenario: Mixed list returned
- **WHEN** the response contains both chat and embedding models
- **THEN** each model appears under the group matching its classification and
  each group is labeled

### Requirement: Read-only presentation
The models page SHALL NOT provide any control that modifies backend state; it
only displays the retrieved list.

#### Scenario: Page rendered with models
- **WHEN** the models page displays any content
- **THEN** no create, edit, enable, disable, or delete actions are offered
