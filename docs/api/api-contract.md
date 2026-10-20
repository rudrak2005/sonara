# SONORA API Contract

Base URL:

/api/v1

## Response Format

Success:

{
  "success": true,
  "data": {}
}

Error:

{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": null,
    "requestId": "request-id"
  }
}