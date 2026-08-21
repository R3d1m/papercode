export interface HandwrittenSample {
  id: string;
  title: string;
  language: 'python' | 'javascript' | 'cpp';
  languageId: number;
  studentAuthor: string;
  schoolDistrict: string;
  notes: string;
  notebookLines: {
    lineNumber: number;
    handwrittenText: string;
    ocrCleanedText: string;
    confidence: number;
    boundingBox: { top: number; left: number; width: number; height: number };
  }[];
  rawCode: string;
  expectedOutput: string;
}

export const SAMPLE_HANDWRITTEN_NOTEBOOKS: HandwrittenSample[] = [
  {
    id: 'sample-py-fib',
    title: 'Python: Fibonacci & Multiples (Class 9 ICT Notebook)',
    language: 'python',
    languageId: 71,
    studentAuthor: 'Tanvir Hossain',
    schoolDistrict: 'Raozan, Chittagong',
    notes: 'Handwritten with 0.5mm Matador Pinpoint ballpoint pen on 60 GSM lined paper.',
    rawCode: `# Scanned from Class 9 ICT Notebook - Page 14
def fibonacci(n):
    a, b = 0, 1
    result = []
    for _ in range(n):
        result.append(a)
        a, b = b, a + b
    return result

print("PaperCode OCR Output:")
print("First 8 Fibonacci numbers:", fibonacci(8))
total = sum(fibonacci(8))
print("Sum of series:", total)`,
    expectedOutput: `PaperCode OCR Output:
First 8 Fibonacci numbers: [0, 1, 1, 2, 3, 5, 8, 13]
Sum of series: 33`,
    notebookLines: [
      { lineNumber: 1, handwrittenText: "# Scanned from Class 9 ICT Notebook - Page 14", ocrCleanedText: "# Scanned from Class 9 ICT Notebook - Page 14", confidence: 99, boundingBox: { top: 12, left: 10, width: 80, height: 6 } },
      { lineNumber: 2, handwrittenText: "def fibonacci(n):", ocrCleanedText: "def fibonacci(n):", confidence: 98, boundingBox: { top: 22, left: 10, width: 45, height: 6 } },
      { lineNumber: 3, handwrittenText: "    a, b = 0, 1", ocrCleanedText: "    a, b = 0, 1", confidence: 97, boundingBox: { top: 32, left: 18, width: 35, height: 6 } },
      { lineNumber: 4, handwrittenText: "    result = []", ocrCleanedText: "    result = []", confidence: 96, boundingBox: { top: 42, left: 18, width: 32, height: 6 } },
      { lineNumber: 5, handwrittenText: "    for _ in range(n):", ocrCleanedText: "    for _ in range(n):", confidence: 98, boundingBox: { top: 52, left: 18, width: 48, height: 6 } },
      { lineNumber: 6, handwrittenText: "        result.append(a)", ocrCleanedText: "        result.append(a)", confidence: 95, boundingBox: { top: 62, left: 26, width: 46, height: 6 } },
      { lineNumber: 7, handwrittenText: "        a, b = b, a + b", ocrCleanedText: "        a, b = b, a + b", confidence: 97, boundingBox: { top: 72, left: 26, width: 44, height: 6 } },
      { lineNumber: 8, handwrittenText: "    return result", ocrCleanedText: "    return result", confidence: 99, boundingBox: { top: 82, left: 18, width: 36, height: 6 } },
    ]
  },
  {
    id: 'sample-js-sum',
    title: 'JavaScript: Array Multiplier & Filter',
    language: 'javascript',
    languageId: 63,
    studentAuthor: 'Sumaiya Akter',
    schoolDistrict: 'Sunamganj, Sylhet',
    notes: 'Written on recycled spiral notebook during power outage.',
    rawCode: `// Scanned from Sylhet Govt Girls High School exercise
const marks = [45, 82, 91, 63, 77, 88];
const distinction = marks.filter(m => m >= 80);

console.log("=== PaperCode Mobile Execution ===");
console.log("All Marks:", marks);
console.log("Distinction Marks (>= 80):", distinction);
const avg = marks.reduce((a, b) => a + b, 0) / marks.length;
console.log("Class Average:", avg.toFixed(2));`,
    expectedOutput: `=== PaperCode Mobile Execution ===
All Marks: [ 45, 82, 91, 63, 77, 88 ]
Distinction Marks (>= 80): [ 82, 91, 88 ]
Class Average: 74.33`,
    notebookLines: [
      { lineNumber: 1, handwrittenText: "// Scanned from Sylhet Govt Girls High School exercise", ocrCleanedText: "// Scanned from Sylhet Govt Girls High School exercise", confidence: 98, boundingBox: { top: 12, left: 10, width: 85, height: 6 } },
      { lineNumber: 2, handwrittenText: "const marks = [45, 82, 91, 63, 77, 88];", ocrCleanedText: "const marks = [45, 82, 91, 63, 77, 88];", confidence: 97, boundingBox: { top: 24, left: 10, width: 75, height: 6 } },
      { lineNumber: 3, handwrittenText: "const distinction = marks.filter(m => m >= 80);", ocrCleanedText: "const distinction = marks.filter(m => m >= 80);", confidence: 96, boundingBox: { top: 36, left: 10, width: 82, height: 6 } },
      { lineNumber: 4, handwrittenText: "console.log('Distinction Marks:', distinction);", ocrCleanedText: "console.log('Distinction Marks:', distinction);", confidence: 98, boundingBox: { top: 48, left: 10, width: 80, height: 6 } },
    ]
  },
  {
    id: 'sample-cpp-prime',
    title: 'C++: Prime Number Checker (Olympiad Prep)',
    language: 'cpp',
    languageId: 54,
    studentAuthor: 'Rakibul Islam',
    schoolDistrict: 'Kushtia, Khulna',
    notes: 'Written on exam paper during Bangladesh National Informatics Olympiad training.',
    rawCode: `#include <iostream>
using namespace std;

bool isPrime(int n) {
    if (n <= 1) return false;
    for (int i = 2; i * i <= n; i++) {
        if (n % i == 0) return false;
    }
    return true;
}

int main() {
    int testNums[] = {7, 12, 19, 29, 35, 97};
    cout << "PaperCode C++ Runner:" << endl;
    for (int num : testNums) {
        cout << num << (isPrime(num) ? " is PRIME" : " is NOT prime") << endl;
    }
    return 0;
}`,
    expectedOutput: `PaperCode C++ Runner:
7 is PRIME
12 is NOT prime
19 is PRIME
29 is PRIME
35 is NOT prime
97 is PRIME`,
    notebookLines: [
      { lineNumber: 1, handwrittenText: "#include <iostream>", ocrCleanedText: "#include <iostream>", confidence: 99, boundingBox: { top: 12, left: 10, width: 50, height: 6 } },
      { lineNumber: 2, handwrittenText: "using namespace std;", ocrCleanedText: "using namespace std;", confidence: 99, boundingBox: { top: 22, left: 10, width: 55, height: 6 } },
      { lineNumber: 3, handwrittenText: "bool isPrime(int n) {", ocrCleanedText: "bool isPrime(int n) {", confidence: 97, boundingBox: { top: 32, left: 10, width: 52, height: 6 } },
    ]
  }
];
