// Rate limiting and security middleware
const rateLimit = new Map();
const MAX_REQUESTS = 100;
const TIME_WINDOW = 15 * 60 * 1000; // 15 minutes

// Rate limiting middleware
const rateLimiter = (req, res, next) => {
  const identifier = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  
  if (!rateLimit.has(identifier)) {
    rateLimit.set(identifier, { count: 1, resetTime: now + TIME_WINDOW });
    return next();
  }
  
  const userData = rateLimit.get(identifier);
  
  if (now > userData.resetTime) {
    userData.count = 1;
    userData.resetTime = now + TIME_WINDOW;
    rateLimit.set(identifier, userData);
    return next();
  }
  
  if (userData.count >= MAX_REQUESTS) {
    return res.status(429).json({
      ok: false,
      error: 'Too many requests. Please try again later.',
      retryAfter: Math.ceil((userData.resetTime - now) / 1000)
    });
  }
  
  userData.count++;
  rateLimit.set(identifier, userData);
  next();
};

// Clean up expired entries every 30 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimit.entries()) {
    if (now > value.resetTime) {
      rateLimit.delete(key);
    }
  }
}, 30 * 60 * 1000);

// Input sanitization middleware
const sanitizeInput = (req, res, next) => {
  const sanitize = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;
    
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        // Remove potentially dangerous characters
        obj[key] = obj[key]
          .replace(/[<>]/g, '') // Remove < and >
          .trim();
      } else if (typeof obj[key] === 'object') {
        sanitize(obj[key]);
      }
    }
    return obj;
  };
  
  if (req.body) req.body = sanitize(req.body);
  if (req.query) req.query = sanitize(req.query);
  if (req.params) req.params = sanitize(req.params);
  
  next();
};

// Security headers middleware
const securityHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
};

// Request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      ok: false,
      error: 'Validation error',
      details: err.message
    });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({
      ok: false,
      error: 'Invalid ID format'
    });
  }
  
  res.status(500).json({
    ok: false,
    error: 'Internal server error'
  });
};

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

module.exports = {
  rateLimiter,
  sanitizeInput,
  securityHeaders,
  requestLogger,
  errorHandler,
  corsOptions
};
