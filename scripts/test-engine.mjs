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

console.log("=== Testing ScholarMatch Core Normalization & Rules ===");
const tests = [
  { name: '4.0 scale', input: [3.8, '4.0'], expected: 3.8 },
  { name: '5.0 scale', input: [4.5, '5.0'], expected: 3.6 },
  { name: '10.0 scale', input: [8.5, '10.0'], expected: 3.4 },
  { name: '100% scale', input: [92, '100%'], expected: 4.0 },
];

let allPassed = true;
tests.forEach(t => {
  const result = normalizeGpaTo4Scale(t.input[0], t.input[1]);
  const pass = Math.abs(result - t.expected) < 0.001;
  console.log(`[${pass ? 'PASS' : 'FAIL'}] ${t.name}: input=${t.input} got=${result} expected=${t.expected}`);
  if (!pass) allPassed = false;
});

console.log(`\nResult: ${allPassed ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'}`);
process.exit(allPassed ? 0 : 1);
