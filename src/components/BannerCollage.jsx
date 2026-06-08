// BannerCollage
// A small row of photos that sits at the very top of the home page.
// All the pictures come from the assets folder and start with "collage_".

import "./BannerCollage.css";

// Bring in each collage image
import facepaint from "../assets/collage_facepaint_office.jpg";
import fancyDress from "../assets/collage_fancy_dress.jpg";
import fastFashion from "../assets/collage_fast_fashion.jpeg";
import keepCup from "../assets/collage_keep_cup.jpg";
import kidsRecycling from "../assets/collage_kids_recycling.jpg";
import noSugar from "../assets/collage_no_sugar.jpg";
import oldPhone from "../assets/collage_old_phone.jpg";
import organicProduce from "../assets/collage_organic_produce.jpg";
import pyjamas from "../assets/collage_pyjamas.jpg";
import scooter from "../assets/collage_scooter.jpg";
import sleepingFloor from "../assets/collage_sleeping_floor.jpg";
import wakingUp from "../assets/collage_waking_up.jpg";

// Put them all in one list so we can show them with a loop
const images = [
  { src: facepaint, alt: "Face paint at the office" },
  { src: fancyDress, alt: "Fancy dress" },
  { src: fastFashion, alt: "Fast fashion" },
  { src: keepCup, alt: "Reusable keep cup" },
  { src: kidsRecycling, alt: "Kids recycling" },
  { src: noSugar, alt: "No sugar" },
  { src: oldPhone, alt: "Old phone" },
  { src: organicProduce, alt: "Organic produce" },
  { src: pyjamas, alt: "Pyjamas" },
  { src: scooter, alt: "Scooter" },
  { src: sleepingFloor, alt: "Sleeping on the floor" },
  { src: wakingUp, alt: "Waking up early" },
];

function BannerCollage() {
  return (
    <div className="banner-collage">
      {images.map((image) => (
        <img
          key={image.src}
          src={image.src}
          alt={image.alt}
          className="banner-collage-image"
        />
      ))}
    </div>
  );
}

export default BannerCollage;
