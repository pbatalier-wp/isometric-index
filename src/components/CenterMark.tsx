export function CenterMark() {
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        width: 23,
        height: 32,
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <img
        src="/thumbnails/center-mark.svg"
        alt=""
        style={{ width: "100%", height: "100%", display: "block" }}
      />
    </div>
  );
}
