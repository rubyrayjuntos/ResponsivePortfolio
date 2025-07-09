// assign_primary_category_tags.js
// Ensures every project in projects.json has exactly one of the three special tags (art, code, writing)

const fs = require('fs');
const path = require('path');

const PROJECTS_PATH = path.join(__dirname, '../frontend/src/data/projects.json');
const TAGS = ['art', 'code', 'writing'];

function getPrimaryTag(tagIds) {
  return TAGS.find(tag => tagIds.includes(tag));
}

function assignPrimaryTag(project) {
  // For demonstration, assign 'art' if missing. You can enhance this logic as needed.
  return 'art';
}

function main() {
  const data = JSON.parse(fs.readFileSync(PROJECTS_PATH, 'utf-8'));
  let changed = false;
  let summary = [];

  data.projects.forEach(project => {
    const currentPrimary = getPrimaryTag(project.tagIds || []);
    if (!currentPrimary) {
      const assigned = assignPrimaryTag(project);
      project.tagIds = Array.isArray(project.tagIds) ? [...project.tagIds, assigned] : [assigned];
      changed = true;
      summary.push(`Assigned '${assigned}' to project '${project.title}' (${project.id})`);
    } else {
      // Remove any extras if present
      const filtered = (project.tagIds || []).filter(tag => !TAGS.includes(tag) || tag === currentPrimary);
      if (filtered.length !== (project.tagIds || []).length) {
        project.tagIds = filtered;
        changed = true;
        summary.push(`Removed extra primary tags from project '${project.title}' (${project.id})`);
      }
    }
  });

  if (changed) {
    fs.writeFileSync(PROJECTS_PATH, JSON.stringify(data, null, 2));
    console.log('Updated projects.json with primary category tags.');
    summary.forEach(line => console.log(line));
  } else {
    console.log('All projects already have exactly one primary category tag.');
  }
}

main(); 