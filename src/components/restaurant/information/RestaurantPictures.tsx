import Placeholder from "../../../assets/image/rice.webp";

// interface RestaurantReviewProps {
//   restaurant: Restaurant;
// }

export default function RestaurantPictures() {
  //     {
  //   restaurant,
  // }: RestaurantReviewProps

  // TODO : add real pictures from restaurant

  return (
    <article className="w-full flex flex-wrap items-start gap-2 pb-4">
      <img
        // src={restaurant.cover_image_url}
        src={Placeholder}
        alt="Restaurant image"
        className="rounded-sm w-[31%]"
      />
      <img
        // src={restaurant.cover_image_url}
        src={Placeholder}
        alt="Restaurant image"
        className="rounded-sm w-[31%]"
      />
      <img
        // src={restaurant.cover_image_url}
        src={Placeholder}
        alt="Restaurant image"
        className="rounded-sm w-[31%]"
      />
      <img
        // src={restaurant.cover_image_url}
        src={Placeholder}
        alt="Restaurant image"
        className="rounded-sm w-[31%]"
      />
    </article>
  );
}
