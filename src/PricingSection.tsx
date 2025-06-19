import React, { useRef, useEffect } from 'react';
import PricingCard from './PricingCard'

const cards = [
  {
    plan: "Standard",
    price: "100",
    features: ["50,000 Requests", "4 contributors", "Up to 3 GB storage space"],
  },
  {
    plan: "Pro",
    price: "200",
    features: ["100,000 Requests", "7 contributors", "Up to 6 GB storage space"],
  },
  {
    plan: "Expert",
    price: "500",
    features: ["200,000 Requests", "11 contributors", "Up to 10 GB storage space"],
  },
];

const PricingSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardCount = cards.length;

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const cardHeight = scrollRef.current.firstChild
          ? (scrollRef.current.firstChild as HTMLElement).clientHeight
          : 0;
        scrollRef.current.scrollTo({
          top: cardHeight * current,
          behavior: 'smooth',
        });
        current = (current + 1) % cardCount;
      }
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen ип-gray-900 flex flex-col items-center justify-center px-4 py-12">

      <h2 className="text-3xl font-bold text-bg-white mb-16">Pricing</h2>
      
      <div
        ref={scrollRef}
        className="flex flex-col md:flex-row md:space-x-0 space-y-4 md:space-y-0 overflow-y-auto w-full px-2 snap-y snap-mandatory md:overflow-y-visible md:max-h-none items-center justify-center pt-8 pb-8"
        style={{ scrollBehavior: 'smooth' }}
      >
        {cards.map((card) => (
          <div className="snap-center shrink-0" key={card.plan}>
            <PricingCard {...card} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingSection