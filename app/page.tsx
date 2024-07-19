"use client";

import { useState, useEffect } from "react";
import * as React from "react";
import { getReactComponentFromCode } from "@/lib/utils";
import html2canvas from "html2canvas";

export default function Home() {
  const [code, setCode] = useState<string | null>(null);

  const [Component, setComponent] = useState<React.ComponentType | null>(null);

  const contentRef = React.useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (code) {
      try {
        const newComponent = getReactComponentFromCode(code);
        if (newComponent) {
          setComponent(() => newComponent);
        } else {
          console.error("No valid React component found in the provided code");
        }
      } catch (error) {
        console.error("Error evaluating component code:", error);
      }
    }
  }, [code]);

  const handleCaptureSelection = async ({
    x,
    y,
    width,
    height,
  }: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => {
    if (!contentRef.current) return;

    const [selectionCanvas, artifactCanvas] = await Promise.all([
      html2canvas(contentRef.current, {
        x: x,
        y: y,
        width: width,
        height: height,
        logging: false,
        useCORS: true,
      }),
      html2canvas(contentRef.current),
    ]);

    const selectionImg = selectionCanvas.toDataURL("image/png");
    const artifactImg = artifactCanvas.toDataURL("image/png");

    window.parent.postMessage(
      {
        type: "SELECTION_DATA",
        data: { selectionImg, artifactImg },
      },
      "*"
    );
  };

  useEffect(() => {
    window.parent.postMessage(
      {
        type: "INIT_COMPLETE",
      },
      "*"
    );

    const handleMessage = (event: any) => {
      if (event?.data?.type === "UPDATE_COMPONENT") {
        setCode(event?.data?.code || "");
      } else if (event?.data?.type === "CAPTURE_SELECTION") {
        handleCaptureSelection(event.data.selection);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div ref={contentRef}>
      {Component ? React.createElement(Component) : null}
    </div>
  );
}
