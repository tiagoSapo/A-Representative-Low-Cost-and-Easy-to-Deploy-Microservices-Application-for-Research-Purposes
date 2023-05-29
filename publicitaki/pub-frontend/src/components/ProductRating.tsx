import starFilled from "../assets/star-filled.png";
import starEmpty from "../assets/star-empty.png";

interface ProductRatingProps {
  rating: number | undefined;
  size: string | undefined;
}

function ProductRating({ rating, size }: ProductRatingProps): JSX.Element {
  let imageSize;

  switch (size) {
    case "small":
      imageSize = 100;
    default:
      imageSize = 200;
  }

  if (typeof rating === "undefined") rating = 0;

  const stars: JSX.Element[] = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <img
        key={i}
        width={25}
        height={25}
        src={i <= rating ? starFilled : starEmpty}
        alt={`Star ${i}`}
      />
    );
  }
  return <div>{stars}</div>;
}

export default ProductRating;
