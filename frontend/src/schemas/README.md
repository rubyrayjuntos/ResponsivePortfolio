# JSON Schemas for Portfolio Data

This directory contains JSON Schema definitions for all portfolio data structures, ensuring type safety, validation, and consistent data formats.

## 📁 Schema Files

### `projects.schema.json`
Defines the structure for project data including:
- **Required fields**: `id`, `title`, `slug`, `subtitle`, `description`, `year`, `type`, `tools`, `tags`, `media`, `links`
- **Optional fields**: `highlight`, `emotion`, `status`, `difficulty`, `collaborators`, `metrics`
- **Validation**: URL formats, year ranges, array limits, pattern matching

### `about.schema.json`
Defines personal/about information including:
- **Required fields**: `name`, `headline`, `bio`
- **Optional fields**: `avatar`, `contact`, `availability`, `resume`, `interests`, `education`, `experience`
- **Contact structure**: Email, phone, location, social media links

### `skills.schema.json`
Defines skills and expertise data including:
- **Required fields**: `category`, `skills` (array)
- **Skill properties**: `name`, `level` (0-100), optional metadata
- **Categories**: Digital Art, Development, Design, etc.

### `tags.schema.json`
Defines tag metadata and categorization including:
- **Required fields**: `tag`, `label`
- **Optional fields**: `emotion`, `visual`, `category`, `color`, `icon`, `priority`
- **Metadata**: Usage tracking, related tags, aliases

## 🚀 Usage

### Basic Import
```javascript
import { schemas, validateData } from '../schemas';

// Validate project data
const validation = validateData(projectData, 'projects');
```

### Type Definitions
```javascript
import { types } from '../schemas';

// Type definitions for TypeScript support
const Project = types.Project;
const About = types.About;
```

### Schema Access
```javascript
import { getSchema, getAllSchemas } from '../schemas';

// Get specific schema
const projectsSchema = getSchema('projects');

// Get all schemas
const allSchemas = getAllSchemas();
```

## 🔧 Validation Features

### Data Validation
- **Type checking**: Ensures correct data types
- **Required fields**: Validates mandatory properties
- **Format validation**: URLs, emails, dates, colors
- **Range validation**: Numbers within specified bounds
- **Pattern matching**: String formats (slugs, IDs)

### Schema Features
- **Descriptions**: Detailed field documentation
- **Enums**: Restricted value sets for categories
- **Defaults**: Default values for optional fields
- **Patterns**: Regex validation for IDs and formats
- **Nested objects**: Complex data structures

## 📋 Field Specifications

### Project Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✅ | Unique identifier (kebab-case) |
| `title` | string | ✅ | Project title (1-100 chars) |
| `slug` | string | ✅ | URL-friendly identifier |
| `subtitle` | string | ✅ | Brief description (1-200 chars) |
| `description` | string | ✅ | Detailed description (10-1000 chars) |
| `year` | integer | ✅ | Completion year (2000-2030) |
| `type` | array | ✅ | Project categories (1-5 items) |
| `tools` | array | ✅ | Technologies used (1-20 items) |
| `tags` | array | ✅ | Searchable tags (1-10 items) |
| `media` | object | ✅ | Images and media |
| `links` | object | ✅ | Demo, GitHub, docs URLs |
| `highlight` | boolean | ❌ | Featured project flag |
| `emotion` | string | ❌ | Emotional descriptor |

### About Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | Full name (1-100 chars) |
| `headline` | string | ✅ | Professional tagline (1-200 chars) |
| `bio` | string | ✅ | Biography (10-1000 chars) |
| `avatar` | string | ❌ | Profile image URL |
| `contact` | object | ❌ | Contact information |
| `availability` | boolean | ❌ | Work availability status |

### Skills Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `category` | string | ✅ | Skill category name |
| `skills` | array | ✅ | Skills in category |
| `name` | string | ✅ | Skill name |
| `level` | integer | ✅ | Proficiency (0-100) |
| `description` | string | ❌ | Skill description |
| `years` | integer | ❌ | Years of experience |

### Tags Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `tag` | string | ✅ | Unique identifier |
| `label` | string | ✅ | Human-readable name |
| `emotion` | string | ❌ | Emotional descriptor |
| `visual` | string | ❌ | Visual description |
| `category` | string | ❌ | Tag category |
| `color` | string | ❌ | Hex color code |

## 🛠️ Development

### Adding New Fields
1. Update the appropriate schema file
2. Add validation rules and descriptions
3. Update the `types` object in `index.js`
4. Test with sample data

### Schema Validation
```javascript
// Example validation
const project = {
  id: "my-project",
  title: "My Project",
  // ... other required fields
};

const result = validateData(project, 'projects');
console.log(result.isValid); // true/false
console.log(result.errors); // validation errors
```

### Extending Schemas
```javascript
// Add custom validation
export const validateProject = (project) => {
  const baseValidation = validateData(project, 'projects');
  
  // Custom business logic
  if (project.year > new Date().getFullYear()) {
    baseValidation.errors.push('Project year cannot be in the future');
    baseValidation.isValid = false;
  }
  
  return baseValidation;
};
```

## 📚 Best Practices

### Data Structure
- Use consistent naming conventions (kebab-case for IDs)
- Include descriptive field names
- Provide meaningful descriptions
- Set appropriate validation rules

### Validation
- Validate data on import/load
- Provide clear error messages
- Handle optional fields gracefully
- Test with edge cases

### Documentation
- Keep schemas well-documented
- Update README when adding fields
- Include examples in comments
- Maintain type definitions

## 🔗 Related Files

- `../data/projects.json` - Project data
- `../data/about.json` - About data
- `../data/skills.json` - Skills data
- `../data/tags.json` - Tags data

## 📝 Notes

- Schemas use JSON Schema Draft-07
- All URLs should be valid URIs
- Color codes should be hex format (#RRGGBB)
- Dates should be ISO format (YYYY-MM-DD)
- IDs should be URL-safe (kebab-case) 