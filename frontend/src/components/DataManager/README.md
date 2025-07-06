# Data Management System

## Overview

The Data Management System provides a comprehensive interface for managing your portfolio's JSON data files and media assets. It includes schema validation, relationship management, and image optimization.

## Features

### 🎯 **JSON Data Editor**
- **Schema-validated forms** for all JSON files
- **Real-time validation** with error highlighting
- **Array dialogs** for relationship management
- **Auto-completion** and suggestions

### 📁 **Image Upload System**
- **Drag & drop interface** for easy uploads
- **Automatic optimization** (WebP conversion, resizing)
- **Project association** with metadata
- **Organized file structure** in `src/assets/images/`

### 🔗 **Relationship Management**
- **Cross-reference validation** between JSON files
- **Array dialogs** for managing IDs
- **Auto-completion** for existing relationships
- **Validation** to prevent orphaned references

## Access

Navigate to `/admin/data` to access the Data Manager.

## Data Structure

### Projects (`projects.json`)
```json
{
  "id": "project-slug",
  "title": "Project Title",
  "slug": "project-slug",
  "subtitle": "Project subtitle",
  "description": "Project description",
  "year": 2025,
  "typeIds": ["type-1", "type-2"],
  "toolIds": ["tool-1", "tool-2"],
  "tagIds": ["tag-1", "tag-2"],
  "mediaIds": ["media-1", "media-2"],
  "linkIds": ["link-1", "link-2"],
  "highlight": true,
  "emotion": "electrified nostalgia",
  "status": "completed",
  "difficulty": "intermediate"
}
```

### Types (`types.json`)
```json
{
  "id": "type-slug",
  "label": "Type Label",
  "description": "Type description",
  "category": "creative",
  "icon": "🎨",
  "color": "#FF6B6B",
  "priority": 1
}
```

### Skills (`skills.json`)
```json
{
  "category": "Development",
  "description": "Programming skills",
  "icon": "💻",
  "color": "#4ECDC4",
  "skills": [
    {
      "id": "skill-slug",
      "name": "Skill Name",
      "level": 85,
      "description": "Skill description"
    }
  ]
}
```

### Tags (`tags.json`)
```json
{
  "id": "tag-slug",
  "label": "Tag Label",
  "description": "Tag description",
  "category": "technology",
  "icon": "⚡",
  "color": "#FFEAA7"
}
```

### Media (`media.json`)
```json
{
  "id": "media-slug",
  "filename": "image-1234567890.webp",
  "path": "/uploads/project-slug/",
  "description": "Image description",
  "alt": "Alt text for accessibility",
  "dimensions": {
    "width": 800,
    "height": 600
  },
  "type": "image",
  "format": "webp",
  "size": "245KB",
  "project": "project-slug",
  "category": "thumbnail"
}
```

### Links (`links.json`)
```json
{
  "id": "link-slug",
  "label": "Link Label",
  "url": "https://example.com",
  "type": "demo",
  "icon": "🌐",
  "project": "project-slug"
}
```

## Usage Guide

### 1. **Editing JSON Data**

1. Navigate to the Data Manager (`/admin/data`)
2. Select the data type you want to edit (Projects, Types, Skills, etc.)
3. Use the JSON editor to modify the data
4. Click "Save" to validate and save changes
5. Use "Validate All Data" to check for errors

### 2. **Managing Relationships**

When editing projects:
- Use the **Array Selectors** to choose related items
- Search through available options
- See selected items as tags
- Remove items by clicking the ✕ button

### 3. **Uploading Images**

1. Go to the "Image Upload" tab
2. Select the project to associate images with
3. Drag & drop images or click "Choose Files"
4. Images are automatically:
   - Converted to WebP format
   - Resized to max 1200px width
   - Optimized for web
   - Saved to the appropriate project folder
   - Added to the media.json file

### 4. **Best Practices**

#### **Naming Conventions**
- Use kebab-case for IDs and slugs
- Keep titles concise but descriptive
- Use meaningful descriptions

#### **Image Optimization**
- Upload high-quality source images
- System automatically optimizes for web
- Use descriptive filenames
- Add meaningful alt text

#### **Relationship Management**
- Always validate data after changes
- Check for orphaned references
- Use consistent naming patterns
- Keep relationships minimal but meaningful

## Validation Rules

### Projects
- **Required fields**: id, title, slug, subtitle, description, year
- **ID pattern**: `^[a-z0-9-]+$`
- **Year range**: 2000-2030
- **Array limits**: 
  - typeIds: 1-5 items
  - toolIds: 1-20 items
  - tagIds: 1-10 items
  - mediaIds: 1-20 items
  - linkIds: 0-10 items

### Types
- **Required fields**: id, label
- **ID pattern**: `^[a-z0-9-]+$`
- **Color format**: Valid hex color
- **Priority**: Integer 1-100

### Skills
- **Required fields**: id, name, level
- **Level range**: 0-100
- **Description**: Optional but recommended

### Tags
- **Required fields**: id, label
- **ID pattern**: `^[a-z0-9-]+$`
- **Color format**: Valid hex color

### Media
- **Required fields**: id, filename, path, project
- **ID pattern**: `^[a-z0-9-]+$`
- **Size format**: "XXXKB" or "X.XMB"
- **Dimensions**: width and height as integers

## File Structure

```
src/
├── data/
│   ├── projects.json
│   ├── types.json
│   ├── skills.json
│   ├── tags.json
│   ├── media.json
│   ├── links.json
│   └── about.json
├── assets/
│   └── images/
│       ├── astronova-asteroids/
│       ├── cartas-del-deseo/
│       ├── nova-writers-conspiracy/
│       └── ...
└── schemas/
    ├── projects.schema.json
    ├── types.schema.json
    ├── skills.schema.json
    ├── tags.schema.json
    ├── media.schema.json
    ├── links.schema.json
    └── about.schema.json
```

## Troubleshooting

### Common Issues

1. **Validation Errors**
   - Check required fields are filled
   - Verify ID patterns match `^[a-z0-9-]+$`
   - Ensure array limits are respected
   - Check for orphaned references

2. **Image Upload Issues**
   - Ensure project is selected before upload
   - Check file format (JPG, PNG, WebP supported)
   - Verify file size (max 10MB recommended)
   - Check browser console for errors

3. **Relationship Issues**
   - Verify referenced IDs exist in other files
   - Check for typos in IDs
   - Ensure consistent naming patterns
   - Use the validation tool to find orphaned references

### Performance Tips

1. **Image Optimization**
   - Upload images at 2x the display size
   - Use WebP format when possible
   - Compress images before upload
   - Use descriptive filenames

2. **Data Management**
   - Validate data regularly
   - Keep JSON files organized
   - Use consistent naming conventions
   - Document complex relationships

## Security Considerations

- The Data Manager is currently frontend-only
- In production, implement proper authentication
- Add backend validation for all operations
- Implement proper file upload security
- Add rate limiting for uploads
- Validate all user inputs server-side

## Future Enhancements

1. **Backend Integration**
   - API endpoints for data operations
   - Database storage for better performance
   - Real-time collaboration features

2. **Advanced Features**
   - Bulk import/export functionality
   - Version control for data changes
   - Advanced image editing tools
   - Automated backup system

3. **User Experience**
   - Drag & drop reordering
   - Bulk editing capabilities
   - Advanced search and filtering
   - Keyboard shortcuts

## Support

For issues or questions:
1. Check the validation results
2. Review the console for errors
3. Verify file permissions
4. Check network connectivity
5. Contact the development team 