import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".eot": "application/vnd.ms-fontobject",
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  try {
    const { slug } = await params;
    const filePath = slug.join("/");

    // Construct the full file path
    const publicPath = join(process.cwd(), "public", "ThinkBox", filePath);

    // Read the file
    const fileData = await readFile(publicPath);

    // Determine MIME type
    const ext = filePath.substring(filePath.lastIndexOf("."));
    const mimeType = MIME_TYPES[ext.toLowerCase()] || "application/octet-stream";

    // Return the file with appropriate headers
    return new NextResponse(fileData, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    return new NextResponse("Not Found", { status: 404 });
  }
}
