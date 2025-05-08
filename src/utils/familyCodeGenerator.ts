import crypto from 'crypto-js';
import Redis from 'ioredis';

// Secure Redis configuration
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
});

// Persistent storage for generated codes
const GENERATED_CODES_KEY = 'generated_family_codes';

export const generateFamilyCode = async (surveyResults: Record<string, any>): Promise<string> => {
  try {
    // Add more entropy by including timestamp and random value
    const entropy = `${Date.now()}:${Math.random()}`;
    const salt = `${JSON.stringify(surveyResults)}:${entropy}`;
    
    // Use a strong secret key from environment
    const secret = process.env.FAMILY_CODE_SECRET;
    if (!secret) {
      throw new Error('FAMILY_CODE_SECRET is not set');
    }
    
    const hmac = crypto.HmacSHA256(salt, secret);
    const code = hmac.toString().toUpperCase().slice(0, 8); // Increased code length

    // Rate limiting: 5 codes per 24 hours per device
    const deviceKey = `family_code_limit:${surveyResults.deviceId}`;
    const currentCount = await redis.incr(deviceKey);
    
    if (currentCount === 1) {
      await redis.expire(deviceKey, 24 * 60 * 60); // 24 hours
    }

    if (currentCount > 5) {
      throw new Error('Exceeded family code generation limit');
    }

    // Store generated code for validation
    await redis.sadd(GENERATED_CODES_KEY, code);

    return code;
  } catch (error) {
    console.error('Family code generation error:', error);
    throw error;
  }
}

export const validateFamilyCode = async (code: string, deviceId: string): Promise<boolean> => {
  try {
    // Check if code exists in generated codes
    const isValid = await redis.sismember(GENERATED_CODES_KEY, code);
    
    // Optional: Add additional validation logic
    if (isValid) {
      // Optionally mark code as used to prevent reuse
      await redis.srem(GENERATED_CODES_KEY, code);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Family code validation error:', error);
    return false;
  }
}
