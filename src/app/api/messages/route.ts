import { DB, readDB, writeDB } from "@lib/DB";
import { Database, Payload } from "@lib/DB";
import { checkToken } from "@lib/checkToken";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {

  const roomId = request.nextUrl.searchParams.get("roomId");

  readDB();

  const meassages = (<Database> DB).messages.filter((x) => x.roomId === roomId);

  if(meassages.length === 0) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      ok: true,
      message: meassages,
    },
    { status: 200 }
  );
  
};

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  const {roomId, messageText} = body;

  readDB();

  const foundroomId = (<Database>DB).rooms.find((x) => x.roomId === roomId);


  if (!foundroomId) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );
  }

  const messageId = nanoid();


  (<Database>DB).messages.push({
    roomId,
    messageId,
    messageText,
  });

  writeDB();

  return NextResponse.json({
    ok: true,
    messageId: messageId,
    message: "Message has been sent",
  });
};

export const DELETE = async (request: NextRequest) => {
  const payload = checkToken();

  if(!payload){
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }

  const {role} = <Payload>payload;

  readDB();

  if(role !== "SUPER_ADMIN"){
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }

  const body = await request.json();
  const { messageId } = body;

  const foundIndex = (<Database>DB).messages.findIndex((x) => x.messageId === messageId);

  if(foundIndex === -1){
    return NextResponse.json(
      {
        ok: false,
        message: "Message is not found",
      },
      { status: 404 }
    );
  }

  
  (<Database>DB).messages.splice(foundIndex, 1);

  writeDB();

  return NextResponse.json({
    ok: true,
    message: "Message has been deleted",
  });
};