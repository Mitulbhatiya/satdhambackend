const path = require("path");
const { readFileSync, existsSync } = require("fs");

let bucketPromise;

const serviceAccountPath = path.resolve(
    __dirname,
    "firebase-service-account.json"
);

function loadServiceAccount() {
    if (!existsSync(serviceAccountPath)) {
        throw new Error(
            `Firebase service account file missing at ${serviceAccountPath}`
        );
    }

    return JSON.parse(readFileSync(serviceAccountPath, "utf8"));
}

async function getBucket() {
    if (!bucketPromise) {
        bucketPromise = (async () => {
            const { default: admin } = await import("firebase-admin");

            if (!admin.apps.length) {
                const serviceAccount = loadServiceAccount();

                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount),
                    storageBucket: "satdham-assets.firebasestorage.app",
                });
            }

            return admin.storage().bucket();
        })();
    }

    return bucketPromise;
}

module.exports = { getBucket };