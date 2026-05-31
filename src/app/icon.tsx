import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default async function Icon() {
  const fontData = await readFile(
    path.join(process.cwd(), "public/fonts/MCFStoneheadDemo.ttf")
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0a0a0a",
          color: "#a8174a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Stonehead",
          fontSize: 56,
          lineHeight: 1,
        }}
      >
        C
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Stonehead",
          data: fontData,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
