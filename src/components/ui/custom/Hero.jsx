import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import MasonryImageList from './MasonryImageList';

function Hero() {
  return (
    <div className='min-h-screen flex flex-col items-center mx-6 md:mx-12 gap-9 py-16'>
      <h1 className='font-extrabold text-[36px] md:text-[45px] text-center leading-tight'>
        <span className='text-[#f56551] block mb-2'>Discover Your Next Adventure with AI:</span>
        Personalized Itineraries at Your Fingertips
      </h1>

      <p className='text-lg md:text-xl text-gray-500 text-center max-w-3xl'>
        Your personal trip planner and travel curator, creating custom itineraries tailored to your interests and budget.
      </p>

      <Link to='/create-trip'>
        <Button size="lg">Get Started</Button>
      </Link>

      <div className="w-full max-w-screen-xl mt-10 flex justify-center">
        <MasonryImageList />
      </div>
    </div>
  );
}

export default Hero;
