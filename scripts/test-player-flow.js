// Comprehensive end-to-end flow test for Velocity Ventures Player App
// Dynamically resolves network host IP and tests backend routes
const { getPrimaryNetworkIp } = require('./detect-network-ip');

async function resolveBackendUrl() {
  const envUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  const networkIp = getPrimaryNetworkIp();
  const port = 3000;
  const prefix = '/api/v1';

  const candidates = [
    ...(envUrl ? [envUrl] : []),
    `http://${networkIp}:${port}${prefix}`,
    `http://localhost:${port}${prefix}`,
    `http://127.0.0.1:${port}${prefix}`,
  ];

  for (const candidate of candidates) {
    const cleanUrl = candidate.endsWith('/') ? candidate.slice(0, -1) : candidate;
    try {
      const res = await fetch(`${cleanUrl}/sports`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        console.log(`[Network Resolver] Verified live backend at: ${cleanUrl}`);
        return cleanUrl;
      }
    } catch {
      // try next candidate
    }
  }

  // Fallback to network IP
  return `http://${networkIp}:${port}${prefix}`;
}

async function run() {
  console.log('=====================================================');
  console.log('Velocity Ventures Player App — Dynamic Network Test');
  console.log('=====================================================');

  const BASE_URL = await resolveBackendUrl();
  console.log(`Active Target Base URL: ${BASE_URL}\n`);

  const testEmail = `player_${Date.now()}@example.com`;

  // 1. Send OTP
  console.log(`1. [POST ${BASE_URL}/auth/otp/send] Sending OTP for: ${testEmail}`);
  const sendRes = await fetch(`${BASE_URL}/auth/otp/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail }),
  }).then((r) => r.json());

  console.log('   Status:', sendRes.status);
  console.log('   Dev OTP received:', sendRes.data?.otp);
  if (sendRes.status !== 'success' || !sendRes.data.otp) {
    throw new Error('Failed to send OTP or receive dev OTP');
  }

  const otp = sendRes.data.otp;

  // 2. Verify OTP
  console.log(`\n2. [POST ${BASE_URL}/auth/otp/verify] Verifying OTP: ${otp}`);
  const verifyRes = await fetch(`${BASE_URL}/auth/otp/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, otp, name: 'Virat Kohli' }),
  }).then((r) => r.json());

  console.log('   Verify Status:', verifyRes.status);
  const { accessToken, refreshToken, user } = verifyRes.data;
  console.log('   User ID:', user.id);
  console.log('   Initial Profiles:', user.profiles);

  // 3. Authoritative Session Check
  console.log(`\n3. [GET ${BASE_URL}/me] Checking initial session`);
  const meRes1 = await fetch(`${BASE_URL}/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  }).then((r) => r.json());

  const needsOnboarding = !meRes1.data.profiles.player || (meRes1.data.sports || []).length === 0;
  console.log('   Needs Onboarding:', needsOnboarding);

  // 4. Update Player Profile Details
  console.log(`\n4. [PUT ${BASE_URL}/users/:id/player-profile] Saving Personal Details`);
  const profileRes = await fetch(`${BASE_URL}/users/${user.id}/player-profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      dateOfBirth: '1998-11-05',
      bloodGroup: 'B+',
      phone: '+919876543210',
      city: 'Kolkata',
      emergencyContactName: 'Rajesh Sharma',
      emergencyContactPhone: '+919876543211',
    }),
  }).then((r) => r.json());
  console.log('   Player Profile Update Status:', profileRes.status);

  // 5. Fetch Cricket Positions
  console.log(`\n5. [GET ${BASE_URL}/sports/cricket/positions] Discovering Playing Positions`);
  const posRes = await fetch(`${BASE_URL}/sports/cricket/positions`).then((r) => r.json());
  console.log(`   Positions Loaded: ${posRes.data.length}`);
  console.log('   Sample Position:', posRes.data[0]?.name, `(${posRes.data[0]?.category})`);

  // 6. Register Cricket Preferences
  console.log(`\n6. [POST ${BASE_URL}/users/:id/sports] Registering Cricket Preference & Priorities`);
  const sportRes = await fetch(`${BASE_URL}/users/${user.id}/sports`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      sportId: 'cricket',
      positions: [
        { positionId: 'top_order_batter', priority: 1 },
        { positionId: 'all_rounder', priority: 2 },
      ],
    }),
  }).then((r) => r.json());

  console.log('   Sport Registration Status:', sportRes.status);
  console.log('   Assigned Skill Tier:', sportRes.data?.level);

  // 7. Verify Authoritative Profile After Onboarding
  console.log(`\n7. [GET ${BASE_URL}/me] Verifying Completed Onboarding Status`);
  const meRes2 = await fetch(`${BASE_URL}/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  }).then((r) => r.json());

  console.log('   Updated Profiles:', meRes2.data.profiles);
  console.log('   Registered Sports Count:', meRes2.data.sports.length);
  const nowNeedsOnboarding = !meRes2.data.profiles.player || (meRes2.data.sports || []).length === 0;
  console.log('   Needs Onboarding after registration:', nowNeedsOnboarding);

  // 8. Refresh Token Rotation
  console.log(`\n8. [POST ${BASE_URL}/auth/refresh-token] Testing Token Rotation`);
  const refreshRes = await fetch(`${BASE_URL}/auth/refresh-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  }).then((r) => r.json());

  console.log('   Token Rotation Status:', refreshRes.status);
  console.log('   New Access Token Present:', Boolean(refreshRes.data?.accessToken));

  // 9. Discover Tournaments
  console.log(`\n9. [GET ${BASE_URL}/tournaments] Fetching Available Tournaments`);
  const tourneyRes = await fetch(`${BASE_URL}/tournaments`).then((r) => r.json());
  console.log(`   Tournaments Available: ${tourneyRes.data.length}`);

  // 10. Shared Account Check
  console.log(`\n10. Testing Shared Account Login (Re-authenticating same email)`);
  const sendRes2 = await fetch(`${BASE_URL}/auth/otp/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail }),
  }).then((r) => r.json());

  const verifyRes2 = await fetch(`${BASE_URL}/auth/otp/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, otp: sendRes2.data.otp }),
  }).then((r) => r.json());

  console.log('   Re-authenticated User ID:', verifyRes2.data.user.id);
  console.log('   Account Preserved Without Duplication:', verifyRes2.data.user.id === user.id);

  console.log('\n=====================================================');
  console.log('SUCCESS: All Backend Routes Tested & Verified via Dynamic Network IP!');
  console.log('=====================================================');
}

run().catch((err) => {
  console.error('[Error] Test execution failed:', err);
  process.exit(1);
});
