import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET(request: NextRequest) {
  try {
    // Serve index.html for the base /ThinkBox path
    const publicPath = join(process.cwd(), "public", "ThinkBox", "index.html");
    const fileData = await readFile(publicPath);

    return new NextResponse(fileData, {
      status: 200,
      headers: {
        "Content-Type": "text/html",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    return new NextResponse("Not Found", { status: 404 });
  }
}
