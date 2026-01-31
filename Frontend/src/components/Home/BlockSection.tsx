import { Check } from 'lucide-react'

const blockTypes = [
  'Headings',
  'Rich Text',
  'Short & Long Answers',
  'Dropdowns',
  'Multiple Choice',
  'Checkboxes',
  'Date Pickers',
  'Images',
  'Dividers',
]

const BlockSection = () => {
  return (
    <section className="w-full sm:px-6 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h2 className="text-foreground mb-4 text-2xl font-extrabold sm:text-3xl">
            12+ Block Types
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            All the building blocks you need to create any form.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {blockTypes.map(block => (
            <div
              key={block}
              className="flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600"
            >
              <Check className="text-success h-4 w-4" color="blue" />
              {block}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BlockSection
