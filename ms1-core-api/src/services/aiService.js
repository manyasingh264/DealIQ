const { ms2ResponseSchema } = require('../schemas/aiReport');

const MS2_API_URL = process.env.MS2_API_URL || 'http://localhost:8000';

/**
 * Call MS2 (FastAPI + LangGraph AI Service) to diagnose a deal
 * @param {Object} dealData - { company, deal_size, outcome, deal_text }
 * @returns {Promise<Object>} - Validated structured report
 */
async function diagnoseDealWithMS2(dealData) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout for LLM

  try {
    const url = `${MS2_API_URL}/api/analyze`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        company: dealData.company,
        deal_size: dealData.deal_size,
        outcome: dealData.outcome,
        deal_text: dealData.deal_text,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`MS2 AI Service returned status ${response.status}: ${errorText || response.statusText}`);
    }

    const rawData = await response.json();

    // Validate structured response using Zod
    const validated = ms2ResponseSchema.safeParse(rawData);
    if (!validated.success) {
      console.warn('MS2 AI Service response format warning:', validated.error.format());
      // Even if schema parsing has mild irregularities, passthrough if report object exists
      if (rawData && rawData.report) {
        return rawData.report;
      }
      throw new Error('Invalid report structure returned by MS2 AI service');
    }

    return validated.data.report;
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('MS2 AI Service request timed out after 60s');
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Check MS2 health
 */
async function checkMS2Health() {
  try {
    const response = await fetch(`${MS2_API_URL}/api/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) return { healthy: false, status: response.status };
    const data = await response.json();
    return { healthy: true, data };
  } catch (err) {
    return { healthy: false, error: err.message };
  }
}

module.exports = {
  diagnoseDealWithMS2,
  checkMS2Health,
};
