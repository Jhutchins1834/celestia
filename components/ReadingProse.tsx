"use client";

interface ReadingProseProps {
  content: string;
  className?: string;
}

export default function ReadingProse({ content, className = "" }: ReadingProseProps) {
  // Split content by double newlines into paragraphs
  const paragraphs = content.split(/\n\n+/).filter(Boolean);

  return (
    <div className={`space-y-4 ${className}`}>
      {paragraphs.map((paragraph, i) => {
        // Check if it looks like a heading (short line, possibly bold markers)
        const isHeading = paragraph.length < 60 && !paragraph.includes(".");
        const cleaned = paragraph.replace(/\*\*/g, "").replace(/^#+\s*/, "");

        if (isHeading) {
          return (
            <h3
              key={i}
              className="font-serif text-lg text-moon-gold mt-6 first:mt-0"
            >
              {cleaned}
            </h3>
          );
        }

        return (
          <p
            key={i}
            className="text-star-cream/90 leading-relaxed text-[15px]"
          >
            {cleaned}
          </p>
        );
      })}
    </div>
  );
}
