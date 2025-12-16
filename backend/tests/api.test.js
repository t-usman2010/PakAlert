// Test suite for PakAlert API
// Run with: npm test

const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

// Color codes for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

// Test results
let passed = 0;
let failed = 0;
const results = [];

// Helper functions
const log = (message, color = colors.reset) => {
  console.log(color + message + colors.reset);
};

const assert = (condition, message) => {
  if (condition) {
    passed++;
    results.push({ status: 'PASS', test: message });
    log(`✓ ${message}`, colors.green);
  } else {
    failed++;
    results.push({ status: 'FAIL', test: message });
    log(`✗ ${message}`, colors.red);
  }
};

const assertExists = (value, message) => {
  assert(value !== undefined && value !== null, message);
};

const assertEqual = (actual, expected, message) => {
  assert(actual === expected, `${message} (expected: ${expected}, got: ${actual})`);
};

// Test suites
const weatherTests = async () => {
  log('\n=== Weather API Tests ===', colors.blue);
  
  try {
    // Test 1: Get weather for default city
    const res1 = await axios.get(`${API_BASE}/weather`);
    assertExists(res1.data, 'Should return weather data for default city');
    assertEqual(res1.data.ok, true, 'Response should have ok=true');
    assertExists(res1.data.data.main, 'Response should contain main weather data');
    assertExists(res1.data.data.main.temp, 'Response should contain temperature');
    
    // Test 2: Get weather for specific city
    const res2 = await axios.get(`${API_BASE}/weather?city=Karachi`);
    assertExists(res2.data, 'Should return weather data for Karachi');
    assertEqual(res2.data.ok, true, 'Response should have ok=true for Karachi');
    
    // Test 3: Get forecast
    const res3 = await axios.get(`${API_BASE}/forecast?city=Lahore`);
    assertExists(res3.data, 'Should return forecast data');
    assertEqual(res3.data.ok, true, 'Forecast response should have ok=true');
    assertExists(res3.data.forecast, 'Response should contain forecast array');
    assert(Array.isArray(res3.data.forecast), 'Forecast should be an array');
    
    // Test 4: Get air pollution
    const res4 = await axios.get(`${API_BASE}/air-pollution?city=Lahore`);
    assertExists(res4.data, 'Should return air pollution data');
    
  } catch (error) {
    log(`Error in weather tests: ${error.message}`, colors.red);
    failed++;
  }
};

const alertTests = async () => {
  log('\n=== Alert API Tests ===', colors.blue);
  
  try {
    // Test 1: Get all alerts
    const res1 = await axios.get(`${API_BASE}/alerts`);
    assertExists(res1.data, 'Should return alerts data');
    assertEqual(res1.data.ok, true, 'Response should have ok=true');
    assertExists(res1.data.alerts, 'Response should contain alerts array');
    assert(Array.isArray(res1.data.alerts), 'Alerts should be an array');
    
    // Test 2: Verify alert structure
    if (res1.data.alerts.length > 0) {
      const alert = res1.data.alerts[0];
      assertExists(alert.title, 'Alert should have a title');
      assertExists(alert.severity, 'Alert should have severity');
      assertExists(alert.createdAt, 'Alert should have createdAt');
      assert(
        ['critical', 'high', 'medium', 'low'].includes(alert.severity),
        'Alert severity should be valid'
      );
    }
    
  } catch (error) {
    log(`Error in alert tests: ${error.message}`, colors.red);
    failed++;
  }
};

const reportTests = async () => {
  log('\n=== Report API Tests ===', colors.blue);
  
  try {
    // Test 1: Get all reports
    const res1 = await axios.get(`${API_BASE}/reports`);
    assertExists(res1.data, 'Should return reports data');
    assertEqual(res1.data.ok, true, 'Response should have ok=true');
    assertExists(res1.data.reports, 'Response should contain reports array');
    assert(Array.isArray(res1.data.reports), 'Reports should be an array');
    
    // Test 2: Submit a new report
    const newReport = {
      reporter: 'Test User',
      location: 'Test City, Pakistan',
      description: 'This is a test weather report for automated testing purposes.'
    };
    
    const res2 = await axios.post(`${API_BASE}/reports`, newReport);
    assertExists(res2.data, 'Should return created report');
    assertEqual(res2.data.ok, true, 'Create response should have ok=true');
    assertExists(res2.data.report, 'Response should contain the created report');
    assertEqual(res2.data.report.reporter, newReport.reporter, 'Reporter name should match');
    assertEqual(res2.data.report.verified, false, 'New report should not be verified');
    
    // Test 3: Verify report structure
    if (res1.data.reports.length > 0) {
      const report = res1.data.reports[0];
      assertExists(report.reporter, 'Report should have reporter');
      assertExists(report.location, 'Report should have location');
      assertExists(report.description, 'Report should have description');
      assertExists(report.verified, 'Report should have verified status');
    }
    
    // Test 4: Validation - missing required fields
    try {
      await axios.post(`${API_BASE}/reports`, { reporter: 'Test' });
      assert(false, 'Should reject report with missing fields');
    } catch (error) {
      assertEqual(error.response?.status, 400, 'Should return 400 for invalid data');
    }
    
  } catch (error) {
    log(`Error in report tests: ${error.message}`, colors.red);
    failed++;
  }
};

const performanceTests = async () => {
  log('\n=== Performance Tests ===', colors.blue);
  
  try {
    // Test 1: Response time for weather API
    const start1 = Date.now();
    await axios.get(`${API_BASE}/weather?city=Lahore`);
    const duration1 = Date.now() - start1;
    assert(duration1 < 3000, `Weather API response time should be under 3s (${duration1}ms)`);
    
    // Test 2: Response time for alerts API
    const start2 = Date.now();
    await axios.get(`${API_BASE}/alerts`);
    const duration2 = Date.now() - start2;
    assert(duration2 < 1000, `Alerts API response time should be under 1s (${duration2}ms)`);
    
    // Test 3: Concurrent requests
    const promises = [];
    for (let i = 0; i < 10; i++) {
      promises.push(axios.get(`${API_BASE}/weather?city=Lahore`));
    }
    const start3 = Date.now();
    await Promise.all(promises);
    const duration3 = Date.now() - start3;
    assert(duration3 < 5000, `10 concurrent requests should complete under 5s (${duration3}ms)`);
    
  } catch (error) {
    log(`Error in performance tests: ${error.message}`, colors.red);
    failed++;
  }
};

// Run all tests
const runAllTests = async () => {
  log('\n╔════════════════════════════════════════╗', colors.yellow);
  log('║      PakAlert API Test Suite          ║', colors.yellow);
  log('╚════════════════════════════════════════╝', colors.yellow);
  
  const startTime = Date.now();
  
  await weatherTests();
  await alertTests();
  await reportTests();
  await performanceTests();
  
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  
  // Print summary
  log('\n' + '='.repeat(50), colors.yellow);
  log('Test Summary', colors.yellow);
  log('='.repeat(50), colors.yellow);
  log(`Total Tests: ${passed + failed}`);
  log(`Passed: ${passed}`, colors.green);
  log(`Failed: ${failed}`, failed > 0 ? colors.red : colors.green);
  log(`Duration: ${duration}s`, colors.blue);
  log('='.repeat(50), colors.yellow);
  
  // Exit with appropriate code
  process.exit(failed > 0 ? 1 : 0);
};

// Handle errors
process.on('unhandledRejection', (error) => {
  log(`\nUnhandled error: ${error.message}`, colors.red);
  process.exit(1);
});

// Start tests
if (require.main === module) {
  log('Waiting for server to be ready...');
  setTimeout(() => {
    runAllTests();
  }, 2000);
}

module.exports = { runAllTests };
