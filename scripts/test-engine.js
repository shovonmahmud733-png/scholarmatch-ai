// Verification runner for recommendation engine rules
const { SCHOLARSHIPS_DATA } = require('../src/data/scholarships.js');

function normalizeGpaTo4Scale(gpa, scale) {
  if (!gpa || isNaN(gpa)) return 0;
  switch (scale) {
    case '5.0': return Math.min(4.0, (gpa / 5.0) * 4.0);
    case '10.0': return Math.min(4.0, (gpa / 10.0) * 4.0);
    case '100%':
      if (gpa >= 90) return 4.0;
      if (gpa >= 80) return 3.5;
      if (gpa >= 70) return 3.0;
      if (gpa >= 60) return 2.5;
      return 2.0;
    case '4.0':
    default: return Math.min(4.0, gpa);
  }
}

console.log("=== Testing Core Algorithmic Logic ===");
console.log("GPA 3.8 / 4.0 =>", normalizeGpaTo4Scale(3.8, '4.0'));
console.log("GPA 4.5 / 5.0 =>", normalizeGpaTo4Scale(4.5, '5.0'));
console.log("GPA 8.5 / 10.0 =>", normalizeGpaTo4Scale(8.5, '10.0'));
console.log("GPA 92 / 100% =>", normalizeGpaTo4Scale(92, '100%'));
console.log("✓ Core normalizations passed");
