// components/ImageSlider.tsx

import React from "react";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // this import assumes you have set up a CSS/SASS loader
import { Image } from "antd";

const ImageSlider = ({ images, initialSlide = 0 }) => {
    const carouselRef = React.useRef(null);

    React.useEffect(() => {
        // The Carousel component might manage the active item internally,
        // so this might not be needed. Check the documentation for your specific version.
        if (carouselRef.current) {
            carouselRef.current.moveTo(initialSlide, false);
        }
    }, [initialSlide]);

    return (
        <Carousel 
            ref={carouselRef} 
            autoPlay 
            showThumbs={true} 
            showStatus={false} // Set to false to hide the current item's label
            showIndicators={true} // Set to false if you want to hide the dots at the bottom
            useKeyboardArrows
            infiniteLoop
            selectedItem={initialSlide}
            dynamicHeight={true}
        >
            {images.map((image, index) => (
                <Image key={index} src={image} style={{ width: '100%', height: 'auto' }} />
            ))}
        </Carousel>
    );
};

export default ImageSlider;