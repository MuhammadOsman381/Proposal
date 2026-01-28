import { NextResponse } from "next/server";
import { db } from "@/db";
import { proposal } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
    try {
        const { adminKey } = await req.json();

        if (!adminKey) {
            return NextResponse.json(
                { success: false, error: "adminKey is required" },
                { status: 400 }
            );
        }

        const [row] = await db
            .select()
            .from(proposal)
            .where(eq(proposal.id, 1));

        if (!row) {
            return NextResponse.json(
                { error: "No proposal found" },
                { status: 404 }
            );
        }

        if (row.adminKey !== adminKey) {
            return NextResponse.json(
                { success: false, error: "Invalid adminKey" },
                { status: 403 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Login successful",
            data: row,
        });
    } catch (err) {
        console.error("Login error:", err);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
