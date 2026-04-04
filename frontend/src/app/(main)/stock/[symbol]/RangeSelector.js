import React from "react"

function RangeSelector({ range, onChange }) {
  const ranges = ["1W", "1M", "6M", "1Y", "MAX"]

  return (
    <div className="mt-6 w-full flex justify-center">
      <div className="flex items-center">
        {ranges.map((r, i) => {
          const active = range === r

          return (
            <React.Fragment key={r}>
              <button
                onClick={() => onChange(r)}
                className={`
                  relative px-4 pb-2 text-sm font-medium
                  transition-colors duration-200
                  ${
                    active
                      ? "text-indigo-400"
                      : "text-zinc-400 hover:text-zinc-200"
                  }
                `}
              >
                {r}

                
                {active && (
                  <span
                    className="
                      absolute left-3 right-3 -bottom-0.5
                      h-[2px] rounded-full
                      bg-indigo-400
                    "
                  />
                )}
              </button>

             
              {i !== ranges.length - 1 && (
                <span className="h-4 w-px bg-zinc-700/60" />
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

export default RangeSelector
