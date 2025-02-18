import { RateLimiterMemory } from 'rate-limiter-flexible';
import { config } from '../config/config'

const rateLimiter = new RateLimiterMemory({
  points: config.RATE_LIMIT_POINTS,
  duration: config.RATE_LIMIT_DURATION,
});

export default rateLimiter;
