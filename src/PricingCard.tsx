import React from "react";

type PricingCardProps = {
  plan: string;
  price: string;
  features: string[];
  isFeatured?: boolean;
};

const PricingCard: React.FC<PricingCardProps> = ({
  plan,
  price,
  features,
  isFeatured = false,
}) => {
  return (
    <div
      className={
        "group flex flex-col items-center min-h-[28rem] rounded-md py-8 mx-2 shadow-lg min-w-[320px] max-w-xs w-full sm:w-80 transition-colors duration-200 transition-transform transition-[margin] z-0 group-hover:z-20 " +
        (isFeatured
          ? "bg-[#425063] text-white hover:bg-white hover:text-[#425063] hover:scale-125"
          : "bg-white text-slate-700 hover:bg-[#425063] hover:text-white hover:scale-125") +
        " group-hover:mx-[1px]"
      }
    >
      <div
        className={
          "text-lg font-bold mb-2 text-center transition-colors duration-200 " +
          (isFeatured
            ? "text-white group-hover:text-[#425063]"
            : "text-slate-700 group-hover:text-white")
        }
      >
        {plan}
      </div>
      <div className="flex items-end justify-center mb-2">
        <span
          className={
            "text-5xl font-extrabold align-top transition-colors duration-200 " +
            (isFeatured
              ? "text-white group-hover:text-[#425063]"
              : "text-slate-700 group-hover:text-white")
          }
        >
          $
        </span>
        <span
          className={
            "text-5xl font-extrabold leading-none ml-1 transition-colors duration-200 " +
            (isFeatured
              ? "text-white group-hover:text-[#425063]"
              : "text-slate-700 group-hover:text-white")
          }
        >
          {price}
        </span>
      </div>
      <ul className="w-full flex-1 flex flex-col mb-6">
        <div
          className={
            "relative h-[2px] transition-all duration-200 w-[80%] left-1/2 -translate-x-1/2 group-hover:w-full group-hover:left-0 group-hover:translate-x-0 " +
            (isFeatured
              ? "bg-white/30 group-hover:bg-[#425063]/30"
              : "bg-slate-200 group-hover:bg-white/30")
          }
        />
        {features.map((feature, idx) => (
          <li
            key={idx}
            className={
              "relative flex items-center justify-center text-center py-3 w-full transition-colors duration-200 " +
              (isFeatured
                ? "text-white font-bold group-hover:text-[#425063]"
                : "text-slate-700 font-normal group-hover:text-white")
            }
          >
            {feature}
            {idx < features.length - 1 && (
              <div
                className={
                  "absolute bottom-0 h-[2px] transition-all duration-200 w-[80%] left-1/2 -translate-x-1/2 group-hover:w-full group-hover:left-0 group-hover:translate-x-0 " +
                  (isFeatured
                    ? "bg-white/30 group-hover:bg-[#425063]/30"
                    : "bg-slate-200 group-hover:bg-white/30")
                }
              />
            )}
          </li>
        ))}
        <div
          className={
            "relative h-[2px] transition-all duration-200 w-[80%] left-1/2 -translate-x-1/2 group-hover:w-full group-hover:left-0 group-hover:translate-x-0 " +
            (isFeatured
              ? "bg-white/30 group-hover:bg-[#425063]/30"
              : "bg-slate-200 group-hover:bg-white/30")
          }
        />
      </ul>
      <button
        className={
          "mt-auto w-full py-2 font-bold rounded bg-transparent border-none shadow-none transition-colors duration-200 cursor-pointer " +
          (isFeatured
            ? "text-white group-hover:text-[#425063]"
            : "text-slate-700 group-hover:text-white")
        }
      >
        SUBSCRIBE
      </button>
    </div>
  );
};

export default PricingCard;