import admin from 'firebase-admin';

export function initFirebase(){
    if(admin.apps.length == 0){
        try {
            const projectId = process.env.FIREBASE_PROJECT_ID;
            const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
            const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

            if (!projectId || !clientEmail || !privateKey) {
                throw new Error('Missing Firebase configuration environment variables');
            }

            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId,
                    clientEmail,
                    privateKey,
                }),
            });
            
        console.log('Firebase is getting initialized')
        
        } catch (error) {
            console.error('Error initializing Firebase:', error);
            throw error;
        }
    }
    return admin;
}

export const firebaseAuth = (): admin.auth.Auth => initFirebase().auth();