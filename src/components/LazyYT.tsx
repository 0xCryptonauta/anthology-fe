import React from "react";
import { useInView } from "react-intersection-observer";

type LazyYTProps = {
  videoId: string;
};

export const LazyYT: React.FC<LazyYTProps> = ({ videoId }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });

  return (
    <div ref={ref} className="w-full h-56">
      {inView ? (
        <iframe
          width="fit-content"
          //height="100%"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          Loading...
        </div>
      )}
    </div>
  );
};
