const containerStyle = {
  display: "flex",
  alignItems: "cernter",
  gap: "16px",
};

const starContainerStyle = {
  display: "flex",
  alignItems: "cernter",
  gap: "4px",
};

const textStyle = {
  margen: "0",
  lineHeight: "1",
};

export default function rating({ maxRating }) {
  return (
    <div style={containerStyle}>
      <div style={starContainerStyle}>
        {Array.from({ length: maxRating }, (_, i) => (
          <span key={i}> star {i + 1} </span>
        ))}

        <p style={textStyle}>{maxRating}</p>
      </div>
    </div>
  );
}
