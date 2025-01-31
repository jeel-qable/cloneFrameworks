import * as fs from 'fs';
import * as path from 'path';
 
// Function to load environment variables from env.txt
function loadEnvVars(): { [key: string]: string } {
  // const envFilePath = path.join(__dirname, '../../env.txt');
  const envFilePath = './.env.txt';  
  const envVars: { [key: string]: string } = {};
  try {
    const data = fs.readFileSync(envFilePath, 'utf8');
    const lines = data.split('\n');
   
    lines.forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        envVars[key.trim()] = value.trim();
      }
    });
    return envVars;  
  } catch (err) {
    console.error('Error reading env.txt file:', err);
    throw err;
  }
}
 
// Function to load and replace variables in a test data file
function loadAndReplaceTestData(fileName: string): any {

  // const filePath = path.join(__dirname,'../../testdata', fileName); 

  const filePath = `./testdata/${fileName}`; 
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(data);  
    const envVars = loadEnvVars();
    return replaceVariablesInObject(jsonData, envVars);
  } catch (err) {
    console.error(`Error reading or parsing the test data file ${fileName}:`, err);
    throw err;
  }
}
 
// Function to recursively replace variables in a JSON object
function replaceVariablesInObject(obj: any, envVars: { [key: string]: string }): any {
  const updatedObj = { ...obj };
  for (const [key, value] of Object.entries(updatedObj)) {
    if (typeof value === 'string') {
      updatedObj[key] = replaceVariables(value, envVars);  
    } else if (typeof value === 'object') {
      updatedObj[key] = replaceVariablesInObject(value, envVars);  
    }
  }
  return updatedObj;
}
 
// Helper function to replace variables in a string (e.g., {{username}} -> "Viral1010")
function replaceVariables(input: string, envVars: { [key: string]: string }): string {
  let updatedString = input;
  for (const [key, value] of Object.entries(envVars)) {
    const placeholder = `{{${key}}}`;
    updatedString = updatedString.replace(new RegExp(placeholder, 'g'), value);
  }
  return updatedString;
}
 
// Function to process all test data files in the testdata folder
function processAllTestDataFiles(): void {
  const testDataFolder = './testdata';

  // Get a list of all the JSON files in the testdata folder
  fs.readdir(testDataFolder, (err, files) => {
    if (err) {
      console.error('Error reading test data folder:', err);
      return;
    }
 
    // Filter out files that are not JSON files
    const jsonFiles = files.filter(file => file.endsWith('.json'));
 
    jsonFiles.forEach(fileName => {
      try {
        // Load and replace variables in each file
        const testData = loadAndReplaceTestData(fileName);
      } catch (error) {
        console.error(`Error processing file ${fileName}:`, error);
      }
    });
  });
}
 
// Call the function to process all files
processAllTestDataFiles();
 
export { loadAndReplaceTestData,processAllTestDataFiles };
 