const admin = require("firebase-admin");
const serviceAccount = require("../secure/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function grantAdmins(uids) {
  for (const uid of uids) {
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    console.log(`Admin claim set for ${uid}`);
  }
  process.exit(0);
}

grantAdmins([
  "67zIRUHOC6M3SW2gPF07X3g0ERu1",
  "U2SymEv266gdI6yt4cYeTQjlMNq2",
]);