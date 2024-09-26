import { DB, readDB, writeDB } from "@lib/DB";
import { Database,Payload } from "@lib/DB";
import { checkToken } from "@lib/checkToken";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  readDB();

  return NextResponse.json({
    ok: true,
    rooms: (<Database>DB).rooms,
    totalRooms: (<Database>DB).rooms.length,
  });
};

export const POST = async (request: NextRequest) => {

  const payload = checkToken();

  if (!payload) {

    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );

  }

  const role = (<Payload>payload).role;

  if(role !== "SUPER_ADMIN"){

    if(role !== "ADMIN"){

      return NextResponse.json(
        {
          ok: false,
          message: "Invalid token",
        },
        { status: 401 }
      );
    }}
  

  const body = await request.json();

  const { roomName } = body;

  readDB();

  const foundroomName =  (<Database>DB).rooms.find((x) => x.roomName === roomName);

  if(foundroomName) {

    return NextResponse.json(
      {
        ok: false,
        message: `Room ${roomName} already exists`,
      },
      { status: 400 }
    );
  }

  const roomId = nanoid();

  (<Database>DB).rooms.push({
    roomId,
    roomName,
  });

  writeDB();

  return NextResponse.json({
    ok: true,
    //roomId

    message: `Room ${"replace this with room name"} has been created`,
  });
  
};