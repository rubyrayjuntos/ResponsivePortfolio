// Test utility for normalized portfolio data
import { validateRelationships, getAllProjects, getAllTypes, getAllSkills, getAllTags } from './dataResolver.js';
import { validateAllData, getValidationSummary } from '../schemas/index.js';

/**
 * Test the normalized data structure
 */
export const testNormalizedData = async () => {
  console.log('🧪 Testing Normalized Portfolio Data Structure...\n');

  const results = {
    validation: null,
    relationships: null,
    dataAccess: null,
    summary: null
  };

  try {
    // 1. Schema Validation
    console.log('📋 1. Validating JSON Schemas...');
    results.validation = await validateAllData();
    const summary = getValidationSummary(results.validation);
    results.summary = summary;
    
    console.log(`   ✅ Valid files: ${summary.validFiles}/${summary.totalFiles}`);
    console.log(`   ❌ Invalid files: ${summary.invalidFiles}`);
    console.log(`   🔍 Total errors: ${summary.totalErrors}`);
    
    if (summary.totalErrors > 0) {
      console.log('   📝 Errors by file:');
      Object.entries(summary.errorsByFile).forEach(([file, errors]) => {
        console.log(`      ${file}: ${errors.length} errors`);
        errors.forEach(error => {
          console.log(`        - ${error.message}`);
        });
      });
    }

    // 2. Relationship Validation
    console.log('\n🔗 2. Validating Data Relationships...');
    results.relationships = validateRelationships();
    
    if (results.relationships.isValid) {
      console.log('   ✅ All relationships are valid');
    } else {
      console.log('   ❌ Relationship errors found:');
      results.relationships.errors.forEach(error => {
        console.log(`      - ${error}`);
      });
    }
    
    if (results.relationships.warnings.length > 0) {
      console.log('   ⚠️  Relationship warnings:');
      results.relationships.warnings.forEach(warning => {
        console.log(`      - ${warning}`);
      });
    }

    // 3. Data Access Testing
    console.log('\n📊 3. Testing Data Access Functions...');
    results.dataAccess = {
      projects: getAllProjects(),
      types: getAllTypes(),
      skills: getAllSkills(),
      tags: getAllTags()
    };

    console.log(`   ✅ Projects: ${results.dataAccess.projects.length}`);
    console.log(`   ✅ Types: ${results.dataAccess.types.length}`);
    console.log(`   ✅ Skills: ${results.dataAccess.skills.length}`);
    console.log(`   ✅ Tags: ${results.dataAccess.tags.length}`);

    // 4. Project Resolution Testing
    console.log('\n🔍 4. Testing Project Resolution...');
    const testProject = results.dataAccess.projects[0];
    if (testProject) {
      console.log(`   📁 Testing project: ${testProject.title}`);
      console.log(`      Types: ${testProject.types.length}`);
      console.log(`      Tools: ${testProject.tools.length}`);
      console.log(`      Tags: ${testProject.tags.length}`);
      console.log(`      Media: ${testProject.media.length}`);
      console.log(`      Links: ${testProject.links.length}`);
    }

    // 5. Summary
    console.log('\n📈 5. Data Structure Summary...');
    const totalRelationships = results.dataAccess.projects.reduce((total, project) => {
      return total + 
        (project.typeIds?.length || 0) +
        (project.toolIds?.length || 0) +
        (project.tagIds?.length || 0) +
        (project.mediaIds?.length || 0) +
        (project.linkIds?.length || 0);
    }, 0);

    console.log(`   📊 Total relationships: ${totalRelationships}`);
    console.log(`   🎯 Average relationships per project: ${(totalRelationships / results.dataAccess.projects.length).toFixed(1)}`);
    
    // Check for orphaned references
    const orphanedCount = results.relationships.errors.length + results.relationships.warnings.length;
    console.log(`   🔗 Orphaned references: ${orphanedCount}`);

    // Overall result
    const isOverallValid = summary.validFiles === summary.totalFiles && 
                          results.relationships.isValid && 
                          orphanedCount === 0;
    
    console.log(`\n${isOverallValid ? '✅' : '❌'} Overall Status: ${isOverallValid ? 'VALID' : 'INVALID'}`);
    
    return {
      isValid: isOverallValid,
      results,
      summary
    };

  } catch (error) {
    console.error('❌ Test failed:', error);
    return {
      isValid: false,
      error: error.message
    };
  }
};

/**
 * Test specific data relationships
 */
export const testDataRelationships = () => {
  console.log('🔗 Testing Specific Data Relationships...\n');

  const { getAllProjects, getAllTypes, getAllSkills, getAllTags } = require('./dataResolver.js');
  
  const projects = getAllProjects();
  const types = getAllTypes();
  const skills = getAllSkills();
  const tags = getAllTags();

  // Test type references
  const typeIds = new Set(types.map(t => t.id));
  const referencedTypeIds = new Set();
  
  projects.forEach(project => {
    project.typeIds?.forEach(id => referencedTypeIds.add(id));
  });

  const orphanedTypes = [...typeIds].filter(id => !referencedTypeIds.has(id));
  const missingTypes = [...referencedTypeIds].filter(id => !typeIds.has(id));

  console.log(`📋 Types: ${types.length} defined, ${referencedTypeIds.size} referenced`);
  if (orphanedTypes.length > 0) {
    console.log(`   ⚠️  Orphaned types: ${orphanedTypes.join(', ')}`);
  }
  if (missingTypes.length > 0) {
    console.log(`   ❌ Missing types: ${missingTypes.join(', ')}`);
  }

  // Test skill references
  const skillIds = new Set(skills.map(s => s.id));
  const referencedSkillIds = new Set();
  
  projects.forEach(project => {
    project.toolIds?.forEach(id => referencedSkillIds.add(id));
  });

  const orphanedSkills = [...skillIds].filter(id => !referencedSkillIds.has(id));
  const missingSkills = [...referencedSkillIds].filter(id => !skillIds.has(id));

  console.log(`🛠️  Skills: ${skills.length} defined, ${referencedSkillIds.size} referenced`);
  if (orphanedSkills.length > 0) {
    console.log(`   ⚠️  Orphaned skills: ${orphanedSkills.join(', ')}`);
  }
  if (missingSkills.length > 0) {
    console.log(`   ❌ Missing skills: ${missingSkills.join(', ')}`);
  }

  return {
    types: { orphaned: orphanedTypes, missing: missingTypes },
    skills: { orphaned: orphanedSkills, missing: missingSkills }
  };
};

/**
 * Generate data statistics
 */
export const generateDataStats = () => {
  const { getAllProjects, getAllTypes, getAllSkills, getAllTags } = require('./dataResolver.js');
  
  const projects = getAllProjects();
  const types = getAllTypes();
  const skills = getAllSkills();
  const tags = getAllTags();

  return {
    projects: {
      total: projects.length,
      highlighted: projects.filter(p => p.highlight).length,
      byStatus: projects.reduce((acc, p) => {
        acc[p.status] = (acc[p.status] || 0) + 1;
        return acc;
      }, {}),
      byDifficulty: projects.reduce((acc, p) => {
        acc[p.difficulty] = (acc[p.difficulty] || 0) + 1;
        return acc;
      }, {})
    },
    types: {
      total: types.length,
      byCategory: types.reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + 1;
        return acc;
      }, {})
    },
    skills: {
      total: skills.length,
      byCategory: skills.reduce((acc, s) => {
        const category = s.category || 'uncategorized';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {})
    },
    tags: {
      total: tags.length,
      byCategory: tags.reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + 1;
        return acc;
      }, {})
    }
  };
};

export default {
  testNormalizedData,
  testDataRelationships,
  generateDataStats
}; 