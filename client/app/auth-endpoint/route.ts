import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import liveblocks from "@/lib/liveblocks";
import { adminDb } from "@/firebase-admin";
import { NextResponse } from "next/server";

async function handleRequest(req: NextRequest) {
	auth().protect();
	const { sessionClaims } = await auth();
	const { room } = req.method === 'POST' ? await req.json() : await req.nextUrl.searchParams.get('room');

	if (!sessionClaims?.email) {
		return NextResponse.json(
			{ message: "User email not found" },
			{ status: 400 }
		);
	}

	const session = liveblocks.prepareSession(sessionClaims.email, {
		userInfo: {
			name: sessionClaims.fullName ?? 'Anonymous',
			email: sessionClaims.email,
			avatar: sessionClaims.image ?? '',
		}
	});

	const usersInRoom = await adminDb
		.collectionGroup("rooms")
		.where("userId",   "==", sessionClaims?.email)
		.get();

	const userInRoom = usersInRoom.docs.find((doc) => doc.id === room);

	if (userInRoom?.exists) {
		session.allow(room, session.FULL_ACCESS);
		const { body, status } = await session.authorize();

		return new Response(body, { status });
	} else {
		return NextResponse.json(
			{ message: "You are not in this room" },
			{ status: 403 }
		);
	}
}

export async function GET(req: NextRequest) {
	return handleRequest(req);
}

export async function POST(req: NextRequest) {
	return handleRequest(req);
}