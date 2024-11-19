"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    MSStream?: any;
  }
}

const isIOS = () => {
  if (typeof window === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
};

const disableIOSTextFieldZoom = () => {
  if (!isIOS()) return;

  const element = document.querySelector("meta[name=viewport]");
  if (element !== null) {
    let content = element.getAttribute("content");
    if (!content) return;

    const scalePattern = /maximum\-scale=[0-9\.]+/g;
    if (scalePattern.test(content)) {
      content = content.replace(scalePattern, "maximum-scale=1.0");
    } else {
      content = [content, "maximum-scale=1.0"].join(", ");
    }
    element.setAttribute("content", content);
  }
};

export function IOSZoomPrevention() {
  useEffect(() => {
    disableIOSTextFieldZoom();
  }, []);

  return null;
}
