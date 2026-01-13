import { inco } from "./incoClient";

/**
 * Submit milestone or dispute evidence privately via Inco
 * @param {string} evidenceText - sensitive evidence (design files, notes, etc.)
 */
export async function submitEvidence(evidenceText) {
  // This data never goes on-chain
  const confidentialInput = {
    evidence: evidenceText,
    timestamp: Date.now(),
  };

  // Inco confidential computation
  const result = await inco.compute({
    function: "validateEvidence",
    input: confidentialInput,
  });

  // Inco returns a public signal (true / false)
  return result.approved === true;
}
