import { Check } from "lucide-react";

const blockTypes = [
  "Headings",
  "Rich Text",
  "Short & Long Answers",
  "Dropdowns",
  "Multiple Choice",
  "Checkboxes",
  "Date Pickers",
  "Images",
  "Dividers",
];

const BlockSection = () => {
  return (
    <section className="w-full sm:py-20  sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-4">
            12+ Block Types
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            All the building blocks you need to create any form.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {blockTypes.map((block) => (
            <div
              key={block}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50  text-sm font-medium text-blue-600"
            >
              <Check className="w-4 h-4 text-success" color="blue" />
              {block}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlockSection;
