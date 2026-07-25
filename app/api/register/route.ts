import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Ensure data directory exists
    const dir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Read and append data
    const filePath = path.join(dir, "registrations.json");
    let registrations = [];
    
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, "utf-8");
      try {
        registrations = JSON.parse(fileData || "[]");
      } catch (e) {
        registrations = [];
      }
    }
    
    registrations.push({
      ...body,
      timestamp: new Date().toISOString()
    });
    
    fs.writeFileSync(filePath, JSON.stringify(registrations, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ success: false, error: "Failed to record registration" }, { status: 500 });
  }
}
