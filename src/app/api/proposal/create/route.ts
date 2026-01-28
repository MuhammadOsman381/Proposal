import { NextResponse } from "next/server";
import { db } from "@/db";
import { proposal } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
    try {
        const { adminKey, secretKey, message, date } = await req.json();

        const [year, month, day, hour, minute] = date
  .match(/\d+/g)!
  .map(Number);

const targetDate = new Date(year, month - 1, day, hour, minute, 0); // seconds = 0


        console.log("Received data:", { adminKey, secretKey, message, date });

        if (!adminKey || !secretKey || !message || !date) {
            return NextResponse.json(
                { error: "All fields required" },
                { status: 400 }
            );
        }

        const existing = await db
            .select()
            .from(proposal)
            .where(eq(proposal.id, 1));

        let result;

        if (existing.length === 0) {
            [result] = await db
                .insert(proposal)
                .values({
                    id: 1,
                    adminKey,
                    secretKey,
                    message,
                    date: targetDate,
                })
                .returning();
        } else {
            [result] = await db
                .update(proposal)
                .set({
                    adminKey,
                    secretKey,
                    message,
                    date: targetDate,
                })
                .where(eq(proposal.id, 1))
                .returning();
        }

        return NextResponse.json({
            success: true,
            data: result,
            message: "Proposal updated",
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}
