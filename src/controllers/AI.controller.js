import { GoogleGenerativeAI } from "@google/generative-ai";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateMedicalReport = AsyncHandler(async (req, res) => {
  const {
    age,
    gender,
    medicalHistory,
    medications,
    lifestyleFactors,
    symptoms,
  } = req.body;

  if (
    !age ||
    !gender ||
    !medicalHistory ||
    !medications ||
    !lifestyleFactors ||
    !symptoms
  ) {
    throw new ApiError(400, "All required fields are missing");
  }
  // Initialize the Google Generative AI client
  const genAI = new GoogleGenerativeAI(process.env.GENAI_TOKEN);

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  // Generate a medical report using the provided data
  const prompt = `
Based on the following patient details, analyze the symptoms and provide a diagnostic summary & answer in  very brief information , very short and  simple language :    
    Age: ${age}
    Gender: ${gender}
    Medical History: ${medicalHistory}
    Current Medications: ${medications}
    Lifestyle Factors: ${lifestyleFactors}
    Symptoms: ${symptoms}
    
**Instructions**:
1. **Most Likely Medical Issue**: Provide a brief diagnosis based on the symptoms and medical history.
2. **Suggested Medications**: Recommend medications or treatments that could alleviate the symptoms.
3. **Recommended Next Steps**: Offer concise advice on lifestyle changes, any further tests, or referrals to specialists for medical consultation.
      `;
  let response;

  try {
     response = await model.generateContent([prompt]);
  } catch (error) {
    throw new ApiError(500, "Error generating report");
  }

  res
    .status(200)
    .json(new ApiResponse(200, " Report  generated successfully", response));
});

export { generateMedicalReport}