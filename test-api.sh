#!/bin/bash

# SecureAuth API Test Script
BASE_URL="http://localhost:3000/api/auth"

echo "🔐 Testing SecureAuth API"
echo "=========================="
echo ""

# Test 1: Register
echo "1️⃣ Testing Registration..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!",
    "name": "Test User"
  }')
echo "Response: $REGISTER_RESPONSE"
echo ""

# Test 2: Login (should fail - email not verified)
echo "2️⃣ Testing Login (should fail - not verified)..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }')
echo "Response: $LOGIN_RESPONSE"
echo ""

echo "⚠️  To continue testing:"
echo "   1. Check your email for verification link"
echo "   2. Click the verification link"
echo "   3. Run the login test again"
echo ""
echo "📝 Manual test commands:"
echo ""
echo "# Login after verification:"
echo "curl -X POST $BASE_URL/login \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"email\":\"test@example.com\",\"password\":\"SecurePass123!\"}'"
echo ""
echo "# Get profile (replace TOKEN):"
echo "curl $BASE_URL/profile \\"
echo "  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'"
echo ""
echo "# Enable 2FA (replace TOKEN):"
echo "curl -X POST $BASE_URL/2fa/enable \\"
echo "  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'"
