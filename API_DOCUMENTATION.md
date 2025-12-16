# PakAlert API Documentation

## Base URL
```
Production: https://your-domain.com/api
Development: http://localhost:5000/api
```

## Authentication
Most endpoints are public. Admin endpoints require session authentication.

## Rate Limiting
- Public endpoints: 100 requests per 15 minutes per IP
- Authenticated endpoints: 1000 requests per 15 minutes

---

## Weather Endpoints

### Get Current Weather
Retrieves current weather data for a specified city.

**Endpoint:** `GET /api/weather`

**Query Parameters:**
- `city` (string, optional): City name. Default: "Lahore"

**Example Request:**
```bash
curl "https://your-domain.com/api/weather?city=Karachi"
```

**Success Response (200):**
```json
{
  "ok": true,
  "data": {
    "coord": {
      "lon": 74.3436,
      "lat": 31.5497
    },
    "weather": [
      {
        "id": 800,
        "main": "Clear",
        "description": "clear sky",
        "icon": "01d"
      }
    ],
    "main": {
      "temp": 28.5,
      "feels_like": 30.2,
      "temp_min": 27.0,
      "temp_max": 30.0,
      "pressure": 1013,
      "humidity": 65
    },
    "wind": {
      "speed": 3.5,
      "deg": 180
    },
    "clouds": {
      "all": 0
    },
    "visibility": 10000,
    "dt": 1703000000,
    "sys": {
      "country": "PK",
      "sunrise": 1702958400,
      "sunset": 1702996800
    },
    "name": "Lahore"
  }
}
```

**Error Response (500):**
```json
{
  "ok": false,
  "error": "Could not fetch weather data"
}
```

---

### Get 5-Day Forecast
Retrieves weather forecast for the next 5 days.

**Endpoint:** `GET /api/forecast`

**Query Parameters:**
- `city` (string, optional): City name. Default: "Lahore"

**Example Request:**
```bash
curl "https://your-domain.com/api/forecast?city=Islamabad"
```

**Success Response (200):**
```json
{
  "ok": true,
  "city": "Islamabad",
  "forecast": [
    {
      "date": "2025-12-16",
      "min_temp": "15.0",
      "max_temp": "25.0",
      "avg_humidity": "60.0",
      "avg_wind": "12.5"
    },
    {
      "date": "2025-12-17",
      "min_temp": "16.0",
      "max_temp": "26.0",
      "avg_humidity": "58.0",
      "avg_wind": "10.0"
    }
  ]
}
```

---

### Get Air Quality Data
Retrieves air pollution and quality index data.

**Endpoint:** `GET /api/air-pollution`

**Query Parameters:**
- `city` (string, optional): City name. Default: "Lahore"

**Example Request:**
```bash
curl "https://your-domain.com/api/air-pollution?city=Lahore"
```

**Success Response (200):**
```json
{
  "ok": true,
  "city": "Lahore",
  "data": {
    "coord": {
      "lon": 74.3436,
      "lat": 31.5497
    },
    "list": [
      {
        "main": {
          "aqi": 3
        },
        "components": {
          "co": 250.5,
          "no": 0.5,
          "no2": 15.3,
          "o3": 45.2,
          "so2": 5.1,
          "pm2_5": 25.6,
          "pm10": 35.8,
          "nh3": 2.1
        },
        "dt": 1703000000
      }
    ]
  }
}
```

**AQI Levels:**
- 1: Good
- 2: Fair
- 3: Moderate
- 4: Poor
- 5: Very Poor

---

## Alert Endpoints

### Get All Alerts
Retrieves all weather alerts, sorted by creation date (newest first).

**Endpoint:** `GET /api/alerts`

**Example Request:**
```bash
curl "https://your-domain.com/api/alerts"
```

**Success Response (200):**
```json
{
  "ok": true,
  "alerts": [
    {
      "_id": "657abc123def456",
      "title": "Heavy Rainfall Warning",
      "severity": "high",
      "description": "Heavy rainfall expected in Lahore and surrounding areas",
      "actions": [
        "Avoid unnecessary travel",
        "Stay indoors if possible",
        "Keep emergency supplies ready"
      ],
      "createdAt": "2025-12-16T10:30:00.000Z"
    },
    {
      "_id": "657abc123def457",
      "title": "Heat Wave Alert",
      "severity": "critical",
      "description": "Extreme heat conditions expected",
      "actions": [
        "Stay hydrated",
        "Avoid direct sunlight",
        "Check on elderly neighbors"
      ],
      "createdAt": "2025-12-15T08:00:00.000Z"
    }
  ]
}
```

**Severity Levels:**
- `critical`: Immediate action required
- `high`: Significant risk
- `medium`: Moderate caution needed
- `low`: General awareness

---

### Create Alert (Admin Only)
Creates a new weather alert. Requires admin authentication.

**Endpoint:** `POST /api/alerts`

**Authentication:** Session cookie required

**Request Body:**
```json
{
  "title": "Storm Warning",
  "severity": "high",
  "description": "Severe thunderstorm approaching",
  "actions": [
    "Secure loose objects",
    "Stay away from windows",
    "Monitor weather updates"
  ]
}
```

**Validation Rules:**
- `title`: Required, 5-200 characters
- `severity`: Required, one of: critical, high, medium, low
- `description`: Required, 10-1000 characters
- `actions`: Optional, array of strings

**Success Response (201):**
```json
{
  "ok": true,
  "alert": {
    "_id": "657abc123def458",
    "title": "Storm Warning",
    "severity": "high",
    "description": "Severe thunderstorm approaching",
    "actions": [
      "Secure loose objects",
      "Stay away from windows",
      "Monitor weather updates"
    ],
    "createdAt": "2025-12-16T14:20:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "ok": false,
  "error": "Title must be between 5 and 200 characters"
}
```

**Error Response (401):**
```json
{
  "ok": false,
  "error": "Unauthorized"
}
```

---

### Delete Alert (Admin Only)
Deletes an existing alert.

**Endpoint:** `DELETE /api/alerts/:id`

**Parameters:**
- `id` (string): Alert ID

**Authentication:** Session cookie required

**Example Request:**
```bash
curl -X DELETE "https://your-domain.com/api/alerts/657abc123def458" \
  -H "Cookie: session=your_session_token"
```

**Success Response (200):**
```json
{
  "ok": true,
  "message": "Alert deleted successfully"
}
```

---

## Report Endpoints

### Get All Reports
Retrieves all community weather reports, sorted by creation date.

**Endpoint:** `GET /api/reports`

**Example Request:**
```bash
curl "https://your-domain.com/api/reports"
```

**Success Response (200):**
```json
{
  "ok": true,
  "reports": [
    {
      "_id": "657abc789def123",
      "reporter": "Ahmed Khan",
      "location": "Lahore, Punjab",
      "description": "Heavy rain observed in Gulberg area",
      "verified": true,
      "createdAt": "2025-12-16T11:45:00.000Z"
    },
    {
      "_id": "657abc789def124",
      "reporter": "Sara Ali",
      "location": "Karachi, Sindh",
      "description": "Strong winds near Clifton beach",
      "verified": false,
      "createdAt": "2025-12-16T10:20:00.000Z"
    }
  ]
}
```

---

### Submit Report
Creates a new community weather report.

**Endpoint:** `POST /api/reports`

**Request Body:**
```json
{
  "reporter": "John Doe",
  "location": "Islamabad, Capital",
  "description": "Sudden temperature drop observed"
}
```

**Validation Rules:**
- `reporter`: Required, 2-100 characters
- `location`: Required, 5-200 characters
- `description`: Required, 10-1000 characters

**Success Response (201):**
```json
{
  "ok": true,
  "report": {
    "_id": "657abc789def125",
    "reporter": "John Doe",
    "location": "Islamabad, Capital",
    "description": "Sudden temperature drop observed",
    "verified": false,
    "createdAt": "2025-12-16T15:30:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "ok": false,
  "error": "Description must be at least 10 characters"
}
```

---

### Verify Report (Admin Only)
Marks a report as verified.

**Endpoint:** `PATCH /api/reports/:id/verify`

**Parameters:**
- `id` (string): Report ID

**Authentication:** Session cookie required

**Example Request:**
```bash
curl -X PATCH "https://your-domain.com/api/reports/657abc789def125/verify" \
  -H "Cookie: session=your_session_token"
```

**Success Response (200):**
```json
{
  "ok": true,
  "report": {
    "_id": "657abc789def125",
    "reporter": "John Doe",
    "location": "Islamabad, Capital",
    "description": "Sudden temperature drop observed",
    "verified": true,
    "createdAt": "2025-12-16T15:30:00.000Z"
  }
}
```

---

## WebSocket Events

### Connection
Connect to the WebSocket server for real-time updates.

**URL:** `ws://localhost:5000` or `wss://your-domain.com`

### Events

#### `alert:new`
Emitted when a new alert is created.

**Payload:**
```json
{
  "_id": "657abc123def459",
  "title": "Flash Flood Warning",
  "severity": "critical",
  "description": "Immediate evacuation required",
  "actions": ["Move to higher ground", "Call emergency services"],
  "createdAt": "2025-12-16T16:00:00.000Z"
}
```

#### `report:new`
Emitted when a new report is submitted.

**Payload:**
```json
{
  "_id": "657abc789def126",
  "reporter": "Ali Hassan",
  "location": "Multan, Punjab",
  "description": "Dust storm approaching",
  "verified": false,
  "createdAt": "2025-12-16T16:15:00.000Z"
}
```

### Client Example (JavaScript)
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

socket.on('connect', () => {
  console.log('Connected to PakAlert server');
});

socket.on('alert:new', (alert) => {
  console.log('New alert:', alert);
  // Update UI with new alert
});

socket.on('report:new', (report) => {
  console.log('New report:', report);
  // Update UI with new report
});
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created successfully |
| 400 | Bad request - validation error |
| 401 | Unauthorized - authentication required |
| 403 | Forbidden - insufficient permissions |
| 404 | Resource not found |
| 429 | Too many requests - rate limit exceeded |
| 500 | Internal server error |

---

## Rate Limiting

The API implements rate limiting to ensure fair usage:

- **Public endpoints**: 100 requests per 15 minutes per IP
- **Authenticated endpoints**: 1000 requests per 15 minutes per session

When rate limit is exceeded:
```json
{
  "ok": false,
  "error": "Too many requests. Please try again later.",
  "retryAfter": 900
}
```

---

## Best Practices

1. **Caching**: Weather data is cached for 10 minutes. Avoid excessive polling.
2. **Error Handling**: Always check the `ok` field in responses.
3. **Rate Limits**: Implement exponential backoff for retries.
4. **WebSockets**: Use WebSocket connections for real-time updates instead of polling.
5. **HTTPS**: Always use HTTPS in production.
6. **API Keys**: Store API keys securely in environment variables.

---

## Support

For API support or bug reports:
- Email: support@pakalert.com
- GitHub: https://github.com/yourusername/pakalert/issues

---

## Changelog

### v1.0.0 (December 2025)
- Initial API release
- Weather, forecast, and air quality endpoints
- Alert and report management
- Real-time WebSocket support
- Rate limiting implementation

---

**Last Updated:** December 16, 2025
