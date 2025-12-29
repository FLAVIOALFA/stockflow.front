import fs from 'fs';
import { execSync } from 'child_process';

const URL = 'http://localhost:1337/documentation';

async function main() {
  try {
    console.log(`Fetching documentation from ${URL}...`);
    const response = await fetch(URL);
    const text = await response.text();

    const startMarker = 'spec: ';
    const endMarker = 'dom_id:';
    
    const startIndex = text.indexOf(startMarker);
    if (startIndex === -1) {
        console.error('HTML Content snippet:', text.slice(0, 500));
        throw new Error('Could not find "spec: " marker in the response');
    }
    
    const searchStartIndex = startIndex + startMarker.length;
    let endIndexMarker = text.indexOf(endMarker, searchStartIndex);
    
    if (endIndexMarker === -1) {
        // Fallback: maybe it's not 'dom_id:' but 'url:' or something else?
        // But based on observation it was dom_id.
        throw new Error('Could not find "dom_id:" marker in the response');
    }

    // The text between spec: and dom_id:
    // It usually ends with "}," followed by newlines and spaces.
    let jsonString = text.substring(searchStartIndex, endIndexMarker).trim();
    
    // Remove the trailing comma if it exists
    if (jsonString.endsWith(',')) {
      jsonString = jsonString.slice(0, -1);
    }

    // Verify if valid JSON
    try {
      JSON.parse(jsonString);
    } catch (e) {
      console.error('Extracted JSON is invalid.');
      console.error('Snippet start:', jsonString.slice(0, 100));
      console.error('Snippet end:', jsonString.slice(-100));
      throw new Error('JSON parsing failed');
    }

    console.log('Swagger JSON extracted successfully.');
    fs.writeFileSync('temp-swagger.json', jsonString);

    console.log('Generating types...');
    execSync('npx openapi-typescript temp-swagger.json -o src/types/api.ts', { stdio: 'inherit' });
    
    fs.unlinkSync('temp-swagger.json');
    console.log('Types generated at src/types/api.ts');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
