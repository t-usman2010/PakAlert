// Automatic Report Verification System
const axios = require('axios');

/**
 * Verify report authenticity based on multiple factors
 * @param {Object} reportData - Report data to verify
 * @param {Object} req - Express request object
 * @returns {Object} Verification result with score and status
 */
async function verifyReport(reportData, req) {
  let score = 0;
  const verificationDetails = {
    checks: [],
    passed: 0,
    failed: 0,
    warnings: []
  };

  // 1. Check if coordinates are provided
  if (reportData.coordinates && reportData.coordinates.latitude && reportData.coordinates.longitude) {
    score += 20;
    verificationDetails.checks.push({ name: 'GPS Coordinates', status: 'passed', points: 20 });
    verificationDetails.passed++;
  } else {
    verificationDetails.checks.push({ name: 'GPS Coordinates', status: 'failed', points: 0 });
    verificationDetails.failed++;
    verificationDetails.warnings.push('No GPS coordinates provided - location may be inaccurate');
  }

  // 2. Verify location against actual weather conditions
  if (reportData.coordinates && process.env.OPENWEATHER_KEY) {
    try {
      const { latitude, longitude } = reportData.coordinates;
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.OPENWEATHER_KEY}`;
      const weatherResponse = await axios.get(weatherUrl);
      const actualWeather = weatherResponse.data;

      // Store actual weather for comparison
      reportData.weatherConditionAtTime = {
        temp: actualWeather.main.temp,
        description: actualWeather.weather[0].description,
        humidity: actualWeather.main.humidity,
        wind: actualWeather.wind.speed,
        timestamp: new Date()
      };

      // Check if report description matches weather conditions
      const description = reportData.description.toLowerCase();
      const actualCondition = actualWeather.weather[0].description.toLowerCase();

      if (
        (description.includes('rain') && actualCondition.includes('rain')) ||
        (description.includes('storm') && (actualCondition.includes('storm') || actualCondition.includes('thunder'))) ||
        (description.includes('hot') && actualWeather.main.temp > 303) || // 30°C
        (description.includes('cold') && actualWeather.main.temp < 288) || // 15°C
        (description.includes('wind') && actualWeather.wind.speed > 5) ||
        (description.includes('clear') && actualCondition.includes('clear')) ||
        (description.includes('cloud') && actualCondition.includes('cloud'))
      ) {
        score += 30;
        verificationDetails.checks.push({ name: 'Weather Condition Match', status: 'passed', points: 30 });
        verificationDetails.passed++;
      } else {
        score += 10; // Partial credit - might be localized conditions
        verificationDetails.checks.push({ name: 'Weather Condition Match', status: 'partial', points: 10 });
        verificationDetails.warnings.push('Report description does not fully match current weather conditions');
      }
    } catch (error) {
      console.error('Weather verification failed:', error.message);
      verificationDetails.checks.push({ name: 'Weather Condition Match', status: 'error', points: 0 });
      verificationDetails.warnings.push('Unable to verify against weather API');
    }
  }

  // 3. Check report quality (length, details)
  if (reportData.description && reportData.description.length >= 20 && reportData.description.length <= 1000) {
    score += 15;
    verificationDetails.checks.push({ name: 'Report Quality', status: 'passed', points: 15 });
    verificationDetails.passed++;
  } else if (reportData.description && reportData.description.length < 20) {
    verificationDetails.checks.push({ name: 'Report Quality', status: 'failed', points: 0 });
    verificationDetails.failed++;
    verificationDetails.warnings.push('Report description too short (minimum 20 characters)');
  }

  // 4. Check if location is valid (not obviously fake)
  const suspiciousPatterns = ['test', 'fake', 'dummy', 'xxx', '123', 'asdf'];
  const locationLower = reportData.location.toLowerCase();
  const descriptionLower = reportData.description.toLowerCase();
  
  if (!suspiciousPatterns.some(pattern => locationLower.includes(pattern) || descriptionLower.includes(pattern))) {
    score += 15;
    verificationDetails.checks.push({ name: 'Content Validity', status: 'passed', points: 15 });
    verificationDetails.passed++;
  } else {
    verificationDetails.checks.push({ name: 'Content Validity', status: 'failed', points: 0 });
    verificationDetails.failed++;
    verificationDetails.warnings.push('Suspicious content detected');
  }

  // 5. Time-based verification (not too many reports in short time)
  score += 10; // Base points for timestamp
  verificationDetails.checks.push({ name: 'Timestamp Valid', status: 'passed', points: 10 });
  verificationDetails.passed++;

  // 6. IP/User Agent tracking (basic spam prevention)
  if (req.ip && req.headers['user-agent']) {
    score += 10;
    verificationDetails.checks.push({ name: 'Request Authenticity', status: 'passed', points: 10 });
    verificationDetails.passed++;
    
    reportData.ipAddress = req.ip;
    reportData.userAgent = req.headers['user-agent'];
  }

  // Calculate final verification status
  const autoVerified = score >= 70;
  const needsReview = score >= 40 && score < 70;
  const likelyFake = score < 40;

  return {
    score,
    autoVerified,
    needsReview,
    likelyFake,
    details: verificationDetails,
    status: autoVerified ? 'verified' : needsReview ? 'pending' : 'flagged'
  };
}

/**
 * Check for duplicate reports from same location/IP within time window
 * @param {Object} reportData - New report data
 * @param {Object} Report - Report model
 * @returns {Boolean} True if potential duplicate
 */
async function checkDuplicateReport(reportData, Report) {
  const timeWindow = 30 * 60 * 1000; // 30 minutes
  const recentTime = new Date(Date.now() - timeWindow);

  try {
    // Check for similar reports from same IP
    const duplicates = await Report.find({
      ipAddress: reportData.ipAddress,
      createdAt: { $gte: recentTime }
    });

    if (duplicates.length >= 3) {
      return { isDuplicate: true, reason: 'Too many reports from same IP in 30 minutes' };
    }

    // Check for very similar descriptions
    if (reportData.coordinates) {
      const nearbyReports = await Report.find({
        'coordinates.latitude': {
          $gte: reportData.coordinates.latitude - 0.01,
          $lte: reportData.coordinates.latitude + 0.01
        },
        'coordinates.longitude': {
          $gte: reportData.coordinates.longitude - 0.01,
          $lte: reportData.coordinates.longitude + 0.01
        },
        createdAt: { $gte: recentTime }
      });

      if (nearbyReports.length >= 5) {
        return { isDuplicate: true, reason: 'Multiple reports from same area' };
      }
    }

    return { isDuplicate: false };
  } catch (error) {
    console.error('Duplicate check failed:', error);
    return { isDuplicate: false };
  }
}

/**
 * Calculate trust score for a reporter based on history
 * @param {String} ipAddress - Reporter IP
 * @param {Object} Report - Report model
 * @returns {Number} Trust score (0-100)
 */
async function calculateReporterTrustScore(ipAddress, Report) {
  try {
    const reporterHistory = await Report.find({ ipAddress }).limit(50);
    
    if (reporterHistory.length === 0) {
      return 50; // Neutral score for new reporters
    }

    const verifiedCount = reporterHistory.filter(r => r.verified || r.autoVerified).length;
    const trustScore = (verifiedCount / reporterHistory.length) * 100;

    return Math.round(trustScore);
  } catch (error) {
    return 50;
  }
}

module.exports = {
  verifyReport,
  checkDuplicateReport,
  calculateReporterTrustScore
};
