const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse");
const docx = require("mammoth");

/**
 * Extracts text from a PDF or DOCX file and scores it based on keywords.
 * @param {string} filePath - The path to the resume file.
 * @param {Array<string>} keywords - An array of keywords to score the resume against.
 * @returns {Promise<number>} - The score of the resume.
 */
async function scoreResumeFromFile(filePath, keywords) {
  async function extractTextFromPdf(pdfPath) {
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(dataBuffer);
    return data.text;
  }

  async function extractTextFromDocx(docxPath) {
    const { value } = await docx.convertToHtml(fs.readFileSync(docxPath));
    return value.replace(/<[^>]+>/g, ""); // Remove HTML tags
  }

  async function extractText(filePath) {
    if (filePath.endsWith(".pdf")) {
      return await extractTextFromPdf(filePath);
    } else if (filePath.endsWith(".docx")) {
      return await extractTextFromDocx(filePath);
    } else {
      throw new Error("Unsupported file format");
    }
  }

  function calculateScore(resumeText, keywords) {
    resumeText = resumeText.toLowerCase();
    return keywords.reduce((score, keyword) => {
      return (
        score +
        (resumeText.match(new RegExp(keyword.toLowerCase(), "g"))?.length || 0)
      );
    }, 0);
  }

  try {
    const resumeText = await extractText(filePath);
    return calculateScore(resumeText, keywords);
  } catch (error) {
    console.error("Error processing file:", error);
    return 0; // Return 0 score on error
  }
}

module.exports = scoreResumeFromFile;

// Example usage (if needed for testing):
// (async () => {
//     const filePath = 'orgUploads\\Gray and White Simple Clean Resume.pdf';
//     const keywords = ['Python', 'Java'];
//     const score = await scoreResumeFromFile(filePath, keywords);
//     console.log(`Resume Score: ${score}`);
// })();
