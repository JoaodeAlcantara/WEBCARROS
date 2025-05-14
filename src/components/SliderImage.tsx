import { Swiper, SwiperSlide } from 'swiper/react';
import { register } from 'swiper/element/bundle';
import { useEffect, useState } from 'react';
import { Car } from '../types';
import { useLocation } from "react-router-dom";

register();
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';



function SldierImage({ car }: { car: Car }) {

    const [slidesPerView, SetSlidesPerView] = useState<number>(2);

    useEffect(() => {
        function handleResize() {
            if (window.innerWidth < 720) {
                SetSlidesPerView(1);
            } else {
                SetSlidesPerView(2);
            }
        }

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    return (

        <Swiper
            slidesPerView={slidesPerView}
            pagination={{ clickable: true }}
            navigation
        >
            {car.carImages.map(item => (
                <SwiperSlide key={item.id}>
                    <img src={`http://localhost:3000/files/${item.filename}`} alt="imagem do carro" className={`w-full h-96 object-cover`}/>
                </SwiperSlide>
            ))}
        </Swiper>

    )
}

export default SldierImage