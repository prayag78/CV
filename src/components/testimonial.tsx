"use client";

import Image from "next/image";

type Testimonial = {
  name: string;
  role: string;
  image: string;
  message: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Daniella Doe",
    role: "Mobile dev",
    image: "/image.png",
    message:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum aliquid quo eum quae quos illo earum ipsa doloribus nostrum minus libero...",
  },
  {
    name: "Jane Doe",
    role: "Marketing",
    image: "/image.png",
    message:
      "Lorem ipsum dolor laboriosam deleniti aperiam ab veniam sint non cumque quis tempore cupiditate...",
  },
  {
    name: "Yanick Doe",
    role: "Developer",
    image: "/image.png",
    message:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Architecto laboriosam deleniti aperiam ab veniam...",
  },
  {
    name: "Jane Doe",
    role: "Mobile dev",
    image: "/image.png",
    message:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Architecto laboriosam deleniti aperiam ab veniam...",
  },
  {
    name: "Andy Doe",
    role: "Manager",
    image: "/image.png",
    message:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Architecto laboriosam deleniti aperiam ab veniam...",
  },
  {
    name: "Yanndy Doe",
    role: "Mobile dev",
    image: "/image.png",
    message:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Architecto laboriosam deleniti aperiam ab veniam...",
  },
];

export default function TestimonialSection() {
  return (
    <section
      className="text-gray-600 dark:text-gray-300 pt-8 dark:bg-gray-900 mt-8 mb-10"
      id="reviews"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 xl:px-6">
        <div className="mb-10 space-y-4 px-6 md:px-0">
          <h2 className="text-center text-2xl font-bold text-gray-800 dark:text-white md:text-4xl">
            We have some fans.
          </h2>
        </div>

        <div className="md:columns-2 lg:columns-3 gap-8 space-y-8">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="aspect-auto p-8 border border-gray-100 rounded-3xl bg-white dark:bg-gray-800 dark:border-gray-700 shadow-2xl shadow-gray-600/10 dark:shadow-none"
            >
              <div className="flex gap-4">
                <Image
                  className="w-12 h-12 rounded-full"
                  src={testimonial.image}
                  alt={`${testimonial.name} avatar`}
                  width={48}
                  height={48}
                  loading="lazy"
                />
                <div>
                  <h6 className="text-lg font-medium text-gray-700 dark:text-white">
                    {testimonial.name}
                  </h6>
                  <p className="text-sm text-gray-500 dark:text-gray-300">
                    {testimonial.role}
                  </p>
                </div>
              </div>
              <p className="mt-8">{testimonial.message}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
