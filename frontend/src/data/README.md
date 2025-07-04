# Portfolio Data Structure

This directory contains the normalized data structure for the portfolio website. The data is organized into separate JSON files to reduce duplication and improve maintainability.

## File Structure

### Core Data Files
- `projects.json` - Project definitions with ID references
- `types.json` - Project type categories
- `skills.json` - Skills and tools organized by categories
- `tags.json` - Project tags with metadata
- `media.json` - Media assets and files
- `links.json` - External links and references
- `about.json` - Personal information (unchanged)

## Normalized Structure Benefits

### 1. **Reduced Duplication**
- Types, skills, tags, media, and links are defined once and referenced by ID
- Changes to shared data only need to be made in one place
- Consistent naming and metadata across all references

### 2. **Better Relationships**
- Clear relationships between projects and their components
- Easy to track which projects use which skills/tools
- Simple to add new relationships without duplicating data

### 3. **Improved Maintainability**
- Centralized data management
- Schema validation for all data types
- Easy to add new projects without touching existing data

### 4. **Enhanced Performance**
- Efficient lookup maps for fast data resolution
- Reduced bundle size through normalization
- Optimized filtering and search capabilities

## Data Relationships

```
Projects
├── typeIds → Types
├── toolIds → Skills
├── tagIds → Tags
├── mediaIds → Media
└── linkIds → Links
```

## Usage Examples

### Get All Projects with Resolved Data
```javascript
import { getAllProjects } from '../utils/dataResolver.js';

const projects = getAllProjects();
// Returns projects with fully resolved types, tools, tags, media, and links
```

### Filter Projects by Type
```javascript
import { getProjectsByFilter } from '../utils/dataResolver.js';

const gameProjects = getProjectsByFilter({ type: 'game-design' });
```

### Get Project by ID
```javascript
import { getProjectById } from '../utils/dataResolver.js';

const project = getProjectById('astronova-asteroids');
```

## Schema Validation

All data files are validated against JSON schemas:

```javascript
import { validateAllData } from '../schemas/index.js';

const validation = await validateAllData();
console.log(validation.isValid); // true/false
```

## Data Resolver Utilities

The `dataResolver.js` utility provides:

- **resolveProject()** - Resolve all relationships for a project
- **getAllProjects()** - Get all projects with resolved data
- **getProjectById()** - Get single project by ID
- **getProjectsByFilter()** - Filter projects by criteria
- **searchProjects()** - Search projects by text
- **validateRelationships()** - Check for orphaned references

## Migration from Old Structure

The new structure maintains backward compatibility through the resolver:

```javascript
// Old way (still works)
project.type // ['Game Design', 'Frontend Development']

// New way (resolved)
project.types // [{ id: 'game-design', label: 'Game Design', ... }]
```

## Adding New Data

### 1. Add New Project Type
```json
// types.json
{
  "id": "new-type",
  "label": "New Type",
  "description": "Description",
  "category": "creative"
}
```

### 2. Add New Skill
```json
// skills.json
{
  "id": "new-skill",
  "name": "New Skill",
  "level": 85,
  "description": "Description"
}
```

### 3. Reference in Project
```json
// projects.json
{
  "typeIds": ["new-type"],
  "toolIds": ["new-skill"]
}
```

## Testing

Run the data validation test:

```javascript
import { testNormalizedData } from '../utils/dataTest.js';

const result = await testNormalizedData();
console.log(result.isValid); // true/false
```

## Benefits Summary

✅ **No Duplication** - Each piece of data defined once  
✅ **Easy Updates** - Change shared data in one place  
✅ **Type Safety** - JSON schema validation  
✅ **Performance** - Efficient lookup maps  
✅ **Scalability** - Easy to add new data types  
✅ **Maintainability** - Clear structure and relationships  
✅ **Backward Compatible** - Legacy code still works  
✅ **Validation** - Comprehensive error checking 