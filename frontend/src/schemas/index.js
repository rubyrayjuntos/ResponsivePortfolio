// Portfolio Data Schema Validation
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

// Import all schemas
import projectsSchema from './projects.schema.json';
import aboutSchema from './about.schema.json';
import skillsSchema from './skills.schema.json';
import tagsSchema from './tags.schema.json';
import typesSchema from './types.schema.json';
import mediaSchema from './media.schema.json';
import linksSchema from './links.schema.json';

// Initialize AJV with formats
const ajv = new Ajv({
  allErrors: true,
  verbose: true,
  strict: false
});
addFormats(ajv);

// Compile validators
const validators = {
  projects: ajv.compile(projectsSchema),
  about: ajv.compile(aboutSchema),
  skills: ajv.compile(skillsSchema),
  tags: ajv.compile(tagsSchema),
  types: ajv.compile(typesSchema),
  media: ajv.compile(mediaSchema),
  links: ajv.compile(linksSchema)
};

/**
 * Validate portfolio data against schemas
 */
export const validateData = (data, type) => {
  const validator = validators[type];
  if (!validator) {
    throw new Error(`Unknown schema type: ${type}`);
  }

  const isValid = validator(data);
  return {
    isValid,
    errors: validator.errors || []
  };
};

/**
 * Validate all portfolio data files
 */
export const validateAllData = async () => {
  const results = {};
  
  try {
    // Import data files
    const projectsData = await import('../data/projects.json');
    const aboutData = await import('../data/about.json');
    const skillsData = await import('../data/skills.json');
    const tagsData = await import('../data/tags.json');
    const typesData = await import('../data/types.json');
    const mediaData = await import('../data/media.json');
    const linksData = await import('../data/links.json');

    // Validate each data file
    results.projects = validateData(projectsData, 'projects');
    results.about = validateData(aboutData, 'about');
    results.skills = validateData(skillsData, 'skills');
    results.tags = validateData(tagsData, 'tags');
    results.types = validateData(typesData, 'types');
    results.media = validateData(mediaData, 'media');
    results.links = validateData(linksData, 'links');

    // Overall validation result
    results.isValid = Object.values(results).every(result => 
      result.isValid !== undefined ? result.isValid : true
    );

    return results;
  } catch (error) {
    console.error('Error validating data:', error);
    return {
      isValid: false,
      error: error.message
    };
  }
};

/**
 * Get validation errors summary
 */
export const getValidationSummary = (validationResults) => {
  const summary = {
    totalFiles: 0,
    validFiles: 0,
    invalidFiles: 0,
    totalErrors: 0,
    errorsByFile: {}
  };

  Object.entries(validationResults).forEach(([file, result]) => {
    if (result.isValid !== undefined) {
      summary.totalFiles++;
      
      if (result.isValid) {
        summary.validFiles++;
      } else {
        summary.invalidFiles++;
        summary.errorsByFile[file] = result.errors || [];
        summary.totalErrors += (result.errors || []).length;
      }
    }
  });

  return summary;
};

/**
 * Validate specific data type
 */
export const validateDataType = (data, type) => {
  return validateData(data, type);
};

/**
 * Get schema for a specific type
 */
export const getSchema = (type) => {
  const schemas = {
    projects: projectsSchema,
    about: aboutSchema,
    skills: skillsSchema,
    tags: tagsSchema,
    types: typesSchema,
    media: mediaSchema,
    links: linksSchema
  };
  
  return schemas[type];
};

/**
 * List all available schema types
 */
export const getSchemaTypes = () => {
  return Object.keys(validators);
};

export default {
  validateData,
  validateAllData,
  validateDataType,
  getValidationSummary,
  getSchema,
  getSchemaTypes,
  validators
}; 