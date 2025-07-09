/**
 * Test Category Mapping
 * Run this in the browser console to test category mapping
 */

import { getAllProjects } from './dataResolver';
import { getProjectCategory, getProjectsByCategory, getCategoryStats, getProjectsByDirectCategory, getCategoryStatsDirect } from './categoryMapper';

// Test category mapping
const testCategoryMapping = () => {
  console.log('=== Testing Category Mapping ===');
  
  const allProjects = getAllProjects();
  console.log('Total projects:', allProjects.length);
  
  // Test direct category method
  console.log('\n=== DIRECT CATEGORY METHOD ===');
  allProjects.forEach(project => {
    console.log(`Project: "${project.title}"`);
    console.log(`  Direct Category: ${project.category?.toUpperCase() || 'UNDEFINED'}`);
    console.log('---');
  });
  
  // Test scoring method
  console.log('\n=== SCORING METHOD ===');
  allProjects.forEach(project => {
    const category = getProjectCategory(project);
    console.log(`Project: "${project.title}"`);
    console.log(`  Types: ${project.types.map(t => t.id).join(', ')}`);
    console.log(`  Tags: ${project.tags.map(t => t.label).join(', ')}`);
    console.log(`  Scored Category: ${category.category.toUpperCase()}`);
    console.log(`  Scores:`, category.scores);
    console.log(`  Confidence: ${(category.confidence * 100).toFixed(1)}%`);
    console.log('---');
  });
  
  // Compare both methods
  console.log('\n=== COMPARISON ===');
  allProjects.forEach(project => {
    const scoredCategory = getProjectCategory(project);
    const directCategory = project.category;
    const match = scoredCategory.category === directCategory;
    console.log(`"${project.title}":`);
    console.log(`  Direct: ${directCategory?.toUpperCase() || 'UNDEFINED'}`);
    console.log(`  Scored: ${scoredCategory.category.toUpperCase()}`);
    console.log(`  Match: ${match ? '✅' : '❌'}`);
    console.log('---');
  });
  
  // Test category filtering with direct method
  console.log('\n=== DIRECT CATEGORY FILTERING ===');
  ['art', 'code', 'writing'].forEach(category => {
    const projects = getProjectsByDirectCategory(allProjects, category);
    console.log(`${category.toUpperCase()} projects (${projects.length}):`);
    projects.forEach(project => {
      console.log(`  - ${project.title}`);
    });
    console.log('');
  });
  
  // Test category filtering with scoring method
  console.log('\n=== SCORING CATEGORY FILTERING ===');
  ['art', 'code', 'writing'].forEach(category => {
    const projects = getProjectsByCategory(allProjects, category);
    console.log(`${category.toUpperCase()} projects (${projects.length}):`);
    projects.forEach(project => {
      console.log(`  - ${project.title}`);
    });
    console.log('');
  });
  
  // Test category stats
  console.log('\n=== DIRECT CATEGORY STATS ===');
  const directStats = getCategoryStatsDirect(allProjects);
  console.log('Direct Category Statistics:', directStats);
  
  console.log('\n=== SCORING CATEGORY STATS ===');
  const scoringStats = getCategoryStats(allProjects);
  console.log('Scoring Category Statistics:', scoringStats);
};

// Export for browser console
if (typeof window !== 'undefined') {
  window.testCategoryMapping = testCategoryMapping;
  console.log('🧪 Test function available: testCategoryMapping()');
}

export default testCategoryMapping; 