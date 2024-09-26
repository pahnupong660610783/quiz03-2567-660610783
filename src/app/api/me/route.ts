import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    ok: true,
    fullName: "Pahnupong Kaeopramun",
    studentId: "660610783",
  });
};
