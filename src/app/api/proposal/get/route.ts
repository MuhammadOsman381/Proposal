import { NextResponse } from "next/server";
import { db } from "@/db";
import { proposal } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
    try {
        const data = await db
            .select({
                id: proposal.id,
                adminKey: proposal.adminKey,
                message: proposal.message,
                date: proposal.date,
                secretKey: proposal.secretKey,
                createdAt: proposal.createdAt,
            })
            .from(proposal)
            .limit(1);

        if (!data.length) {
            return NextResponse.json(
                { error: "Proposal not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: data[0],
        });
    } catch (error) {
        console.error("Get proposal error:", error);

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
