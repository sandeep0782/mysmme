export function cloudinaryImage(
  url: string | undefined | null,
  width = 600,
  height?: number
) {
  if (!url) return "";

  if (!url.includes("res.cloudinary.com")) {
    return url;
  }

  if (!url.includes("/upload/")) {
    return url;
  }

  const transformation = [
    "f_auto",
    "q_auto",
    `w_${width}`,
    height ? `h_${height}` : null,
    height ? "c_fill" : null,
  ]
    .filter(Boolean)
    .join(",");

  return url.replace(
    "/upload/",
    `/upload/${transformation}/`
  );
}
