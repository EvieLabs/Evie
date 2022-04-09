export async function setupFirebase() {
  const { initializeApp, cert } = await import("firebase-admin/app");
  if (!process.env.FBA) return;
  initializeApp({
    credential: cert(JSON.parse(process.env.FBA)),
    projectId: "tristan-smp",
  });
}
