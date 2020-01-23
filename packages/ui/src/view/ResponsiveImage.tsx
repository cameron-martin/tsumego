import React from 'react';

interface Props extends React.HTMLAttributes<HTMLElement> {
  image: typeof import('.jpg');
  alt?: string;
}

export default React.forwardRef<HTMLImageElement, Props>(
  function ResponsiveImage({ image, ...props }, ref) {
    return (
      <img
        {...props}
        srcSet={image.srcSet}
        src={image.src}
        ref={ref}
        sizes="100vw"
      />
    );
  },
);
