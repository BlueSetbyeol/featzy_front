import type { RestaurantMedia } from "@/types/restaurantTypes";

import Placeholder from "../../../assets/image/rice.webp";

interface RestaurantPicturesProps {
  media: RestaurantMedia;
}

export default function RestaurantPictures({ media }: RestaurantPicturesProps) {
  const pictures = [
    ...new Set(
      [media.cover, ...media.gallery].filter((url): url is string =>
        Boolean(url),
      ),
    ),
  ];

  if (pictures.length === 0) {
    return (
      <article className="w-full flex flex-wrap items-start gap-2 pb-4">
        <img
          src={Placeholder}
          alt="Photo du restaurant"
          className="rounded-sm w-[31%] aspect-square object-cover"
        />
      </article>
    );
  }

  return (
    <article className="w-full flex flex-wrap items-start gap-2 pb-4">
      {pictures.map((url) => (
        <img
          key={url}
          src={url}
          alt="Photo du restaurant"
          className="rounded-sm w-[31%] aspect-square object-cover"
        />
      ))}
    </article>
  );
}
