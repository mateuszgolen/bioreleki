import QRCode from "qrcode";

/** Kod QR jako data URI (PNG) — do <img> i pobrania. */
export function qrPngDataUrl(text: string): Promise<string> {
  return QRCode.toDataURL(text, {
    errorCorrectionLevel: "M",
    margin: 2,
    width: 512,
    color: { dark: "#000000", light: "#ffffff" },
  });
}

/** Kod QR jako SVG (string) — ostre przy dowolnym rozmiarze wydruku. */
export function qrSvg(text: string): Promise<string> {
  return QRCode.toString(text, { type: "svg", errorCorrectionLevel: "M", margin: 2 });
}
