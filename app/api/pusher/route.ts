import { NextRequest, NextResponse } from 'next/server';
import Pusher from 'pusher';

// NOTE: These secrets normally go in .env.local
// Since I don't have them, this is a placeholder. 
// You MUST populate these for the controller to work.
const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID || "YOUR_APP_ID",
    key: "2e2a115faa09f16baa5b", // Public key from reference
    secret: process.env.PUSHER_SECRET || "YOUR_SECRET",
    cluster: "ap2",
    useTLS: true,
});

export async function POST(req: NextRequest) {
    const { sessionId, event, data } = await req.json();

    try {
        if (process.env.PUSHER_SECRET) {
            await pusher.trigger(`session-${sessionId}`, event, data);
            return NextResponse.json({ success: true });
        } else {
            console.log("Mock Pusher Event Triggered:", { sessionId, event, data });
            return NextResponse.json({ success: true, message: "Mocked mode (Missing Secrets)" });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
}
