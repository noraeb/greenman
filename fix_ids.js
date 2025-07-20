import fs from 'fs';

// Read the lineup JSON file
let lineupData;
try {
  const data = fs.readFileSync('data/line_up.json', 'utf8');
  lineupData = JSON.parse(data);
} catch (error) {
  console.error('Error reading lineup file:', error);
  process.exit(1);
}

console.log(`Original lineup has ${lineupData.lineup.length} artists`);

// Fix the IDs to be sequential
lineupData.lineup = lineupData.lineup.map((artist, index) => {
  const oldId = artist.id;
  const newId = index + 1;

  if (oldId !== newId) {
    console.log(`Fixed ID: "${artist.artist}" - ${oldId} → ${newId}`);
  }

  return {
    ...artist,
    id: newId,
  };
});

console.log(`\nFixed ${lineupData.lineup.length} artist IDs to be sequential`);

// Write the corrected data back to the file
try {
  fs.writeFileSync('data/line_up.json', JSON.stringify(lineupData, null, 2));
  console.log('\n✅ Successfully updated line_up.json with sequential IDs');
} catch (error) {
  console.error('Error writing file:', error);
  process.exit(1);
}

// Verify the fix
console.log('\n📋 Verification:');
const hasSequentialIds = lineupData.lineup.every(
  (artist, index) => artist.id === index + 1,
);
console.log(
  `Sequential IDs: ${hasSequentialIds ? '✅ Correct' : '❌ Still incorrect'}`,
);
console.log(`First artist ID: ${lineupData.lineup[0]?.id}`);
console.log(
  `Last artist ID: ${lineupData.lineup[lineupData.lineup.length - 1]?.id}`,
);
console.log(`Expected last ID: ${lineupData.lineup.length}`);
