"use client";

import Image from "next/image";

export const Human = () => {
  return (
    <div className="human-container">
      <Image
        width={597}
        height={935}
        loading="eager"
        className="human noselect"
        src={"/human.png"}
        alt="human"
      />
    </div>
  );
};

export default Human;
